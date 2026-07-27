import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, X } from 'lucide-react';
import api from "../api/client";
import { formatPrice } from "../utils/format";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const fetchCustomers = useCallback(async () => {
    setCustomers(null);
    try {
      const { data } = await api.get('/users', { params: { search: search || undefined, page, limit: 15 } });
      setCustomers(data.customers);
      setPages(data.pages);
    } catch {
      setCustomers([]);
    }
  }, [search, page]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const viewCustomer = async (id) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setSelected(data.customer);
      setSelectedOrders(data.orders);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/users/${id}/status`);
      toast.success(data.customer.isActive ? 'Customer activated' : 'Customer deactivated');
      fetchCustomers();
      if (selected?._id === id) setSelected(data.customer);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Customers</h1>

      <div className="flex items-center gap-2 mb-6 bg-white border border-ink/20 rounded-sm px-4 py-2.5 max-w-sm">
        <Search size={16} className="text-ink-soft" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers..." className="flex-1 outline-none text-sm" />
      </div>

      <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs font-mono uppercase tracking-wide text-ink-soft">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {customers === null && Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5} className="p-4"><div className="skeleton h-8 w-full" /></td></tr>)}
            {customers?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-ink-soft">No customers found.</td></tr>}
            {customers?.map((c) => (
              <tr key={c._id} className="hover:bg-chalk cursor-pointer" onClick={() => viewCustomer(c._id)}>
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-ink-soft">{c.email}</td>
                <td className="p-4 text-ink-soft">{c.phone || '—'}</td>
                <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-leather/15 text-leather'}`}>{c.isActive ? 'Active' : 'Deactivated'}</span></td>
                <td className="p-4 text-ink-soft text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
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

      {selected && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-sm max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold">{selected.name}</h2>
                <p className="text-sm text-ink-soft">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <button onClick={() => toggleStatus(selected._id)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border mb-6 ${selected.isActive ? 'border-leather text-leather' : 'border-pitch text-pitch'}`}>
              {selected.isActive ? 'Deactivate account' : 'Activate account'}
            </button>

            <h3 className="font-semibold text-sm mb-3">Order History ({selectedOrders.length})</h3>
            <div className="divide-y divide-ink/10">
              {selectedOrders.map((o) => (
                <div key={o._id} className="flex justify-between py-2 text-sm">
                  <span className="font-mono">{o.orderNumber}</span>
                  <span>{formatPrice(o.pricing.total)}</span>
                  <span className="capitalize text-ink-soft">{o.status}</span>
                </div>
              ))}
              {selectedOrders.length === 0 && <p className="text-sm text-ink-soft py-2">No orders yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
