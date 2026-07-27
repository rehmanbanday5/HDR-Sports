import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/client';
import { formatPrice } from '../utils/format';

const STATUS_COLORS = {
  pending: 'bg-willow/20 text-willow-dark',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-gold/20 text-gold',
  shipped: 'bg-pitch/15 text-pitch',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-leather/15 text-leather',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setOrders(null);
    try {
      const { data } = await api.get('/orders', {
        params: {
          search: search || undefined,
          status: status || undefined,
          isInternational: region || undefined,
          page,
          limit: 15,
        },
      });
      setOrders(data.orders);
      setPages(data.pages);
    } catch {
      setOrders([]);
    }
  }, [search, status, region, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Orders</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-ink/20 rounded-sm px-4 py-2.5 flex-1 min-w-[220px]">
          <Search size={16} className="text-ink-soft" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search order #, name, email..." className="flex-1 outline-none text-sm" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-ink/20 rounded-sm px-3 py-2.5 text-sm bg-white">
          <option value="">All Statuses</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }} className="border border-ink/20 rounded-sm px-3 py-2.5 text-sm bg-white">
          <option value="">All Regions</option>
          <option value="false">Local (Pakistan)</option>
          <option value="true">International</option>
        </select>
      </div>

      <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs font-mono uppercase tracking-wide text-ink-soft">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders === null && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={6} className="p-4"><div className="skeleton h-8 w-full" /></td></tr>
            ))}
            {orders?.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-ink-soft">No orders found.</td></tr>}
            {orders?.map((o) => (
              <tr key={o._id} className="hover:bg-chalk">
                <td className="p-4">
                  <Link to={`/admin/orders/${o._id}`} className="font-mono font-medium hover:underline">{o.orderNumber}</Link>
                  {o.isInternationalOrder && <span className="ml-2 text-[10px] bg-willow/20 text-willow-dark px-1.5 py-0.5 rounded-full">INTL</span>}
                </td>
                <td className="p-4">
                  <p>{o.customer.fullName}</p>
                  <p className="text-xs text-ink-soft">{o.customer.email}</p>
                </td>
                <td className="p-4 font-semibold">{formatPrice(o.pricing.total)}</td>
                <td className="p-4 text-xs uppercase text-ink-soft">{o.paymentMethod} · {o.paymentStatus}</td>
                <td className="p-4"><span className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                <td className="p-4 text-ink-soft text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`h-8 w-8 text-sm rounded-sm border ${page === i + 1 ? 'bg-pitch text-chalk border-pitch' : 'border-ink/20'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
