import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Truck,
} from "lucide-react";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = searchParams.get("role") || "user";

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const roleNames = {
    user: "User",
    admin: "Admin",
    operator: "Operator",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend authentication will be connected later.
    console.log("Login data:", {
      role,
      ...formData,
    });

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "operator") {
      navigate("/operator");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Image / Branding */}
          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#0B1D2B] lg:block">
            <img
              src="/images/excavator.jpg"
              alt="Bismi Earth Movers"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-[#0B1D2B]/70" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">

              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-yellow-400 p-3 text-[#0B1D2B]">
                    <Truck size={28} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Bismi
                    </h2>

                    <p className="text-sm text-slate-300">
                      Earth Movers
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-yellow-400">
                  Reliable Earth Moving Services
                </p>

                <h2 className="text-4xl font-bold leading-tight">
                  Heavy Machines.
                  <br />
                  Skilled Operators.
                  <br />
                  <span className="text-yellow-400">
                    Reliable Service.
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                  Powering your projects from ground up with
                  reliable earth moving solutions.
                </p>
              </div>

            </div>
          </div>

          {/* Right Login */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md mx-auto">

              {/* Mobile Logo */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-400 text-[#0B1D2B]">
                  <Truck size={28} />
                </div>

                <h1 className="mt-3 text-xl font-bold text-[#0B1D2B]">
                  Bismi Earth Movers
                </h1>
              </div>

              {/* Back */}
              <button
                onClick={() => navigate("/portal-selector")}
                className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#0B1D2B]"
              >
                <ArrowLeft size={17} />
                Back to modules
              </button>

              {/* Heading */}
              <div className="mb-7">
                <p className="text-sm font-medium text-yellow-600">
                  {roleNames[role]} Portal
                </p>

                <h1 className="mt-1 text-3xl font-bold text-[#0B1D2B]">
                  Welcome Back!
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Login to your account
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email or Phone
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email or phone"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="mb-6 text-right">
                  <button
                    type="button"
                    className="text-xs font-medium text-yellow-600 hover:text-yellow-700"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-yellow-500"
                >
                  Login
                </button>
              </form>

              {/* User Registration */}
              {role === "user" && (
                <p className="mt-6 text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-yellow-600 hover:text-yellow-700"
                  >
                    Register
                  </Link>
                </p>
              )}

              {/* Admin / Operator */}
              {role !== "user" && (
                <p className="mt-6 text-center text-xs text-gray-400">
                  {role === "operator"
                    ? "Operator accounts are created by the Admin."
                    : "Admin access is restricted to authorized personnel."}
                </p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}