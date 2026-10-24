import React, { useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  IndianRupee,
  CalendarDays,
  Truck,
  Eye,
  X,
  CheckCircle2,
  Clock3,
  ReceiptText,
} from "lucide-react";

// =====================================================
// SAMPLE PAYMENT DATA
// =====================================================

const initialPayments = [
  {
    id: "PAY-001",
    bookingId: "BK-001",
    machine: "JCB 3DX",
    work: "Land Excavation",
    date: "03 Oct 2026",
    amount: 4800,
    paymentMethod: "UPI",
    transactionId: "TXN982341",
    status: "Paid",
  },
  {
    id: "PAY-002",
    bookingId: "BK-002",
    machine: "JCB 4DX",
    work: "Foundation Work",
    date: "29 Sep 2026",
    amount: 5600,
    paymentMethod: "Card",
    transactionId: "TXN762154",
    status: "Paid",
  },
  {
    id: "PAY-003",
    bookingId: "BK-003",
    machine: "JCB 3DX",
    work: "Site Cleaning",
    date: "25 Sep 2026",
    amount: 4000,
    paymentMethod: "-",
    transactionId: "-",
    status: "Pending",
  },
  {
    id: "PAY-004",
    bookingId: "BK-004",
    machine: "JCB 4DX",
    work: "Earth Moving",
    date: "18 Sep 2026",
    amount: 5600,
    paymentMethod: "UPI",
    transactionId: "TXN451982",
    status: "Paid",
  },
  {
    id: "PAY-005",
    bookingId: "BK-005",
    machine: "JCB 3DX",
    work: "Road Work",
    date: "12 Sep 2026",
    amount: 4000,
    paymentMethod: "-",
    transactionId: "-",
    status: "Cancelled",
  },
];

export default function UserPayments() {
  const [payments, setPayments] = useState(initialPayments);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    const searchValue = search.toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchValue) ||
        payment.bookingId
          .toLowerCase()
          .includes(searchValue) ||
        payment.machine
          .toLowerCase()
          .includes(searchValue) ||
        payment.work
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // PAY NOW
  // =====================================================

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // =====================================================
  // COMPLETE PAYMENT
  // =====================================================

  const handlePaymentComplete = () => {
    if (!selectedPayment) return;

    setPayments((previous) =>
      previous.map((payment) =>
        payment.id === selectedPayment.id
          ? {
              ...payment,
              status: "Paid",
              paymentMethod: "UPI",
              transactionId: `TXN${Math.floor(
                100000 + Math.random() * 900000
              )}`,
            }
          : payment
      )
    );

    setShowPaymentModal(false);

    setSelectedPayment(null);

    alert("Payment completed successfully!");
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalAmount = payments
    .filter((item) => item.status !== "Cancelled")
    .reduce((sum, item) => sum + item.amount, 0);

  const paidAmount = payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = payments
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          Payments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your machine booking payments
        </p>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Amount
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0B1D2B] sm:text-2xl">
                ₹{totalAmount.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
              <IndianRupee size={22} />
            </div>

          </div>

        </div>

        {/* Paid */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Paid
              </p>

              <h2 className="mt-2 text-xl font-bold text-green-600 sm:text-2xl">
                ₹{paidAmount.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle2 size={22} />
            </div>

          </div>

        </div>

        {/* Pending */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="mt-2 text-xl font-bold text-yellow-600 sm:text-2xl">
                ₹{pendingAmount.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Clock3 size={22} />
            </div>

          </div>

        </div>

        {/* Transactions */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Transactions
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0B1D2B] sm:text-2xl">
                {payments.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ReceiptText size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PAYMENT HISTORY
      ===================================================== */}

      <div className="rounded-2xl bg-white shadow-sm">

        {/* Toolbar */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#0B1D2B]">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View all your payment transactions
            </p>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}

            <div className="relative sm:w-64">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />

            </div>

            {/* Filter */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-yellow-400"
            >

              <option value="All">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>

        {/* =====================================================
            DESKTOP TABLE
        ===================================================== */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[1000px]">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50 text-left">

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Payment ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Machine
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Method
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPayments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-b border-gray-100 transition hover:bg-yellow-50/40"
                >

                  {/* Payment ID */}

                  <td className="px-5 py-4">

                    <span className="font-semibold text-[#0B1D2B]">
                      {payment.id}
                    </span>

                  </td>

                  {/* Booking */}

                  <td className="px-5 py-4">

                    <span className="text-sm text-gray-600">
                      {payment.bookingId}
                    </span>

                  </td>

                  {/* Machine */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Truck
                        size={17}
                        className="text-yellow-600"
                      />

                      <span className="text-sm text-gray-700">
                        {payment.machine}
                      </span>

                    </div>

                  </td>

                  {/* Date */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={15}
                        className="text-gray-400"
                      />

                      <span className="text-sm text-gray-600">
                        {payment.date}
                      </span>

                    </div>

                  </td>

                  {/* Amount */}

                  <td className="px-5 py-4">

                    <span className="font-semibold text-[#0B1D2B]">
                      ₹
                      {payment.amount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </td>

                  {/* Method */}

                  <td className="px-5 py-4">

                    <span className="text-sm text-gray-600">
                      {payment.paymentMethod}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          setSelectedPayment(payment)
                        }
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-yellow-400 hover:bg-yellow-50"
                      >

                        <Eye size={15} />

                        View

                      </button>

                      {payment.status === "Pending" && (

                        <button
                          onClick={() =>
                            handlePayNow(payment)
                          }
                          className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-semibold text-[#0B1D2B] hover:bg-yellow-500"
                        >
                          Pay Now
                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            MOBILE CARDS
        ===================================================== */}

        <div className="space-y-4 p-4 md:hidden">

          {filteredPayments.map((payment) => (

            <div
              key={payment.id}
              className="rounded-xl border border-gray-100 p-4"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-bold text-[#0B1D2B]">
                    {payment.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {payment.bookingId}
                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <p className="flex items-center gap-2 text-gray-600">

                  <Truck
                    size={16}
                    className="text-yellow-600"
                  />

                  {payment.machine}

                </p>

                <p className="flex items-center gap-2 text-gray-600">

                  <CalendarDays size={16} />

                  {payment.date}

                </p>

                <p className="flex items-center gap-2 text-gray-600">

                  <CreditCard size={16} />

                  {payment.paymentMethod}

                </p>

                <p className="font-bold text-[#0B1D2B]">

                  ₹
                  {payment.amount.toLocaleString(
                    "en-IN"
                  )}

                </p>

              </div>

              <div className="mt-4 flex gap-2">

                <button
                  onClick={() =>
                    setSelectedPayment(payment)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700"
                >

                  <Eye size={16} />

                  View

                </button>

                {payment.status === "Pending" && (

                  <button
                    onClick={() =>
                      handlePayNow(payment)
                    }
                    className="flex-1 rounded-xl bg-yellow-400 py-2.5 text-sm font-semibold text-[#0B1D2B]"
                  >
                    Pay Now
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

        {/* Empty */}

        {filteredPayments.length === 0 && (

          <div className="px-5 py-12 text-center">

            <CreditCard
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-3 font-semibold text-gray-700">
              No payments found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try another search or status filter.
            </p>

          </div>

        )}

        {/* Footer */}

        <div className="border-t border-gray-100 px-5 py-4">

          <p className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-700">
              {filteredPayments.length}
            </span>{" "}

            payments

          </p>

        </div>

      </div>

      {/* =====================================================
          PAYMENT DETAILS MODAL
      ===================================================== */}

      {selectedPayment && !showPaymentModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>

                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Payment Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedPayment.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Details */}

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

              <PaymentDetail
                label="Booking ID"
                value={selectedPayment.bookingId}
              />

              <PaymentDetail
                label="Machine"
                value={selectedPayment.machine}
              />

              <PaymentDetail
                label="Work Type"
                value={selectedPayment.work}
              />

              <PaymentDetail
                label="Date"
                value={selectedPayment.date}
              />

              <PaymentDetail
                label="Amount"
                value={`₹${selectedPayment.amount.toLocaleString(
                  "en-IN"
                )}`}
              />

              <PaymentDetail
                label="Payment Method"
                value={selectedPayment.paymentMethod}
              />

              <PaymentDetail
                label="Transaction ID"
                value={selectedPayment.transactionId}
              />

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs text-gray-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedPayment.status
                  )}`}
                >
                  {selectedPayment.status}
                </span>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-gray-100 p-5">

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              {selectedPayment.status === "Pending" && (

                <button
                  onClick={() =>
                    handlePayNow(selectedPayment)
                  }
                  className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500"
                >
                  Pay Now
                </button>

              )}

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal && selectedPayment && (

        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>

                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Make Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedPayment.bookingId}
                </p>

              </div>

              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Amount */}

            <div className="p-5">

              <div className="rounded-2xl bg-[#0B1D2B] p-5 text-white">

                <p className="text-sm text-gray-300">
                  Amount to Pay
                </p>

                <h3 className="mt-2 text-3xl font-bold text-yellow-400">
                  ₹
                  {selectedPayment.amount.toLocaleString(
                    "en-IN"
                  )}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {selectedPayment.machine} •{" "}
                  {selectedPayment.work}
                </p>

              </div>

              {/* Payment Methods */}

              <div className="mt-5">

                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Select Payment Method
                </p>

                <div className="grid grid-cols-1 gap-3">

                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl border-2 border-yellow-400 bg-yellow-50 p-4 text-left"
                  >

                    <div className="rounded-lg bg-yellow-400 p-2 text-[#0B1D2B]">
                      <CreditCard size={20} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#0B1D2B]">
                        UPI
                      </p>

                      <p className="text-xs text-gray-500">
                        Google Pay / PhonePe / Paytm
                      </p>

                    </div>

                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left hover:border-yellow-400"
                  >

                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <CreditCard size={20} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#0B1D2B]">
                        Card
                      </p>

                      <p className="text-xs text-gray-500">
                        Credit / Debit Card
                      </p>

                    </div>

                  </button>

                </div>

              </div>

              {/* Frontend Notice */}

              <div className="mt-5 rounded-xl bg-blue-50 p-3">

                <p className="text-xs leading-5 text-blue-700">
                  This is a frontend payment demo.
                  Real payment gateway integration will
                  be connected when the backend is added.
                </p>

              </div>

              {/* Buttons */}

              <div className="mt-5 flex gap-3">

                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handlePaymentComplete}
                  className="flex-1 rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500"
                >
                  Pay ₹
                  {selectedPayment.amount.toLocaleString(
                    "en-IN"
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// PAYMENT DETAIL COMPONENT
// =====================================================

function PaymentDetail({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-[#0B1D2B]">
        {value}
      </p>

    </div>
  );
}