import React, { useMemo, useState } from "react";

import {
  Search,
  CalendarDays,
  MapPin,
  Truck,
  Eye,
  X,
  Clock3,
  User,
  IndianRupee,
  Plus,
} from "lucide-react";

// --------------------------------------------------
// SAMPLE BOOKING DATA
// --------------------------------------------------

const initialBookings = [
  {
    id: "BK-001",
    machine: "JCB 3DX",
    work: "Land Excavation",
    location: "Manjeri, Malappuram",
    date: "03 Oct 2026",
    time: "09:00 AM - 03:00 PM",
    operator: "Abdul Rahman",
    amount: 4800,
    status: "Confirmed",
  },
  {
    id: "BK-002",
    machine: "JCB 4DX",
    work: "Foundation Work",
    location: "Perinthalmanna, Malappuram",
    date: "29 Sep 2026",
    time: "08:00 AM - 03:00 PM",
    operator: "Shahid K",
    amount: 5600,
    status: "Completed",
  },
  {
    id: "BK-003",
    machine: "JCB 3DX",
    work: "Site Cleaning",
    location: "Kondotty, Malappuram",
    date: "25 Sep 2026",
    time: "10:00 AM - 02:00 PM",
    operator: "Rashid P",
    amount: 4000,
    status: "Pending",
  },
  {
    id: "BK-004",
    machine: "JCB 4DX",
    work: "Earth Moving",
    location: "Wandoor, Malappuram",
    date: "18 Sep 2026",
    time: "09:00 AM - 04:00 PM",
    operator: "Sameer V",
    amount: 5600,
    status: "Completed",
  },
  {
    id: "BK-005",
    machine: "JCB 3DX",
    work: "Road Work",
    location: "Nilambur, Malappuram",
    date: "12 Sep 2026",
    time: "08:00 AM - 01:00 PM",
    operator: "Niyas T",
    amount: 4000,
    status: "Cancelled",
  },
];

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function MyBookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showBookingForm, setShowBookingForm] = useState(false);

  // --------------------------------------------------
  // BOOKING FORM STATE
  // --------------------------------------------------

  const [formData, setFormData] = useState({
    machine: "",
    work: "",
    date: "",
    startTime: "",
    duration: "",
    location: "",
    address: "",
    notes: "",
  });

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredBookings = useMemo(() => {
    const searchValue = search.toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(searchValue) ||
        booking.machine.toLowerCase().includes(searchValue) ||
        booking.work.toLowerCase().includes(searchValue) ||
        booking.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // --------------------------------------------------
  // FORM INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setFormData({
      machine: "",
      work: "",
      date: "",
      startTime: "",
      duration: "",
      location: "",
      address: "",
      notes: "",
    });
  };

  // --------------------------------------------------
  // SUBMIT BOOKING
  // --------------------------------------------------

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.machine ||
      !formData.work ||
      !formData.date ||
      !formData.startTime ||
      !formData.duration ||
      !formData.location ||
      !formData.address
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Calculate sample amount
    const durationNumber = Number(formData.duration);

    let hourlyRate = 800;

    if (formData.machine === "JCB 4DX") {
      hourlyRate = 800;
    }

    const amount = durationNumber * hourlyRate;

    // Create new booking ID
    const newId = `BK-${String(bookings.length + 1).padStart(3, "0")}`;

    // Convert date
    const selectedDate = new Date(formData.date);

    const formattedDate = selectedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Create new booking
    const newBooking = {
      id: newId,
      machine: formData.machine,
      work: formData.work,
      location: formData.location,
      date: formattedDate,
      time: `${formData.startTime} - ${durationNumber} Hours`,
      operator: "Not Assigned",
      amount: amount,
      status: "Pending",
    };

    // Add booking
    setBookings((previous) => [
      newBooking,
      ...previous,
    ]);

    // Close form
    setShowBookingForm(false);

    // Reset form
    resetForm();

    alert(
      "Booking request submitted successfully!"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          My Bookings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and track all your machine bookings
        </p>

      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Bookings
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
            {bookings.length}
          </h2>

        </div>

        {/* Confirmed */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Confirmed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {
              bookings.filter(
                (item) => item.status === "Confirmed"
              ).length
            }
          </h2>

        </div>

        {/* Completed */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {
              bookings.filter(
                (item) => item.status === "Completed"
              ).length
            }
          </h2>

        </div>

        {/* Pending */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {
              bookings.filter(
                (item) => item.status === "Pending"
              ).length
            }
          </h2>

        </div>

      </div>

      {/* ==================================================
          MAIN BOOKING CARD
      ================================================== */}

      <div className="rounded-2xl bg-white shadow-sm">

        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Heading */}

          <div>

            <h2 className="text-lg font-bold text-[#0B1D2B]">
              Booking History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your previous and upcoming bookings
            </p>

          </div>

          {/* Search + Filter + Book */}

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}

            <div className="relative sm:w-64">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />

            </div>

            {/* Status Filter */}

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

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

            {/* Book Slot Button */}

            <button
              onClick={() =>
                setShowBookingForm(true)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-[#0B1D2B] transition hover:bg-yellow-500"
            >

              <Plus size={18} />

              Book a Slot

            </button>

          </div>

        </div>

        {/* ==================================================
            DESKTOP TABLE
        ================================================== */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[1000px]">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50 text-left">

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Machine
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Work
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
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

              {filteredBookings.map((booking) => (

                <tr
                  key={booking.id}
                  className="border-b border-gray-100 transition hover:bg-yellow-50/40"
                >

                  <td className="px-5 py-4">

                    <span className="font-semibold text-[#0B1D2B]">
                      {booking.id}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Truck
                        size={17}
                        className="text-yellow-600"
                      />

                      <span className="text-sm text-gray-700">
                        {booking.machine}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {booking.work}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1.5">

                      <MapPin
                        size={15}
                        className="text-gray-400"
                      />

                      <span className="text-sm text-gray-600">
                        {booking.location}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={15}
                        className="text-gray-400"
                      />

                      <span className="text-sm text-gray-600">
                        {booking.date}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#0B1D2B]">

                    ₹
                    {booking.amount.toLocaleString(
                      "en-IN"
                    )}

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <button
                      onClick={() =>
                        setSelectedBooking(booking)
                      }
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50"
                    >

                      <Eye size={15} />

                      View

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ==================================================
            MOBILE CARDS
        ================================================== */}

        <div className="space-y-4 p-4 md:hidden">

          {filteredBookings.map((booking) => (

            <div
              key={booking.id}
              className="rounded-xl border border-gray-100 p-4"
            >

              <div className="flex items-center justify-between">

                <span className="font-bold text-[#0B1D2B]">
                  {booking.id}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <p className="flex items-center gap-2 text-gray-600">

                  <Truck
                    size={16}
                    className="text-yellow-600"
                  />

                  {booking.machine}

                </p>

                <p className="text-gray-600">

                  <span className="font-medium text-gray-800">
                    Work:
                  </span>{" "}

                  {booking.work}

                </p>

                <p className="flex items-center gap-2 text-gray-600">

                  <MapPin size={16} />

                  {booking.location}

                </p>

                <p className="flex items-center gap-2 text-gray-600">

                  <CalendarDays size={16} />

                  {booking.date}

                </p>

                <p className="font-semibold text-[#0B1D2B]">

                  ₹
                  {booking.amount.toLocaleString(
                    "en-IN"
                  )}

                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedBooking(booking)
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-2.5 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500"
              >

                <Eye size={16} />

                View Details

              </button>

            </div>

          ))}

        </div>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {filteredBookings.length === 0 && (

          <div className="px-5 py-12 text-center">

            <CalendarDays
              size={40}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-3 font-semibold text-gray-700">
              No bookings found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try another search or status filter.
            </p>

          </div>

        )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="border-t border-gray-100 px-5 py-4">

          <p className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-700">
              {filteredBookings.length}
            </span>{" "}

            bookings

          </p>

        </div>

      </div>

      {/* ==================================================
          BOOKING DETAILS MODAL
      ================================================== */}

      {selectedBooking && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>

                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Booking Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedBooking.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >

                <X size={20} />

              </button>

            </div>

            {/* Details */}

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

              <DetailBox
                label="Machine"
                icon={<Truck size={17} className="text-yellow-600" />}
                value={selectedBooking.machine}
              />

              <DetailBox
                label="Work Type"
                value={selectedBooking.work}
              />

              <DetailBox
                label="Location"
                icon={<MapPin size={17} />}
                value={selectedBooking.location}
              />

              <DetailBox
                label="Date"
                icon={<CalendarDays size={17} />}
                value={selectedBooking.date}
              />

              <DetailBox
                label="Working Time"
                icon={<Clock3 size={17} />}
                value={selectedBooking.time}
              />

              <DetailBox
                label="Operator"
                icon={<User size={17} />}
                value={selectedBooking.operator}
              />

              <DetailBox
                label="Total Amount"
                icon={<IndianRupee size={17} />}
                value={selectedBooking.amount.toLocaleString(
                  "en-IN"
                )}
              />

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs text-gray-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>

              </div>

            </div>

            {/* Close */}

            <div className="border-t border-gray-100 p-5 text-right">

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-xl bg-[#0B1D2B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#142b3c]"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          BOOK A SLOT MODAL
      ================================================== */}

      {showBookingForm && (

        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5">

              <div>

                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Book a Machine
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select your machine and booking details
                </p>

              </div>

              <button
                onClick={() => {
                  setShowBookingForm(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >

                <X size={21} />

              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleBookingSubmit}
              className="p-5"
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Machine */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Select Machine
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <select
                    name="machine"
                    value={formData.machine}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  >

                    <option value="">
                      Select machine
                    </option>

                    <option value="JCB 3DX">
                      JCB 3DX
                    </option>

                    <option value="JCB 4DX">
                      JCB 4DX
                    </option>

                  </select>

                </div>

                {/* Work Type */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Work Type
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <select
                    name="work"
                    value={formData.work}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  >

                    <option value="">
                      Select work type
                    </option>

                    <option value="Land Excavation">
                      Land Excavation
                    </option>

                    <option value="Foundation Work">
                      Foundation Work
                    </option>

                    <option value="Site Cleaning">
                      Site Cleaning
                    </option>

                    <option value="Earth Moving">
                      Earth Moving
                    </option>

                    <option value="Road Work">
                      Road Work
                    </option>

                  </select>

                </div>

                {/* Date */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Booking Date
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  />

                </div>

                {/* Start Time */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Start Time
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  />

                </div>

                {/* Duration */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Duration
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  >

                    <option value="">
                      Select duration
                    </option>

                    <option value="2">
                      2 Hours
                    </option>

                    <option value="4">
                      4 Hours
                    </option>

                    <option value="6">
                      6 Hours
                    </option>

                    <option value="8">
                      8 Hours
                    </option>

                  </select>

                </div>

                {/* Location */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Work Location
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Example: Manjeri"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  />

                </div>

                {/* Address */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Address
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter complete work site address"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    required
                  />

                </div>

                {/* Notes */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Additional Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any additional requirements..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

              </div>

              {/* Info */}

              <div className="mt-5 rounded-xl bg-yellow-50 p-4">

                <div className="flex gap-3">

                  <Truck
                    size={20}
                    className="mt-0.5 shrink-0 text-yellow-600"
                  />

                  <div>

                    <p className="text-sm font-semibold text-[#0B1D2B]">
                      Booking Information
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Your booking request will be sent for
                      confirmation. The operator and final
                      amount will be assigned after booking
                      confirmation.
                    </p>

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setShowBookingForm(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-[#0B1D2B] transition hover:bg-yellow-500"
                >
                  Submit Booking
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

// ==================================================
// DETAIL BOX COMPONENT
// ==================================================

function DetailBox({
  label,
  icon,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 flex items-center gap-2 font-semibold text-[#0B1D2B]">

        {icon}

        {value}

      </p>

    </div>
  );
}