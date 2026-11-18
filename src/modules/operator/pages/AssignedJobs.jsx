
import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Check, X } from "lucide-react";

const API = "https://bismiserver.onrender.com/api/bookings";

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "-";

  const match = time.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = match[2];

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${String(displayHours).padStart(2, "0")}:${minutes} ${suffix}`;
}

export default function AssignedJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchAssignedJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("operatorToken");

      if (!token) {
        throw new Error("Operator login token not found. Please login again.");
      }

      const response = await fetch(`${API}/operator/assigned-jobs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch assigned jobs.");
      }

      const bookings = Array.isArray(data)
        ? data
        : data.bookings || [];

      setJobs(bookings);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedJobs();
  }, []);

  // Accept job and update MongoDB
  const handleAccept = async (jobId) => {
    try {
      const token = localStorage.getItem("operatorToken");

      if (!token) {
        throw new Error("Operator login token not found. Please login again.");
      }

      setAcceptingId(jobId);

      const response = await fetch(
        `${API}/operator/assigned-jobs/${jobId}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept job.");
      }

      // Remove accepted job from Assigned Jobs list
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== jobId)
      );

      alert("Job accepted successfully! You can find it in Complete Jobs.");
    } catch (err) {
      console.error("Accept job error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (job) => {
    const reason = window.prompt("Reason for rejection (optional):");
    if (reason === null) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this job?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("operatorToken") || localStorage.getItem("token");
      const response = await fetch(
        `${API}/operator/assigned-jobs/${job._id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject job.");
      }

      setJobs((previous) =>
        previous.filter((item) => item._id !== job._id)
      );

      alert("Job rejected successfully.");
    } catch (err) {
      alert(err.message || "Failed to reject job.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const text = search.toLowerCase().trim();

    const bookingId = job._id
      ? `BM${job._id.slice(-6).toUpperCase()}`
      : "";

    const customer =
      job.userId?.username ||
      job.userId?.email ||
      "Customer";

    return [
      bookingId,
      customer,
      job.work,
      job.machine,
      job.location,
      job.address,
    ].some((value) =>
      String(value || "").toLowerCase().includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Jobs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your assigned jobs.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAssignedJobs}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search booking, customer, machine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchAssignedJobs}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Jobs Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            Assigned Jobs
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review your assigned jobs and accept or reject them.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Booking ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Service
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Machine
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold text-gray-600">
                  Location
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Loading assigned jobs...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No assigned jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const bookingId = `BM${job._id
                    .slice(-6)
                    .toUpperCase()}`;

                  const customer =
                    job.userId?.username ||
                    job.userId?.email ||
                    "Customer";

                  return (
                    <tr
                      key={job._id}
                      className="border-b last:border-0 transition hover:bg-yellow-50/40"
                    >
                      <td className="px-5 py-4 text-sm font-bold text-gray-900">
                        {bookingId}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {customer}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {job.work || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {job.machine || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {formatDate(job.date)}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatTime(job.startTime)}
                          {job.duration
                            ? ` · ${job.duration} hours`
                            : ""}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {job.location || job.address || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAccept(job._id)}
                            disabled={acceptingId === job._id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check size={15} />
                            {acceptingId === job._id
                              ? "Accepting..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(job)}
                            disabled={acceptingId === job._id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            <X size={15} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Count */}
      {!loading && !error && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredJobs.length} of {jobs.length} assigned jobs
        </div>
      )}
    </div>
  );
}
