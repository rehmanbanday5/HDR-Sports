import { useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api/client';
import { formatPrice } from '../utils/format';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const OrderLookup = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const { data } = await api.get('/orders/lookup', { params: { orderNumber: orderNumber.trim(), email: email.trim() } });
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = order?.status === 'cancelled';
  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="container-gully py-14 max-w-xl">
      <h1 className="font-display text-3xl font-bold mb-2">Track Your Order</h1>
      <p className="text-ink-soft mb-8">Enter your order number and the email used at checkout.</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Order number, e.g. GLY-20260726-0001" className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          <Search size={16} /> {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && <p className="text-leather text-sm mb-6">{error}</p>}

      {order && (
        <div className="bg-white border border-ink/10 rounded-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="font-mono font-semibold">{order.orderNumber}</p>
            <span className="text-xs font-mono uppercase tracking-wide bg-willow/20 text-willow-dark px-3 py-1 rounded-full">
              {order.status}
            </span>
          </div>

          {!isCancelled && (
            <div className="flex items-center mb-8">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`h-3 w-3 rounded-full shrink-0 ${i <= currentStepIndex ? 'bg-pitch' : 'bg-ink/15'}`} />
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 ${i < currentStepIndex ? 'bg-pitch' : 'bg-ink/15'}`} />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-5 text-[10px] text-ink-soft mb-8 -mt-6 uppercase font-mono tracking-wide">
            {STATUS_STEPS.map((s) => <span key={s} className="text-center first:text-left last:text-right">{s}</span>)}
          </div>

          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ink/10 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.pricing.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLookup;
