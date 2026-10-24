import React, { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Printer,
  CreditCard,
  User,
  Calendar,
  Receipt,
} from "lucide-react";

const payments = [
  {
    id: "PAY-1001",
    bookingId: "BM1025",
    customer: "Arshad K",
    phone: "+91 9037123456",
    amount: "₹5,000",
    method: "Google Pay",
    date: "30 Sep 2026",
    status: "Paid",
    service: "Land Clearing",
  },
  {
    id: "PAY-1002",
    bookingId: "BM1026",
    customer: "Fathima P",
    phone: "+91 9876543210",
    amount: "₹6,500",
    method: "UPI",
    date: "01 Oct 2026",
    status: "Paid",
    service: "Excavation",
  },
  {
    id: "PAY-1003",
    bookingId: "BM1027",
    customer: "Shameer P",
    phone: "+91 9123456789",
    amount: "₹4,500",
    method: "Cash",
    date: "02 Oct 2026",
    status: "Pending",
    service: "Land Leveling",
  },
  {
    id: "PAY-1004",
    bookingId: "BM1028",
    customer: "Nihal M",
    phone: "+91 9567890123",
    amount: "₹8,000",
    method: "Google Pay",
    date: "03 Oct 2026",
    status: "Paid",
    service: "Road Work",
  },
  {
    id: "PAY-1005",
    bookingId: "BM1029",
    customer: "Ameen A",
    phone: "+91 9345678901",
    amount: "₹5,500",
    method: "UPI",
    date: "04 Oct 2026",
    status: "Pending",
    service: "Digging",
  },
];

function PaymentStatus({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        status === "Paid"
          ? "bg-green-100 text-green-700"
          : status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function Payments() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      payment.id.toLowerCase().includes(searchText) ||
      payment.bookingId.toLowerCase().includes(searchText) ||
      payment.customer.toLowerCase().includes(searchText);

    const matchesStatus =
      status === "All Status" || payment.status === status;

    return matchesSearch && matchesStatus;
  });

  if (selectedPayment) {
    return (
      <PaymentDetails
        payment={selectedPayment}
        onBack={() => setSelectedPayment(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track all customer payments and transactions.
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
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-yellow-500"
        >
          <option>All Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </div>

      {/* Payment Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Payment ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Booking ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Payment Method
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Date
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
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-yellow-50/40"
                >

                  <td className="px-5 py-4 text-sm font-bold text-gray-800">
                    {payment.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {payment.bookingId}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {payment.customer}
                    </p>

                    <p className="text-xs text-gray-500">
                      {payment.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    {payment.amount}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {payment.method}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {payment.date}
                  </td>

                  <td className="px-5 py-4">
                    <PaymentStatus status={payment.status} />
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-100 hover:text-yellow-700"
                      title="View Payment"
                    >
                      <Eye size={18} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No payments found.
          </div>
        )}
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


/* =====================================================
   PAYMENT DETAILS
===================================================== */

function PaymentDetails({ payment, onBack }) {
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            className="rounded-lg bg-white p-2.5 text-gray-700 shadow-sm hover:bg-yellow-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Details
            </h1>

            <p className="text-sm text-gray-500">
              View complete payment information
            </p>
          </div>

        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          <Printer size={17} />
          Print
        </button>

      </div>


      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Payment ID */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Payment ID
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              {payment.id}
            </h2>
          </div>

          <PaymentStatus status={payment.status} />

        </div>


        {/* Amount */}
        <div className="border-b border-gray-100 p-6">

          <p className="text-sm font-medium text-gray-500">
            Amount Paid
          </p>

          <p className="mt-2 text-4xl font-bold text-gray-900">
            {payment.amount}
          </p>

        </div>


        {/* Details */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">

          {/* Left */}
          <div className="space-y-7 p-6 lg:border-r lg:border-gray-100">

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Receipt size={16} />
                Booking ID
              </p>

              <p className="text-base font-semibold text-gray-900">
                {payment.bookingId}
              </p>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <User size={16} />
                Customer
              </p>

              <p className="text-base font-bold text-gray-900">
                {payment.customer}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {payment.phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Service
              </p>

              <p className="text-base font-semibold text-gray-900">
                {payment.service}
              </p>
            </div>

          </div>


          {/* Right */}
          <div className="space-y-7 border-t border-gray-100 p-6 lg:border-t-0">

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <CreditCard size={16} />
                Payment Method
              </p>

              <p className="text-base font-semibold text-gray-900">
                {payment.method}
              </p>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar size={16} />
                Payment Date
              </p>

              <p className="text-base font-semibold text-gray-900">
                {payment.date}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Payment Status
              </p>

              <PaymentStatus status={payment.status} />
            </div>

          </div>

        </div>
      </div>


      {/* Transaction Summary */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold text-gray-900">
          Transaction Summary
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">
              Payment ID
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {payment.id}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">
              Booking ID
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {payment.bookingId}
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-xs font-medium text-gray-500">
              Total Amount
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {payment.amount}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}