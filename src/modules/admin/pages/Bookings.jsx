import React, { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Printer,
  Clock,
  MapPin,
  User,
  CreditCard,
} from "lucide-react";

const bookings = [
  {
    id: "BM1025",
    customer: "Arshad K",
    phone: "+91 9037123456",
    service: "Land Clearing",
    machine: "JCB 3DX",
    location: "Manjeri, Malappuram",
    date: "30 Sep 2026",
    time: "10:00 AM - 05:00 PM",
    operator: "Muhammed",
    amount: "₹ 5,000",
    paymentMethod: "Google Pay",
    paymentStatus: "Paid",
    status: "Approved",
    stage: "In Progress",
    description: "Need land clearing for 1 acre land.",
  },
  {
    id: "BM1026",
    customer: "Fathima P",
    phone: "+91 9876543210",
    service: "Excavation",
    machine: "JCB 3DX",
    location: "Perinthalmanna, Malappuram",
    date: "01 Oct 2026",
    time: "09:00 AM - 04:00 PM",
    operator: "Abdul Rahman",
    amount: "₹ 6,500",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Approved",
    stage: "Assigned",
    description: "Excavation work for building foundation.",
  },
  {
    id: "BM1027",
    customer: "Shameer P",
    phone: "+91 9123456789",
    service: "Land Leveling",
    machine: "Tata Hitachi",
    location: "Manjeri, Malappuram",
    date: "02 Oct 2026",
    time: "08:00 AM - 03:00 PM",
    operator: "Riyas",
    amount: "₹ 4,500",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    status: "Pending",
    stage: "Pending",
    description: "Leveling work required for residential plot.",
  },
  {
    id: "BM1028",
    customer: "Nihal M",
    phone: "+91 9567890123",
    service: "Road Work",
    machine: "Hyundai Excavator",
    location: "Kondotty, Malappuram",
    date: "03 Oct 2026",
    time: "09:30 AM - 05:00 PM",
    operator: "Shahid",
    amount: "₹ 8,000",
    paymentMethod: "Google Pay",
    paymentStatus: "Paid",
    status: "Approved",
    stage: "Operator Assigned",
    description: "Road construction and earth moving work.",
  },
  {
    id: "BM1029",
    customer: "Ameen A",
    phone: "+91 9345678901",
    service: "Digging",
    machine: "JCB 3DX",
    location: "Wandoor, Malappuram",
    date: "04 Oct 2026",
    time: "10:00 AM - 04:00 PM",
    operator: "Sameer",
    amount: "₹ 5,500",
    paymentMethod: "UPI",
    paymentStatus: "Pending",
    status: "Pending",
    stage: "Pending",
    description: "Digging work for water tank.",
  },
];

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        status === "Paid"
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function Bookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(search.toLowerCase()) ||
      booking.customer.toLowerCase().includes(search.toLowerCase()) ||
      booking.service.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All Status" || booking.status === status;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // BOOKING DETAILS
  // =========================
  if (selectedBooking) {
    return (
      <BookingDetails
        booking={selectedBooking}
        onBack={() => setSelectedBooking(null)}
      />
    );
  }

  // =========================
  // BOOKINGS LIST
  // =========================
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bookings Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage all machine booking requests and services.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-500"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Booking List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">

            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Booking ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Machine
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b last:border-0 hover:bg-yellow-50/40"
                >
                  <td className="px-5 py-4 text-sm font-bold text-gray-800">
                    {booking.id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-gray-800">
                      {booking.customer}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.phone}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {booking.service}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {booking.machine}
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm text-gray-700">
                      {booking.date}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.time}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="mb-1 text-sm font-semibold">
                      {booking.amount}
                    </div>
                    <PaymentBadge status={booking.paymentStatus} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                      title="View Booking"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex justify-end gap-2">

        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ChevronLeft size={18} />
        </button>

        <button className="h-9 w-9 rounded-lg bg-yellow-500 text-sm font-semibold text-black">
          1
        </button>

        <button className="h-9 w-9 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          2
        </button>

        <button className="h-9 w-9 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          3
        </button>

        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}


// ======================================================
// BOOKING DETAILS
// ======================================================

function BookingDetails({ booking, onBack }) {
  const steps = [
    { name: "Pending", date: booking.date, done: true },
    { name: "Approved", date: booking.date, done: true },
    { name: "Operator Assigned", date: booking.date, done: true },
    { name: "In Progress", date: booking.date, current: true },
    { name: "Completed", date: "-", done: false },
    { name: "Billed", date: "-", done: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            className="rounded-lg bg-white p-2.5 text-gray-700 shadow-sm hover:bg-yellow-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking Details
            </h1>

            <p className="text-sm text-gray-500">
              View complete booking information
            </p>
          </div>

        </div>

        {/* Print */}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          <Printer size={17} />
          Print
        </button>

      </div>


      {/* Main Booking Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Booking ID */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Booking ID
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              {booking.id}
            </h2>
          </div>

          <StatusBadge status={booking.status} />

        </div>


        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">

          {/* LEFT */}
          <div className="space-y-7 p-6 lg:border-r lg:border-gray-100">

            {/* Customer */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Customer
              </p>

              <p className="text-base font-bold text-gray-900">
                {booking.customer}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {booking.phone}
              </p>
            </div>

            {/* Service */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Service
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking.service}
              </p>
            </div>

            {/* Machine */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Machine
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking.machine}
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <MapPin size={16} />
                Location
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking.location}
              </p>
            </div>

            {/* Date & Time */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Clock size={16} />
                Date & Time
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking.date}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {booking.time}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Description
              </p>

              <p className="text-sm leading-6 text-gray-700">
                {booking.description}
              </p>
            </div>

          </div>


          {/* RIGHT */}
          <div className="space-y-7 border-t border-gray-100 p-6 lg:border-t-0">

            {/* Operator */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

              <p className="mb-4 text-sm font-medium text-gray-500">
                Operator
              </p>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                  <User size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {booking.operator}
                  </p>

                  <p className="text-sm text-gray-500">
                    Machine Operator
                  </p>
                </div>

              </div>
            </div>


            {/* Payment */}
            <div>

              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <CreditCard size={16} />
                Payment
              </p>

              <div className="flex flex-wrap items-center gap-3">

                <p className="text-xl font-bold text-gray-900">
                  {booking.amount}
                </p>

                <span className="text-sm text-gray-500">
                  {booking.paymentMethod}
                </span>

              </div>

            </div>


            {/* Payment Status */}
            <div>

              <p className="mb-2 text-sm font-medium text-gray-500">
                Payment Status
              </p>

              <PaymentBadge status={booking.paymentStatus} />

            </div>

          </div>

        </div>
      </div>


      {/* Booking Timeline */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="overflow-x-auto">

          <div className="flex min-w-[850px] items-start">

            {steps.map((step, index) => (
              <React.Fragment key={step.name}>

                {/* Step */}
                <div className="flex w-[140px] flex-col items-center text-center">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-4 ${
                      step.current
                        ? "border-gray-900 bg-yellow-500"
                        : step.done
                        ? "border-green-500 bg-green-500"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {step.done && (
                      <span className="text-sm font-bold text-white">
                        ✓
                      </span>
                    )}

                    {step.current && (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    )}
                  </div>

                  <p
                    className={`mt-3 text-sm font-semibold ${
                      step.current
                        ? "text-gray-900"
                        : step.done
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {step.date}
                  </p>

                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div
                    className={`mt-5 h-1 flex-1 ${
                      step.done && steps[index + 1].done
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}

              </React.Fragment>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}