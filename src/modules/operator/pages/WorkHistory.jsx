import React, { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  Truck,
} from "lucide-react";

const workHistoryData = [
  {
    id: "JOB-001",
    customer: "Ahmed Kareem",
    work: "Land Excavation",
    machine: "JCB 3DX",
    location: "Manjeri, Malappuram",
    date: "28 Sep 2026",
    hours: "6 hrs",
    amount: 4800,
    status: "Completed",
  },
  {
    id: "JOB-002",
    customer: "Shameer P",
    work: "Site Cleaning",
    machine: "JCB 3DX",
    location: "Kondotty, Malappuram",
    date: "24 Sep 2026",
    hours: "5 hrs",
    amount: 4000,
    status: "Completed",
  },
  {
    id: "JOB-003",
    customer: "Niyas TK",
    work: "Foundation Work",
    machine: "JCB 4DX",
    location: "Perinthalmanna, Malappuram",
    date: "20 Sep 2026",
    hours: "7 hrs",
    amount: 5600,
    status: "Completed",
  },
  {
    id: "JOB-004",
    customer: "Rashid K",
    work: "Earth Moving",
    machine: "JCB 3DX",
    location: "Wandoor, Malappuram",
    date: "15 Sep 2026",
    hours: "4 hrs",
    amount: 3200,
    status: "Completed",
  },
  {
    id: "JOB-005",
    customer: "Faisal M",
    work: "Road Work",
    machine: "JCB 4DX",
    location: "Nilambur, Malappuram",
    date: "10 Sep 2026",
    hours: "8 hrs",
    amount: 6400,
    status: "Completed",
  },
];

export default function WorkHistory() {
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const value = search.toLowerCase();

    return workHistoryData.filter(
      (job) =>
        job.id.toLowerCase().includes(value) ||
        job.customer.toLowerCase().includes(value) ||
        job.work.toLowerCase().includes(value) ||
        job.location.toLowerCase().includes(value)
    );
  }, [search]);

  const totalJobs = workHistoryData.length;
  const totalHours = workHistoryData.reduce(
    (total, job) => total + parseInt(job.hours),
    0
  );
  const totalAmount = workHistoryData.reduce(
    (total, job) => total + job.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          Work History
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your completed jobs and work history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Jobs */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Jobs</p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                {totalJobs}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Working Hours</p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                {totalHours} hrs
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Clock3 size={24} />
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Job Amount</p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <IndianRupee size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl bg-white shadow-sm">

        {/* Card Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-[#0B1D2B]">
              Completed Jobs
            </h2>

            <p className="text-sm text-gray-500">
              Your previous completed work
            </p>
          </div>

          {/* Search */}
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Job ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Work
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Machine
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Hours
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-gray-100 transition hover:bg-yellow-50/40"
                >
                  {/* Job ID */}
                  <td className="px-5 py-4">
                    <span className="font-semibold text-[#0B1D2B]">
                      {job.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-800">
                      {job.customer}
                    </span>
                  </td>

                  {/* Work */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">
                      {job.work}
                    </span>
                  </td>

                  {/* Machine */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-yellow-600" />
                      <span className="text-sm text-gray-700">
                        {job.machine}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {job.location}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="text-gray-400"
                      />
                      <span className="text-sm text-gray-600">
                        {job.date}
                      </span>
                    </div>
                  </td>

                  {/* Hours */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-700">
                      {job.hours}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[#0B1D2B]">
                      ₹{job.amount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={13} />
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Clock3 className="mx-auto text-gray-300" size={40} />

            <h3 className="mt-3 font-semibold text-gray-700">
              No work history found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try searching with another keyword.
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