
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  Eye,
  ArrowLeft,
  Printer,
  CreditCard,
  User,
  Calendar,
  Receipt,
  RefreshCw,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

import { toast } from "react-toastify";

const API = "https://bismiserver.onrender.com/api";
const ITEMS_PER_PAGE = 8;

const getToken = () => localStorage.getItem("token");

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const getPaymentId = (payment) => {
  return payment.orderId || `PAY-${payment._id?.slice(-8)}`;
};

const getMethod = (payment) => {
  if (payment.paymentMethod === "CASH") return "Cash";
  if (payment.paymentMethod === "UPI") return "UPI";
  return payment.paymentMethod || "-";
};

const getStatus = (payment) => {
  return (payment.status || "PENDING").toUpperCase();
};

// =====================================================
// STATUS BADGE
// =====================================================

function PaymentStatus({ status }) {
  const normalized = (status || "").toUpperCase();

  let styles = "bg-yellow-100 text-yellow-700";
  let label = "Pending";

  if (normalized === "PAID" || normalized === "SUCCESS") {
    styles = "bg-green-100 text-green-700";
    label = "Paid";
  } else if (normalized === "FAILED") {
    styles = "bg-red-100 text-red-600";
    label = "Failed";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

// =====================================================
// PAYMENT METHOD BADGE
// =====================================================

function PaymentMethod({ method }) {
  const isCash = method === "CASH";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
        isCash
          ? "bg-orange-100 text-orange-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {isCash ? (
        <IndianRupee size={14} />
      ) : (
        <CreditCard size={14} />
      )}

      {isCash ? "Cash" : method === "UPI" ? "UPI" : method || "-"}
    </span>
  );
}

// =====================================================
// MAIN PAYMENTS COMPONENT
// =====================================================

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [method, setMethod] = useState("All Methods");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  const [page, setPage] = useState(1);

  // =====================================================
  // FETCH ALL PAYMENTS
  // =====================================================

  const fetchPayments = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await fetch(`${API}/payments/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch payments.");
      }

      setPayments(data.payments || []);

    } catch (error) {
      console.error("Fetch Payments Error:", error);
      toast.error(error.message || "Failed to load payments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // =====================================================
  // CONFIRM CASH PAYMENT
  // =====================================================

  const handleConfirmCash = async (payment) => {
    const customerName =
      payment.userId?.username || "this customer";

    const confirmed = window.confirm(
      `Have you received the cash payment from ${customerName}?`
    );

    if (!confirmed) return;

    try {
      setConfirmingId(payment._id);

      const response = await fetch(
        `${API}/payments/admin/cash/${payment._id}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cash confirmation failed.");
      }

      toast.success("Cash payment confirmed successfully!");

      await fetchPayments(false);

      if (selectedPayment?._id === payment._id) {
        setSelectedPayment((previous) => ({
          ...previous,
          status: "PAID",
        }));
      }

    } catch (error) {
      console.error("Cash Confirmation Error:", error);
      toast.error(error.message || "Unable to confirm cash payment.");
    } finally {
      setConfirmingId(null);
    }
  };

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const customer = payment.userId?.username || "";
      const email = payment.userId?.email || "";
      const booking = payment.billId?.bookingId;
      const bookingId = booking?._id || "";
      const paymentId = getPaymentId(payment);

      const matchesSearch =
        paymentId.toLowerCase().includes(searchText) ||
        customer.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        bookingId.toLowerCase().includes(searchText);

      const paymentStatus = getStatus(payment);

      const matchesStatus =
        status === "All Status" ||
        (status === "Paid" && paymentStatus === "PAID") ||
        (status === "Pending" && paymentStatus === "PENDING") ||
        (status === "Failed" && paymentStatus === "FAILED");

      const matchesMethod =
        method === "All Methods" ||
        payment.paymentMethod === method;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, status, method]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalPaid = payments
    .filter((item) => getStatus(item) === "PAID")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const pendingCash = payments.filter(
    (item) =>
      item.paymentMethod === "CASH" &&
      getStatus(item) === "PENDING"
  ).length;

  const totalTransactions = payments.length;

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [search, status, method]);

  // =====================================================
  // DETAILS PAGE
  // =====================================================

  if (selectedPayment) {
    const latestPayment =
      payments.find((item) => item._id === selectedPayment._id) ||
      selectedPayment;

    return (
      <PaymentDetails
        payment={latestPayment}
        onBack={() => setSelectedPayment(null)}
        onConfirmCash={handleConfirmCash}
        confirmingId={confirmingId}
      />
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Heading */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer payments and transactions.
          </p>
        </div>

        <button
          onClick={() => fetchPayments(false)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Transactions
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalTransactions}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Amount Received
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {formatAmount(totalPaid)}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Cash Awaiting Confirmation
          </p>

          <h2 className="mt-2 text-2xl font-bold text-orange-600">
            {pendingCash}
          </h2>
        </div>

      </div>

      {/* Search + Filters */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_190px_190px]">

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search payment, booking or customer..."
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

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-yellow-500"
        >
          <option value="All Methods">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="CASH">Cash</option>
        </select>

      </div>

      {/* Payment Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">

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
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm text-gray-500">
                    Loading payments...
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => {
                  const booking = payment.billId?.bookingId;
                  const customer = payment.userId;

                  const isCashPending =
                    payment.paymentMethod === "CASH" &&
                    getStatus(payment) === "PENDING";

                  return (
                    <tr
                      key={payment._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-yellow-50/40"
                    >

                      <td className="px-5 py-4 text-sm font-bold text-gray-800">
                        {getPaymentId(payment)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {booking?._id?.slice(-6) || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {customer?.username || "Customer"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {customer?.phone || customer?.email || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-gray-900">
                        {formatAmount(payment.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <PaymentMethod method={payment.paymentMethod} />
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatus status={payment.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-100 hover:text-yellow-700"
                            title="View Payment"
                          >
                            <Eye size={18} />
                          </button>

                          {isCashPending && (
                            <button
                              onClick={() => handleConfirmCash(payment)}
                              disabled={confirmingId === payment._id}
                              className="whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {confirmingId === payment._id
                                ? "Confirming..."
                                : "Cash Received"}
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredPayments.length > 0 && (
          <div className="flex flex-col justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center">

            <p className="text-sm text-gray-500">
              Showing{" "}
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              {" - "}
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredPayments.length
              )}
              {" of "}
              {filteredPayments.length} payments
            </p>

            <div className="flex items-center gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <ArrowLeft size={16} />
              </button>

              <span className="px-3 text-sm font-semibold text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <ArrowLeft size={16} className="rotate-180" />
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// =====================================================
// PAYMENT DETAILS
// =====================================================

function PaymentDetails({
  payment,
  onBack,
  onConfirmCash,
  confirmingId,
}) {
  const booking = payment.billId?.bookingId;
  const customer = payment.userId;

  const isCashPending =
    payment.paymentMethod === "CASH" &&
    getStatus(payment) === "PENDING";

  const isConfirming = confirmingId === payment._id;

  const payableAmount =
    payment.billId?.adminFinalAmount ??
    payment.billId?.totalAmount ??
    payment.amount;

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

        <div className="flex flex-wrap gap-2">

          {isCashPending && (
            <button
              onClick={() => onConfirmCash(payment)}
              disabled={isConfirming}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle2 size={17} />
              {isConfirming ? "Confirming..." : "Mark Cash Received"}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
          >
            <Printer size={17} />
            Print
          </button>

        </div>

      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Payment ID */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Payment ID
            </p>

            <h2 className="mt-1 break-all text-xl font-bold text-gray-900 sm:text-2xl">
              {getPaymentId(payment)}
            </h2>
          </div>

          <PaymentStatus status={payment.status} />

        </div>

        {/* Amount */}
        <div className="border-b border-gray-100 p-6">

          <p className="text-sm font-medium text-gray-500">
            Payment Amount
          </p>

          <p className="mt-2 text-4xl font-bold text-gray-900">
            {formatAmount(payment.amount)}
          </p>

          {Number(payableAmount) !== Number(payment.amount) && (
            <p className="mt-2 text-xs text-gray-500">
              Bill payable amount: {formatAmount(payableAmount)}
            </p>
          )}

        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">

          {/* Customer and Booking */}
          <div className="space-y-7 p-6 lg:border-r lg:border-gray-100">

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Receipt size={16} />
                Booking ID
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking?._id || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <User size={16} />
                Customer
              </p>

              <p className="text-base font-bold text-gray-900">
                {customer?.username || "Customer"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {customer?.phone || "-"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {customer?.email || ""}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Machine
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking?.machine || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Service
              </p>

              <p className="text-base font-semibold text-gray-900">
                {booking?.work || "-"}
              </p>
            </div>

          </div>

          {/* Payment Information */}
          <div className="space-y-7 border-t border-gray-100 p-6 lg:border-t-0">

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <CreditCard size={16} />
                Payment Method
              </p>

              <PaymentMethod method={payment.paymentMethod} />
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar size={16} />
                Payment Date
              </p>

              <p className="text-base font-semibold text-gray-900">
                {formatDate(payment.createdAt)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Payment Status
              </p>

              <PaymentStatus status={payment.status} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Cashfree Order ID
              </p>

              <p className="break-all text-sm font-semibold text-gray-700">
                {payment.orderId || "-"}
              </p>
            </div>

            {payment.cfPaymentId && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">
                  Cashfree Payment ID
                </p>

                <p className="break-all text-sm font-semibold text-gray-700">
                  {payment.cfPaymentId}
                </p>
              </div>
            )}

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

            <p className="mt-1 break-all font-semibold text-gray-900">
              {getPaymentId(payment)}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">
              Payment Method
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {getMethod(payment)}
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-xs font-medium text-gray-500">
              Total Amount
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {formatAmount(payment.amount)}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
