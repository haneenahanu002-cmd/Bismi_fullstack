import React from "react";
import {
  CalendarCheck,
  CreditCard,
  Clock3,
  CheckCircle2,
  Truck,
  MapPin,
  ArrowRight,
} from "lucide-react";

const recentBookings = [
  {
    id: "BK-001",
    machine: "JCB 3DX",
    work: "Land Excavation",
    location: "Manjeri, Malappuram",
    date: "03 Oct 2026",
    amount: 4800,
    status: "Confirmed",
  },
  {
    id: "BK-002",
    machine: "JCB 4DX",
    work: "Foundation Work",
    location: "Perinthalmanna, Malappuram",
    date: "29 Sep 2026",
    amount: 5600,
    status: "Completed",
  },
  {
    id: "BK-003",
    machine: "JCB 3DX",
    work: "Site Cleaning",
    location: "Kondotty, Malappuram",
    date: "25 Sep 2026",
    amount: 4000,
    status: "Pending",
  },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          Welcome back, Customer 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your bookings, payments and machine services
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Bookings */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Bookings
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                12
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <CalendarCheck size={24} />
            </div>
          </div>
        </div>

        {/* Active Booking */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Booking
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                1
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Clock3 size={24} />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Completed Jobs
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                10
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Pending Payment */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending Payment
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                ₹4,800
              </h2>
            </div>

            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

        <h2 className="text-lg font-bold text-[#0B1D2B]">
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          <button className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-yellow-400 hover:bg-yellow-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600">
                <CalendarCheck size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  New Booking
                </p>

                <p className="text-xs text-gray-500">
                  Book a machine
                </p>
              </div>
            </div>

            <ArrowRight size={18} className="text-gray-400" />
          </button>

          <button className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-yellow-400 hover:bg-yellow-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Truck size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  View Machines
                </p>

                <p className="text-xs text-gray-500">
                  Explore available machines
                </p>
              </div>
            </div>

            <ArrowRight size={18} className="text-gray-400" />
          </button>

          <button className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-yellow-400 hover:bg-yellow-50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 text-green-600">
                <CreditCard size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Make Payment
                </p>

                <p className="text-xs text-gray-500">
                  Check pending payments
                </p>
              </div>
            </div>

            <ArrowRight size={18} className="text-gray-400" />
          </button>

        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-6 rounded-2xl bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-[#0B1D2B]">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest machine bookings
            </p>
          </div>

          <button className="text-sm font-semibold text-yellow-600 hover:text-yellow-700">
            View All
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Machine
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Work
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 hover:bg-yellow-50/40"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[#0B1D2B]">
                    {booking.id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Truck
                        size={17}
                        className="text-yellow-600"
                      />

                      <span className="text-sm text-gray-700">
                        {booking.machine}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {booking.work}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin
                        size={15}
                        className="text-gray-400"
                      />

                      <span className="text-sm text-gray-600">
                        {booking.location}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {booking.date}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#0B1D2B]">
                    ₹{booking.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 md:hidden">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0B1D2B]">
                  {booking.id}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {booking.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">
                    Machine:
                  </span>{" "}
                  {booking.machine}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Work:
                  </span>{" "}
                  {booking.work}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Location:
                  </span>{" "}
                  {booking.location}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Date:
                  </span>{" "}
                  {booking.date}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Amount:
                  </span>{" "}
                  ₹{booking.amount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}