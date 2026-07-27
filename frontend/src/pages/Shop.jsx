import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import EmptyState from '../components/EmptyState';
import { slugify } from '../utils/format';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.categories)).catch(() => setCategories([]));
  }, []);

  const activeCategorySlug = searchParams.get('categorySlug');
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug || slugify(c.name) === activeCategorySlug);

  const fetchProducts = useCallback(async () => {
    setProducts(null);
    const params = {
      search: searchParams.get('search') || undefined,
      category: activeCategory?._id || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      sort: searchParams.get('sort') || undefined,
      featured: searchParams.get('featured') || undefined,
      newArrival: searchParams.get('newArrival') || undefined,
      bestSeller: searchParams.get('bestSeller') || undefined,
      page: searchParams.get('page') || 1,
      limit: 12,
    };
    try {
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch {
      setProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories]);

  useEffect(() => {
    // wait until categories are loaded (or confirmed empty) before first fetch, so category filter resolves correctly
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === undefined || value === null) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice');
    next.delete('page');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const activeFilterCount = ['categorySlug', 'minPrice', 'maxPrice', 'featured', 'newArrival', 'bestSeller'].filter((k) =>
    searchParams.get(k)
  ).length;

  const heading = searchParams.get('search')
    ? `Results for "${searchParams.get('search')}"`
    : activeCategory
    ? activeCategory.name
    : searchParams.get('featured')
    ? 'Featured Products'
    : searchParams.get('newArrival')
    ? 'New Arrivals'
    : searchParams.get('bestSeller')
    ? 'Best Sellers'
    : 'All Products';

  return (
    <div className="container-gully py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl font-bold">{heading}</h1>
        <button
          onClick={() => setFiltersOpen((s) => !s)}
          className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-ink/20 px-3 py-2 rounded-sm"
        >
          <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>
      {products !== null && <p className="text-sm text-ink-soft mb-8">{pagination.total} product{pagination.total !== 1 && 's'}</p>}

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-32 space-y-8">
            <div className="flex items-center justify-between lg:hidden">
              <span className="font-semibold">Filters</span>
              <button onClick={() => setFiltersOpen(false)}><X size={18} /></button>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">Category</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => updateParam('categorySlug', undefined)}
                    className={`text-sm ${!activeCategorySlug ? 'font-semibold text-pitch' : 'text-ink-soft hover:text-ink'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c._id}>
                    <button
                      onClick={() => updateParam('categorySlug', c.slug)}
                      className={`text-sm ${activeCategorySlug === c.slug ? 'font-semibold text-pitch' : 'text-ink-soft hover:text-ink'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">Price (PKR)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-ink/20 rounded-sm px-2 py-1.5 text-sm"
                />
                <span className="text-ink-soft">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-ink/20 rounded-sm px-2 py-1.5 text-sm"
                />
              </div>
              <button onClick={applyPriceFilter} className="mt-2 text-xs font-semibold text-pitch hover:underline">
                Apply
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters} className="text-xs font-semibold text-leather hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex justify-end mb-5">
            <select
              value={searchParams.get('sort') || ''}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-ink/20 rounded-sm px-3 py-2 text-sm bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {products === null ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try adjusting your filters or search terms."
              action={<button onClick={clearAllFilters} className="btn-secondary">Clear filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`h-9 w-9 text-sm rounded-sm border ${
                        pagination.page === i + 1 ? 'bg-pitch text-chalk border-pitch' : 'border-ink/20 hover:border-ink/40'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
