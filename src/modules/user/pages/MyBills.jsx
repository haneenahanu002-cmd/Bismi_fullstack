
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  FileText,
  Eye,
  X,
  Download,
  CalendarDays,
  MapPin,
  Truck,
  IndianRupee,
  CheckCircle2,
  Clock3,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000/api/bills";

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAmount(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function getBookingId(id) {
  if (!id) return "-";
  return `BM${String(id).slice(-6).toUpperCase()}`;
}

export default function MyBills() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view your bills.");
      }

      const response = await fetch(`${API}/user/my-bills`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bills.");
      }

      setBills(Array.isArray(data.bills) ? data.bills : []);
    } catch (err) {
      console.error("Fetch bills error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Convert MongoDB bill data into display data
  const formattedBills = useMemo(() => {
    return bills.map((bill) => {
      const booking = bill.bookingId || {};

      const finalAmount =
        bill.adminFinalAmount !== null &&
        bill.adminFinalAmount !== undefined
          ? Number(bill.adminFinalAmount)
          : Number(bill.totalAmount || 0);

      const hours = Number(bill.totalHours || 0);
      const baseAmount = Number(bill.amount || 0);

      return {
        ...bill,
        id: `BILL-${String(bill._id).slice(-6).toUpperCase()}`,
        bookingId: getBookingId(booking._id || bill.bookingId),
        machine: booking.machine || bill.machine || "-",
        workType: booking.work || bill.work || "-",
        location: bill.siteName || booking.location || booking.address || "-",
        date: formatDate(bill.billDate || booking.date || bill.createdAt),
        hours,
        amount: baseAmount,
        rate: hours > 0 ? baseAmount / hours : 0,
        shiftingCharge: Number(bill.shiftingCharge || 0),
        tipper: Number(bill.tipper || 0),
        batta: Number(bill.batta || 0),
        total: finalAmount,
        status: bill.paymentStatus || "Pending",
        operator: bill.operatorId?.username || "-",
      };
    });
  }, [bills]);

  const filteredBills = formattedBills.filter((bill) => {
    const text = search.toLowerCase().trim();

    const matchesSearch = [
      bill.id,
      bill.bookingId,
      bill.machine,
      bill.workType,
      bill.location,
      bill.operator,
    ].some((value) =>
      String(value || "").toLowerCase().includes(text)
    );

    const matchesStatus =
      statusFilter === "All" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBills = formattedBills.length;

  const paidAmount = formattedBills
    .filter((bill) => bill.status === "Paid")
    .reduce((sum, bill) => sum + bill.total, 0);

  const pendingAmount = formattedBills
    .filter((bill) => bill.status !== "Paid")
    .reduce((sum, bill) => sum + bill.total, 0);

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const handleDownload = (bill) => {
    alert(
      `Bill ${bill.id} PDF download will be connected later.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
            My Bills
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your admin-approved bills and invoices.
          </p>
        </div>

        <button
          onClick={fetchBills}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Bills
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                {totalBills}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Paid Amount
              </p>
              <h2 className="mt-2 text-2xl font-bold text-green-600">
                ₹{getAmount(paidAmount)}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Amount
              </p>
              <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                ₹{getAmount(pendingAmount)}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Clock3 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            onClick={fetchBills}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Bills Section */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Search + Filter */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1D2B]">
              Bills & Invoices
            </h2>

            <p className="text-sm text-gray-500">
              Your approved billing history
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search bills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-yellow-400"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                {[
                  "Bill ID",
                  "Booking",
                  "Machine",
                  "Work",
                  "Date",
                  "Amount",
                  "Status",
                  "Actions",
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
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading your bills...
                  </td>
                </tr>
              ) : filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr
                    key={bill._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#0B1D2B]">
                      {bill.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.bookingId}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {bill.machine}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.workType}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.date}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-[#0B1D2B]">
                      ₹{getAmount(bill.total)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          bill.status
                        )}`}
                      >
                        {bill.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    {bills.length === 0
                      ? "No approved bills available yet."
                      : "No bills found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading your bills...
            </div>
          ) : filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <div
                key={bill._id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#0B1D2B]">
                      {bill.id}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Booking: {bill.bookingId}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      bill.status
                    )}`}
                  >
                    {bill.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Machine</p>
                    <p className="font-medium text-gray-700">
                      {bill.machine}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Work</p>
                    <p className="font-medium text-gray-700">
                      {bill.workType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="font-medium text-gray-700">
                      {bill.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="font-bold text-[#0B1D2B]">
                      ₹{getAmount(bill.total)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBill(bill)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-yellow-500"
                >
                  <Eye size={16} />
                  View Bill
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">
              {bills.length === 0
                ? "No approved bills available yet."
                : "No bills found."}
            </div>
          )}
        </div>
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Bill Details
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedBill.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBill(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              {/* Company */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h3 className="text-xl font-bold text-[#0B1D2B]">
                    Bismi Earth Movers
                  </h3>

                  <p className="text-sm text-gray-500">
                    JCB & Earth Moving Services
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Malappuram, Kerala
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">Bill Number</p>

                  <p className="font-bold text-[#0B1D2B]">
                    {selectedBill.id}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Booking: {selectedBill.bookingId}
                  </p>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Truck size={19} className="text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-400">Machine</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.machine}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={19} className="text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-400">Work Type</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.workType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={19} className="text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={19} className="text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill Amount Details */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Machine Service
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹{getAmount(selectedBill.amount)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Working Hours
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedBill.hours} hrs
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Rate / Hour
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹{getAmount(selectedBill.rate)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Shifting Charge
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹{getAmount(selectedBill.shiftingCharge)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">Tipper</span>
                  <span className="font-medium text-gray-800">
                    ₹{getAmount(selectedBill.tipper)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">Batta</span>
                  <span className="font-medium text-gray-800">
                    ₹{getAmount(selectedBill.batta)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4">
                  <span className="font-bold text-[#0B1D2B]">
                    Admin Approved Total
                  </span>

                  <span className="flex items-center gap-1 text-xl font-bold text-[#0B1D2B]">
                    <IndianRupee size={18} />
                    {getAmount(selectedBill.total)}
                  </span>
                </div>
              </div>

              {/* Operator */}
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">
                  Assigned Operator
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {selectedBill.operator}
                </p>
              </div>

              {/* Status */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Payment Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedBill.status
                  )}`}
                >
                  {selectedBill.status}
                </span>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
