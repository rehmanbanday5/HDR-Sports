const ProductCardSkeleton = () => (
  <div className="bg-white border border-ink/10 rounded-sm overflow-hidden">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-2.5 w-1/3" />
      <div className="skeleton h-4 w-4/5" />
      <div className="skeleton h-4 w-1/3" />
    </div>
  </div>
);

const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default ProductGridSkeleton;
