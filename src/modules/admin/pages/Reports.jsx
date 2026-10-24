import React from "react";
import {
  CalendarDays,
  Download,
  Calendar,
  ClipboardList,
  IndianRupee,
  CheckCircle,
  Users,
} from "lucide-react";

const revenueData = [
  { label: "Week 1", value: 32000 },
  { label: "Week 2", value: 39000 },
  { label: "Week 3", value: 52000 },
  { label: "Week 4", value: 61000 },
];

const services = [
  { name: "JCB 3DX", value: 40, color: "#2563eb" },
  { name: "Excavator", value: 20, color: "#ef4444" },
  { name: "Land Clearing", value: 15, color: "#f59e0b" },
  { name: "Tipper", value: 10, color: "#14b8a6" },
  { name: "Others", value: 15, color: "#64748b" },
];

function StatCard({ icon: Icon, title, value, change }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {value}
          </h2>

          <p className="mt-2 text-sm font-semibold text-green-600">
            {change}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const maxRevenue = Math.max(...revenueData.map((item) => item.value));

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View business reports and statistics.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Date */}
          <button className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar size={17} className="text-gray-500" />
              <span>01 Sep 2026 - 30 Sep 2026</span>
            </div>

            <span className="text-gray-400">⌄</span>
          </button>

          {/* Export */}
          <button className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-yellow-600">
            <Download size={17} />
            Export
          </button>

        </div>
      </div>


      {/* ================= STAT CARDS ================= */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={ClipboardList}
          title="Total Bookings"
          value="86"
          change="+15%"
        />

        <StatCard
          icon={IndianRupee}
          title="Total Revenue"
          value="₹4,28,000"
          change="+20%"
        />

        <StatCard
          icon={CheckCircle}
          title="Completed Jobs"
          value="62"
          change="+10%"
        />

        <StatCard
          icon={Users}
          title="Total Customers"
          value="58"
          change="+12%"
        />

      </div>


      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Revenue Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Revenue Overview
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Weekly revenue performance
            </p>
          </div>

          <div className="flex h-[300px]">

            {/* Y Axis */}
            <div className="flex w-14 flex-col justify-between pb-8 pt-2 text-xs text-gray-400">
              <span>₹60K</span>
              <span>₹40K</span>
              <span>₹20K</span>
              <span>₹0</span>
            </div>

            {/* Chart */}
            <div className="relative flex-1">

              {/* Horizontal lines */}
              <div className="absolute inset-x-0 top-2 border-t border-gray-100" />
              <div className="absolute inset-x-0 top-[33%] border-t border-gray-100" />
              <div className="absolute inset-x-0 top-[66%] border-t border-gray-100" />
              <div className="absolute inset-x-0 bottom-8 border-t border-gray-100" />

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around gap-5 px-5 pb-8 pt-4">

                {revenueData.map((item) => {
                  const height = (item.value / maxRevenue) * 85;

                  return (
                    <div
                      key={item.label}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div
                        className="w-full max-w-[75px] rounded-t-lg bg-yellow-500 transition hover:bg-yellow-600"
                        style={{
                          height: `${height}%`,
                        }}
                        title={`₹${item.value.toLocaleString("en-IN")}`}
                      />

                      <span className="mt-3 text-xs font-medium text-gray-500">
                        {item.label}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>


        {/* Service Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              Service Distribution
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Bookings by service type
            </p>
          </div>

          <div className="flex flex-col items-center gap-7 md:flex-row md:justify-center">

            {/* Donut */}
            <div className="relative h-56 w-56 shrink-0">

              <svg
                viewBox="0 0 200 200"
                className="h-full w-full -rotate-90"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="28"
                />

                {(() => {
                  let offset = 0;
                  const circumference = 2 * Math.PI * 70;

                  return services.map((service) => {
                    const dash = (service.value / 100) * circumference;

                    const circle = (
                      <circle
                        key={service.name}
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={service.color}
                        strokeWidth="28"
                        strokeDasharray={`${dash} ${
                          circumference - dash
                        }`}
                        strokeDashoffset={-offset}
                      />
                    );

                    offset += dash;
                    return circle;
                  });
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  86
                </span>

                <span className="text-sm text-gray-500">
                  Total
                </span>
              </div>

            </div>


            {/* Legend */}
            <div className="w-full max-w-[240px] space-y-4">

              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between gap-5"
                >

                  <div className="flex items-center gap-3">

                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: service.color,
                      }}
                    />

                    <span className="text-sm text-gray-600">
                      {service.name}
                    </span>

                  </div>

                  <span className="text-sm font-semibold text-gray-700">
                    {service.value}%
                  </span>

                </div>
              ))}

            </div>

          </div>
        </div>

      </div>


      {/* ================= EXTRA REPORT CARDS ================= */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Booking Value
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹4,977
          </p>

          <p className="mt-2 text-xs text-green-600">
            Based on completed bookings
          </p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Payments
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹42,500
          </p>

          <p className="mt-2 text-xs text-orange-600">
            Amount to be collected
          </p>
        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Machine Utilization
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            78%
          </p>

          <p className="mt-2 text-xs text-green-600">
            Current period
          </p>
        </div>

      </div>

    </div>
  );
}