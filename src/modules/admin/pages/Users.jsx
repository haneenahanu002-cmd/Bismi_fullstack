
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";

import { getAllUsersAPI } from "../../../services/allApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 8;

  // Fetch users from MongoDB
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await getAllUsersAPI(token);

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search and role filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (user.username || "").toLowerCase().includes(searchText) ||
        (user.email || "").toLowerCase().includes(searchText) ||
        (user.phone || "").toLowerCase().includes(searchText) ||
        (user.location || "").toLowerCase().includes(searchText);

      const matchesRole =
        role === "All Roles" || user.role === role.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, role]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1D2B] text-yellow-400 shadow-sm">
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

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

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

            <div className="relative w-full sm:w-44">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-amber-700 focus:bg-white"
              >
                
                <option value="user">User</option>
               
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3.5 top-3.5 text-gray-400"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-10 text-center text-red-600">
              {error}
              <button
                onClick={fetchUsers}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">

                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      {[
                        "User ID",
                        "Name",
                        "Email",
                        "Phone",
                        "Location",
                        "Role",
                        "Registered Date",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="transition hover:bg-yellow-50/30"
                        >
                          <td className="px-5 py-5">
                            <span className="font-semibold text-yellow-600">
                              {user._id.slice(-8).toUpperCase()}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-yellow-800">
                                {user.username?.charAt(0)?.toUpperCase() || "U"}
                              </div>

                              <span className="whitespace-nowrap font-semibold text-gray-800">
                                {user.username || "-"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-5 text-sm text-gray-600">
                            {user.email || "-"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                            {user.phone || "-"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                            {user.location || "-"}
                          </td>

                          <td className="px-5 py-5">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">
                              {user.role || "user"}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-5 py-12 text-center text-sm text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {filteredUsers.length === 0 ? 0 : startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-700">
                    {Math.min(startIndex + usersPerPage, filteredUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {filteredUsers.length}
                  </span>{" "}
                  users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <span className="px-3 text-sm font-semibold text-gray-700">
                    {totalPages === 0 ? 0 : currentPage} / {totalPages}
                  </span>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
