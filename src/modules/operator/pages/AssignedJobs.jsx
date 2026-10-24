import React, { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: "BM1025",
    customer: "Ameen",
    service: "Land Clearing",
    machine: "JCB 3DX",
    date: "30 Sep 2026",
    time: "10:00 AM - 02:00 PM",
    location: "Manjeri, Malappuram",
    status: "In Progress",
  },
  {
    id: "BM1028",
    customer: "Fathima",
    service: "Site Preparation",
    machine: "JCB 3DX",
    date: "01 Oct 2026",
    time: "03:00 PM - 05:00 PM",
    location: "Perinthalmanna",
    status: "Pending",
  },
  {
    id: "BM1032",
    customer: "Shameer",
    service: "Earth Moving",
    machine: "Tata Hitachi",
    date: "02 Oct 2026",
    time: "09:00 AM - 01:00 PM",
    location: "Manjeri",
    status: "Upcoming",
  },
  {
    id: "BM1035",
    customer: "Amina",
    service: "Land Leveling",
    machine: "JCB 3DX",
    date: "03 Oct 2026",
    time: "02:00 PM - 07:00 PM",
    location: "Kondotty",
    status: "Upcoming",
  },
  {
    id: "BM1018",
    customer: "Rahman",
    service: "Excavation",
    machine: "Hyundai R210",
    date: "25 Sep 2026",
    time: "10:00 AM - 03:00 PM",
    location: "Malappuram",
    status: "Completed",
  },
];

function StatusBadge({ status }) {
  const styles = {
    "In Progress": "bg-blue-100 text-blue-700",
    Pending: "bg-orange-100 text-orange-700",
    Upcoming: "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

export default function AssignedJobs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filteredJobs = jobs.filter((job) => {
    const text = search.toLowerCase();

    const matchesSearch =
      job.id.toLowerCase().includes(text) ||
      job.customer.toLowerCase().includes(text) ||
      job.service.toLowerCase().includes(text) ||
      job.machine.toLowerCase().includes(text);

    const matchesStatus =
      status === "All Status" || job.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          My Jobs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your assigned jobs.
        </p>

      </div>


      {/* Search */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          />

        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-500"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Upcoming</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

      </div>


      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

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
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-bold text-gray-600">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b last:border-0 hover:bg-yellow-50/40"
                >

                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    {job.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {job.customer}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {job.service}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {job.machine}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {job.date}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {job.time}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>

                  <td className="px-5 py-4 text-center">

                    <Link
                      to={`/operator/jobs/${job.id}`}
                      className="inline-flex rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                      title="View Job"
                    >
                      <Eye size={18} />
                    </Link>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {filteredJobs.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No jobs found.
          </div>
        )}

      </div>


      {/* Pagination */}
      <div className="mt-5 flex justify-end gap-2">

        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ChevronLeft size={18} />
        </button>

        <button className="h-9 w-9 rounded-lg bg-yellow-500 text-sm font-bold text-black">
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