import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  X,
  CalendarDays,
  MapPin,
  Truck,
  UserRound,
  Printer,
  Receipt,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useParams } from "react-router-dom";

const API = "http://localhost:5000/api";

const today = new Date().toISOString().split("T")[0];

const emptyBill = (job) => ({
  startingReading: "",
  closingReading: "",
  amount: "",
  shiftingCharge: "",
  tipper: "",
  batta: "",
  siteName: job?.location || "",
  billDate: today,
});

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

function formatJob(booking) {
  return {
    ...booking,
    id: `BM${booking._id.slice(-6).toUpperCase()}`,
    customer:
      booking.userId?.username ||
      booking.userId?.email ||
      "Customer",
    machine: booking.machine || "-",
    service: booking.work || "-",
    date: formatDate(booking.date),
    location: booking.location || "-",
    operator:
      booking.operatorId?.username ||
      booking.operatorId?.email ||
      "You",
    bill: booking.bill || null,
  };
}

export default function CreateBill() {
  const { id } = useParams();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [billData, setBillData] = useState(emptyBill(null));
  const [billMode, setBillMode] = useState("create");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("operatorToken");

  const fetchCompletedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API}/bills/completed-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load completed jobs");
      }

      const bookings = data.jobs || [];
      setJobs(bookings.map(formatJob));
    } catch (error) {
      console.error("Completed jobs error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  // If navigated from Complete Jobs with MongoDB booking ID
  useEffect(() => {
    if (!id || jobs.length === 0) return;

    const matchedJob = jobs.find((job) => job._id === id);

    if (matchedJob) {
      handleSelectJob(matchedJob);
    }
  }, [id, jobs]);

  const filteredJobs = jobs.filter((job) =>
    [
      job.id,
      job.customer,
      job.machine,
      job.service,
      job.location,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const totalHours = useMemo(() => {
    if (
      billData.startingReading === "" ||
      billData.closingReading === ""
    ) {
      return "0.00";
    }

    const start = Number(billData.startingReading);
    const end = Number(billData.closingReading);

    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
      return "0.00";
    }

    return (end - start).toFixed(2);
  }, [billData.startingReading, billData.closingReading]);

  const totalAmount = useMemo(() => {
    return (
      Number(billData.amount || 0) +
      Number(billData.shiftingCharge || 0) +
      Number(billData.tipper || 0) +
      Number(billData.batta || 0)
    );
  }, [billData]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);

    if (job.bill) {
      setBillData({
        startingReading: String(job.bill.startingReading ?? ""),
        closingReading: String(job.bill.closingReading ?? ""),
        amount: String(job.bill.amount ?? ""),
        shiftingCharge: String(job.bill.shiftingCharge ?? ""),
        tipper: String(job.bill.tipper ?? ""),
        batta: String(job.bill.batta ?? ""),
        siteName: job.bill.siteName || job.location,
        billDate: job.bill.billDate || today,
      });

      setBillMode("view");
    } else {
      setBillData(emptyBill(job));
      setBillMode("create");
    }
  };

  const handleChange = (field, value) => {
    setBillData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateBill = async () => {
    if (!selectedJob) return;

    if (
      billData.startingReading === "" ||
      billData.closingReading === "" ||
      billData.amount === ""
    ) {
      alert("Please enter Starting Reading, Closing Reading and Amount.");
      return;
    }

    const start = Number(billData.startingReading);
    const end = Number(billData.closingReading);
    const amount = Number(billData.amount);

    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      !Number.isFinite(amount) ||
      start < 0 ||
      end < 0 ||
      amount < 0
    ) {
      alert("Please enter valid positive numbers.");
      return;
    }

    if (end < start) {
      alert("Closing Reading cannot be less than Starting Reading.");
      return;
    }

    const optionalAmounts = [
      billData.shiftingCharge,
      billData.tipper,
      billData.batta,
    ];

    if (
      optionalAmounts.some(
        (value) => !Number.isFinite(Number(value)) || Number(value) < 0
      )
    ) {
      alert("Please enter valid extra charges.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        bookingId: selectedJob._id,
        startingReading: start,
        closingReading: end,
        amount,
        shiftingCharge: Number(billData.shiftingCharge || 0),
        tipper: Number(billData.tipper || 0),
        batta: Number(billData.batta || 0),
        siteName: billData.siteName,
        billDate: billData.billDate,
      };

      const isEditing = billMode === "edit";
      const existingBillId = selectedJob.bill?._id;

      const response = await fetch(
        isEditing
          ? `${API}/bills/${existingBillId}`
          : `${API}/bills`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save bill");
      }

      alert(
        isEditing
          ? "Bill updated successfully!"
          : "Bill created successfully!"
      );

      // Refresh jobs to get saved bill from database
      await fetchCompletedJobs();

      const savedBill = data.bill;

      setSelectedJob((prev) => ({
        ...prev,
        bill: savedBill,
      }));

      setBillMode("view");
    } catch (error) {
      console.error("Save bill error:", error);
      alert(error.message || "Bill save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseForm = () => {
    setSelectedJob(null);
    setBillMode("create");
    setBillData(emptyBill(null));
  };

  const handleEditBill = () => {
    setBillMode("edit");
  };

  const handlePrint = () => {
    window.print();
  };

  const isReadOnly = billMode === "view";

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 print:hidden">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-yellow-700">
          Operator / Billing
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          Create Bill
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Select completed jobs and create customer bills.
        </p>
      </div>

      {/* Completed Jobs */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm print:hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Completed Jobs Lists
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a completed job to create its bill.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative w-full sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search completed jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-500"
              />
            </div>

            <button
              onClick={fetchCompletedJobs}
              disabled={loading}
              className="rounded-xl border border-gray-200 px-3 text-gray-600 hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Booking ID",
                  "Customer",
                  "Machine",
                  "Service",
                  "Date",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 text-xs font-bold uppercase text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Loading completed jobs...
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-5 text-sm font-bold text-gray-900">
                      {job.id}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-gray-800">
                      {job.customer}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {job.machine}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {job.service}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {job.date}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {!job.bill ? (
                          <button
                            onClick={() => handleSelectJob(job)}
                            className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-600"
                          >
                            <FileText size={16} />
                            Create Bill
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSelectJob(job)}
                            className="rounded-lg bg-blue-100 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-200"
                          >
                            View Bill
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredJobs.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            No completed jobs found.
          </div>
        )}

        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-500">
            Showing {filteredJobs.length} completed jobs
          </p>
        </div>
      </div>

      {/* Bill Form */}
      {selectedJob && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5 print:hidden">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">
                Billing Section
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {billMode === "view"
                  ? "View Bill"
                  : billMode === "edit"
                  ? "Edit Bill"
                  : "Create Bill"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Booking ID: {selectedJob.id}
              </p>
            </div>

            <button
              onClick={handleCloseForm}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mx-auto max-w-3xl border-2 border-gray-300 bg-white p-4 sm:p-8">
              {/* Company Header */}
              <div className="border-b-2 border-gray-800 pb-5 text-center">
                <h2 className="text-3xl font-extrabold tracking-widest text-gray-900">
                  BISMI
                </h2>
                <p className="mt-1 text-sm font-bold tracking-wider text-gray-800">
                  EARTH MOVERS
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-600">
                  PADINHATTUMMURI
                </p>
                <p className="mt-3 text-xs text-gray-600">
                  Earth Moving & Excavation Services
                </p>
              </div>

              {/* Bill Date and Site */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-300 py-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    Bill No.
                  </label>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {selectedJob.id}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    Date
                  </label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    value={billData.billDate}
                    onChange={(e) =>
                      handleChange("billDate", e.target.value)
                    }
                    className="mt-1 w-full border-b border-gray-300 bg-transparent py-1 text-sm outline-none disabled:opacity-70"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Site Name
                  </label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={billData.siteName}
                    onChange={(e) =>
                      handleChange("siteName", e.target.value)
                    }
                    placeholder="Enter site name"
                    className="mt-1 w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none disabled:opacity-70"
                  />
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 gap-4 border-b border-gray-300 py-4 sm:grid-cols-2">
                <Info
                  label="Customer"
                  value={selectedJob.customer}
                  icon={<UserRound size={16} />}
                />
                <Info
                  label="Machine"
                  value={selectedJob.machine}
                  icon={<Truck size={16} />}
                />
                <Info
                  label="Location"
                  value={selectedJob.location}
                  icon={<MapPin size={16} />}
                />
                <Info
                  label="Service"
                  value={selectedJob.service}
                  icon={<CalendarDays size={16} />}
                />
                <Info
                  label="Operator"
                  value={selectedJob.operator}
                  icon={<UserRound size={16} />}
                />
                <Info
                  label="Booking Date"
                  value={selectedJob.date}
                  icon={<CalendarDays size={16} />}
                />
              </div>

              {/* Bill Inputs */}
              <div className="py-5">
                <h3 className="mb-4 text-center text-base font-bold uppercase tracking-wider text-gray-900">
                  Work Details & Amount
                </h3>

                <div className="overflow-hidden border border-gray-800">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-gray-300">
                      <BillInputRow
                        label="Starting Reading"
                        value={billData.startingReading}
                        onChange={(v) => handleChange("startingReading", v)}
                        disabled={isReadOnly}
                      />

                      <BillInputRow
                        label="Closing Reading"
                        value={billData.closingReading}
                        onChange={(v) => handleChange("closingReading", v)}
                        disabled={isReadOnly}
                      />

                      <tr>
                        <td className="w-[45%] border-r border-gray-800 bg-gray-50 px-3 py-3 text-sm font-semibold">
                          Total Hours
                        </td>
                        <td className="px-3 py-3 text-sm font-bold">
                          {totalHours} Hours
                        </td>
                      </tr>

                      <BillInputRow
                        label="Amount (₹)"
                        value={billData.amount}
                        onChange={(v) => handleChange("amount", v)}
                        disabled={isReadOnly}
                      />

                      <BillInputRow
                        label="Shifting Charge (₹)"
                        value={billData.shiftingCharge}
                        onChange={(v) => handleChange("shiftingCharge", v)}
                        disabled={isReadOnly}
                      />

                      <BillInputRow
                        label="Tipper (₹)"
                        value={billData.tipper}
                        onChange={(v) => handleChange("tipper", v)}
                        disabled={isReadOnly}
                      />

                      <BillInputRow
                        label="Batta (₹)"
                        value={billData.batta}
                        onChange={(v) => handleChange("batta", v)}
                        disabled={isReadOnly}
                      />

                      <tr className="bg-gray-100">
                        <td className="border-r border-gray-800 px-3 py-4 text-sm font-extrabold">
                          Total Amount
                        </td>
                        <td className="px-3 py-4 text-lg font-extrabold">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature */}
              <div className="flex justify-end pt-10">
                <div className="w-44 border-t border-gray-800 pt-2 text-center">
                  <p className="text-xs font-semibold text-gray-700">
                    Operator Signature
                  </p>
                </div>
              </div>

              {billMode === "view" && (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700 print:hidden">
                  <CheckCircle2 size={17} />
                  Bill Created Successfully
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-end print:hidden">
              <button
                onClick={handleCloseForm}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back to Jobs
              </button>

              {(billMode === "create" || billMode === "edit") && (
                <button
                  onClick={handleGenerateBill}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-black hover:bg-yellow-600 disabled:opacity-60"
                >
                  <Receipt size={17} />
                  {saving
                    ? "Saving..."
                    : billMode === "edit"
                    ? "Update Bill"
                    : "Generate Bill"}
                </button>
              )}

              {billMode === "view" && (
                <>
                  <button
                    onClick={handleEditBill}
                    className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-black hover:bg-yellow-600"
                  >
                    Edit Bill
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
                  >
                    <Printer size={17} />
                    Print Bill
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-bold text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function BillInputRow({ label, value, onChange, disabled = false }) {
  return (
    <tr>
      <td className="w-[45%] border-r border-gray-800 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-800">
        {label}
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter value"
          className="w-full min-w-0 bg-transparent py-1 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-b focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </td>
    </tr>
  );
}