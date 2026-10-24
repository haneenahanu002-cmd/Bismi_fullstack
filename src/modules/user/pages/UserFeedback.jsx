import { useState } from "react";
import {
  MessageSquare,
  Star,
  Send,
  CalendarDays,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function UserFeedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [booking, setBooking] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const bookings = [
    {
      id: "BK-001",
      machine: "JCB 3DX",
      work: "Land Excavation",
      date: "03 Oct 2026",
    },
    {
      id: "BK-002",
      machine: "JCB 4DX",
      work: "Foundation Work",
      date: "29 Sep 2026",
    },
    {
      id: "BK-003",
      machine: "JCB 3DX",
      work: "Site Cleaning",
      date: "25 Sep 2026",
    },
  ];

  const previousFeedback = [
    {
      id: 1,
      booking: "BK-002",
      machine: "JCB 4DX",
      rating: 5,
      message:
        "Excellent service. The operator was professional and completed the work on time.",
      date: "29 Sep 2026",
    },
    {
      id: 2,
      booking: "BK-001",
      machine: "JCB 3DX",
      rating: 4,
      message:
        "Good service and the machine was in good condition.",
      date: "03 Oct 2026",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!booking || rating === 0 || !message.trim()) {
      alert("Please select booking, rating and enter your feedback.");
      return;
    }

    setSubmitted(true);

    setBooking("");
    setRating(0);
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          Feedback
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Share your experience and help us improve our service
        </p>
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Feedback Form */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Form Header */}
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
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                >
                  <option value="">Select a completed booking</option>

                  {bookings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} - {item.machine} - {item.work}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Booking */}
              {booking && (
                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                  {bookings
                    .filter((item) => item.id === booking)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                      >
                        <div className="flex items-center gap-3">
                          <Truck
                            size={18}
                            className="text-yellow-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Machine
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {item.machine}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MessageSquare
                            size={18}
                            className="text-yellow-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Work
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {item.work}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <CalendarDays
                            size={18}
                            className="text-yellow-600"
                          />

                          <div>
                            <p className="text-xs text-gray-400">
                              Date
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {item.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent"}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-500 sm:w-auto"
              >
                <Send size={17} />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="space-y-6">
          {/* Rating Info */}
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
              {previousFeedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#0B1D2B]">
                        {item.booking}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.machine}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-semibold text-gray-700">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-5 text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}