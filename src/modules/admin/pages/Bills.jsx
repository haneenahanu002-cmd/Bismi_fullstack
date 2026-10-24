import React, { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Printer,
  Receipt,
  User,
  Calendar,
  IndianRupee,
  Plus,
  X,
} from "lucide-react";

const bills = [
  {
    id: "INV-1001",
    customer: "Jaffar Mariyad",
    phone: "+91 9037192107",
    bookingId: "BM1025",
    service: "Land Clearing",
    total: 18200,
    paid: 7540,
    date: "14 May 2026",
    status: "Partially Paid",
    payments: [
      {
        date: "14 May 2026",
        time: "08:22 PM",
        amount: 7540,
        method: "Cash",
        note: "Payment received",
      },
    ],
  },
  {
    id: "INV-1002",
    customer: "Arshad K",
    phone: "+91 9037123456",
    bookingId: "BM1026",
    service: "Excavation",
    total: 12500,
    paid: 12500,
    date: "01 Oct 2026",
    status: "Paid",
    payments: [
      {
        date: "01 Oct 2026",
        time: "04:20 PM",
        amount: 12500,
        method: "Google Pay",
        note: "Full payment",
      },
    ],
  },
  {
    id: "INV-1003",
    customer: "Fathima P",
    phone: "+91 9876543210",
    bookingId: "BM1027",
    service: "Land Leveling",
    total: 20000,
    paid: 5000,
    date: "02 Oct 2026",
    status: "Partially Paid",
    payments: [
      {
        date: "02 Oct 2026",
        time: "03:15 PM",
        amount: 5000,
        method: "UPI",
        note: "Advance payment",
      },
    ],
  },
  {
    id: "INV-1004",
    customer: "Nihal M",
    phone: "+91 9567890123",
    bookingId: "BM1028",
    service: "Road Work",
    total: 8000,
    paid: 0,
    date: "03 Oct 2026",
    status: "Unpaid",
    payments: [],
  },
];

const money = (amount) =>
  `₹${amount.toLocaleString("en-IN")}`;

function BillStatus({ status }) {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    "Partially Paid": "bg-yellow-100 text-yellow-700",
    Unpaid: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

export default function Bills() {
  const [selectedBill, setSelectedBill] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredBills = bills.filter((bill) => {
    const text = search.toLowerCase();

    const matchesSearch =
      bill.id.toLowerCase().includes(text) ||
      bill.customer.toLowerCase().includes(text) ||
      bill.bookingId.toLowerCase().includes(text);

    const matchesStatus =
      status === "All Status" || bill.status === status;

    return matchesSearch && matchesStatus;
  });

  if (selectedBill) {
    return (
      <BillDetails
        bill={selectedBill}
        onBack={() => setSelectedBill(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bills & Invoices
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer bills, payments and outstanding amounts.
        </p>
      </div>

      {/* Search */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search bills..."
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
          <option>Paid</option>
          <option>Partially Paid</option>
          <option>Unpaid</option>
        </select>
      </div>

      {/* Bills Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Bill ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Service
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">
                  Total
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">
                  Paid
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold text-gray-600">
                  To Collect
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
              {filteredBills.map((bill) => {
                const due = bill.total - bill.paid;

                return (
                  <tr
                    key={bill.id}
                    className="border-b last:border-0 hover:bg-yellow-50/40"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-gray-800">
                      {bill.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">
                        {bill.customer}
                      </p>

                      <p className="text-xs text-gray-500">
                        {bill.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.service}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-semibold">
                      {money(bill.total)}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-semibold text-green-700">
                      {money(bill.paid)}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-red-600">
                      {money(due)}
                    </td>

                    <td className="px-5 py-4">
                      <BillStatus status={bill.status} />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                        title="View Bill"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {filteredBills.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No bills found.
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
   BILL DETAILS
===================================================== */

function BillDetails({ bill, onBack }) {
  const [showPayment, setShowPayment] = useState(false);

  const balance = bill.total - bill.paid;

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
              Bill Details
            </h1>

            <p className="text-sm text-gray-500">
              {bill.id}
            </p>
          </div>

        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
        >
          <Printer size={17} />
          Print Bill
        </button>

      </div>


      {/* Customer Header */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-5 border-b p-6 sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-lg font-bold text-yellow-700">
              {bill.customer
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {bill.customer}
              </h2>

              <p className="text-sm text-gray-500">
                {bill.phone}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {bill.date}
              </p>
            </div>

          </div>

          <BillStatus status={bill.status} />

        </div>


        {/* Amount Summary */}
        <div className="grid grid-cols-1 border-b sm:grid-cols-3">

          <div className="p-6 sm:border-r">
            <p className="text-sm text-gray-500">
              Total Bill
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {money(bill.total)}
            </p>
          </div>

          <div className="border-t p-6 sm:border-r sm:border-t-0">
            <p className="text-sm text-gray-500">
              You Got
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {money(bill.paid)}
            </p>
          </div>

          <div className="border-t bg-red-50 p-6 sm:border-t-0">
            <p className="text-sm text-gray-500">
              Balance to Collect
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {money(balance)}
            </p>
          </div>

        </div>


        {/* Bill Info */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Receipt size={16} />
              Bill ID
            </p>

            <p className="font-semibold text-gray-900">
              {bill.id}
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              Customer
            </p>

            <p className="font-semibold text-gray-900">
              {bill.customer}
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              Booking
            </p>

            <p className="font-semibold text-gray-900">
              {bill.bookingId}
            </p>
          </div>

        </div>

      </div>


      {/* Payment History */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b p-6 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Payment History
            </h2>

            <p className="text-sm text-gray-500">
              Previous payments received from customer
            </p>
          </div>

          {balance > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-yellow-600"
            >
              <Plus size={17} />
              Collect Payment
            </button>
          )}

        </div>


        {bill.payments.length > 0 ? (
          <div className="divide-y">

            {bill.payments.map((payment, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >

                <div>
                  <p className="font-semibold text-gray-900">
                    {payment.date} · {payment.time}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {payment.note}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Payment method: {payment.method}
                  </p>
                </div>

                <p className="text-xl font-bold text-green-600">
                  + {money(payment.amount)}
                </p>

              </div>
            ))}

          </div>
        ) : (
          <div className="p-10 text-center text-sm text-gray-500">
            No payment received yet.
          </div>
        )}

      </div>


      {/* Bottom Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Amount
          </p>

          <p className="mt-2 text-xl font-bold">
            {money(bill.total)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Amount Received
          </p>

          <p className="mt-2 text-xl font-bold text-green-600">
            {money(bill.paid)}
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm text-gray-500">
            Amount to Collect
          </p>

          <p className="mt-2 text-xl font-bold text-red-600">
            {money(balance)}
          </p>
        </div>

      </div>


      {/* Collect Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">

              <div>
                <h2 className="text-lg font-bold">
                  Collect Payment
                </h2>

                <p className="text-sm text-gray-500">
                  Amount remaining: {money(balance)}
                </p>
              </div>

              <button
                onClick={() => setShowPayment(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4 p-6">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <div className="relative">
                  <IndianRupee
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-gray-200 py-3 pl-9 pr-4 outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Payment Method
                </label>

                <select className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-yellow-500">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Google Pay</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Note
                </label>

                <textarea
                  rows="3"
                  placeholder="Payment note..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-yellow-500"
                />
              </div>

              <button
                onClick={() => {
                  alert(
                    "Design preview only. Payment will be saved after backend integration."
                  );
                  setShowPayment(false);
                }}
                className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black hover:bg-yellow-600"
              >
                Record Payment
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}