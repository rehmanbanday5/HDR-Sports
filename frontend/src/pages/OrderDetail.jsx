import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useCurrency } from "../context/CurrencyContext";

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const OrderDetail = () => {
  const { id } = useParams();
  const { formatCurrency } = useCurrency();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/users/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="container-HDR py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-3">
          Order not found
        </h1>
        <Link to="/orders" className="text-pitch font-semibold hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  if (!order)
    return (
      <div className="container-HDR py-24 text-center text-ink-soft">
        Loading...
      </div>
    );

  const isCancelled = order.status === "cancelled";
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container-HDR py-10 max-w-2xl">
      <Link
        to="/orders"
        className="text-sm text-pitch font-semibold hover:underline mb-6 inline-block"
      >
        ← Back to orders
      </Link>
      <div className="flex justify-end items-center mb-8">
        <span
          className={`text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full ${
            order.status === "delivered"
              ? "bg-green-600 text-white"
              : order.status === "shipped"
                ? "bg-green-200 text-green-800"
                : order.status === "processing" || order.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {!isCancelled && (
        <div className="bg-white border border-ink/10 rounded-sm p-6 mb-6">
          <div className="flex items-center mb-2">
            {STATUS_STEPS.map((step, i) => (
              <div
                key={step}
                className="flex items-center flex-1 last:flex-none"
              >
                <div
                  className={`h-3 w-3 rounded-full shrink-0 ${
                    i <= currentStepIndex
                      ? step === "delivered"
                        ? "bg-green-600"
                        : step === "pending"
                          ? "bg-yellow-400"
                          : "bg-green-300"
                      : "bg-black/10"
                  }`}
                />
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${i < currentStepIndex ? "bg-pitch" : "bg-ink/15"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 text-[10px] uppercase font-mono tracking-wide">
            {STATUS_STEPS.map((s) => (
              <span
                key={s}
                className={`text-center first:text-left last:text-right ${
                  s === order.status
                    ? s === "delivered"
                      ? "text-green-600 font-bold"
                      : s === "pending"
                        ? "text-yellow-600 font-bold"
                        : "text-green-600 font-bold"
                    : "text-gray-400"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-ink/10 rounded-sm p-6 mb-6">
        <h2 className="font-display font-semibold text-lg mb-4">Items</h2>
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
            <span className="text-ink-soft">Shipping</span>
            <span>{formatCurrency(order.pricing.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink/10 mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.pricing.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 text-sm">
        <p className="font-semibold mb-1">Shipping Address</p>
        <p className="text-ink-soft mb-4">
          {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.country}
        </p>
        <p className="font-semibold mb-1">Payment</p>
        <p className="text-ink-soft uppercase">
          {order.paymentMethod.replace("_", " ")} — {order.paymentStatus}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
