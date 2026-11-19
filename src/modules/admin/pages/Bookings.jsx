
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  ArrowLeft,
  Printer,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const API = "https://bismiserver.onrender.com/api/admin";

const MACHINE_OPTIONS = [
  "JCB 3DX",
  "Tata Hitachi",
  "Hyundai Excavator",
];

const getToken = () =>
  localStorage.getItem("adminToken") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("token") ||
  "";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

const getBookingId = (booking) =>
  booking?._id
    ? `BM${booking._id.slice(-6).toUpperCase()}`
    : "Booking";

const getCustomerName = (booking) =>
  booking?.userId?.username ||
  booking?.username ||
  "Customer";

const getPhone = (booking) =>
  booking?.userId?.phone ||
  booking?.phone ||
  "Phone not available";

const getOperatorName = (booking) =>
  booking?.operatorId?.username || "Not assigned";

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Assigned: "bg-blue-100 text-blue-800",
    Approved: "bg-green-100 text-green-800",
    "In Progress": "bg-purple-100 text-purple-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [operatorId, setOperatorId] = useState("");
  const [machine, setMachine] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Load bookings and operators from backend
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin token not found. Please login again."
        );
      }

      const headers = authHeaders();

      const [bookingResponse, operatorResponse] =
        await Promise.all([
          fetch(`${API}/bookings`, { headers }),
          fetch(`${API}/operators`, { headers }),
        ]);

      const bookingData = await bookingResponse.json();
      const operatorData = await operatorResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(
          bookingData.message ||
            "Unable to load bookings. Please check admin login."
        );
      }

      if (!operatorResponse.ok) {
        throw new Error(
          operatorData.message ||
            "Unable to load operators."
        );
      }

      // Supports both array and object API responses
      const bookingList = Array.isArray(bookingData)
        ? bookingData
        : Array.isArray(bookingData.bookings)
        ? bookingData.bookings
        : [];

      const operatorList = Array.isArray(operatorData)
        ? operatorData
        : Array.isArray(operatorData.operators)
        ? operatorData.operators
        : [];

      setBookings(bookingList);
      setOperators(operatorList);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
      setBookings([]);
      setOperators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search and status filter
  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const searchValues = [
        getBookingId(booking),
        getCustomerName(booking),
        getPhone(booking),
        booking.work,
        booking.machine,
        booking.location,
        booking.status,
      ];

      const matchesSearch =
        !query ||
        searchValues
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "All Status" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setOperatorId(booking.operatorId?._id || "");
    setMachine(booking.machine || MACHINE_OPTIONS[0]);
    setRejectReason("");
    setMessage("");
  };

  // Approve or reject a booking
  const runDecision = async (decision) => {
    if (!selectedBooking) return;

    if (
      decision === "approve" &&
      !operatorId
    ) {
      setMessage("Please select an operator before approving.");
      return;
    }

    if (
      decision === "reject" &&
      !rejectReason.trim()
    ) {
      setMessage("Please enter a rejection reason.");
      return;
    }

    setActionLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/bookings/${selectedBooking._id}/decision`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({
            decision,
            operatorId:
              decision === "approve" ? operatorId : null,
            machine:
              decision === "approve" ? machine : undefined,
            rejectionReason:
              decision === "reject"
                ? rejectReason.trim()
                : "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update booking."
        );
      }

      setMessage(
        data.message || "Booking updated successfully."
      );

      // Reload the list after successful action
      await loadData();

      if (data.booking) {
        setSelectedBooking(data.booking);
      } else {
        setSelectedBooking(null);
      }
    } catch (err) {
      setMessage(
        err.message || "Server connection failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Booking details page
  if (selectedBooking) {
    return (
      <BookingDetails
        booking={selectedBooking}
        operators={operators}
        operatorId={operatorId}
        setOperatorId={setOperatorId}
        machine={machine}
        setMachine={setMachine}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        actionLoading={actionLoading}
        message={message}
        onApprove={() => runDecision("approve")}
        onReject={() => runDecision("reject")}
        onBack={() => {
          setSelectedBooking(null);
          setMessage("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bookings Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review bookings and assign operators.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Search and status filter */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, booking, machine..."
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-500"
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}

          <button
            onClick={loadData}
            className="ml-3 font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
          Loading bookings...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    "Booking ID",
                    "Customer",
                    "Work",
                    "Machine",
                    "Date & Time",
                    "Operator",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-bold text-gray-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b last:border-0 hover:bg-yellow-50/40"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-gray-800">
                      {getBookingId(booking)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-gray-800">
                        {getCustomerName(booking)}
                      </div>

                      <div className="text-xs text-gray-500">
                        {getPhone(booking)}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {booking.work || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {booking.machine || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-700">
                        {formatDate(booking.date)}
                      </div>

                      <div className="text-xs text-gray-500">
                        {booking.startTime || "Time not specified"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {getOperatorName(booking)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetails(booking)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                          title="View booking"
                        >
                          <Eye size={18} />
                        </button>

                        {booking.operatorDecision === "Rejected" && (
                          <button
                            onClick={() => openDetails(booking)}
                            className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                            title="Reassign operator"
                          >
                            Reassign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredBookings.length && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      {error
                        ? "Bookings could not be loaded."
                        : search || statusFilter !== "All Status"
                        ? "No bookings match your search or filter."
                        : "No bookings found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>
    </div>
  );
}

function BookingDetails({
  booking,
  operators,
  operatorId,
  setOperatorId,
  machine,
  setMachine,
  rejectReason,
  setRejectReason,
  actionLoading,
  message,
  onApprove,
  onReject,
  onBack,
}) {
  const canDecide = booking.status === "Pending";

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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
              Review and manage this booking
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black"
        >
          <Printer size={17} />
          Print
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {getBookingId(booking)}
            </h2>
          </div>

          <StatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          <div className="space-y-6 p-6 lg:border-r">
            <Info label="Customer" value={getCustomerName(booking)} />
            <Info label="Phone" value={getPhone(booking)} />
            <Info label="Work" value={booking.work || "—"} />
            <Info label="Requested Machine" value={booking.machine || "—"} />

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                Location
              </p>

              <p className="font-semibold text-gray-900">
                {booking.location || "—"}
              </p>

              {booking.address && (
                <p className="mt-1 text-sm text-gray-500">
                  {booking.address}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                Date & Time
              </p>

              <p className="font-semibold text-gray-900">
                {formatDate(booking.date)}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {booking.startTime || "Time not specified"}
                {booking.duration
                  ? ` · ${booking.duration} hours`
                  : ""}
              </p>
            </div>

            <Info
              label="Customer Notes"
              value={booking.notes || "No notes"}
            />
          </div>

          <div className="space-y-6 border-t p-6 lg:border-t-0">
            <div className="rounded-xl border bg-gray-50 p-5">
              <p className="mb-3 text-sm font-medium text-gray-500">
                <User size={16} className="mr-2 inline" />
                Assigned Operator
              </p>

              <p className="font-semibold text-gray-900">
                {getOperatorName(booking)}
              </p>

              {booking.operatorId?.phone && (
                <p className="mt-1 text-sm text-gray-500">
                  {booking.operatorId.phone}
                </p>
              )}
            </div>

            {canDecide && (
              <div className="space-y-5 rounded-xl border border-yellow-200 bg-yellow-50/50 p-5">
                <h3 className="font-bold text-gray-900">
                  Admin Decision
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select machine
                  </label>

                  <select
                    value={machine}
                    onChange={(e) => setMachine(e.target.value)}
                    className="w-full rounded-lg border bg-white px-3 py-3 text-sm"
                  >
                    {!MACHINE_OPTIONS.includes(machine) && machine && (
                      <option value={machine}>
                        {machine} (Requested)
                      </option>
                    )}

                    {MACHINE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                        {item === booking.machine ? " (Requested)" : ""}
                      </option>
                    ))}
                  </select>

                  <p className="mt-1 text-xs text-gray-500">
                    Confirm machine availability before assigning.
                    Machine options are currently static.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assign operator
                  </label>

                  <select
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className="w-full rounded-lg border bg-white px-3 py-3 text-sm"
                  >
                    <option value="">Choose an operator</option>

                    {operators.map((operator) => (
                      <option
                        key={operator._id || operator.id}
                        value={operator._id || operator.id}
                      >
                        {operator.username}
                        {operator.phone ? ` — ${operator.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  disabled={actionLoading}
                  onClick={onApprove}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle size={17} />
                  {actionLoading
                    ? "Processing..."
                    : "Approve & Assign Operator"}
                </button>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rejection reason
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Explain why this booking is rejected..."
                    className="w-full rounded-lg border bg-white p-3 text-sm outline-none focus:border-red-400"
                  />
                </div>

                <button
                  disabled={actionLoading}
                  onClick={onReject}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle size={17} />
                  Reject Booking
                </button>
              </div>
            )}

            {booking.status === "Rejected" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="font-semibold text-red-700">
                  Booking Rejected
                </p>

                <p className="mt-2 text-sm text-red-700">
                  {booking.rejectionReason ||
                    "No rejection reason provided."}
                </p>
              </div>
            )}

            {booking.operatorDecision === "Rejected" &&
              booking.status === "Assigned" && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                  <p className="font-semibold text-yellow-800">
                    Operator Rejected
                  </p>
                  <p className="mt-2 text-sm text-yellow-800">
                    Reassign this booking to another operator.
                  </p>

                  <select
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className="mt-3 w-full rounded-lg border bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Choose an operator</option>
                    {operators.map((operator) => (
                      <option
                        key={operator._id || operator.id}
                        value={operator._id || operator.id}
                      >
                        {operator.username}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={actionLoading || !operatorId}
                    onClick={async () => {
                      try {
                        setActionLoading(true);
                        const token = localStorage.getItem("token");
                        const response = await fetch(
                          `https://bismiserver.onrender.com/api/admin/bookings/${booking._id}/reassign`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              operatorId,
                              machine: booking.machine,
                            }),
                          }
                        );
                        const data = await response.json();
                        if (!response.ok) {
                          throw new Error(
                            data.message || "Failed to reassign."
                          );
                        }
                        setMessage("Booking reassigned successfully.");
                        fetchBookings();
                      } catch (err) {
                        setMessage(err.message);
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Reassign Operator
                  </button>
                </div>
              )}

            {message && (
              <div className="rounded-lg border bg-white p-3 text-sm text-gray-700">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="text-base font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
