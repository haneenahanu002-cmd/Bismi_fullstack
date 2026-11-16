
import React, { useEffect, useState } from "react";
import {
  Search,
  X,
  Play,
  Clock3,
  CheckCircle2,
  FileText,
  UserRound,
  Truck,
  MapPin,
  CalendarDays,
  Timer,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/bookings";

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

// Convert MongoDB booking data into the fields used by this UI
function formatJob(booking) {
  return {
    ...booking,
    id: `BM${booking._id.slice(-6).toUpperCase()}`,
    customer:
      booking.userId?.username ||
      booking.userId?.email ||
      "Customer",
    phone: booking.userId?.phone || "-",
    service: booking.work || "-",
    date: formatDate(booking.date),
    time: formatTime(booking.startTime),
    operator:
      booking.operatorId?.username ||
      booking.operatorId?.email ||
      "You",
    description: booking.notes || booking.work || "-",
    location: booking.location || "-",
    address: booking.address || "-",
    duration: booking.duration
      ? `${booking.duration} hours`
      : "-",
  };
}

export default function CompleteJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch accepted jobs from MongoDB
  const fetchAcceptedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("operatorToken");

      if (!token) {
        throw new Error("Operator login token not found. Please login again.");
      }

      const response = await fetch(`${API}/operator/accepted-jobs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch accepted jobs.");
      }

      const bookings = Array.isArray(data)
  ? data
  : data.jobs || data.bookings || [];

      setJobs(bookings.map(formatJob));
    } catch (err) {
      console.error("Fetch accepted jobs error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    [
      job.id,
      job.customer,
      job.machine,
      job.service,
      job.location,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  // NOTE: These two status updates are currently frontend-only.
  // Backend start/complete APIs are not connected yet.
 const updateJobStatus = async (jobId, action) => {
  try {
    const token = localStorage.getItem("operatorToken");

    if (!token) {
      throw new Error("Please login again.");
    }

    const endpoint =
      action === "start" ? "start" : "complete";

    const response = await fetch(
      `${API}/operator/${jobId}/${endpoint}`,
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
      throw new Error(data.message || "Status update failed");
    }

    // Backend success aayal local list update cheyyum
    const updatedJob = data.job;

    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId
          ? formatJob(updatedJob)
          : job
      )
    );

    setSelectedJob(formatJob(updatedJob));

    alert(
      action === "start"
        ? "Job started successfully!"
        : "Job completed successfully!"
    );
  } catch (error) {
    console.error("Job status update:", error);
    alert(error.message || "Something went wrong");
  }
};

const handleStartJob = () => {
  if (!selectedJob) return;
  updateJobStatus(selectedJob._id, "start");
};

const handleCompleteJob = () => {
  if (!selectedJob) return;
  updateJobStatus(selectedJob._id, "complete");
};
  const handleCreateBill = () => {
    if (!selectedJob) return;
    navigate(`/operator/create-bill/${selectedJob._id}`);
  };

  const getStatusStyle = (status) => {
    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-indigo-100 text-indigo-700";
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-yellow-700">
          Operator / Job Management
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          Complete Jobs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View accepted jobs and update the work progress.
        </p>
      </div>

      {/* Accepted Jobs Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Accepted Job Lists
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Jobs accepted by you
            </p>
          </div>

          <div className="flex w-full gap-2 sm:max-w-md">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-500"
              />
            </div>

            <button
              type="button"
              onClick={fetchAcceptedJobs}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchAcceptedJobs}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Jobs Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Machine
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading accepted jobs...
                  </td>
                </tr>
              ) : filteredJobs.map((job) => (
                <tr
                  key={job._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">
                      {job.id}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-gray-800">
                      {job.customer}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {job.phone}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-gray-700">
                    {job.machine}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {job.service}
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-gray-800">
                      {job.date}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {job.time}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className={`rounded-lg px-4 py-2 text-xs font-bold ${
                        job.status === "Completed"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "inline-flex items-center gap-2 bg-yellow-500 text-black hover:bg-yellow-600"
                      }`}
                    >
                      {job.status === "Completed" ? (
                        "Details"
                      ) : (
                        <>
                          <Play size={15} />
                          Start Job
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredJobs.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    {error ? "Unable to load jobs." : "No accepted jobs found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-500">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">
                  Job Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedJob.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Current Job Status
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {selectedJob.status}
                  </p>
                </div>

                <span className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(selectedJob.status)}`}>
                  {selectedJob.status}
                </span>
              </div>

              {/* Job Information */}
              <div>
                <h3 className="mb-4 text-base font-bold text-gray-900">
                  Job Information
                </h3>

                <div className="grid grid-cols-1 gap-5 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                  <Info label="Customer" value={selectedJob.customer} icon={<UserRound size={17} />} />
                  <Info label="Phone Number" value={selectedJob.phone} icon={<UserRound size={17} />} />
                  <Info label="Machine" value={selectedJob.machine} icon={<Truck size={17} />} />
                  <Info label="Operator" value={selectedJob.operator} icon={<UserRound size={17} />} />
                  <Info label="Service" value={selectedJob.service} icon={<FileText size={17} />} />
                  <Info label="Work Duration" value={selectedJob.duration} icon={<Timer size={17} />} />
                  <Info label="Scheduled Date" value={selectedJob.date} icon={<CalendarDays size={17} />} />
                  <Info label="Scheduled Time" value={selectedJob.time} icon={<Clock3 size={17} />} />
                  <Info label="Location" value={selectedJob.location} icon={<MapPin size={17} />} />
                  <Info label="Address" value={selectedJob.address} icon={<MapPin size={17} />} />
                </div>
              </div>

              {/* Work Description */}
              <div>
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  Work Description
                </h3>
                <p className="rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-600">
                  {selectedJob.description}
                </p>
              </div>

              {/* Progress */}
              <div>
                <h3 className="mb-4 text-base font-bold text-gray-900">
                  Job Progress
                </h3>

                <div className="flex items-center gap-2">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-600">
                      Accepted
                    </span>
                  </div>

                  <div className={`mb-5 h-1 flex-1 rounded ${
                    selectedJob.status !== "Accepted"
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`} />

                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      selectedJob.status === "In Progress" || selectedJob.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      <Clock3 size={18} />
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-600">
                      In Progress
                    </span>
                  </div>

                  <div className={`mb-5 h-1 flex-1 rounded ${
                    selectedJob.status === "Completed"
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`} />

                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      selectedJob.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-center text-xs font-semibold text-gray-600">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="rounded-xl border border-gray-200 p-5">
                {selectedJob.status === "Accepted" && (
                  <>
                    <div className="flex items-start gap-3">
                      <AlertCircle size={21} className="mt-0.5 text-indigo-600" />
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Ready to Start?
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Click Start Job when you are ready to begin the work.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartJob}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      <Play size={18} />
                      Start Job
                    </button>
                  </>
                )}

                {selectedJob.status === "In Progress" && (
                  <>
                    <div className="flex items-start gap-3">
                      <Clock3 size={21} className="mt-0.5 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-blue-900">
                          Job In Progress
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          After finishing the work, click Complete Job.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteJob}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      <CheckCircle2 size={18} />
                      Complete Job
                    </button>
                  </>
                )}

                {selectedJob.status === "Completed" && (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={25} className="text-green-600" />
                      <div>
                        <h3 className="font-bold text-green-800">
                          Job Completed Successfully
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Now you can create the customer bill.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateBill}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3.5 text-sm font-bold text-black transition hover:bg-yellow-600"
                    >
                      <FileText size={18} />
                      Create Bill
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
