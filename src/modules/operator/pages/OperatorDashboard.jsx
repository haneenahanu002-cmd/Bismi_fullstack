import React from "react";
import {
  BriefcaseBusiness,
  Clock3,
  PlayCircle,
  CheckCircle2,
  Eye,
  UserRound,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: "BM1025",
    service: "Land Clearing",
    customer: "Ameen",
    time: "10:00 AM - 02:00 PM",
    status: "In Progress",
  },
  {
    id: "BM1028",
    service: "Site Preparation",
    customer: "Fathima",
    time: "03:00 PM - 05:00 PM",
    status: "Pending",
  },
  {
    id: "BM1032",
    service: "Earth Moving",
    customer: "Shameer",
    time: "09:00 AM - 01:00 PM",
    status: "Upcoming",
  },
  {
    id: "BM1035",
    service: "Land Leveling",
    customer: "Amina",
    time: "02:00 PM - 07:00 PM",
    status: "Upcoming",
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function OperatorDashboard() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Welcome */}
      <div className="mb-6 rounded-2xl bg-[#071521] p-6 text-white shadow-sm">
        <p className="text-sm text-gray-300">
          Here's your work summary for today.
        </p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          Welcome Back, Muhammed 👋
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Stay updated with your assigned jobs and daily work.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<BriefcaseBusiness size={22} />}
          title="Total Assigned"
          value="4"
          subtitle="Jobs"
        />

        <StatCard
          icon={<Clock3 size={22} />}
          title="Pending"
          value="1"
          subtitle="Job"
        />

        <StatCard
          icon={<PlayCircle size={22} />}
          title="In Progress"
          value="1"
          subtitle="Job"
        />

        <StatCard
          icon={<CheckCircle2 size={22} />}
          title="Completed"
          value="2"
          subtitle="Jobs"
        />

      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">

        {/* Today's Jobs */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-bold text-gray-900">
                Today's Jobs
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your assigned jobs for today
              </p>
            </div>

            <Link
              to="/operator/jobs"
              className="text-sm font-semibold text-yellow-600 hover:text-yellow-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 font-bold text-yellow-700">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      {job.id}
                    </p>

                    <p className="text-sm text-gray-600">
                      {job.service}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {job.customer} • {job.time}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={job.status} />

                  <Link
                    to={`/operator/jobs/${job.id}`}
                    className="rounded-lg p-2 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                  >
                    <Eye size={18} />
                  </Link>
                </div>

              </div>
            ))}

          </div>
        </div>


        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="mt-4 space-y-3">

            <QuickAction
              icon={<BriefcaseBusiness size={18} />}
              title="View Assigned Jobs"
              to="/operator/jobs"
            />

            <QuickAction
              icon={<UserRound size={18} />}
              title="Update Profile"
              to="/operator/profile"
            />

            <QuickAction
              icon={<FileText size={18} />}
              title="View My Bills"
              to="/operator/bills"
            />

          </div>

          {/* Small banner */}
          <div className="mt-6 rounded-xl bg-yellow-400 p-5 text-gray-900">
            <p className="text-sm font-bold">
              Hard work moves the world.
            </p>

            <p className="mt-1 text-xs">
              Complete your assigned jobs on time.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-sm text-gray-500">
        {title}
      </p>

      <div className="mt-1 flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {value}
        </span>

        <span className="mb-1 text-xs text-gray-400">
          {subtitle}
        </span>
      </div>

    </div>
  );
}

function QuickAction({ icon, title, to }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-yellow-400 hover:bg-yellow-50"
    >
      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          {icon}
        </div>

        <span className="text-sm font-semibold text-gray-700">
          {title}
        </span>

      </div>

      <span className="text-gray-400">›</span>
    </Link>
  );
}