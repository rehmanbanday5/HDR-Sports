import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import api from "../api/client";
import HDR from "../assets/HDR.png";

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
      localStorage.setItem("HDR_token", data.token);

      toast.success("Admin login successful!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#080B12] px-4 py-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.16),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.10),_transparent_35%)]" />

      {/* Decorative Gold Circles */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full border border-[#D4AF37]/10" />
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full border border-[#D4AF37]/10" />

      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-[#D4AF37]/10" />
      <div className="absolute -bottom-24 -left-24 w-[340px] h-[340px] rounded-full border border-[#D4AF37]/10" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1050px]">
        {/* Login Card */}
        <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-[#11151F]/95 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          {/* Left Branding Section */}
          <div className="hidden md:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-[#151A25] via-[#0D111A] to-[#080B12] p-10">
            {/* Gold Glow */}
            <div className="absolute top-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-white shadow-[0_0_30px_rgba(212,175,55,0.12)]">
                  <img
                    src={HDR}
                    alt="HDR Sports Logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-black tracking-[0.18em] text-white">
                    HDR SPORTS
                  </h1>

                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                    Premium Sports Store
                  </p>
                </div>
              </div>

              {/* Heading */}
              <h2 className="max-w-sm text-4xl font-black leading-tight text-white">
                Manage Your
                <span className="block text-[#D4AF37]">Sports Store</span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
                Manage products, inventory, orders and everything your HDR
                Sports store needs from one secure dashboard.
              </p>
            </div>

            {/* Bottom Feature */}
            <div className="relative z-10 mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Secure Admin Access
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Authorized personnel only
                </p>
              </div>
            </div>
          </div>

          {/* Right Login Section */}
          <div className="bg-white p-7 sm:p-10 md:p-12">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0D111A]">
                <span className="text-sm font-black text-[#D4AF37]">HDR</span>
              </div>

              <div>
                <h1 className="font-black tracking-[0.15em] text-[#0D111A]">
                  HDR SPORTS
                </h1>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                Admin Portal
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#0D111A]">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to manage your HDR Sports store.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0D111A]">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="Enter your admin email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-[#0D111A] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0D111A]">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-[#0D111A] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-3 w-full overflow-hidden rounded-xl bg-[#0D111A] py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0D111A] hover:shadow-[0_10px_35px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Signing In..." : "Sign In to Admin Panel"}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                HDR SPORTS
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <p className="mt-5 text-center text-[11px] text-gray-400">
              This area is restricted to authorized administrators.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} HDR Sports. Admin Dashboard.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
