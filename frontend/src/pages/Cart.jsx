import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';
import { useCurrency, RATES, SYMBOLS } from "../context/CurrencyContext";

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
const { currency } = useCurrency();

const symbol = SYMBOLS[currency];

  const convertPrice = (value) =>
    (value * RATES[currency]).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="container-HDR py-16">
        <div className="skeleton h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 w-full" />)}
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-HDR">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added any gear yet. Let's fix that."
          action={
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center h-12 px-6 bg-black text-white rounded-md font-semibold overflow-hidden transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
            >
              <span
                className="inline-block transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="block transition-transform duration-500 group-hover:[transform:rotateX(360deg)]">
                  Start Shopping
                </span>
              </span>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-HDR py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {cart.items.map((item) => (
            <div key={item._id} className="flex gap-4 py-5">
              <div className="h-24 w-24 bg-white border border-ink/10 rounded-sm overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold leading-snug mb-1">
                  {item.name}
                </p>
                {item.attributes && Object.keys(item.attributes).length > 0 && (
                  <p className="text-xs text-ink-soft mb-2">
                    {Object.entries(item.attributes)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </p>
                )}
                <p className="text-sm font-semibold">
                  {symbol} {convertPrice(item.price)}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-ink/20 rounded-sm">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="p-2 hover:bg-ink/5"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="p-2 hover:bg-ink/5"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-ink-soft hover:text-leather transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-sm shrink-0">
                {symbol} {convertPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-ink/10 rounded-sm p-6 h-fit sticky top-32">
          <h2 className="font-display font-semibold text-lg mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-medium">
              {symbol} {convertPrice(cart.subtotal)}
            </span>
          </div>
          <p className="text-xs text-ink-soft mb-4">
            Shipping and taxes calculated at checkout.
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="group w-full h-12 bg-black text-white rounded-md flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
          >
            Proceed to Checkout
            <span className="transition-transform duration-300 group-hover:scale-150 group-hover:translate-x-1">
              <ArrowRight size={18} />
            </span>
          </button>
          <Link
            to="/shop"
            className="block text-center text-sm text-[#D4AF37] font-semibold mt-4 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
