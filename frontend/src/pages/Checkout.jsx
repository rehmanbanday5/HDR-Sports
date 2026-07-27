import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Truck, Landmark, CreditCard, Smartphone } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

const COUNTRIES = [
  'Pakistan', 'United States', 'United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'Canada',
  'Australia', 'India', 'Bangladesh', 'Qatar', 'Germany', 'Other',
];

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Truck, localOnly: true, desc: 'Pay when your order arrives (Pakistan only).' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Landmark, desc: 'Manual transfer — details sent after order confirmation.' },
  { id: 'jazzcash', label: 'JazzCash / EasyPaisa', icon: Smartphone, localOnly: true, desc: 'Pay instantly via mobile wallet.' },
  { id: 'stripe', label: 'Credit / Debit Card', icon: CreditCard, desc: 'International cards via secure gateway.' },
];

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Pakistan',
  orderNotes: '',
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ...emptyForm,
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  const isInternational = form.country && form.country.toLowerCase() !== 'pakistan';

  useEffect(() => {
    if (!cart.items || cart.items.length === 0) return;
    api
      .post('/orders/shipping-options', { country: form.country, subtotal: cart.subtotal })
      .then(({ data }) => {
        setShippingOptions(data.options);
        setSelectedShipping(data.options[0]?.id);
      })
      .catch(() => setShippingOptions([]));
  }, [form.country, cart.subtotal, cart.items]);

  useEffect(() => {
    if (isInternational && (paymentMethod === 'cod' || paymentMethod === 'jazzcash')) {
      setPaymentMethod('bank_transfer');
    }
  }, [isInternational, paymentMethod]);

  const selectedOption = shippingOptions.find((o) => o.id === selectedShipping);
  const total = (cart.subtotal || 0) + (selectedOption?.cost || 0);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShipping) {
      toast.error('Please select a shipping method');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer: { fullName: form.fullName, email: form.email, phone: form.phone },
        shippingAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        orderNotes: form.orderNotes,
        items: cart.items.map((i) => ({ productId: i.product, variantId: i.variantId, quantity: i.quantity })),
        shippingMethodId: selectedShipping,
        paymentMethod,
      };
      const { data } = await api.post('/orders', payload);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data.order.orderNumber}`, { state: { email: form.email } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-gully py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-3">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary inline-flex">Browse Products</Link>
      </div>
    );
  }

  const availablePaymentMethods = PAYMENT_METHODS.filter((m) => !(isInternational && m.localOnly));

  return (
    <div className="container-gully py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-10">
          {/* Contact */}
          <section>
            <h2 className="font-display font-semibold text-lg mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm sm:col-span-2" />
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="font-display font-semibold text-lg mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <select name="country" value={form.country} onChange={handleChange} className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm sm:col-span-2 bg-white">
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Address line 1" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm sm:col-span-2" />
              <input name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Address line 2 (optional)" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm sm:col-span-2" />
              <input required name="city" value={form.city} onChange={handleChange} placeholder="City" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input name="state" value={form.state} onChange={handleChange} placeholder="State / Province" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
              <input required name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal / ZIP code" className="border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
            </div>
          </section>

          {/* Shipping Method */}
          <section>
            <h2 className="font-display font-semibold text-lg mb-4">Shipping Method</h2>
            <div className="space-y-2">
              {shippingOptions.map((o) => (
                <label key={o.id} className={`flex items-center justify-between border rounded-sm px-4 py-3 cursor-pointer ${selectedShipping === o.id ? 'border-pitch bg-pitch/5' : 'border-ink/20'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" checked={selectedShipping === o.id} onChange={() => setSelectedShipping(o.id)} />
                    <div>
                      <p className="text-sm font-medium">{o.name}</p>
                      <p className="text-xs text-ink-soft">{o.estimatedDays}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{o.cost === 0 ? 'Free' : formatPrice(o.cost)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-display font-semibold text-lg mb-4">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {availablePaymentMethods.map(({ id, label, icon: Icon, desc }) => (
                <label key={id} className={`flex items-start gap-3 border rounded-sm px-4 py-3 cursor-pointer ${paymentMethod === id ? 'border-pitch bg-pitch/5' : 'border-ink/20'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon size={16} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <p className="text-xs text-ink-soft mt-1">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {(paymentMethod === 'stripe' || paymentMethod === 'jazzcash') && (
              <p className="text-xs text-ink-soft mt-3 bg-willow/10 border border-willow/30 rounded-sm px-3 py-2">
                You'll be redirected to a secure payment page to complete this step once the order is placed.
              </p>
            )}
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg mb-4">Order Notes (optional)</h2>
            <textarea name="orderNotes" value={form.orderNotes} onChange={handleChange} rows={3} placeholder="Delivery instructions, gift note, etc." className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
          </section>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-ink/10 rounded-sm p-6 h-fit sticky top-32">
          <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex gap-3 text-sm">
                <div className="h-14 w-14 bg-chalk border border-ink/10 rounded-sm overflow-hidden shrink-0 relative">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 bg-ink text-chalk text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>{selectedOption ? (selectedOption.cost === 0 ? 'Free' : formatPrice(selectedOption.cost)) : '—'}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink/10"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-6 disabled:opacity-60">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
