
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  X,
  Truck,
  CalendarDays,
  Clock,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  ClipboardList,
} from "lucide-react";

const API_URL = "https://bismiserver.onrender.com/api/bookings";
const MACHINE_API = "https://bismiserver.onrender.com/api/machines/available";

const emptyForm = {
  machine: "",
  work: "",
  date: "",
  startTime: "",
  duration: "",
  location: "",
  address: "",
  notes: "",
};

const workTypes = [
  "Land Clearing",
  "Excavation",
  "Foundation Work",
  "Road Construction",
  "Road Repair",
  "Trenching",
  "Demolition",
  "Site Preparation",
  "Earth Moving",
  "Soil Removal",
  "Sand Loading",
  "Material Loading",
  "Material Unloading",
  "Pond Digging",
  "Drainage Work",
  "Agricultural Work",
  "Other",
];

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Invalid backend response:", text);

    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      throw new Error(
        `Backend HTML response received (${response.status}). Check API URL and backend routes.`
      );
    }

    throw new Error("Backend returned an invalid response.");
  }
}

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "-";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDisplayStatus(status) {
  if (status === "Assigned") return "Approved";
  return status || "Pending";
}

function StatusBadge({ status }) {
  const displayStatus = getDisplayStatus(status);

  const styles = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[displayStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {displayStatus}
    </span>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [machines, setMachines] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [machineLoading, setMachineLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [machineError, setMachineError] = useState("");

  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10";

  const getHeaders = (json = false) => {
    const token = localStorage.getItem("token");

    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // FETCH USER BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view your bookings.");
      }

      const response = await fetch(`${API_URL}/my-bookings`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch bookings.");
      }

      setBookings(
        Array.isArray(data.bookings) ? data.bookings : []
      );
    } catch (err) {
      console.error("Fetch Bookings Error:", err);
      setError(err.message || "Unable to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // FETCH AVAILABLE MACHINES
  const fetchAvailableMachines = async () => {
    try {
      setMachineLoading(true);
      setMachineError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(MACHINE_API, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch available machines."
        );
      }

      setMachines(
        Array.isArray(data.machines) ? data.machines : []
      );
    } catch (err) {
      console.error("Fetch Available Machines Error:", err);
      setMachineError(err.message || "Unable to load machines.");
      setMachines([]);
    } finally {
      setMachineLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchAvailableMachines();
  }, []);

  // SUMMARY
  const totalBookings = bookings.length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const approvedCount = bookings.filter(
    (booking) =>
      booking.status === "Assigned" ||
      booking.status === "Accepted"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  // SEARCH AND FILTER
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        booking.machine?.toLowerCase().includes(query) ||
        booking.work?.toLowerCase().includes(query) ||
        booking.location?.toLowerCase().includes(query) ||
        booking.address?.toLowerCase().includes(query) ||
        booking._id?.toLowerCase().includes(query);

      const displayStatus = getDisplayStatus(booking.status);

      const matchesStatus =
        statusFilter === "All Status" ||
        displayStatus === statusFilter ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // OPEN BOOKING MODAL
  const openBookingModal = async () => {
    setFormData({ ...emptyForm });
    setMachineError("");
    setShowModal(true);
    await fetchAvailableMachines();
  };

  const closeBookingModal = () => {
    if (saving) return;

    setShowModal(false);
    setFormData({ ...emptyForm });
    setMachineError("");
  };

  // FORM CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // CREATE BOOKING
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    const token = localStorage.getItem("token");

    if (!token) {
      window.alert("Please login again. Authentication token missing.");
      return;
    }

    if (!formData.machine) {
      window.alert("Please select a machine.");
      return;
    }

    if (!formData.work.trim()) {
      window.alert("Please select the type of work.");
      return;
    }

    if (!formData.date || !formData.startTime) {
      window.alert("Please select booking date and time.");
      return;
    }

    if (formData.date < getToday()) {
      window.alert("Please select today or a future date.");
      return;
    }

    const duration = Number(formData.duration);

    if (!Number.isFinite(duration) || duration < 1) {
      window.alert("Duration must be at least 1 hour.");
      return;
    }

    if (!formData.location.trim() || !formData.address.trim()) {
      window.alert("Please enter your location and full address.");
      return;
    }

    try {
      setSaving(true);

      const bookingData = {
        machine: formData.machine,
        work: formData.work.trim(),
        date: formData.date,
        startTime: formData.startTime,
        duration,
        location: formData.location.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(bookingData),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to create booking.");
      }

      window.alert("Booking request submitted successfully!");

      setShowModal(false);
      setFormData({ ...emptyForm });

      await fetchBookings();
    } catch (err) {
      console.error("Create Booking Error:", err);
      window.alert(err.message || "Unable to submit booking.");
    } finally {
      setSaving(false);
    }
  };

  // CANCEL BOOKING
  const handleCancelBooking = async (booking) => {
    if (booking.status !== "Pending") {
      window.alert("Only pending bookings can be cancelled.");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `${API_URL}/${booking._id}/cancel`,
        {
          method: "PATCH",
          headers: getHeaders(),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel booking.");
      }

      window.alert("Booking cancelled successfully.");
      setViewBooking(null);
      await fetchBookings();
    } catch (err) {
      console.error("Cancel Booking Error:", err);
      window.alert(err.message || "Unable to cancel booking.");
    }
  };

  // OPERATOR NAME
  const getOperatorName = (booking) => {
    return booking.operatorId?.username || "Not assigned yet";
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-amber-800">
              Bismi Earth Movers / User
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Book machines and track your booking requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                fetchBookings();
                fetchAvailableMachines();
              }}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openBookingModal}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-[#0B1D2B] hover:bg-amber-400"
            >
              <Plus size={19} />
              Book a Slot
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBookings}
              className="text-sm font-bold text-red-700 hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Bookings",
              value: totalBookings,
              icon: ClipboardList,
              color: "text-gray-900",
            },
            {
              title: "Pending",
              value: pendingCount,
              icon: Clock3,
              color: "text-amber-600",
            },
            {
              title: "Approved",
              value: approvedCount,
              icon: CheckCircle2,
              color: "text-blue-600",
            },
            {
              title: "Completed",
              value: completedCount,
              icon: CheckCircle2,
              color: "text-green-600",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {item.title}
                    </p>

                    <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
                      {item.value}
                    </h2>
                  </div>

                  <Icon size={25} className={item.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* SEARCH AND FILTER */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by machine, work, location or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-amber-500"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Accepted</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Rejected</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-sm md:block">
          <div className="border-b px-5 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              Booking History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    "Booking ID",
                    "Machine",
                    "Work",
                    "Date & Time",
                    "Duration",
                    "Operator",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-bold uppercase text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <RefreshCw
                        size={30}
                        className="mx-auto animate-spin text-amber-600"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        Loading bookings...
                      </p>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <ClipboardList
                        size={38}
                        className="mx-auto text-gray-300"
                      />

                      <h3 className="mt-3 font-bold text-gray-800">
                        No bookings found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Your booking requests will appear here.
                      </p>

                      {bookings.length === 0 && (
                        <button
                          type="button"
                          onClick={openBookingModal}
                          className="mt-4 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold"
                        >
                          <Plus size={16} className="mr-1 inline" />
                          Book Your First Slot
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-amber-50/40"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-amber-800">
                        {booking._id?.slice(-8).toUpperCase()}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        {booking.machine}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {booking.work}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        <p>{formatDate(booking.date)}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {formatTime(booking.startTime)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {booking.duration} hour(s)
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {getOperatorName(booking)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setViewBooking(booking)}
                          className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE BOOKING CARDS */}
        <div className="space-y-4 md:hidden">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Booking History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredBookings.length} bookings
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border bg-white p-12 text-center">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-amber-600"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading bookings...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <ClipboardList
                size={36}
                className="mx-auto text-gray-300"
              />
              <h3 className="mt-3 font-bold text-gray-800">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your booking requests will appear here.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-800">
                      #{booking._id?.slice(-8).toUpperCase()}
                    </p>

                    <h3 className="mt-2 font-bold text-gray-900">
                      {booking.machine}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.work}
                    </p>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays size={16} className="text-amber-700" />
                    {formatDate(booking.date)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-amber-700" />
                    {formatTime(booking.startTime)} · {booking.duration} hour(s)
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-amber-700" />
                    {booking.location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewBooking(booking)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={16} />
                  View Booking Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D2B]/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeBookingModal();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Bismi Earth Movers
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Book a Slot
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your machine booking details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeBookingModal}
                disabled={saving}
                className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                {/* MACHINE DROPDOWN */}
                <div className="sm:col-span-2">
                  <FormField label="Select Machine" required>
                    <select
                      name="machine"
                      value={formData.machine}
                      onChange={handleChange}
                      required
                      disabled={machineLoading || machines.length === 0}
                      className={inputStyle}
                    >
                      <option value="">
                        {machineLoading
                          ? "Loading available machines..."
                          : machines.length === 0
                          ? "No available machines"
                          : "Select machine"}
                      </option>

                      {machines.map((machine) => (
                        <option
                          key={machine._id}
                          value={machine.name}
                        >
                          {machine.name} - {machine.model} (
                          {machine.registration})
                        </option>
                      ))}
                    </select>
                  </FormField>

                  {machineLoading && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <RefreshCw size={13} className="animate-spin" />
                      Loading machines...
                    </p>
                  )}

                  {machineError && (
                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-700">
                        {machineError}
                      </p>

                      <button
                        type="button"
                        onClick={fetchAvailableMachines}
                        className="mt-2 text-xs font-bold text-red-700 underline"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {!machineLoading &&
                    !machineError &&
                    machines.length === 0 && (
                      <p className="mt-2 text-xs text-orange-700">
                        No machines are currently available. Please try again later.
                      </p>
                    )}
                </div>

                {/* TYPE OF WORK DROPDOWN */}
                <div className="sm:col-span-2">
                  <FormField label="Type of Work" required>
                    <select
                      name="work"
                      value={formData.work}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    >
                      <option value="">Select type of work</option>

                      {workTypes.map((work) => (
                        <option key={work} value={work}>
                          {work}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {/* DATE */}
                <FormField label="Booking Date" required>
                  <input
                    type="date"
                    name="date"
                    min={getToday()}
                    value={formData.date}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </FormField>

                {/* TIME */}
                <FormField label="Start Time" required>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </FormField>

                {/* DURATION */}
                <FormField label="Duration (Hours)" required>
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    step="1"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className={inputStyle}
                    required
                  />
                </FormField>

                {/* LOCATION */}
                <FormField label="Location / Place" required>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Manjeri"
                    className={inputStyle}
                    required
                  />
                </FormField>

                {/* ADDRESS */}
                <div className="sm:col-span-2">
                  <FormField label="Full Work Address" required>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete work site address..."
                      rows={3}
                      className={inputStyle}
                      required
                    />
                  </FormField>
                </div>

                {/* NOTES */}
                <div className="sm:col-span-2">
                  <FormField label="Additional Notes">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional instructions..."
                      rows={3}
                      className={inputStyle}
                    />
                  </FormField>
                </div>
              </div>

              {/* FORM FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  disabled={saving}
                  className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    machineLoading ||
                    machines.length === 0
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-[#0B1D2B] hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}

                  {saving ? "Submitting..." : "Submit Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING DETAILS MODAL */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D2B]/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Booking Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  #{viewBooking._id?.slice(-8).toUpperCase()}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setViewBooking(null)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Booking Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={viewBooking.status} />
                  </div>
                </div>

                <Truck size={30} className="text-amber-700" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Machine</p>
                  <p className="mt-2 font-bold text-gray-900">
                    {viewBooking.machine}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Type of Work</p>
                  <p className="mt-2 font-bold text-gray-900">
                    {viewBooking.work}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Booking Date</p>
                  <p className="mt-2 font-bold text-gray-900">
                    {formatDate(viewBooking.date)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Start Time</p>
                  <p className="mt-2 font-bold text-gray-900">
                    {formatTime(viewBooking.startTime)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="mt-2 font-bold text-gray-900">
                    {viewBooking.duration} hour(s)
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Operator</p>
                  <p className="mt-2 font-bold text-gray-900">
                    {getOperatorName(viewBooking)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} />
                  Location
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {viewBooking.location}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {viewBooking.address}
                </p>
              </div>

              {viewBooking.notes && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Additional Notes
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {viewBooking.notes}
                  </p>
                </div>
              )}

              {viewBooking.rejectionReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-700">
                    Rejection Reason
                  </p>

                  <p className="mt-2 text-sm text-red-600">
                    {viewBooking.rejectionReason}
                  </p>
                </div>
              )}

              {viewBooking.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => handleCancelBooking(viewBooking)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  <XCircle size={17} />
                  Cancel Booking
                </button>
              )}
            </div>

            <div className="flex justify-end border-t bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setViewBooking(null)}
                className="rounded-xl bg-[#0B1D2B] px-5 py-3 text-sm font-bold text-white hover:bg-[#17364d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
