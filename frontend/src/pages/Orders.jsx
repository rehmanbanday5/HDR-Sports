import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import api from "../api/client";
import EmptyState from "../components/EmptyState";
import { useCurrency } from "../context/CurrencyContext";

const STATUS_COLORS = {
  pending: "bg-willow/20 text-willow-dark",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-gold/20 text-gold",
  shipped: "bg-pitch/15 text-pitch",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-leather/15 text-leather",
};

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    api
      .get("/users/orders")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setOrders([]));
  }, []);

  if (orders === null) {
    return (
      <div className="container-HDR py-10">
        <div className="skeleton h-8 w-48 mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 w-full mb-3" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-HDR">
        <EmptyState
          icon={PackageSearch}
          title="No orders yet"
          message="Your order history will appear here."
          action={
            <Link to="/shop" className="btn-primary">
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-HDR py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Order History</h1>
      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="flex items-center justify-between py-5 hover:bg-white/60 transition-colors px-2 -mx-2"
          >
            <div>
              <p className="font-mono font-semibold text-sm">{o.orderNumber}</p>
              <p className="text-xs text-ink-soft mt-1">
                {new Date(o.createdAt).toLocaleDateString("en-PK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-sm">
                {formatCurrency(o.pricing.total)}
              </span>
              <span
                className={`text-xs font-mono uppercase tracking-wide px-3 py-1 rounded-full ${STATUS_COLORS[o.status]}`}
              >
                {o.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
