
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Calendar,
  ClipboardList,
  IndianRupee,
  CheckCircle,
  Users,
  RefreshCw,
  CreditCard,
  Clock,
  Truck,
} from "lucide-react";

const API = "https://bismiserver.onrender.com/api/reports";

const serviceColors = [
  "#2563eb",
  "#ef4444",
  "#f59e0b",
  "#14b8a6",
  "#64748b",
  "#a855f7",
];

const money = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = new Date();
const monthStart = new Date();
monthStart.setDate(today.getDate() - 29);

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm print:shadow-none">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          {value}
        </h2>

        {subtitle && (
          <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
        <Icon size={21} />
      </div>
    </div>
  </div>
);

function Reports() {
  const [from, setFrom] = useState(localDate(monthStart));
  const [to, setTo] = useState(localDate(today));

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin to view reports.");
        setReport(null);
        return;
      }

      const params = new URLSearchParams();

      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const response = await fetch(`${API}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Invalid server response. Please check the backend API route."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load reports.");
      }

      setReport(data);
    } catch (err) {
      console.error("Reports Error:", err);
      setError(err.message || "Something went wrong.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = () => {
    if (from && to && from > to) {
      setError("From date cannot be later than To date.");
      return;
    }

    fetchReports();
  };

  // Export report using browser Print -> Save as PDF
  const handleExportPDF = () => {
    if (!report) return;

    window.print();
  };

  const summary = report?.summary;

  // Convert daily revenue into weekly revenue
  const revenueData = useMemo(() => {
    if (!report?.revenueTrend?.length) return [];

    const startDate = from
      ? new Date(`${from}T00:00:00`)
      : new Date(report.revenueTrend[0].date);

    const weeklyMap = {};

    report.revenueTrend.forEach((item) => {
      const itemDate = new Date(`${item.date}T00:00:00`);

      const diffDays = Math.floor(
        (itemDate - startDate) / (1000 * 60 * 60 * 24)
      );

      const weekNumber = Math.max(0, Math.floor(diffDays / 7));
      const label = `Week ${weekNumber + 1}`;

      weeklyMap[label] = (weeklyMap[label] || 0) + Number(item.revenue || 0);
    });

    return Object.entries(weeklyMap).map(([label, value]) => ({
      label,
      value,
    }));
  }, [report, from]);

  const maxRevenue = Math.max(
    ...revenueData.map((item) => item.value),
    1
  );

  // Dynamic service distribution from workReport
  const services = useMemo(() => {
    const workData = report?.workReport || [];

    const total = workData.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0
    );

    return workData.map((item, index) => ({
      name: item.work,
      count: item.count,
      value: total ? (item.count / total) * 100 : 0,
      color: serviceColors[index % serviceColors.length],
    }));
  }, [report]);

  const totalServiceBookings = services.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  const averagePaidAmount =
    summary?.paidPaymentCount > 0
      ? summary.totalRevenue / summary.paidPaymentCount
      : 0;

  const totalMachineBookings = (report?.machineReport || []).reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8 report-page">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .report-page {
            background: #ffffff !important;
            padding: 0 !important;
            min-height: auto !important;
          }

          .no-print {
            display: none !important;
          }

          .report-card {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
          }

          .report-heading {
            margin-bottom: 20px !important;
          }

          .report-charts {
            grid-template-columns: 1fr 1fr !important;
          }

          .report-page * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="report-heading mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View business reports and statistics.
          </p>

          {report && (
            <p className="mt-2 text-xs text-gray-400">
              Report period: {from} to {to}
            </p>
          )}
        </div>

        <div className="no-print flex flex-col gap-3 sm:flex-row">
          {/* DATE FILTER */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <Calendar className="text-gray-500" size={17} />

            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />

            <span className="text-gray-400">-</span>

            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>

          <button
            onClick={handleFilter}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Apply
          </button>

          {/* EXPORT PDF */}
          <button
            onClick={handleExportPDF}
            disabled={!report || loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export as PDF
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="no-print mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && !report && (
        <div className="py-20 text-center text-gray-500">
          <RefreshCw className="mx-auto mb-3 animate-spin" size={28} />
          Loading reports...
        </div>
      )}

      {report && summary && (
        <>
          {/* SUMMARY CARDS */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={ClipboardList}
              title="Total Bookings"
              value={summary.totalBookings}
            />

            <StatCard
              icon={IndianRupee}
              title="Total Revenue"
              value={money(summary.totalRevenue)}
              subtitle="Paid UPI + confirmed Cash"
            />

            <StatCard
              icon={CheckCircle}
              title="Completed Jobs"
              value={summary.completedBookings}
            />

            <StatCard
              icon={Users}
              title="Total Customers"
              value={summary.totalCustomers}
            />
          </div>

          {/* CHARTS */}
          <div className="report-charts grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* REVENUE OVERVIEW */}
            <div className="report-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Revenue Overview
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Weekly paid revenue performance
                </p>
              </div>

              {revenueData.length === 0 ? (
                <p className="flex h-[300px] items-center justify-center text-sm text-gray-400">
                  No paid revenue available for this period.
                </p>
              ) : (
                <div className="flex h-[300px]">
                  {/* Y AXIS */}
                  <div className="flex w-16 flex-col justify-between pb-8 pt-2 text-xs text-gray-400">
                    <span>{money(maxRevenue)}</span>
                    <span>{money(maxRevenue * 0.66)}</span>
                    <span>{money(maxRevenue * 0.33)}</span>
                    <span>₹0</span>
                  </div>

                  {/* BAR CHART */}
                  <div className="relative flex-1">
                    <div className="absolute inset-x-0 top-2 border-t border-gray-100" />
                    <div className="absolute inset-x-0 top-[33%] border-t border-gray-100" />
                    <div className="absolute inset-x-0 top-[66%] border-t border-gray-100" />
                    <div className="absolute inset-x-0 bottom-8 border-t border-gray-100" />

                    <div className="absolute inset-0 flex items-end justify-around gap-3 px-2 pb-8 pt-4">
                      {revenueData.map((item) => {
                        const height = (item.value / maxRevenue) * 85;

                        return (
                          <div
                            key={item.label}
                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                          >
                            <div
                              className="w-full max-w-[75px] rounded-t-lg bg-yellow-500 transition hover:bg-yellow-600"
                              style={{ height: `${height}%` }}
                              title={money(item.value)}
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
              )}
            </div>

            {/* SERVICE DISTRIBUTION */}
            <div className="report-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Service Distribution
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Bookings by work type
                </p>
              </div>

              {services.length === 0 ? (
                <p className="flex h-[260px] items-center justify-center text-sm text-gray-400">
                  No service data available.
                </p>
              ) : (
                <div className="flex flex-col items-center gap-7 md:flex-row md:justify-center">
                  {/* DONUT CHART */}
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
                          const dash =
                            (service.value / 100) * circumference;

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
                        {totalServiceBookings}
                      </span>

                      <span className="text-sm text-gray-500">
                        Total
                      </span>
                    </div>
                  </div>

                  {/* LEGEND */}
                  <div className="w-full max-w-[240px] space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.name}
                        className="flex items-center justify-between gap-5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{
                              backgroundColor: service.color,
                            }}
                          />

                          <span className="truncate text-sm text-gray-600">
                            {service.name}
                          </span>
                        </div>

                        <span className="text-sm font-semibold text-gray-700">
                          {service.value.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EXTRA REPORT CARDS */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="report-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average Paid Amount
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {money(averagePaidAmount)}
              </p>

              <p className="mt-2 text-xs text-green-600">
                Average per successful payment
              </p>
            </div>

            <div className="report-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Pending Payments
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {money(summary.pendingPaymentAmount)}
              </p>

              <p className="mt-2 text-xs text-orange-600">
                Amount to be collected from approved bills
              </p>
            </div>

            <div className="report-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Successful Payments
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {summary.paidPaymentCount}
              </p>

              <p className="mt-2 text-xs text-green-600">
                Verified UPI and confirmed Cash
              </p>
            </div>
          </div>

          {/* BOOKING STATUS */}
          <div className="report-card mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Booking Status Overview
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {report.bookingStatus.map((item) => (
                <div
                  key={item.status}
                  className="rounded-lg bg-[#f8f8f6] p-4"
                >
                  <p className="text-sm text-gray-500">
                    {item.status}
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MACHINE REPORT */}
          <div className="report-card mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Truck size={20} className="text-yellow-600" />
              Machine-wise Bookings
            </h2>

            {report.machineReport.length === 0 ? (
              <p className="text-sm text-gray-400">
                No machine data available.
              </p>
            ) : (
              <div className="space-y-4">
                {report.machineReport.map((item) => (
                  <div key={item.machine}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.machine}
                      </span>

                      <span className="font-semibold text-gray-900">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-yellow-500"
                        style={{
                          width: `${
                            totalMachineBookings
                              ? (item.count / totalMachineBookings) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OPERATOR REPORT */}
          <div className="report-card mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Users size={20} className="text-yellow-600" />
              Operator Performance
            </h2>

            {report.operatorReport.length === 0 ? (
              <p className="text-sm text-gray-400">
                No operator data available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="px-3 py-3">Operator</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3 text-center">Assigned Jobs</th>
                      <th className="px-3 py-3 text-right">Completed Jobs</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.operatorReport.map((item) => (
                      <tr
                        key={item.operatorId}
                        className="border-b border-gray-100"
                      >
                        <td className="px-3 py-4 font-medium text-gray-900">
                          {item.username}
                        </td>

                        <td className="px-3 py-4 text-gray-500">
                          {item.email || "-"}
                        </td>

                        <td className="px-3 py-4 text-center text-gray-700">
                          {item.assignedJobs}
                        </td>

                        <td className="px-3 py-4 text-right font-semibold text-green-600">
                          {item.completedJobs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
