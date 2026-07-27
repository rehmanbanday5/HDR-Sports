import { Link } from 'react-router-dom';
import { primaryImage, displayPrice, originalPrice, formatPrice } from '../utils/format';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const price = displayPrice(product);
  const original = originalPrice(product);
  const outOfStock = (product.hasVariants ? product.variants?.every((v) => v.stock <= 0) : product.stock <= 0);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white border border-ink/10 hover:border-ink/25 transition-colors duration-200 rounded-sm overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-chalk">
        <img
          src={primaryImage(product)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {original && (
          <span className="absolute top-3 left-3 bg-leather text-chalk text-[10px] font-mono font-bold uppercase tracking-wide px-2 py-1 rounded-sm">
            Sale
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
            <span className="text-chalk text-xs font-mono uppercase tracking-widest">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category?.name && (
          <p className="text-[10px] font-mono uppercase tracking-widest text-willow-dark mb-1">{product.category.name}</p>
        )}
        <h3 className="font-display font-semibold text-ink leading-snug mb-1.5 line-clamp-2">{product.name}</h3>
        {product.ratingCount > 0 && <StarRating rating={product.ratingAverage} count={product.ratingCount} />}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-ink">{formatPrice(price)}</span>
          {original && <span className="text-sm text-ink-soft line-through">{formatPrice(original)}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
