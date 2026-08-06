import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../api/client";
import { useCurrency } from "../context/CurrencyContext";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { formatCurrency } = useCurrency();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const email = location.state?.email;
    if (!email) {
      setError(true);
      return;
    }
    api
      .get("/orders/lookup", { params: { orderNumber, email } })
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError(true));
  }, [orderNumber, location.state]);

  if (error) {
    return (
      <div className="container-HDR py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-3">
          Order #{orderNumber}
        </h1>
        <p className="text-ink-soft mb-6">
          Your order was placed successfully. Use the order lookup page with
          your email to view full details anytime.
        </p>
        <Link to="/order-lookup" className="btn-primary inline-flex">
          Track Your Order
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-HDR py-24 text-center text-ink-soft">
        Loading your order...
      </div>
    );
  }

  return (
    <div className="container-HDR py-16 max-w-2xl">
      <div className="text-center mb-10">
        <CheckCircle2 size={48} className="text-pitch mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-2">
          Thank you, {order.customer.fullName.split(" ")[0]}!
        </h1>
        <p className="text-ink-soft">Your order has been placed.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-ink/10">
          <span className="text-xs font-mono uppercase tracking-wide bg-willow/20 text-willow-dark px-3 py-1 rounded-full">
            {order.status}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-ink/10 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span>{formatCurrency(order.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">
              Shipping ({order.shippingMethod.name})
            </span>
            <span>{formatCurrency(order.pricing.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink/10 mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.pricing.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 mb-8 text-sm">
        <p className="font-semibold mb-1">Shipping to</p>
        <p className="text-ink-soft">
          {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.country}
        </p>
        <p className="font-semibold mt-3 mb-1">Payment Method</p>
        <p className="text-ink-soft uppercase">
          {order.paymentMethod.replace("_", " ")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link
          to="/shop"
          className="group relative inline-flex h-12 px-6 overflow-hidden bg-black text-white rounded-md items-center justify-center font-semibold transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
        >
          <span className="relative h-5 overflow-hidden">
            <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-5">
              Continue Shopping
            </span>
            <span className="absolute left-0 top-5 block transition-transform duration-500 ease-out group-hover:-translate-y-5">
              Continue Shopping
            </span>
          </span>
        </Link>

        <Link
          to="/order-lookup"
          className="group relative inline-flex h-12 px-6 overflow-hidden bg-black text-white rounded-md items-center justify-center font-semibold transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
        >
          <span className="relative h-5 overflow-hidden">
            <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-5">
              Track This Order
            </span>
            <span className="absolute left-0 top-5 block transition-transform duration-500 ease-out group-hover:-translate-y-5">
              Track This Order
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
