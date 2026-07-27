import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // Save JWT token
      localStorage.setItem("gully_token", data.token);

      // Optional: remove old guest token
      // localStorage.removeItem('gully_guest_id');

      toast.success("Admin login successful!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 p-8 rounded-sm w-full max-w-md"
      >
        <h1 className="font-display text-3xl font-bold mb-2">GULLY Admin</h1>

        <p className="text-sm text-ink-soft mb-6">
          Login to access the admin dashboard.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
