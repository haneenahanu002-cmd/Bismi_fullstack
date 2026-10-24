import { useState } from "react";
import {
  Search,
  FileText,
  Eye,
  X,
  Download,
  CalendarDays,
  MapPin,
  Truck,
  IndianRupee,
  CheckCircle2,
  Clock3,
} from "lucide-react";

export default function MyBills() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);

  const [bills] = useState([
    {
      id: "BILL-001",
      bookingId: "BK-001",
      machine: "JCB 3DX",
      workType: "Land Excavation",
      location: "Manjeri",
      date: "03 Oct 2026",
      hours: 6,
      rate: 800,
      amount: 4800,
      tax: 0,
      total: 4800,
      status: "Paid",
    },
    {
      id: "BILL-002",
      bookingId: "BK-002",
      machine: "JCB 4DX",
      workType: "Foundation Work",
      location: "Perinthalmanna",
      date: "29 Sep 2026",
      hours: 7,
      rate: 800,
      amount: 5600,
      tax: 0,
      total: 5600,
      status: "Paid",
    },
    {
      id: "BILL-003",
      bookingId: "BK-003",
      machine: "JCB 3DX",
      workType: "Site Cleaning",
      location: "Kondotty",
      date: "25 Sep 2026",
      hours: 5,
      rate: 800,
      amount: 4000,
      tax: 0,
      total: 4000,
      status: "Pending",
    },
    {
      id: "BILL-004",
      bookingId: "BK-004",
      machine: "JCB 4DX",
      workType: "Earth Moving",
      location: "Wandoor",
      date: "18 Sep 2026",
      hours: 7,
      rate: 800,
      amount: 5600,
      tax: 0,
      total: 5600,
      status: "Paid",
    },
    {
      id: "BILL-005",
      bookingId: "BK-005",
      machine: "JCB 3DX",
      workType: "Road Work",
      location: "Nilambur",
      date: "12 Sep 2026",
      hours: 5,
      rate: 800,
      amount: 4000,
      tax: 0,
      total: 4000,
      status: "Pending",
    },
  ]);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.id.toLowerCase().includes(search.toLowerCase()) ||
      bill.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      bill.machine.toLowerCase().includes(search.toLowerCase()) ||
      bill.workType.toLowerCase().includes(search.toLowerCase()) ||
      bill.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBills = bills.length;

  const paidAmount = bills
    .filter((bill) => bill.status === "Paid")
    .reduce((sum, bill) => sum + bill.total, 0);

  const pendingAmount = bills
    .filter((bill) => bill.status === "Pending")
    .reduce((sum, bill) => sum + bill.total, 0);

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const handleDownload = (bill) => {
    alert(`Download bill ${bill.id} - PDF generation will be connected later.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          My Bills
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage all your bills and invoices
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Bills */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Bills
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
                {totalBills}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Paid Amount
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                ₹{paidAmount.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Amount
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                ₹{pendingAmount.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Clock3 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Bills Section */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Search + Filter */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1D2B]">
              Bills & Invoices
            </h2>

            <p className="text-sm text-gray-500">
              Your billing history
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search bills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 sm:w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-yellow-400"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Bill ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Machine
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Work
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#0B1D2B]">
                      {bill.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.bookingId}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {bill.machine}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.workType}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {bill.date}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-[#0B1D2B]">
                      ₹{bill.total.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          bill.status
                        )}`}
                      >
                        {bill.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDownload(bill)}
                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 p-4 lg:hidden">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#0B1D2B]">
                      {bill.id}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Booking: {bill.bookingId}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      bill.status
                    )}`}
                  >
                    {bill.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Machine</p>
                    <p className="font-medium text-gray-700">
                      {bill.machine}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Work</p>
                    <p className="font-medium text-gray-700">
                      {bill.workType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="font-medium text-gray-700">
                      {bill.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="font-bold text-[#0B1D2B]">
                      ₹{bill.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => setSelectedBill(bill)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={() => handleDownload(bill)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-yellow-500"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">
              No bills found.
            </div>
          )}
        </div>
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Bill Details
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedBill.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBill(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bill Content */}
            <div className="p-5">
              {/* Company */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h3 className="text-xl font-bold text-[#0B1D2B]">
                    Bismi Earth Movers
                  </h3>

                  <p className="text-sm text-gray-500">
                    JCB & Earth Moving Services
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Malappuram, Kerala
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">Bill Number</p>

                  <p className="font-bold text-[#0B1D2B]">
                    {selectedBill.id}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Booking: {selectedBill.bookingId}
                  </p>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Truck size={19} className="text-yellow-600" />

                  <div>
                    <p className="text-xs text-gray-400">Machine</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.machine}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={19} className="text-yellow-600" />

                  <div>
                    <p className="text-xs text-gray-400">Work Type</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.workType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={19} className="text-yellow-600" />

                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={19} className="text-yellow-600" />

                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedBill.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Machine Service
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{selectedBill.amount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Working Hours
                  </span>

                  <span className="font-medium text-gray-800">
                    {selectedBill.hours} hrs
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Rate / Hour
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{selectedBill.rate.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 p-4 text-sm">
                  <span className="text-gray-500">
                    Tax
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹{selectedBill.tax.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4">
                  <span className="font-bold text-[#0B1D2B]">
                    Total Amount
                  </span>

                  <span className="flex items-center gap-1 text-xl font-bold text-[#0B1D2B]">
                    <IndianRupee size={18} />
                    {selectedBill.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Payment Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedBill.status
                  )}`}
                >
                  {selectedBill.status}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

                <button
                  onClick={() => handleDownload(selectedBill)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-yellow-500"
                >
                  <Download size={17} />
                  Download Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}