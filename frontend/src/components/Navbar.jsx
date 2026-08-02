import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {ShoppingBag, Search, User, Menu, X, LogOut, ChevronDown} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { slugify } from "../utils/format";
import HDR from "../assets/HDR.png";
import { useCurrency } from "../context/CurrencyContext";

const NAV_DROPDOWNS = [
  {
    title: "Cricket",
    items: ["Cricket Bats", "Cricket Balls", "Batting Pads"],
  },
  {
    title: "Sports Apparel",
    items: ["Shirts", "Trousers", "Hoodies", "Track Suits"],
  },
  {
    title: "Cricket Accessories",
    items: ["Helmets", "Guard", "Shoes", "Grips", "Gloves Inner"],
  },
  {
    title: "Cricket Bags",
    items: ["Backpack", "Kit Bags"],
  },
];

const Navbar = () => {
  const { currency, setCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/10">
      {/* Top Announcement Bar */}
      <div className="bg-[#0D111A] text-white text-center text-xs font-medium tracking-wide py-2 px-4">
        Free Standard Shipping On Local Orders Over Rs. 15,000
      </div>

      {/* Main Navbar */}
      <div className="container-HDR flex items-center justify-between h-20 gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0"
          aria-label="HDR Sports Home"
        >
          <img
            src={HDR}
            alt="HDR Sports Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
          {/* Home */}
          <Link
            to="/"
            className="text-[#0D111A] hover:text-[#D4AF37] transition-colors duration-300"
          >
            Home
          </Link>

          {/* Dropdown Menus */}
          {NAV_DROPDOWNS.map((menu) => (
            <div
              key={menu.title}
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown(menu.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`relative flex items-center gap-1.5 py-7 transition-colors duration-300 ${
                  activeDropdown === menu.title
                    ? "text-[#D4AF37]"
                    : "text-[#0D111A] hover:text-[#D4AF37]"
                }`}
              >
                {menu.title}

                <ChevronDown size={15} />
              </button>

              {/* Dropdown */}
              {activeDropdown === menu.title && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-xl py-3 z-50">
                  {menu.items.map((item) => (
                    <Link
                      key={item}
                      to={`/shop?categorySlug=${slugify(item)}`}
                      className="group relative block px-5 py-3 text-sm text-[#0D111A] transition-colors duration-300 "
                    >
                      {item}

                      {/* Equal Golden Line */}
                      <span className="absolute left-5 bottom-1 w-8 h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Search */}
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 hover:text-[#D4AF37] rounded-full transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Account */}
          <div className="relative">
            <button
              aria-label="Account"
              onClick={() => setProfileOpen((s) => !s)}
              className="p-2 hover:text-[#D4AF37] rounded-full transition-colors"
            >
              <User size={20} />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-3 w-56 bg-white border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-xl py-2 z-50"
                onMouseLeave={() => setProfileOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-3 text-xs text-gray-500 border-b border-black/10">
                      Signed in as{" "}
                      <span className="font-bold text-[#0D111A]">
                        {user.name}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Order History
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 text-sm hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2.5 text-sm hover:text-[#D4AF37]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Log in
                    </Link>

                    <Link
                      to="/register"
                      className="block px-4 py-2.5 text-sm hover:text-[#D4AF37]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Create account
                    </Link>

                    <Link
                      to="/order-lookup"
                      className="block px-4 py-2.5 text-sm hover:text-[#D4AF37]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Track an order
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative inline-flex items-center justify-center p-2 rounded-full text-[#080B12] hover:text-[#D4AF37] transition-all duration-300"
          >
            <ShoppingBag size={20} />

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#D4AF37] text-[#080B12] text-[11px] rounded-full font-black flex items-center justify-center border-2 border-white">
                {itemCount > 10 ? "10+" : itemCount}
              </span>
            )}
          </Link>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            {[
              "PKR",
              "USD",
              "EUR",
              "GBP",
              "AED",
              "SAR",
              "CAD",
              "AUD",
              "NZD",
              "JPY",
              "CNY",
              "INR",
              "BDT",
              "NPR",
              "LKR",
              "TRY",
              "RUB",
              "ZAR",
              "MYR",
              "SGD",
              "HKD",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Mobile Menu */}
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2.5 hover:bg-[#D4AF37]/10 rounded-full transition-colors lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-black/10 bg-white">
          <form
            onSubmit={handleSearch}
            className="container-HDR py-4 flex items-center gap-3"
          >
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bats, balls, gloves, apparel..."
              className="flex-1 bg-transparent text-sm py-1 text-[#0D111A] border border-black rounded-md px-3 outline-none focus:outline-none focus:border-black focus:ring-0"
            />

            <button
              type="submit"
              className="text-sm font-bold hover:text-[#D4AF37] text-[#0D111A] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-black/10 bg-white">
          <nav className="container-HDR py-4 flex flex-col gap-1 text-sm">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 font-bold border-b border-black/5 text-[#0D111A] hover:text-[#D4AF37] transition-colors"
            >
              Home
            </Link>

            {NAV_DROPDOWNS.map((menu) => (
              <div key={menu.title} className="py-2">
                <p className="py-2 font-bold text-[#0D111A] hover:text-[#D4AF37] transition-colors cursor-pointer">
                  {menu.title}{" "}
                </p>

                <div className="pl-4 border-l-2 border-[#D4AF37]/40">
                  {menu.items.map((item) => (
                    <Link
                      key={item}
                      to={`/shop?categorySlug=${slugify(item)}`}
                      onClick={() => setMenuOpen(false)}
                      className="group relative block py-2 text-gray-500 hover:text-[#D4AF37] transition-colors"
                    >
                      {item}
                      <span className="absolute left-0 bottom-0 w-8 h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
