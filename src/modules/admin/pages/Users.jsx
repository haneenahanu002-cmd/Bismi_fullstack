
import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";

const users = [
  {
    id: "USR001",
    name: "Arun Kumar",
    email: "arun@gmail.com",
    phone: "+91 98765 43210",
    work: "JCB Operator",
    timeline: "3 Years",
    workplace: "Malappuram",
    status: "Active",
  },
  {
    id: "USR002",
    name: "Rahul Das",
    email: "rahul@gmail.com",
    phone: "+91 98765 12345",
    work: "Site Supervisor",
    timeline: "2 Years",
    workplace: "Manjeri",
    status: "Active",
  },
  {
    id: "USR003",
    name: "Navas K",
    email: "navas@gmail.com",
    phone: "+91 95678 23456",
    work: "Machine Operator",
    timeline: "4 Years",
    workplace: "Perinthalmanna",
    status: "Active",
  },
  {
    id: "USR004",
    name: "Shameer Ali",
    email: "shameer@gmail.com",
    phone: "+91 94456 78901",
    work: "JCB Operator",
    timeline: "1 Year",
    workplace: "Kondotty",
    status: "Inactive",
  },
  {
    id: "USR005",
    name: "Vishnu P",
    email: "vishnu@gmail.com",
    phone: "+91 98470 45678",
    work: "Driver",
    timeline: "5 Years",
    workplace: "Nilambur",
    status: "Active",
  },
  {
    id: "USR006",
    name: "Fasil Rahman",
    email: "fasil@gmail.com",
    phone: "+91 70123 56789",
    work: "Excavator Operator",
    timeline: "2 Years",
    workplace: "Wandoor",
    status: "Active",
  },
  {
    id: "USR007",
    name: "Ajmal P",
    email: "ajmal@gmail.com",
    phone: "+91 85904 67890",
    work: "Site Worker",
    timeline: "8 Months",
    workplace: "Areekode",
    status: "Active",
  },
  {
    id: "USR008",
    name: "Muhammed Shafi",
    email: "shafi@gmail.com",
    phone: "+91 90721 34567",
    work: "Machine Operator",
    timeline: "3 Years",
    workplace: "Edavanna",
    status: "Inactive",
  },
];

export default function Users() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl text-yellow-400 text-white shadow-sm">
              <UsersIcon size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                User Management
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage all registered users in the system
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Search & Filter */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-3.5 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-700/10"
              />
            </div>

            {/* Role Dropdown */}
            <div className="relative w-full sm:w-44">
              <select
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-700/10"
              >
                <option>All Roles</option>
                <option>Customer</option>
                <option>Operator</option>
                <option>Supervisor</option>
                <option>Admin</option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3.5 top-3.5 text-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] text-left">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    User ID
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Name
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Work
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Work Timeline
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Work Place
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-yellow-50/30"
                  >
                    {/* User ID */}
                    <td className="px-5 py-5">
                      <span className="font-semibold text-yellow-600">
                        {user.id}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-yellow-700 text-sm font-bold text-yellow-800">
                          {user.name.charAt(0)}
                        </div>

                        <span className="whitespace-nowrap font-semibold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-5 text-sm text-gray-600">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-5 whitespace-nowrap text-sm text-gray-600">
                      {user.phone}
                    </td>

                    {/* Work */}
                    <td className="px-5 py-5">
                      <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                        {user.work}
                      </span>
                    </td>

                    {/* Timeline */}
                    <td className="px-5 py-5 whitespace-nowrap text-sm text-gray-600">
                      {user.timeline}
                    </td>

                    {/* Workplace */}
                    <td className="px-5 py-5 whitespace-nowrap text-sm text-gray-600">
                      {user.workplace}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">1</span> to{" "}
              <span className="font-semibold text-gray-700">8</span> of{" "}
              <span className="font-semibold text-gray-700">64</span> users
            </p>

            <div className="flex items-center gap-1">

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                <ChevronLeft size={17} />
              </button>

              <button
                type="button"
                className="h-9 w-9 rounded-lg text-yellow-500 text-sm font-bold text-white"
              >
                1
              </button>

              <button
                type="button"
                className="h-9 w-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                2
              </button>

              <button
                type="button"
                className="h-9 w-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                3
              </button>

              <button
                type="button"
                className="h-9 w-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                4
              </button>

              <span className="px-1 text-gray-400">...</span>

              <button
                type="button"
                className="h-9 w-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                8
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight size={17} />
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}