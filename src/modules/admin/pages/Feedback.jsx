import React, { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";

const feedbacks = [
  {
    id: "FDB-001",
    customer: "Arshad K",
    phone: "+91 9037123456",
    rating: 5,
    service: "Land Clearing",
    machine: "JCB 3DX",
    operator: "Muhammed",
    date: "30 Sep 2026",
    status: "Reviewed",
    comment:
      "Very good service. Machine arrived on time and the operator was very professional.",
  },
  {
    id: "FDB-002",
    customer: "Fathima P",
    phone: "+91 9876543210",
    rating: 4,
    service: "Excavation",
    machine: "JCB 3DX",
    operator: "Abdul Rahman",
    date: "01 Oct 2026",
    status: "Reviewed",
    comment:
      "Good service and the work was completed properly. Overall satisfied.",
  },
  {
    id: "FDB-003",
    customer: "Shameer P",
    phone: "+91 9123456789",
    rating: 5,
    service: "Land Leveling",
    machine: "Tata Hitachi",
    operator: "Riyas",
    date: "02 Oct 2026",
    status: "New",
    comment:
      "Excellent work. The operator handled the machine very well.",
  },
  {
    id: "FDB-004",
    customer: "Nihal M",
    phone: "+91 9567890123",
    rating: 3,
    service: "Road Work",
    machine: "Hyundai Excavator",
    operator: "Shahid",
    date: "03 Oct 2026",
    status: "New",
    comment:
      "The work was good but there was a delay in starting the service.",
  },
  {
    id: "FDB-005",
    customer: "Ameen A",
    phone: "+91 9345678901",
    rating: 5,
    service: "Digging",
    machine: "JCB 3DX",
    operator: "Sameer",
    date: "04 Oct 2026",
    status: "Reviewed",
    comment:
      "Great experience. Fast service and reasonable pricing.",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

function FeedbackStatus({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        status === "Reviewed"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function Feedback() {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("All Ratings");

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const text = search.toLowerCase();

    const matchesSearch =
      feedback.id.toLowerCase().includes(text) ||
      feedback.customer.toLowerCase().includes(text) ||
      feedback.service.toLowerCase().includes(text) ||
      feedback.operator.toLowerCase().includes(text);

    const matchesRating =
      rating === "All Ratings" ||
      feedback.rating === Number(rating);

    return matchesSearch && matchesRating;
  });

  if (selectedFeedback) {
    return (
      <FeedbackDetails
        feedback={selectedFeedback}
        onBack={() => setSelectedFeedback(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Feedback
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage feedback received from customers.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Feedback
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            128
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              4.6
            </span>

            <Stars rating={5} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            New Feedback
          </p>

          <p className="mt-2 text-2xl font-bold text-yellow-600">
            12
          </p>
        </div>

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
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-500"
        >
          <option>All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

      </div>

      {/* Feedback Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Feedback ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Rating
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Operator
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
              {filteredFeedbacks.map((feedback) => (
                <tr
                  key={feedback.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-yellow-50/40"
                >

                  <td className="px-5 py-4 text-sm font-bold text-gray-800">
                    {feedback.id}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {feedback.customer}
                    </p>

                    <p className="text-xs text-gray-500">
                      {feedback.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Stars rating={feedback.rating} />

                      <span className="text-xs font-semibold text-gray-600">
                        {feedback.rating}.0
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {feedback.service}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {feedback.operator}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {feedback.date}
                  </td>

                  <td className="px-5 py-4">
                    <FeedbackStatus status={feedback.status} />
                  </td>

                  <td className="px-5 py-4 text-center">

                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-100 hover:text-yellow-700"
                      title="View Feedback"
                    >
                      <Eye size={18} />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {filteredFeedbacks.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No feedback found.
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
   FEEDBACK DETAILS
===================================================== */

function FeedbackDetails({ feedback, onBack }) {
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">

        <button
          onClick={onBack}
          className="rounded-lg bg-white p-2.5 text-gray-700 shadow-sm hover:bg-yellow-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Feedback Details
          </h1>

          <p className="text-sm text-gray-500">
            {feedback.id}
          </p>
        </div>

      </div>


      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Customer */}
        <div className="flex flex-col justify-between gap-5 border-b p-6 sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-lg font-bold text-yellow-700">
              {feedback.customer
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {feedback.customer}
              </h2>

              <p className="text-sm text-gray-500">
                {feedback.phone}
              </p>
            </div>

          </div>

          <FeedbackStatus status={feedback.status} />

        </div>


        {/* Rating */}
        <div className="border-b p-6">

          <p className="mb-3 text-sm font-medium text-gray-500">
            Customer Rating
          </p>

          <div className="flex items-center gap-3">

            <Stars rating={feedback.rating} />

            <span className="text-lg font-bold text-gray-900">
              {feedback.rating}.0 / 5
            </span>

          </div>

        </div>


        {/* Details */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <MessageSquare size={16} />
              Service
            </p>

            <p className="font-semibold text-gray-900">
              {feedback.service}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">
              Machine
            </p>

            <p className="font-semibold text-gray-900">
              {feedback.machine}
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              Operator
            </p>

            <p className="font-semibold text-gray-900">
              {feedback.operator}
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              Date
            </p>

            <p className="font-semibold text-gray-900">
              {feedback.date}
            </p>
          </div>

        </div>


        {/* Customer Comment */}
        <div className="border-t p-6">

          <p className="mb-3 text-sm font-medium text-gray-500">
            Customer Comment
          </p>

          <div className="rounded-xl bg-gray-50 p-5">

            <MessageSquare
              size={22}
              className="mb-3 text-yellow-600"
            />

            <p className="text-base leading-7 text-gray-700">
              "{feedback.comment}"
            </p>

          </div>

        </div>

      </div>


      {/* Rating Breakdown */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold text-gray-900">
          Rating Summary
        </h2>

        {[5, 4, 3, 2, 1].map((number) => (
          <div
            key={number}
            className="mb-3 flex items-center gap-3"
          >

            <span className="w-10 text-sm text-gray-600">
              {number} star
            </span>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-yellow-500"
                style={{
                  width:
                    number === feedback.rating
                      ? "75%"
                      : number === 4
                      ? "20%"
                      : "5%",
                }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}