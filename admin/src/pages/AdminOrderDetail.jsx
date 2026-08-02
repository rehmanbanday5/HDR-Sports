import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { formatPrice } from "../utils/format";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["unpaid", "pending", "paid", "failed", "refunded"];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const fetchOrder = () => {
    api
      .get(`/orders/${id}`)
      .then((r) => setOrder(r.data.order))
      .catch(() => setOrder(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);

    try {
      const { data } = await api.put(`/orders/${id}/status`, {
        status: newStatus,
      });

      setOrder(data.order);
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updatePayment = async (newStatus) => {
    setUpdatingPayment(true);
    try {
      const { data } = await api.put(`/orders/${id}/payment-status`, {
        paymentStatus: newStatus,
      });
      setOrder(data.order);
      toast.success(`Payment marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingPayment(false);
    }
  };

  if (order === false) return <p className="text-leather">Order not found.</p>;
  if (!order) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/orders"
        className="text-sm text-pitch font-semibold hover:underline mb-4 inline-block"
      >
        ← Back to orders
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">
          {order.customer.fullName}
        </h1>

        {order.isInternationalOrder && (
          <span className="text-xs bg-willow/20 text-willow-dark px-2 py-1 rounded-full">
            International
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-ink/10 rounded-sm p-6">
          <h2 className="font-display font-semibold text-lg mb-4">
            Order Status
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                disabled={updatingStatus || order.status === s}
                onClick={() => updateStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-full border capitalize disabled:opacity-40 ${order.status === s ? "bg-pitch text-chalk border-pitch" : "border-ink/20 hover:border-ink/40"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-sm p-6">
          <h2 className="font-display font-semibold text-lg mb-4">
            Payment Status
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {PAYMENT_STATUSES.map((s) => (
              <button
                key={s}
                disabled={updatingPayment || order.paymentStatus === s}
                onClick={() => updatePayment(s)}
                className={`text-xs px-3 py-1.5 rounded-full border capitalize disabled:opacity-40 ${order.paymentStatus === s ? "bg-leather text-chalk border-leather" : "border-ink/20 hover:border-ink/40"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="text-xs text-ink-soft">
            Method: <span className="uppercase">{order.paymentMethod}</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 mb-6">
        <h2 className="font-display font-semibold text-lg mb-4">Items</h2>

        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <div>
                <p>
                  {item.name} × {item.quantity}
                </p>

                {item.attributes && Object.keys(item.attributes).length > 0 && (
                  <p className="text-xs text-ink-soft">
                    {Object.entries(item.attributes)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </p>
                )}
              </div>

              <span className="font-medium">{formatPrice(item.lineTotal)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-ink/10 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span>{formatPrice(order.pricing.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-ink-soft">
              Shipping ({order.shippingMethod.name})
            </span>
            <span>{formatPrice(order.pricing.shippingCost)}</span>
          </div>

          <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink/10 mt-2">
            <span>Total</span>
            <span>{formatPrice(order.pricing.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-ink/10 rounded-sm p-6 text-sm">
          <h2 className="font-display font-semibold text-lg mb-3">Customer</h2>

          <p>{order.customer.fullName}</p>
          <p className="text-ink-soft">{order.customer.email}</p>
          <p className="text-ink-soft">{order.customer.phone}</p>
        </div>

        <div className="bg-white border border-ink/10 rounded-sm p-6 text-sm">
          <h2 className="font-display font-semibold text-lg mb-3">
            Shipping Address
          </h2>

          <p>{order.shippingAddress.addressLine1}</p>

          {order.shippingAddress.addressLine2 && (
            <p>{order.shippingAddress.addressLine2}</p>
          )}

          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>

          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      {order.orderNotes && (
        <div className="bg-white border border-ink/10 rounded-sm p-6 mb-6 text-sm">
          <h2 className="font-display font-semibold text-lg mb-2">
            Order Notes
          </h2>

          <p className="text-ink-soft">{order.orderNotes}</p>
        </div>
      )}

      <div className="bg-white border border-ink/10 rounded-sm p-6 text-sm">
        <h2 className="font-display font-semibold text-lg mb-3">
          Status History
        </h2>

        <ul className="space-y-2">
          {order.statusHistory.map((h, i) => (
            <li key={i} className="flex justify-between text-xs text-ink-soft">
              <span className="capitalize font-medium text-ink">
                {h.status}
                {h.note ? ` — ${h.note}` : ""}
              </span>

              <span>{new Date(h.changedAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
