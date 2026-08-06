import { Link } from "react-router-dom";
import { displayPrice, originalPrice } from "../utils/format";
import { useCurrency } from "../context/CurrencyContext";

const ProductCard = ({ product }) => {
  const { formatCurrency } = useCurrency();

  const images = product.images || [];

  const firstImage = images[0]?.url || "https://placehold.co/600x600?text=HDR";

  const secondImage = images[1]?.url || firstImage;

  const price = formatCurrency(displayPrice(product));

  const original = originalPrice(product)
    ? formatCurrency(originalPrice(product))
    : null;

  const outOfStock = product.hasVariants
    ? product.variants?.every((v) => v.stock <= 0)
    : product.stock <= 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden"
    >
      {/* IMAGE */}

      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        {/* First */}

        <img
          src={firstImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-0"
        />

        {/* Second */}

        <img
          src={secondImage}
          alt={product.name}
          className=" absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-110"
        />

        {original && (
          <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[11px] px-3 py-1 font-semibold rounded-full">
            SALE
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <span className="bg-white px-4 py-2 text-xs font-semibold rounded-full">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>
      {/* INFO */}

      <div
        className="
    px-4
    py-3
    relative
    overflow-hidden
  "
      >
        {/* White Hover Background */}

        <div
          className="
      absolute
      inset-0
      bg-white
      rounded-md
      opacity-0
      scale-95
      transition-all
      duration-300
      ease-out
      group-hover:opacity-100
      group-hover:scale-100
      -z-10
    "
        />

        <div
          className="
      transition-all
      duration-300
      group-hover:-translate-y-1
    "
        >
          <h3
            className="
        text-[15px]
        font-semibold
        text-[#111]
        leading-[20px]
        line-clamp-2
        transition-colors
        duration-300
        group-hover:text-[#D4AF37]
      "
          >
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[18px] font-bold text-[#080B12]">
              {price}
            </span>

            {original && (
              <span className="text-[14px] text-gray-400 line-through">
                {original}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
