import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, ShoppingCart, Users, ArrowLeft } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-chalk grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-chalk lg:h-screen lg:sticky lg:top-0 flex lg:flex-col">
        <div className="p-6 border-b border-chalk/10 hidden lg:block">
          <span className="font-display text-xl font-bold">GULLY</span>
          <p className="text-[10px] font-mono uppercase tracking-widest text-willow mt-1">Admin Panel</p>
        </div>
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-3 lg:p-4 gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-pitch text-chalk' : 'text-chalk/70 hover:bg-chalk/10 hover:text-chalk'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-chalk/10 hidden lg:block">
          <Link to="/" className="flex items-center gap-2 text-xs text-chalk/60 hover:text-chalk">
            <ArrowLeft size={14} /> Back to storefront
          </Link>
        </div>
      </aside>
      <main className="p-6 lg:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
