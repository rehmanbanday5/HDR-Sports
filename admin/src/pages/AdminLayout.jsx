import { NavLink, Outlet, Link } from "react-router-dom";
import HDR from "../assets/HDR.png";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  Images,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/instagram", label: "Instagram", icon: Images },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("HDR_token");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] grid lg:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="bg-black text-white lg:h-screen lg:sticky lg:top-0 flex lg:flex-col shadow-xl">
        {/* Logo / Brand */}
        <div className="bg-white p-6 border-b border-black/10 hidden lg:block">
          <img
            src={HDR}
            alt="HDR Logo"
            className="w-32 h-auto object-contain ml-7"
          />
        </div>

        {/* Navigation */}
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-3 lg:p-4 gap-2 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#C9A227] text-black shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? "text-black"
                        : "text-white/60 group-hover:text-[#C9A227]"
                    }
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 hidden lg:block">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen p-6 lg:p-10 overflow-x-hidden bg-[#f7f7f5]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
