import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { slugify } from '../utils/format';

const CATEGORIES_QUICK = [
  'Cricket Bats',
  'Cricket Balls',
  'Batting Gloves',
  'Batting Pads',
  'Helmets',
  'Cricket Bags',
  'Shoes',
  'Clothing',
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-50 bg-chalk/95 backdrop-blur border-b border-ink/10">
      <div className="bg-pitch text-chalk text-center text-xs font-mono tracking-wide py-1.5 px-4">
        Free standard shipping on local orders over Rs. 15,000
      </div>
      <div className="container-gully flex items-center justify-between h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="GULLY Cricket home">
          <span className="font-display text-2xl font-bold tracking-tight text-pitch">GULLY</span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-willow-dark self-end mb-1">
            Cricket Co.
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link to="/shop" className="hover:text-pitch transition-colors">
            All Products
          </Link>
          {CATEGORIES_QUICK.slice(0, 5).map((c) => (
            <Link
              key={c}
              to={`/shop?categorySlug=${slugify(c)}`}
              className="hover:text-pitch transition-colors text-ink-soft"
            >
              {c}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 hover:bg-ink/5 rounded-full transition-colors"
          >
            <Search size={20} />
          </button>

          <div className="relative">
            <button
              aria-label="Account"
              onClick={() => setProfileOpen((s) => !s)}
              className="p-2 hover:bg-ink/5 rounded-full transition-colors"
            >
              <User size={20} />
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white border border-ink/10 shadow-lg rounded-sm py-2 z-50"
                onMouseLeave={() => setProfileOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 text-xs text-ink-soft border-b border-ink/10">
                      Signed in as <span className="font-semibold text-ink">{user.name}</span>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-chalk" onClick={() => setProfileOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-chalk" onClick={() => setProfileOpen(false)}>
                      Order History
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-chalk" onClick={() => setProfileOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-chalk flex items-center gap-2 text-leather"
                    >
                      <LogOut size={14} /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm hover:bg-chalk" onClick={() => setProfileOpen(false)}>
                      Log in
                    </Link>
                    <Link to="/register" className="block px-4 py-2 text-sm hover:bg-chalk" onClick={() => setProfileOpen(false)}>
                      Create account
                    </Link>
                    <Link to="/order-lookup" className="block px-4 py-2 text-sm hover:bg-chalk" onClick={() => setProfileOpen(false)}>
                      Track an order
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" aria-label="Cart" className="relative p-2 hover:bg-ink/5 rounded-full transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-leather text-chalk text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <button
            aria-label="Menu"
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 hover:bg-ink/5 rounded-full transition-colors lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-ink/10 bg-white">
          <form onSubmit={handleSearch} className="container-gully py-3 flex items-center gap-3">
            <Search size={18} className="text-ink-soft shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bats, gloves, helmets..."
              className="flex-1 bg-transparent outline-none text-sm py-1"
            />
            <button type="submit" className="text-sm font-semibold text-pitch">
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-ink/10 bg-white">
          <nav className="container-gully py-3 flex flex-col gap-1 text-sm">
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="py-2 font-semibold">
              All Products
            </Link>
            {CATEGORIES_QUICK.map((c) => (
              <Link
                key={c}
                to={`/shop?categorySlug=${slugify(c)}`}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-ink-soft"
              >
                {c}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
