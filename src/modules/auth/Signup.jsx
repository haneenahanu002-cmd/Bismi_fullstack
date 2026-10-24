import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Truck,
  MapPin,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Backend registration will be connected later.
    console.log("Registration data:", formData);

    alert("Registration successful!");

    navigate("/login?role=user");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Image */}
          <div className="relative hidden min-h-[680px] overflow-hidden bg-[#0B1D2B] lg:block">
            <img
              src="/images/excavator.jpg"
              alt="Bismi Earth Movers"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-[#0B1D2B]/70" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">

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

              <div>
                <h2 className="text-4xl font-bold leading-tight">
                  Build Your
                  <br />
                  <span className="text-yellow-400">
                    Future With Bismi
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                  Create your account and easily book reliable
                  earth moving services for your projects.
                </p>
              </div>

            </div>
          </div>

          {/* Signup */}
          <div className="flex items-center p-6 sm:p-10 lg:p-12">

            <div className="mx-auto w-full max-w-md">

              {/* Mobile Logo */}
              <div className="mb-7 text-center lg:hidden">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-400 text-[#0B1D2B]">
                  <Truck size={28} />
                </div>

                <h1 className="mt-3 text-xl font-bold text-[#0B1D2B]">
                  Bismi Earth Movers
                </h1>
              </div>

              {/* Back */}
              <button
                onClick={() => navigate("/login?role=user")}
                className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B1D2B]"
              >
                <ArrowLeft size={17} />
                Back to Login
              </button>

              {/* Heading */}
              <div className="mb-6">
                <p className="text-sm font-medium text-yellow-600">
                  User Registration
                </p>

                <h1 className="mt-1 text-3xl font-bold text-[#0B1D2B]">
                  Create Your Account
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Join us and get started
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your location"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
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
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Register */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-yellow-500"
                >
                  Register
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login?role=user"
                  className="font-bold text-yellow-600 hover:text-yellow-700"
                >
                  Login
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}