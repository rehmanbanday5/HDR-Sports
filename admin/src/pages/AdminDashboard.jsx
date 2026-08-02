import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, TrendingUp, Users, AlertTriangle, DollarSign } from 'lucide-react';
import api from '../api/client';
import { formatPrice } from '../utils/format';

const TONE_CLASSES = {
  pitch: { bg: 'bg-pitch/10', text: 'text-pitch' },
  'willow-dark': { bg: 'bg-willow/20', text: 'text-willow-dark' },
  leather: { bg: 'bg-leather/10', text: 'text-leather' },
};

const StatCard = ({ icon: Icon, label, value, tone = 'pitch' }) => {
  const cls = TONE_CLASSES[tone] || TONE_CLASSES.pitch;
  return (
    <div className="bg-white border border-ink/10 rounded-sm p-5">
      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${cls.bg} mb-3`}>
        <Icon size={16} className={cls.text} />
      </div>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-xs text-ink-soft mt-1">{label}</p>
    </div>
  );
};

const STATUS_COLORS = {
  pending: 'bg-willow/20 text-willow-dark',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-gold/20 text-gold',
  shipped: 'bg-pitch/15 text-pitch',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-leather/15 text-leather',
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary').then((r) => setData(r.data)).catch(() => setData(false));
  }, []);

  if (data === false) return <p className="text-leather">Failed to load dashboard data.</p>;
  if (!data) return <div className="skeleton h-64 w-full" />;

  const { stats, recentOrders } = data;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Sales" value={formatPrice(stats.totalSales)} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} tone="willow-dark" />
        <StatCard icon={Users} label="Customers" value={stats.totalCustomers} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Processing" value={stats.processingOrders} />
        <StatCard icon={TrendingUp} label="Shipped" value={stats.shippedOrders} />
        <StatCard icon={TrendingUp} label="Delivered" value={stats.deliveredOrders} />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats.lowStockCount} tone="leather" />
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-semibold text-lg">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-pitch hover:underline">
            View all
          </Link>
        </div>

        <div className="divide-y divide-ink/10">
          {recentOrders.map((o) => (
            <Link
              key={o._id}
              to={`/admin/orders/${o._id}`}
              className="flex justify-between py-3 text-sm hover:bg-chalk -mx-2 px-2 rounded-sm"
            >
              <div>
                <p className="font-mono font-medium">{o.orderNumber}</p>
                <p className="text-xs text-ink-soft">{o.customer?.fullName}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">{formatPrice(o.pricing.total)}</p>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}
                >
                  {o.status}
                </span>
              </div>
            </Link>
          ))}

          {recentOrders.length === 0 && (
            <p className="text-sm text-ink-soft py-3">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

