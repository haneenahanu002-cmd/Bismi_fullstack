
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  IndianRupee,
  CheckCircle2,
  Clock3,
  CalendarDays,
  BriefcaseBusiness,
  CreditCard,
  RefreshCw,
  Receipt,
  TrendingUp,
} from "lucide-react";

const API = "http://localhost:5000/api";

const OperatorWages = () => {
  const [wageBills, setWageBills] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalJobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyWages = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/operator-wages/operator/my-wages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWageBills(response.data.wageBills || []);

      setSummary(
        response.data.summary || {
          totalEarnings: 0,
          paidAmount: 0,
          pendingAmount: 0,
          totalJobs: 0,
        }
      );
    } catch (err) {
      console.error("Fetch operator wages error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your wage details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyWages();
  }, []);

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "Not paid yet";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getMachineName = (booking) => {
    if (!booking) return "Machine";

    return booking.machine || "Machine";
  };

  const getCustomerName = (booking) => {
    if (!booking) return "Customer";

    return booking.userId?.username || "Customer";
  };

  const getPaymentColor = (status) =>
    status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-600">
              OPERATOR PANEL
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
              My Earnings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View your wage bills and payment history from admin.
            </p>
          </div>

          <button
            onClick={fetchMyWages}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#0B1D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Earnings
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                  {formatCurrency(summary.totalEarnings)}
                </h2>
              </div>

              <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                <Wallet size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Total wages generated
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Paid Amount
                </p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(summary.paidAmount)}
                </h2>
              </div>

              <div className="rounded-lg bg-green-100 p-3 text-green-700">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Amount received from admin
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Pending Amount
                </p>
                <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                  {formatCurrency(summary.pendingAmount)}
                </h2>
              </div>

              <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700">
                <Clock3 size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Waiting for admin payment
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Completed Jobs
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                  {summary.totalJobs}
                </h2>
              </div>

              <div className="rounded-lg bg-purple-100 p-3 text-purple-700">
                <BriefcaseBusiness size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Jobs with wage bills
            </p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              onClick={fetchMyWages}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* WAGE BILLS */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0B1D2B]">
                My Wage Bills
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Individual wage details for your completed jobs
              </p>
            </div>

            <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              {wageBills.length} Bills
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <RefreshCw
                size={30}
                className="animate-spin text-yellow-500"
              />
              <p className="text-sm text-slate-500">
                Loading your wage details...
              </p>
            </div>
          ) : wageBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="rounded-full bg-slate-100 p-5">
                <Wallet size={35} className="text-slate-400" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#0B1D2B]">
                No Wage Bills Yet
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Your wage bills will appear here when admin creates
                payment details for your completed jobs.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {wageBills.map((bill) => (
                <div
                  key={bill._id}
                  className="p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* JOB DETAILS */}
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                        <BriefcaseBusiness size={23} />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#0B1D2B]">
                          {getMachineName(bill.bookingId)}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Customer: {getCustomerName(bill.bookingId)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Job ID: {bill.bookingId?._id || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <p className="text-xs text-slate-500">
                        Wage Amount
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-[#0B1D2B]">
                        {formatCurrency(bill.totalAmount)}
                      </h3>
                    </div>

                    {/* STATUS */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentColor(
                          bill.paymentStatus
                        )}`}
                      >
                        {bill.paymentStatus === "Paid" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}
                        {bill.paymentStatus}
                      </span>
                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-3 lg:grid-cols-5">

                    <div>
                      <p className="text-xs text-slate-500">
                        Working Hours
                      </p>
                      <p className="mt-1 font-semibold text-[#0B1D2B]">
                        {bill.workingHours} hrs
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Rate / Hour
                      </p>
                      <p className="mt-1 font-semibold text-[#0B1D2B]">
                        {formatCurrency(bill.ratePerHour)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Payment Method
                      </p>
                      <p className="mt-1 font-semibold text-[#0B1D2B]">
                        {bill.paymentMethod || "Not paid"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Payment Date
                      </p>
                      <p className="mt-1 font-semibold text-[#0B1D2B]">
                        {formatDate(bill.paymentDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Transaction ID
                      </p>
                      <p className="mt-1 break-all font-semibold text-[#0B1D2B]">
                        {bill.transactionId || "N/A"}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT INFORMATION */}
        <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <TrendingUp
            size={22}
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <div>
            <h3 className="font-semibold text-blue-900">
              Payment Information
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Your wage status is updated by admin after payment.
              If an amount is pending, please contact admin for
              payment details.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OperatorWages;
