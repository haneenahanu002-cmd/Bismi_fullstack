
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Truck,
  RefreshCw,
} from "lucide-react";

const API = "https://bismiserver.onrender.com/api/bookings";

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function WorkHistory() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch completed work history
  const fetchWorkHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("operatorToken");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API}/operator/work-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch work history"
        );
      }

      const bookings = Array.isArray(data)
        ? data
        : data.jobs || [];

      const formatted = bookings.map((job) => ({
        id: `BM${job._id.slice(-6).toUpperCase()}`,

        customer:
          job.userId?.username ||
          job.userId?.email ||
          "Customer",

        work: job.work || "-",

        machine: job.machine || "-",

        location: job.location || "-",

        date: formatDate(job.date),

        hours: `${Number(job.duration || 0)} hrs`,

        status: job.status || "Completed",
      }));

      setJobs(formatted);
    } catch (error) {
      console.error("Work history error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkHistory();
  }, []);

  // Search filter
  const filteredJobs = useMemo(() => {
    const value = search.toLowerCase().trim();

    return jobs.filter((job) =>
      [
        job.id,
        job.customer,
        job.work,
        job.location,
        job.machine,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [jobs, search]);

  // Summary
  const totalJobs = jobs.length;

  const totalHours = jobs.reduce(
    (total, job) => total + Number(job.hours.replace(" hrs", "") || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
            Work History
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your completed jobs and work history
          </p>
        </div>

        <button
          onClick={fetchWorkHistory}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <SummaryCard
          label="Completed Jobs"
          value={totalJobs}
          icon={<CheckCircle2 size={24} />}
          color="bg-green-100 text-green-600"
        />

        <SummaryCard
          label="Total Working Hours"
          value={`${totalHours} hrs`}
          icon={<Clock3 size={24} />}
          color="bg-yellow-100 text-yellow-600"
        />

      </div>

      {/* Main Card */}
      <div className="rounded-2xl bg-white shadow-sm">

        {/* Search Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-[#0B1D2B]">
              Completed Jobs
            </h2>

            <p className="text-sm text-gray-500">
              Your previous completed work
            </p>
          </div>

          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">

                {[
                  "Job ID",
                  "Customer",
                  "Work",
                  "Machine",
                  "Location",
                  "Date",
                  "Hours",
                  "Status",
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
                    Loading work history...
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (

                  <tr
                    key={job.id}
                    className="border-b border-gray-100 transition hover:bg-yellow-50/40"
                  >

                    {/* Job ID */}
                    <td className="px-5 py-4 font-semibold text-[#0B1D2B]">
                      {job.id}
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {job.customer}
                    </td>

                    {/* Work */}
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {job.work}
                    </td>

                    {/* Machine */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Truck
                          size={16}
                          className="text-yellow-600"
                        />
                        {job.machine}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin
                          size={15}
                          className="text-gray-400"
                        />
                        {job.location}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={15}
                          className="text-gray-400"
                        />
                        {job.date}
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {job.hours}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={13} />
                        {job.status}
                      </span>
                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (

          <div className="px-5 py-12 text-center">

            <Clock3
              className="mx-auto text-gray-300"
              size={40}
            />

            <h3 className="mt-3 font-semibold text-gray-700">
              No work history found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Completed jobs will appear here.
            </p>

          </div>

        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredJobs.length}
            </span>{" "}
            completed jobs
          </p>

          <span className="text-xs text-gray-400">
            Work History
          </span>

        </div>

      </div>

    </div>
  );
}

// Summary Card Component
function SummaryCard({ label, value, icon, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
            {value}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}
