import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import { useCurrency } from "../context/CurrencyContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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
    return Object.fromEntries(
      Object.entries(opts).map(([k, v]) => [k, Array.from(v)]),
    );
  }, [product]);

  const matchedVariant = useMemo(() => {
    if (!product?.hasVariants) return null;
    return product.variants.find((v) =>
      Object.entries(selectedAttrs).every(
        ([k, val]) => v.attributes[k] === val,
      ),
    );
  }, [product, selectedAttrs]);

  if (product === false) {
    return (
      <div className="container-HDR py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">
          Product not found
        </h1>
        <Link to="/shop" className="text-pitch font-semibold hover:underline">
          Back to shop
        </Link>
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

  const price = product.hasVariants
    ? matchedVariant?.salePrice || matchedVariant?.price
    : product.baseSalePrice || product.basePrice;
  const originalPriceVal = product.hasVariants
    ? matchedVariant?.salePrice
      ? matchedVariant.price
      : null
    : product.baseSalePrice
      ? product.basePrice
      : null;
  const stock = product.hasVariants
    ? (matchedVariant?.stock ?? 0)
    : product.stock;
  const inStock = stock > 0;
  const variantIncomplete = product.hasVariants && !matchedVariant;

  const handleAddToCart = async (buyNow = false) => {
    if (variantIncomplete) {
      toast.error("Please select all options");
      return;
    }
    try {
      await addItem(product._id, matchedVariant?._id, quantity);
      if (buyNow) navigate("/cart");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Thanks for your review!");
      setReviewComment("");
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container-HDR py-10 space-y-16">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
        {/* Gallery */}
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="h-[520px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-5 text-white">
              <p className="text-sm uppercase tracking-[0.32em] text-gold">
                Product gallery
              </p>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img._id || i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-3xl border transition ${
                    activeImage === i
                      ? "border-gold shadow-[0_10px_30px_rgba(212,167,55,0.18)]"
                      : "border-ink/10 hover:border-ink/40"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.category?.name && (
            <Link
              to={`/shop?categorySlug=${product.category.slug}`}
              className="eyebrow hover:text-gold"
            >
              {product.category.name}
            </Link>
          )}

          <div className="space-y-3 rounded-[2rem] border border-ink/10 bg-white/95 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-4xl font-semibold">
                {product.name}
              </h1>
              {product.ratingCount > 0 && (
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={product.ratingAverage}
                    count={product.ratingCount}
                  />
                  <span className="text-sm text-ink-soft">
                    {product.ratingCount} reviews
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold text-ink">
                {formatCurrency(price)}
              </span>
              {originalPriceVal && (
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft line-through">
                  {formatCurrency(originalPriceVal)}
                </span>
              )}
              {product.isNew && <span className="badge-pill">New Arrival</span>}
            </div>

            {product.shortDescription && (
              <p className="text-sm leading-relaxed text-ink-soft">
                {product.shortDescription}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#f6f1e4] p-4 text-sm text-ink-soft">
                <p className="font-semibold text-ink mb-2">Quality Guarantee</p>
                <p>
                  Engineered for comfort, durability, and consistent performance
                  match after match.
                </p>
              </div>
              <div className="rounded-3xl bg-[#f6f1e4] p-4 text-sm text-ink-soft">
                <p className="font-semibold text-ink mb-2">
                  Worldwide Shipping
                </p>
                <p>
                  Ships securely from Pakistan to cricket fans across the globe.
                </p>
              </div>
            </div>

            {Object.entries(attributeOptions).map(([key, values]) => (
              <div key={key} className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-widest text-ink-soft">
                  {key}
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSelectedAttrs((prev) => ({ ...prev, [key]: val }))
                      }
                      className={`rounded-full border px-4 py-2 text-sm transition duration-200 ${
                        selectedAttrs[key] === val
                          ? "border-gold bg-gold/10 text-ink"
                          : "border-ink/20 bg-white text-ink hover:border-gold"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span
                className={`rounded-full px-3 py-2 font-semibold ${inStock ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}
              >
                {inStock ? "In stock" : "Out of stock"}
              </span>
              {inStock && stock <= 5 && (
                <span className="text-sm text-ink-soft">Only {stock} left</span>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-ink/10 bg-white p-1 w-max">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-11 w-11 rounded-full transition hover:bg-ink/5"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
                className="h-11 w-11 rounded-full transition hover:bg-ink/5"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
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
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white/95 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
            <h2 className="font-display font-semibold text-xl mb-4">Details</h2>
            <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-3">
                    Specifications
                  </h3>
                  <dl className="grid grid-cols-2 gap-y-2 text-sm text-ink-soft">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-ink-soft">{k}</dt>
                        <dd className="font-medium text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
          </div>
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
