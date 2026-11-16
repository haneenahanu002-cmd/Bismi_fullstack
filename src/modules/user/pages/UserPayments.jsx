
import React, { useEffect, useMemo, useState } from "react";
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
  Banknote,
  RefreshCw,
} from "lucide-react";

const API = "https://bismiserver.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getBookingInfo = (bill) => {
  const booking = bill?.bookingId || {};

  const bookingId =
    typeof booking === "object"
      ? booking.bookingId || booking._id
      : booking;

  const machine =
    booking.machineName ||
    booking.machine ||
    booking.machineType ||
    booking.machineId?.name ||
    booking.machineId?.machineName ||
    "-";

  const work =
    booking.serviceType ||
    booking.workType ||
    booking.service ||
    booking.work ||
    bill?.siteName ||
    "Machine Work";

  return {
    bookingId: bookingId
      ? String(bookingId).slice(-8).toUpperCase()
      : "-",
    machine:
      typeof machine === "object"
        ? machine.name || machine.machineName || "-"
        : machine,
    work,
  };
};

const getPaymentStatus = (payment) => {
  if (!payment) return "Unpaid";

  if (payment.status === "PAID") return "Paid";

  if (payment.status === "FAILED") return "Failed";

  if (payment.paymentMethod === "CASH") {
    return "Cash Confirmation Pending";
  }

  return "Payment Pending";
};

export default function UserPayments() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // API HELPER
  // ==========================================

  const apiRequest = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
      throw new Error("Please login to continue.");
    }

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Something went wrong."
      );
    }

    return data;
  };

  // ==========================================
  // FETCH BILLS AND PAYMENTS
  // ==========================================

  const fetchPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [billResponse, paymentResponse] = await Promise.all([
        apiRequest("/bills/user/my-bills"),
        apiRequest("/payments/my-payments"),
      ]);

      const approvedBills =
        billResponse.bills ||
        billResponse.data ||
        [];

      const paymentList =
        paymentResponse.payments ||
        paymentResponse.data ||
        [];

      setBills(
        Array.isArray(approvedBills) ? approvedBills : []
      );

      setPayments(
        Array.isArray(paymentList) ? paymentList : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // CASHFREE PAYMENT VERIFICATION
  // ==========================================

  const verifyPayment = async (orderId) => {
    try {
      setError("");
      setSuccess("Checking payment status...");

      const response = await apiRequest(
        `/payments/verify/${encodeURIComponent(orderId)}`
      );

      if (response.paymentStatus === "PAID") {
        setSuccess("Payment completed successfully.");
      } else {
        setSuccess(
          "Payment is not confirmed yet. Please refresh after some time."
        );
      }

      await fetchPayments(true);

      // Remove query parameters after verification
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  // ==========================================
  // INITIAL LOAD AND RETURN VERIFICATION
  // ==========================================

  useEffect(() => {
    const initialize = async () => {
      await fetchPayments();

      const params = new URLSearchParams(
        window.location.search
      );

      const orderId = params.get("order_id");

      if (orderId) {
        await verifyPayment(orderId);
      }
    };

    initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // LOAD CASHFREE SDK
  // ==========================================

  const loadCashfreeSDK = () =>
    new Promise((resolve, reject) => {
      if (window.Cashfree) {
        resolve();
        return;
      }

      const scriptUrl =
        "https://sdk.cashfree.com/js/v3/cashfree.js";

      const existingScript = document.querySelector(
        `script[src="${scriptUrl}"]`
      );

      if (existingScript) {
        existingScript.addEventListener("load", resolve, {
          once: true,
        });

        existingScript.addEventListener(
          "error",
          () => reject(
            new Error("Unable to load Cashfree SDK.")
          ),
          { once: true }
        );

        return;
      }

      const script = document.createElement("script");

      script.src = scriptUrl;
      script.async = true;

      script.onload = resolve;

      script.onerror = () => {
        reject(
          new Error("Unable to load Cashfree SDK.")
        );
      };

      document.body.appendChild(script);
    });

  // ==========================================
  // OPEN PAYMENT MODAL
  // ==========================================

  const handlePayNow = (bill) => {
    setSelectedPayment(bill);
    setSelectedMethod("UPI");

    setError("");
    setSuccess("");

    setShowPaymentModal(true);
  };

  // ==========================================
  // UPI PAYMENT
  // ==========================================

  const handleUpiPayment = async () => {
    if (!selectedPayment || processing) return;

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      // Create order in backend
      const response = await apiRequest(
        `/payments/upi/create-order/${selectedPayment._id}`,
        {
          method: "POST",
        }
      );

      if (!response.paymentSessionId) {
        throw new Error(
          response.message ||
          "Payment session was not created."
        );
      }

      // Load Cashfree SDK
      await loadCashfreeSDK();

      if (!window.Cashfree) {
        throw new Error(
          "Cashfree SDK is not available."
        );
      }

      const mode =
        import.meta.env.VITE_CASHFREE_MODE === "production"
          ? "production"
          : "sandbox";

      const cashfree = window.Cashfree({
        mode,
      });

      // Open hosted checkout
      const result = await cashfree.checkout({
        paymentSessionId: response.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(
          result.error.message ||
          "Unable to complete payment."
        );
      }

      // Checkout normally redirects the browser.
      // If it does not redirect, allow the user to retry.
    } catch (err) {
      setError(
        err.message || "Unable to start UPI payment."
      );

      setProcessing(false);
    }
  };

  // ==========================================
  // CASH PAYMENT REQUEST
  // ==========================================

  const handleCashPayment = async () => {
    if (!selectedPayment || processing) return;

    try {
      setProcessing(true);
      setError("");

      const response = await apiRequest(
        "/payments/cash/request",
        {
          method: "POST",
          body: JSON.stringify({
            billId: selectedPayment._id,
          }),
        }
      );

      setSuccess(
        response.message ||
        "Cash payment request submitted successfully."
      );

      setShowPaymentModal(false);
      setSelectedPayment(null);

      await fetchPayments(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // COMBINE BILLS AND PAYMENTS
  // ==========================================

  const paymentRows = useMemo(() => {
    return bills.map((bill) => {
      const payment = payments
        .filter((item) => {
          const billId =
            item.billId?._id || item.billId;

          return String(billId) === String(bill._id);
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )[0];

      const booking = getBookingInfo(bill);

      return {
        ...bill,
        payment,

        id:
          payment?.orderId ||
          String(bill._id).slice(-8),

        bookingId: booking.bookingId,
        machine: booking.machine,
        work: booking.work,

        date: bill.billDate || bill.createdAt,

        amount: Number(
          bill.adminFinalAmount ??
          bill.totalAmount ??
          0
        ),

        paymentMethod:
          payment?.paymentMethod || "-",

        transactionId:
          payment?.cfPaymentId ||
          payment?.orderId ||
          "-",

        status: getPaymentStatus(payment),
      };
    });
  }, [bills, payments]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredPayments = useMemo(() => {
    const searchValue = search.toLowerCase();

    return paymentRows.filter((payment) => {
      const matchesSearch =
        String(payment.id)
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.bookingId)
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.machine)
          .toLowerCase()
          .includes(searchValue) ||
        String(payment.work)
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [paymentRows, search, statusFilter]);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Payment Pending":
      case "Cash Confirmation Pending":
      case "Unpaid":
        return "bg-yellow-100 text-yellow-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalAmount = paymentRows.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const paidAmount = paymentRows
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = paymentRows
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-yellow-500"
            size={32}
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading payments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your approved bills and payment history
          </p>
        </div>

        <button
          onClick={() => fetchPayments(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <span>{success}</span>

          <button onClick={() => setSuccess("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Amount"
          amount={totalAmount}
          icon={<IndianRupee size={22} />}
          color="yellow"
        />

        <SummaryCard
          label="Paid"
          amount={paidAmount}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <SummaryCard
          label="Pending"
          amount={pendingAmount}
          icon={<Clock3 size={22} />}
          color="orange"
        />

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Transactions
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                {paymentRows.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ReceiptText size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT HISTORY */}

      <div className="rounded-2xl bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1D2B]">
              My Bills & Payment History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Pay your admin-approved bills
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-yellow-400"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Payment Pending">Payment Pending</option>
              <option value="Cash Confirmation Pending">
                Cash Confirmation Pending
              </option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                {[
                  "Bill ID",
                  "Booking",
                  "Machine",
                  "Date",
                  "Amount",
                  "Method",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-100 transition hover:bg-yellow-50/40"
                >
                  <td className="px-5 py-4 font-semibold text-[#0B1D2B]">
                    {payment.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {payment.bookingId}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Truck
                        size={17}
                        className="text-yellow-600"
                      />

                      {payment.machine}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays
                        size={15}
                        className="text-gray-400"
                      />

                      {formatDate(payment.date)}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-semibold text-[#0B1D2B]">
                    ₹{formatAmount(payment.amount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {payment.paymentMethod}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={payment.status}
                      getStatusStyle={getStatusStyle}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-yellow-400 hover:bg-yellow-50"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      {payment.status !== "Paid" &&
                        payment.status !== "Cash Confirmation Pending" && (
                          <button
                            onClick={() => handlePayNow(payment)}
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

        {/* MOBILE CARDS */}

        <div className="space-y-4 p-4 md:hidden">
          {filteredPayments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-[#0B1D2B]">
                    {payment.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Booking: {payment.bookingId}
                  </p>
                </div>

                <StatusBadge
                  status={payment.status}
                  getStatusStyle={getStatusStyle}
                />
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Truck
                    size={16}
                    className="text-yellow-600"
                  />
                  {payment.machine}
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatDate(payment.date)}
                </p>

                <p className="flex items-center gap-2">
                  <CreditCard size={16} />
                  {payment.paymentMethod}
                </p>

                <p className="font-bold text-[#0B1D2B]">
                  ₹{formatAmount(payment.amount)}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedPayment(payment)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700"
                >
                  <Eye size={16} />
                  View
                </button>

                {payment.status !== "Paid" &&
                  payment.status !== "Cash Confirmation Pending" && (
                    <button
                      onClick={() => handlePayNow(payment)}
                      className="flex-1 rounded-xl bg-yellow-400 py-2.5 text-sm font-semibold text-[#0B1D2B]"
                    >
                      Pay Now
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}

        {filteredPayments.length === 0 && (
          <div className="px-5 py-12 text-center">
            <CreditCard
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-3 font-semibold text-gray-700">
              No approved bills found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Bills will appear here after admin approval.
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredPayments.length}
            </span>{" "}
            bills
          </p>
        </div>
      </div>

      {/* BILL DETAILS MODAL */}

      {selectedPayment && !showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Bill Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedPayment.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

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
                label="Bill Date"
                value={formatDate(selectedPayment.date)}
              />

              <PaymentDetail
                label="Amount"
                value={`₹${formatAmount(selectedPayment.amount)}`}
              />

              <PaymentDetail
                label="Payment Method"
                value={selectedPayment.paymentMethod}
              />

              <PaymentDetail
                label="Transaction / Order ID"
                value={selectedPayment.transactionId}
              />

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">
                  Status
                </p>

                <div className="mt-2">
                  <StatusBadge
                    status={selectedPayment.status}
                    getStatusStyle={getStatusStyle}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 p-5">
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              {selectedPayment.status !== "Paid" &&
                selectedPayment.status !== "Cash Confirmation Pending" && (
                  <button
                    onClick={() => handlePayNow(selectedPayment)}
                    className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500"
                  >
                    Pay Now
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD MODAL */}

      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Make Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Booking: {selectedPayment.bookingId}
                </p>
              </div>

              <button
                disabled={processing}
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                  setError("");
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-2xl bg-[#0B1D2B] p-5 text-white">
                <p className="text-sm text-gray-300">
                  Amount to Pay
                </p>

                <h3 className="mt-2 text-3xl font-bold text-yellow-400">
                  ₹{formatAmount(selectedPayment.amount)}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {selectedPayment.machine} • {selectedPayment.work}
                </p>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Select Payment Method
                </p>

                <div className="grid grid-cols-1 gap-3">

                  {/* UPI */}

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("UPI")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left ${
                      selectedMethod === "UPI"
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-400"
                    }`}
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

                  {/* CASH */}

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("CASH")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left ${
                      selectedMethod === "CASH"
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-400"
                    }`}
                  >
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                      <Banknote size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#0B1D2B]">
                        Cash
                      </p>

                      <p className="text-xs text-gray-500">
                        Pay cash and request confirmation
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {selectedMethod === "CASH" && (
                <div className="mt-4 rounded-xl bg-yellow-50 p-3 text-xs leading-5 text-yellow-800">
                  Submit a cash payment request. Your bill will
                  become Paid only after the admin confirms
                  receiving the cash.
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  disabled={processing}
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                    setError("");
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  disabled={processing}
                  onClick={
                    selectedMethod === "UPI"
                      ? handleUpiPayment
                      : handleCashPayment
                  }
                  className="flex-1 rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing
                    ? "Please wait..."
                    : selectedMethod === "UPI"
                    ? `Pay ₹${formatAmount(selectedPayment.amount)}`
                    : "Request Cash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({ label, amount, icon, color }) {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#0B1D2B] sm:text-2xl">
            ₹{formatAmount(amount)}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status, getStatusStyle }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}

// ==========================================
// PAYMENT DETAIL
// ==========================================

function PaymentDetail({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-[#0B1D2B]">
        {value || "-"}
      </p>
    </div>
  );
}
