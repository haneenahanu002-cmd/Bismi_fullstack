
import React, { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:5000/api/feedback";
const ITEMS_PER_PAGE = 8;

// Get authentication token
const getToken = () => localStorage.getItem("token");

// Format date
const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Convert MongoDB feedback into UI format
const formatFeedback = (item) => {
  const customer = item.userId || {};
  const booking = item.bookingId || {};
  const operator = booking.operatorId || {};

  return {
    id: item._id,
    feedbackId: `FDB-${item._id.slice(-6).toUpperCase()}`,
    customer: customer.username || "Unknown Customer",
    email: customer.email || "-",
    phone: customer.phone || "-",
    rating: Number(item.rating) || 0,
    service: booking.work || "-",
    machine: booking.machine || "-",
    operator:
      typeof operator === "object"
        ? operator.username || "Not available"
        : "Not available",
    date: formatDate(item.createdAt),
    status: item.status || "New",
    comment: item.message || "",
  };
};
function Stars({ rating = 0, size = 16 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
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
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("All Ratings");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch all feedback from MongoDB
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login as admin.");
      }

      const response = await fetch(`${API}/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch feedback.");
      }

      const formatted = (data.feedbacks || []).map(formatFeedback);

      setFeedbacks(formatted);

      // Update selected details if already opened
      setSelectedFeedback((previous) => {
        if (!previous) return null;

        return (
          formatted.find((item) => item.id === previous.id) || null
        );
      });
    } catch (err) {
      console.error("Fetch Feedback Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Summary calculations
  const totalFeedback = feedbacks.length;

  const averageRating =
    totalFeedback > 0
      ? (
          feedbacks.reduce((sum, item) => sum + item.rating, 0) /
          totalFeedback
        ).toFixed(1)
      : "0.0";

  const newFeedback = feedbacks.filter(
    (item) => item.status === "New"
  ).length;

  // Search and rating filter
  const filteredFeedbacks = useMemo(() => {
    const text = search.toLowerCase().trim();

    return feedbacks.filter((feedback) => {
      const matchesSearch =
        feedback.feedbackId.toLowerCase().includes(text) ||
        feedback.customer.toLowerCase().includes(text) ||
        feedback.email.toLowerCase().includes(text) ||
        feedback.service.toLowerCase().includes(text) ||
        feedback.machine.toLowerCase().includes(text) ||
        feedback.operator.toLowerCase().includes(text) ||
        feedback.comment.toLowerCase().includes(text);

      const matchesRating =
        rating === "All Ratings" ||
        feedback.rating === Number(rating);

      return matchesSearch && matchesRating;
    });
  }, [feedbacks, search, rating]);

  // Pagination
  const totalPages = Math.ceil(
    filteredFeedbacks.length / ITEMS_PER_PAGE
  );

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rating]);

  // Mark feedback as Reviewed
  const updateFeedbackStatus = async (feedback) => {
    try {
      setUpdating(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API}/${feedback.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status:
              feedback.status === "Reviewed" ? "New" : "Reviewed",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update feedback status."
        );
      }

      await fetchFeedbacks();
    } catch (err) {
      console.error("Update Feedback Error:", err);
      setError(err.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (selectedFeedback) {
    return (
      <FeedbackDetails
        feedback={selectedFeedback}
        onBack={() => setSelectedFeedback(null)}
        onUpdateStatus={updateFeedbackStatus}
        updating={updating}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Feedback
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage feedback received from customers.
          </p>
        </div>

        <button
          onClick={fetchFeedbacks}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-yellow-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Feedback</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {totalFeedback}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Rating</p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {averageRating}
            </span>

            <Stars rating={Number(averageRating)} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">New Feedback</p>

          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {newFeedback}
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <RefreshCw
                      size={24}
                      className="mx-auto animate-spin text-yellow-600"
                    />
                    <p className="mt-3 text-sm text-gray-500">
                      Loading feedback...
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedFeedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-yellow-50/40"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-gray-800">
                      {feedback.feedbackId}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredFeedbacks.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No feedback found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredFeedbacks.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {(safePage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(
              safePage * ITEMS_PER_PAGE,
              filteredFeedbacks.length
            )}{" "}
            of {filteredFeedbacks.length} feedbacks
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                  safePage === page
                    ? "bg-yellow-500 text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   FEEDBACK DETAILS
===================================================== */

function FeedbackDetails({
  feedback,
  onBack,
  onUpdateStatus,
  updating,
}) {
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
            {feedback.feedbackId}
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

              <p className="text-xs text-gray-400">
                {feedback.email}
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

        {/* Admin Status Action */}
        <div className="flex flex-col justify-between gap-3 border-t p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Feedback Status
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Update this feedback after reviewing it.
            </p>
          </div>

          <button
            onClick={() => onUpdateStatus(feedback)}
            disabled={updating}
            className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold disabled:opacity-50 ${
              feedback.status === "Reviewed"
                ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                : "bg-yellow-500 text-black hover:bg-yellow-400"
            }`}
          >
            <CheckCircle size={17} />

            {updating
              ? "Updating..."
              : feedback.status === "Reviewed"
              ? "Mark as New"
              : "Mark as Reviewed"}
          </button>
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
                    number === feedback.rating ? "100%" : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
