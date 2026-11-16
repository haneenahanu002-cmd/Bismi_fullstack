
import { useState, useEffect, useCallback } from "react";

import {
  MessageSquare,
  Star,
  Send,
  CalendarDays,
  Truck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  getCompletedBookingsAPI,
  addFeedbackAPI,
  getMyFeedbackAPI,
} from "../../../services/allApi";

import { toast } from "react-toastify";

export default function UserFeedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [booking, setBooking] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [previousFeedback, setPreviousFeedback] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch completed bookings and feedback history
  const fetchFeedbackData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch completed bookings
      try {
        const bookingResponse = await getCompletedBookingsAPI();

        setBookings(bookingResponse.data.bookings || []);
      } catch (bookingError) {
        console.error(
          "Completed bookings error:",
          bookingError.response?.data || bookingError.message
        );

        setBookings([]);

        throw bookingError;
      }

      // Fetch previous feedback
      try {
        const feedbackResponse = await getMyFeedbackAPI();

        setPreviousFeedback(
          feedbackResponse.data.feedbacks || []
        );
      } catch (feedbackError) {
        console.error(
          "My feedback error:",
          feedbackError.response?.data || feedbackError.message
        );

        setPreviousFeedback([]);

        throw feedbackError;
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to load feedback details.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!booking || rating === 0 || !message.trim()) {
      toast.error(
        "Please select booking, rating and enter feedback."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await addFeedbackAPI({
        bookingId: booking,
        rating,
        message: message.trim(),
      });

      toast.success(
        response.data.message ||
        "Feedback submitted successfully!"
      );

      setSubmitted(true);

      setBooking("");
      setRating(0);
      setHoverRating(0);
      setMessage("");

      // Refresh bookings and feedback history
      await fetchFeedbackData();

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);

    } catch (err) {
      console.error(
        "Feedback submit error:",
        err.response?.data || err.message
      );

      toast.error(
        err.response?.data?.message ||
        "Failed to submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBooking = bookings.find(
    (item) => item._id === booking
  );

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
            Feedback
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Share your experience and help us improve our service
          </p>
        </div>

        <button
          type="button"
          onClick={fetchFeedbackData}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          <CheckCircle2 size={20} />

          <div>
            <p className="font-semibold">
              Feedback submitted successfully!
            </p>

            <p className="text-sm">
              Thank you for sharing your experience.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchFeedbackData}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Feedback Form */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
                  <MessageSquare size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#0B1D2B]">
                    Give Your Feedback
                  </h2>

                  <p className="text-sm text-gray-500">
                    Tell us about your recent service
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6">

              {/* Booking */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Booking
                </label>

                <select
                  value={booking}
                  onChange={(e) => setBooking(e.target.value)}
                  disabled={loading || bookings.length === 0}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                >
                  <option value="">
                    {loading
                      ? "Loading bookings..."
                      : "Select a completed booking"}
                  </option>

                  {bookings.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item._id.slice(-6)} - {item.machine} - {item.work}
                    </option>
                  ))}
                </select>

                {!loading && bookings.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    No completed bookings available for feedback.
                  </p>
                )}
              </div>

              {/* Selected Booking */}
              {selectedBooking && (
                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="flex items-center gap-3">
                      <Truck size={18} className="text-yellow-600" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Machine
                        </p>

                        <p className="text-sm font-semibold text-gray-700">
                          {selectedBooking.machine}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageSquare size={18} className="text-yellow-600" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Work
                        </p>

                        <p className="text-sm font-semibold text-gray-700">
                          {selectedBooking.work}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-yellow-600" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Date
                        </p>

                        <p className="text-sm font-semibold text-gray-700">
                          {formatDate(selectedBooking.date)}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Rate Your Experience
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition hover:scale-110"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        size={32}
                        className={
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}

                  {rating > 0 && (
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Feedback
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  placeholder="Tell us about your experience..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Please share your experience with the machine,
                  operator and service.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || loading || bookings.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Send size={17} />
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>

            </form>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="space-y-6">

          <div className="rounded-2xl bg-[#0B1D2B] p-6 text-white shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-yellow-400 p-3 text-slate-950">
                <Star size={22} className="fill-current" />
              </div>

              <div>
                <h3 className="font-bold">
                  Your Feedback Matters
                </h3>

                <p className="text-xs text-slate-400">
                  Help us serve you better
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              Your feedback helps Bismi Earth Movers improve our
              machines, operators and overall service quality.
            </p>
          </div>

          {/* Previous Feedback */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-5">
              <h2 className="font-bold text-[#0B1D2B]">
                My Previous Feedback
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your submitted reviews
              </p>
            </div>

            <div className="space-y-4 p-5">

              {loading && previousFeedback.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Loading feedback...
                </p>
              ) : previousFeedback.length === 0 ? (
                <p className="text-sm text-gray-500">
                  You haven't submitted any feedback yet.
                </p>
              ) : (
                previousFeedback.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#0B1D2B]">
                          {item.bookingId?._id?.slice(-6) || "Booking"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.bookingId?.machine || ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star
                          size={15}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-sm font-semibold text-gray-700">
                          {item.rating}/5
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-5 text-gray-600">
                      {item.message}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
