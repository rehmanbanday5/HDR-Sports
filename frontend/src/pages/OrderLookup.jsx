import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package, Truck } from "lucide-react";
import api from "../api/client";
import { formatPrice } from "../utils/format";

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

const OrderLookup = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/orders/my-orders");

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  const getCurrentStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0D111A]/10 border-t-[#D4AF37]" />

          <p className="text-sm font-semibold text-[#0D111A]">
            Loading Your Orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-HDR py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>

          <button
            onClick={loadOrders}
            className="mt-4 rounded-xl bg-[#0D111A] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0D111A]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-black/10 bg-[#0D111A]">
        <div className="container-HDR py-12 sm:py-16">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            HDR SPORTS
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Your Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
            View your orders and track the latest status of your purchases.
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="container-HDR py-10 sm:py-14">
        {orders.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-10 text-center shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D111A] text-[#D4AF37]">
              <Package size={28} />
            </div>

            <h2 className="mt-5 text-xl font-black text-[#0D111A]">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const isCancelled = order.status === "cancelled";
              const currentStepIndex = getCurrentStepIndex(order.status);

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
                >
                  {/* Order Top Header */}
                  <div className="flex flex-col gap-4 border-b border-black/10 bg-[#F8F8F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-sm font-black text-[#0D111A]">
                          {formatPrice(order.pricing.total)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                          isCancelled
                            ? "bg-red-100 text-red-600"
                            : order.status === "delivered"
                              ? "bg-green-600 text-white"
                              : order.status === "shipped"
                                ? "bg-green-200 text-green-800"
                                : order.status === "processing" ||
                                    order.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-black/10">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${item.product || index}`}
                        className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:px-7"
                      >
                        {/* Product Image */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#F8F8F8]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <Package size={28} className="text-gray-300" />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#0D111A]">
                            {item.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                            <span>
                              Price:{" "}
                              <strong className="text-[#0D111A]">
                                {formatPrice(item.unitPrice)}
                              </strong>
                            </span>

                            <span>
                              Quantity:{" "}
                              <strong className="text-[#0D111A]">
                                {item.quantity}
                              </strong>
                            </span>

                            {item.attributes &&
                              Object.entries(item.attributes).map(
                                ([key, value]) => (
                                  <span key={key}>
                                    {key}:{" "}
                                    <strong className="text-[#0D111A]">
                                      {value}
                                    </strong>
                                  </span>
                                ),
                              )}
                          </div>

                          <p className="mt-3 text-xs text-gray-400">
                            Ordered on{" "}
                            {new Date(order.createdAt).toDateString()}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Payment:{" "}
                            <span className="font-medium text-gray-500">
                              {order.paymentMethod}
                            </span>
                          </p>
                        </div>

                        {/* Status + Track Button */}
                        <div className="flex w-full flex-col gap-4 sm:w-auto sm:min-w-[210px] sm:items-end">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                isCancelled ? "bg-red-500" : "bg-[#D4AF37]"
                              }`}
                            />

                            <span className="text-sm font-bold capitalize text-[#0D111A]">
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleOrder(order._id)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0D111A] px-5 py-3 text-xs font-bold text-[#0D111A] transition-all duration-300 hover:bg-[#D4AF37] hover:border-[#D4AF37]"
                          >
                            <Truck size={16} />

                            {isExpanded ? "Hide Tracking" : "Track Your Order"}

                            {isExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Section */}
                  {isExpanded && (
                    <div className="border-t border-black/10 bg-[#F8F8F8] px-5 py-8 sm:px-7">
                      <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                          Order Tracking
                        </p>

                        <h3 className="mt-2 text-xl font-black text-[#0D111A]">
                          Track Your Order
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          Current status:{" "}
                          <span className="font-bold capitalize text-[#0D111A]">
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </p>
                      </div>

                      {isCancelled ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                          <p className="font-bold text-red-600">
                            This order has been cancelled.
                          </p>

                          {order.cancelledReason && (
                            <p className="mt-2 text-sm text-red-500">
                              {order.cancelledReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <div className="min-w-[650px]">
                            {/* Progress Line */}
                            <div className="flex items-center">
                              {STATUS_STEPS.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;

                                const isLast =
                                  index === STATUS_STEPS.length - 1;

                                return (
                                  <div
                                    key={step}
                                    className="flex flex-1 items-center last:flex-none"
                                  >
                                    <div
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                                        isCompleted
                                          ? step === "delivered"
                                            ? "border-green-600 bg-green-600 text-white"
                                            : step === "pending"
                                              ? "border-yellow-300 bg-yellow-200 text-yellow-800"
                                              : "border-green-300 bg-green-100 text-green-700"
                                          : "border-black/15 bg-white text-gray-400"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>

                                    {!isLast && (
                                      <div
                                        className={`h-1 flex-1 ${
                                          index < currentStepIndex
                                            ? index === 0
                                              ? "bg-yellow-300"
                                              : "bg-green-300"
                                            : "bg-black/10"
                                        }`}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Status Labels */}
                            <div className="mt-4 flex">
                              {STATUS_STEPS.map((step) => (
                                <div
                                  key={step}
                                  className="flex-1 text-center first:text-left last:text-right"
                                >
                                  <p
                                    className={`text-xs font-bold ${
                                      step === order.status
                                        ? "text-[#D4AF37]"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {STATUS_LABELS[step]}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="mt-8 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Shipping
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#0D111A]">
                            {order.shippingMethod?.name || "Standard Shipping"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Payment
                          </p>

                          <p className="mt-1 text-sm font-bold capitalize text-[#0D111A]">
                            {order.paymentMethod}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-black text-[#0D111A]">
                            {formatPrice(order.pricing.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderLookup;
