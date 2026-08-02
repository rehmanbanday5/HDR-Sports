import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import api from '../api/client';
import { formatPrice, primaryImage, displayPrice } from '../utils/format';

const AdminProducts = () => {
  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setProducts(null);
    try {
      const { data } = await api.get('/products/admin/all', { params: { search: search || undefined, page, limit: 15 } });
      setProducts(data.products);
      setPages(data.pages);
    } catch {
      setProducts([]);
    }
  }, [search, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md text-sm font-semibold border border-black hover:bg-gold hover:text-[#D4AF37] transition-all duration-200 shadow-sm"
        >
          <Plus size={17} strokeWidth={2.5} />
          Add Product
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-white border border-ink/20 rounded-sm px-4 py-2.5 max-w-sm">
        <Search size={16} className="text-ink-soft" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="flex-1 outline-none text-sm"
        />
      </div>

      <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs font-mono uppercase tracking-wide text-ink-soft">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="p-4">
                    <div className="skeleton h-8 w-full" />
                  </td>
                </tr>
              ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-soft">
                  No products found.
                </td>
              </tr>
            )}
            {products?.map((p) => {
              const stock = p.hasVariants
                ? p.variants.reduce((s, v) => s + v.stock, 0)
                : p.stock;
              return (
                <tr key={p._id}>
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={primaryImage(p)}
                      alt=""
                      className="h-10 w-10 rounded-sm object-cover border border-ink/10"
                    />
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="p-4 text-ink-soft">
                    {p.category?.name || "—"}
                  </td>
                  <td className="p-4">{formatPrice(displayPrice(p))}</td>
                  <td
                    className={`p-4 ${stock <= 5 ? "text-leather font-semibold" : ""}`}
                  >
                    {stock}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink-soft"}`}
                    >
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="text-ink-soft hover:text-pitch"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="text-ink-soft hover:text-leather"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 text-sm rounded-sm border ${page === i + 1 ? "bg-pitch text-chalk border-pitch" : "border-ink/20"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
