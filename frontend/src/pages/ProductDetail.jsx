import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, ShoppingBag, Zap, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/format';
import { useCurrency, RATES, SYMBOLS } from "../context/CurrencyContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
const { currency } = useCurrency();

const symbol = SYMBOLS[currency];



  const convertPrice = (value) =>
    (value * RATES[currency]).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    setProduct(null);
    setActiveImage(0);
    setSelectedAttrs({});
    setQuantity(1);
    window.scrollTo(0, 0);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        // pre-select the first variant's attributes if variants exist
        if (data.product.hasVariants && data.product.variants.length) {
          setSelectedAttrs(data.product.variants[0].attributes);
        }
      })
      .catch(() => setProduct(false));
  }, [slug]);

  // Determine unique attribute keys and their possible values across variants
  const attributeOptions = useMemo(() => {
    if (!product?.hasVariants) return {};
    const opts = {};
    product.variants.forEach((v) => {
      Object.entries(v.attributes).forEach(([key, val]) => {
        if (!opts[key]) opts[key] = new Set();
        opts[key].add(val);
      });
    });
    return Object.fromEntries(Object.entries(opts).map(([k, v]) => [k, Array.from(v)]));
  }, [product]);

  const matchedVariant = useMemo(() => {
    if (!product?.hasVariants) return null;
    return product.variants.find((v) =>
      Object.entries(selectedAttrs).every(([k, val]) => v.attributes[k] === val)
    );
  }, [product, selectedAttrs]);

  if (product === false) {
    return (
      <div className="container-HDR py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Product not found</h1>
        <Link to="/shop" className="text-pitch font-semibold hover:underline">Back to shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-HDR py-16 grid lg:grid-cols-2 gap-12">
        <div className="aspect-square skeleton" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  const price = product.hasVariants ? (matchedVariant?.salePrice || matchedVariant?.price) : (product.baseSalePrice || product.basePrice);
  const originalPriceVal = product.hasVariants
    ? (matchedVariant?.salePrice ? matchedVariant.price : null)
    : (product.baseSalePrice ? product.basePrice : null);
  const stock = product.hasVariants ? (matchedVariant?.stock ?? 0) : product.stock;
  const inStock = stock > 0;
  const variantIncomplete = product.hasVariants && !matchedVariant;

  const handleAddToCart = async (buyNow = false) => {
    if (variantIncomplete) {
      toast.error('Please select all options');
      return;
    }
    try {
      await addItem(product._id, matchedVariant?._id, quantity);
      if (buyNow) navigate('/cart');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success('Thanks for your review!');
      setReviewComment('');
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container-HDR py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-white border border-ink/10 rounded-sm overflow-hidden mb-3">
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img._id || i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 border rounded-sm overflow-hidden ${activeImage === i ? "border-pitch" : "border-ink/15"}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category?.name && (
            <Link
              to={`/shop?categorySlug=${product.category.slug}`}
              className="eyebrow hover:underline"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="font-display text-3xl font-bold mt-2 mb-2">
            {product.name}
          </h1>

          {product.ratingCount > 0 && (
            <div className="mb-4">
              <StarRating
                rating={product.ratingAverage}
                count={product.ratingCount}
              />
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-ink">
              {symbol} {convertPrice(price)}
            </span>
            {originalPriceVal && (
              <span className="text-lg text-ink-soft line-through">
                {symbol}{" "}
                {currency === "PKR"
                  ? Math.round(convertPrice(originalPriceVal))
                  : convertPrice(originalPriceVal).toFixed(2)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-ink-soft leading-relaxed mb-6">
              {product.shortDescription}
            </p>
          )}

          {/* Variant selectors */}
          {Object.entries(attributeOptions).map(([key, values]) => (
            <div key={key} className="mb-5">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-2">
                {key}
              </p>
              <div className="flex flex-wrap gap-2">
                {values.map((val) => (
                  <button
                    key={val}
                    onClick={() =>
                      setSelectedAttrs((prev) => ({ ...prev, [key]: val }))
                    }
                    className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                      selectedAttrs[key] === val
                        ? "border-pitch bg-pitch text-chalk"
                        : "border-ink/20 hover:border-ink/40"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            {inStock ? (
              <>
                <CheckCircle2 size={16} className="text-pitch" />{" "}
                <span>In stock{stock <= 5 ? ` — only ${stock} left` : ""}</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-leather" />{" "}
                <span>Out of stock</span>
              </>
            )}
          </div>

          {/* Quantity + actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-ink/20 rounded-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-ink/5"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
                className="p-3 hover:bg-ink/5"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => handleAddToCart(false)}
              disabled={!inStock}
              className="btn-secondary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              onClick={() => handleAddToCart(true)}
              disabled={!inStock}
              className="btn-accent flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="border-t border-ink/10 pt-6">
            <h2 className="font-display font-semibold text-lg mb-2">
              Description
            </h2>
            <p className="text-ink-soft leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-ink/10 pt-6 mt-6">
                <h2 className="font-display font-semibold text-lg mb-3">
                  Specifications
                </h2>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-ink-soft">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
        </div>
      </div>

      {/* Reviews */}
      <section className="border-t border-ink/10 mt-16 pt-10 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold mb-6">
          Reviews ({product.reviews?.length || 0})
        </h2>

        {product.reviews?.length > 0 ? (
          <ul className="space-y-6 mb-10">
            {product.reviews.map((r) => (
              <li key={r._id} className="border-b border-ink/10 pb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-sm">{r.name}</span>
                  <StarRating rating={r.rating} size={12} />
                </div>
                {r.comment && (
                  <p className="text-sm text-ink-soft">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-soft mb-10">
            No reviews yet. Be the first to share your thoughts.
          </p>
        )}

        {user ? (
          <form
            onSubmit={submitReview}
            className="border border-ink/10 rounded-sm p-5"
          >
            <p className="font-semibold text-sm mb-3">Leave a review</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewRating(n)}
                >
                  <StarRating rating={n <= reviewRating ? 5 : 0} size={20} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full border border-ink/20 rounded-sm p-3 text-sm mb-3"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary text-sm"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-ink-soft">
            <Link
              to="/login"
              className="text-pitch font-semibold hover:underline"
            >
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-ink/10 mt-16 pt-10">
          <h2 className="font-display text-2xl font-semibold mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
