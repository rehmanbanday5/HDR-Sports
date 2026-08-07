import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { slugify } from "../utils/format";
import HDR from "../assets/HDR.png";
import { useCurrency } from "../context/CurrencyContext";

const NAV_DROPDOWNS = [
  {
    title: "Cricket Bats",
    items: [
      "English Willow",
      "Kashmir Willow",
      "Grade 1",
      "Grade 2",
      "Grade 3",
    ],
  },
  {
    title: "Cricket Balls",
    items: ["Red Ball", "White Ball", "Synthetic Ball"],
  },
  {
    title: "Cricket Protection",
    items: [
      "Helmets",
      "Batting Pads",
      "Batting Gloves",
      "Gloves Inner",
      "Arm Guards",
      "Thigh Pads",
      "Chest Guards",
    ],
  },
  {
    title: "Wikcet Keeping",
    items: [
      "Gloves",
      "Pads",
      "Gloves Inner"
    ],
  },
  {
    title: "Sports Apparel",
    items: ["Shirts", "Trousers", "Hoodies", "Track Suits", "Shoes"],
  },
  {
    title: "Cricket Bags",
    items: ["wheelie Bags", "Duffle Bags", "Backpack"],
  },
];

const Navbar = () => {
  const { currency, setCurrency, currencyOptions } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-sm">
      <div className="bg-[#0D111A] text-white text-center text-[11px] font-semibold tracking-[0.24em] uppercase py-2 px-4">
        Free standard shipping on local orders over Rs. 15,000 — international
        delivery available.
      </div>

      <div className="container-HDR flex items-center justify-between gap-2 lg:gap-4 py-3 lg:py-4">
        <Link to="/" className="flex items-center shrink-0 ">
          <img
            src={HDR}
            alt="HDR Sports Logo"
            className="h-12 sm:h-14 lg:h-16 w-auto object-contain lg:-translate-x-6"
          />
        </Link>

        <nav className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-7 text-sm font-semibold text-ink">
          <Link
            to="/"
            className="transition-colors duration-300 hover:text-[#D4AF37]"
          >
            Home
          </Link>
          {NAV_DROPDOWNS.map((menu) => (
            <div
              key={menu.title}
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown(menu.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`relative flex items-center gap-1 whitespace-nowrap transition-colors duration-300 ${
                  activeDropdown === menu.title
                    ? "text-[#D4AF37]"
                    : "hover:text-[#D4AF37]"
                }`}
              >
                {menu.title}
                <ChevronDown size={14} />
              </button>
              {activeDropdown === menu.title && (
                <div className="absolute top-full left-1/2 z-50 w-60 -translate-x-1/2 rounded-3xl border border-black/10 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.16)] py-4">
                  {menu.items.map((item) => (
                    <Link
                      key={item}
                      to={`/shop?categorySlug=${slugify(item)}`}
                      className="group block px-6 py-3 text-sm text-[#0D111A] transition-colors duration-300 hover:text-[#D4AF37]"
                    >
                      {item}
                      <span className="mt-1 block h-[2px] w-8 bg-[#D4AF37] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/shop"
            className="whitespace-nowrap transition-colors duration-300 hover:text-[#D4AF37]"
          >
            Shop All
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded-full text-ink transition duration-200 hover:text-[#D4AF37]"
          >
            <Search size={20} />
          </button>

          <div className="relative">
            <button
              aria-label="Account"
              onClick={() => setProfileOpen((s) => !s)}
              className="p-2 rounded-full text-ink transition duration-200 hover:text-[#D4AF37]"
            >
              <User size={20} />
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 mt-3 w-56 rounded-[1.5rem] border border-black/10 bg-white p-2 shadow-[0_15px_40px_rgba(15,23,42,0.16)]"
                onMouseLeave={() => setProfileOpen(false)}
              >
                {user ? (
                  <>
                    <div className="rounded-2xl border border-ink/10 bg-[#F8F5EF] px-4 py-3 text-xs text-ink-soft">
                      Signed in as{" "}
                      <span className="font-semibold text-ink">
                        {user.name}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-ink/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-ink/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Order History
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-ink/5"
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
                      className="mt-2 w-full rounded-2xl px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={14} className="inline-block align-middle" />{" "}
                      <span className="align-middle">Log out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-ink/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-ink/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Create account
                    </Link>
                    <Link
                      to="/order-lookup"
                      className="block rounded-2xl px-4 py-3 text-sm text-ink transition hover:bg-ink/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Track an order
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative inline-flex items-center justify-center rounded-full p-2 text-ink transition duration-200 hover:text-[#D4AF37]"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[11px] font-black text-[#080B12] border-2 border-white">
                {itemCount > 10 ? "10+" : itemCount}
              </span>
            )}
          </Link>

          <div className="hidden md:block">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 hover:border-ink/20"
            >
              {currencyOptions.map(({ code, label }) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <button
            className="lg:hidden p-2 rounded-full text-ink transition duration-200 hover:text-[#D4AF37]"
            onClick={() => setMenuOpen((s) => !s)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="container-HDR border-t border-black/10 bg-white/90 py-4">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex w-full max-w-3xl items-center gap-2 sm:gap-3 rounded-full border border-ink/10 bg-ink/5 px-3 sm:px-4 py-3"
          >
            <Search size={18} className="text-ink/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cricket bats, gloves, helmets..."
              className="flex-1 min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
            />
            <button
              type="submit"
              className="rounded-full bg-ink px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-chalk transition hover:bg-[#0a0a0a]"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-black/10 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.16)]">
          <div className="container-HDR space-y-5 py-5">
            <div className="grid gap-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-3xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="rounded-3xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Shop All
              </Link>
            </div>
            {NAV_DROPDOWNS.map((menu) => (
              <div
                key={menu.title}
                className="rounded-3xl border border-ink/10 bg-[#f8f5ef] p-4"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-ink-soft mb-3">
                  {menu.title}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menu.items.map((item) => (
                    <Link
                      key={item}
                      to={`/shop?categorySlug=${slugify(item)}`}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-3xl bg-white px-4 py-3 text-sm text-ink transition hover:bg-[#D4AF37] hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid gap-3">
              <Link
                to="/order-lookup"
                onClick={() => setMenuOpen(false)}
                className="rounded-3xl border border-ink/10 px-4 py-3 text-sm text-ink transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Track Order
              </Link>
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-3xl border border-ink/10 px-4 py-3 text-sm text-ink transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-3xl border border-ink/10 px-4 py-3 text-sm text-ink transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
