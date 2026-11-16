
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  HardHat,
  Truck,
  CalendarDays,
  Wallet,
  LogOut,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Activity,
  RefreshCw,
  Loader2,
} from "lucide-react";

import PageHeader from "../../../components/PageHeader";

const API = "http://localhost:5000/api/dashboard/admin";

const badgeColors = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  Accepted: "bg-cyan-100 text-cyan-700",
  "In Progress": "bg-violet-100 text-violet-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const statusColors = {
  Pending: "bg-amber-400",
  Assigned: "bg-blue-500",
  Accepted: "bg-cyan-500",
  "In Progress": "bg-violet-500",
  Completed: "bg-emerald-500",
  Rejected: "bg-red-500",
  Cancelled: "bg-gray-400",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        throw new Error(data.message || "You are not authorized.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load dashboard.");
      }

      setDashboard(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const stats = [
    {
      title: "Total Users",
      value: dashboard?.stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registered customers",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Operators",
      value: dashboard?.stats?.totalOperators ?? 0,
      icon: HardHat,
      description: "Registered operators",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Machines",
      value: dashboard?.stats?.totalMachines ?? 0,
      icon: Truck,
      description: "Total machines",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Bookings",
      value: dashboard?.stats?.totalBookings ?? 0,
      icon: CalendarDays,
      description: "All booking requests",
      color: "bg-green-50 text-green-600",
    },
  ];

  const bookings = dashboard?.recentBookings || [];
  const payments = dashboard?.payments || {};
  const bookingStatuses = dashboard?.bookingStatuses || {};

  const statusEntries = Object.entries(bookingStatuses);
  const maxStatusCount = Math.max(
    1,
    ...statusEntries.map(([, count]) => count)
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-600">
        <Loader2 className="animate-spin" size={25} />
        <span className="text-sm font-medium">
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={22} />
          <h2 className="font-bold">Dashboard Loading Failed</h2>
        </div>

        <p className="mt-3 text-sm text-slate-600">{error}</p>

        <button
          onClick={fetchDashboard}
          className="mt-5 flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-yellow-500"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <PageHeader
            title="Business Overview"
            description="Monitor bookings, machines and business operations."
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDashboard}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon, description, color }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {title}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {value}
                </p>
              </div>

              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={23} />
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ArrowUpRight size={14} />
              {description}
            </p>
          </div>
        ))}
      </section>

      {/* RECENT BOOKINGS + PAYMENTS */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* RECENT BOOKINGS */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer booking requests
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/bookings")}
              className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              View All
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Booking ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {booking.bookingCode}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {booking.customer}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {booking.service}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {booking.date}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                            badgeColors[booking.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing the latest {bookings.length} bookings.
            </p>
          </div>
        </div>

        {/* PAYMENT OVERVIEW */}
        <div className="flex flex-col rounded-2xl bg-[#10253A] p-6 text-white shadow-sm">

          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-white/10 p-3">
              <Wallet className="text-yellow-400" size={24} />
            </div>

            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
              Payment Overview
            </span>
          </div>

          <h2 className="mt-6 text-lg font-bold">
            Pending Collection
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(payments.pendingAmount)}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Total amount in pending payment records
          </p>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-5">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock3 size={17} />
                Pending Payments
              </div>

              <span className="font-semibold">
                {payments.pending ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={17} />
                Completed Payments
              </div>

              <span className="font-semibold">
                {payments.paid ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <AlertCircle size={17} />
                Failed Payments
              </div>

              <span className="font-semibold">
                {payments.failed ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-sm text-slate-300">
                Total Paid
              </span>

              <span className="font-bold text-green-300">
                {formatCurrency(payments.paidAmount)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/payments")}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
          >
            Manage Payments
            <ArrowUpRight size={17} />
          </button>
        </div>
      </section>

      {/* BOTTOM OVERVIEW */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* BOOKING STATUS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
              <Activity size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Booking Activity
              </h2>

              <p className="text-sm text-slate-500">
                Booking status overview
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {statusEntries.length > 0 ? (
              statusEntries.map(([status, count]) => (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">
                      {status}
                    </span>

                    <span className="font-bold text-slate-800">
                      {count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        statusColors[status] || "bg-gray-400"
                      }`}
                      style={{
                        width: `${(count / maxStatusCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                No booking activity available.
              </p>
            )}
          </div>
        </div>

        {/* BUSINESS INFORMATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Business Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current business account summary
          </p>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <Users size={19} />
                </div>

                <span className="text-sm font-medium text-slate-700">
                  Registered Customers
                </span>
              </div>

              <span className="font-bold text-slate-900">
                {dashboard?.stats?.totalUsers ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                  <HardHat size={19} />
                </div>

                <span className="text-sm font-medium text-slate-700">
                  Total Operators
                </span>
              </div>

              <span className="font-bold text-slate-900">
                {dashboard?.stats?.totalOperators ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                  <Truck size={19} />
                </div>

                <span className="text-sm font-medium text-slate-700">
                  Total Machines
                </span>
              </div>

              <span className="font-bold text-slate-900">
                {dashboard?.stats?.totalMachines ?? 0}
              </span>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        Bismi Earth Movers · Admin Dashboard
      </p>
    </div>
  );
}
