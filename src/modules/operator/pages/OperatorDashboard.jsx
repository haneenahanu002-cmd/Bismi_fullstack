
import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Clock3,
  PlayCircle,
  CheckCircle2,
  Eye,
  UserRound,
  FileText,
  CalendarDays,
  ArrowUpRight,
  MapPin,
  ClipboardList,
  RefreshCw,
  Truck,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/bookings";

export default function OperatorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("operatorToken");
    localStorage.removeItem("operator");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.replace("http://localhost:5173/");
  };

  // GET TOKEN
  const getToken = () => {
    return (
      localStorage.getItem("operatorToken") ||
      localStorage.getItem("token")
    );
  };

  // FETCH ALL OPERATOR JOBS
  const fetchAssignedJobs = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        setJobs([]);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch assigned jobs
      const assignedResponse = await fetch(
        `${API_URL}/operator/assigned-jobs`,
        { headers }
      );

      const assignedData = await assignedResponse.json();

      if (!assignedResponse.ok) {
        throw new Error(
          assignedData.message || "Failed to fetch assigned jobs."
        );
      }

      // Fetch accepted, in-progress and completed jobs
      const acceptedResponse = await fetch(
        `${API_URL}/operator/accepted-jobs`,
        { headers }
      );

      const acceptedData = await acceptedResponse.json();

      if (!acceptedResponse.ok) {
        throw new Error(
          acceptedData.message || "Failed to fetch accepted jobs."
        );
      }

      const assignedJobs = assignedData.bookings || [];
      const acceptedJobs = acceptedData.bookings || [];

      // Combine both API responses
      const allJobs = [...assignedJobs, ...acceptedJobs];

      // Remove duplicate bookings
      const uniqueJobs = Array.from(
        new Map(
          allJobs.map((job) => [job._id, job])
        ).values()
      );

      // Latest updated jobs first
      uniqueJobs.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );

      setJobs(uniqueJobs);
    } catch (err) {
      console.error("Fetch assigned jobs error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // INITIAL FETCH + AUTO REFRESH
  useEffect(() => {
    fetchAssignedJobs();

    const interval = setInterval(() => {
      fetchAssignedJobs(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // JOB STATISTICS
  const stats = useMemo(() => {
    return {
      total: jobs.length,

      assigned: jobs.filter(
        (job) => job.status === "Assigned"
      ).length,

      accepted: jobs.filter(
        (job) => job.status === "Accepted"
      ).length,

      inProgress: jobs.filter(
        (job) => job.status === "In Progress"
      ).length,

      completed: jobs.filter(
        (job) => job.status === "Completed"
      ).length,
    };
  }, [jobs]);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-700";

      case "Accepted":
        return "bg-purple-100 text-purple-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.total,
      icon: BriefcaseBusiness,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Assigned",
      value: stats.assigned,
      icon: ClipboardList,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: PlayCircle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700",
    },
  ];

  const quickActions = [
    {
      title: "Assigned Jobs",
      description: "View your assigned work",
      icon: BriefcaseBusiness,
      link: "AssignedJobs",
    },
    {
      title: "My Profile",
      description: "Manage your profile",
      icon: UserRound,
      link: "OpProfile",
    },
    {
      title: "My Bills",
      description: "View job bills",
      icon: FileText,
      link: "CreateBills",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* TOP HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
              Operator Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your assigned jobs and daily activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm sm:flex">
              <CalendarDays size={18} className="text-yellow-600" />

              <span className="text-sm font-medium text-gray-600">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* WELCOME BANNER */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-[#0B1D2B] p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-yellow-400">
                OPERATOR PANEL
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Welcome Back, Operator 👋
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                Track your assigned jobs, manage ongoing work,
                and keep your daily activities updated.
              </p>
            </div>

            <Link
              to="AssignedJobs"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-[#0B1D2B] transition hover:bg-yellow-300"
            >
              View Assigned Jobs
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-[#0B1D2B]">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-[#0B1D2B]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700 transition group-hover:bg-yellow-400 group-hover:text-[#0B1D2B]">
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#0B1D2B]">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-gray-400 transition group-hover:text-yellow-600"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RECENT JOBS */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0B1D2B]">
                Recent Assigned Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest assigned work details.
              </p>
            </div>

            <button
              onClick={() => fetchAssignedJobs()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading assigned jobs...
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-5 text-center">
              <AlertCircle
                size={30}
                className="mx-auto mb-2 text-red-500"
              />

              <p className="font-medium text-red-600">{error}</p>

              <button
                onClick={() => fetchAssignedJobs()}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl bg-gray-50 py-12 text-center">
              <BriefcaseBusiness
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-700">
                No Assigned Jobs
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Jobs assigned by Admin will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="rounded-xl border border-gray-100 p-4 transition hover:border-yellow-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                        <Truck size={22} />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#0B1D2B]">
                          {job.work || "Service Job"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Job ID: JOB-{job._id?.slice(-6)}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <UserRound size={14} />
                          {job.userId?.username ||
                            job.userId?.name ||
                            "Customer"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        job.status
                      )}`}
                    >
                      {job.status || "Pending"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="text-yellow-600" />
                      <span>{job.location || "Location not available"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays size={16} className="text-yellow-600" />
                      <span>{formatDate(job.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock3 size={16} className="text-yellow-600" />
                      <span>{job.startTime || "Time not available"}</span>
                    </div>
                  </div>

                  {job.machine && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <Truck size={16} className="text-yellow-600" />
                      Machine: {job.machine}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Link
                      to="AssignedJobs"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 hover:text-yellow-800"
                    >
                      View Details
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {jobs.length > 5 && (
            <div className="mt-5 text-center">
              <Link
                to="AssignedJobs"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B1D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16364d]"
              >
                View All Jobs
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
