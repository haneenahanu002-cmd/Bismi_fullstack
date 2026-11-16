import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  FileText,
  Wallet,
  Clock,
  CheckCircle2,
  Truck,
  Filter,
  RefreshCw,
  X,
  Eye,
  Calculator,
} from "lucide-react";

const API = axios.create({
  baseURL: "https://bismiserver.onrender.com/api",
});

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const dateFormat = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getName = (value) => {
  if (!value) return "-";
  if (typeof value === "object") {
    return (
      value.username ||
      value.name ||
      value.machineName ||
      value.serviceName ||
      "-"
    );
  }
  return String(value);
};

const statusStyle = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Paid: "bg-green-50 text-green-700 border-green-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const formatBill = (bill) => {
  const booking =
    bill.bookingId && typeof bill.bookingId === "object"
      ? bill.bookingId
      : {};

  const user =
    bill.userId && typeof bill.userId === "object"
      ? bill.userId
      : {};

  const operator =
    bill.operatorId && typeof bill.operatorId === "object"
      ? bill.operatorId
      : {};

  return {
    _id: bill._id,
    id: `INV-${String(bill._id).slice(-6).toUpperCase()}`,
    operator: getName(operator),
    customer: user.username || booking.customerName || "-",
    job:
      booking.service ||
      booking.serviceName ||
      booking.serviceType ||
      "-",
    date: bill.billDate || bill.createdAt,
    total: Number(bill.adminFinalAmount ?? bill.totalAmount ?? 0),
    originalTotal: Number(bill.totalAmount || 0),
    status: bill.approvalStatus || "Pending",
    phone: user.phone || "-",
    machine:
      booking.machineName ||
      getName(booking.machine) ||
      booking.machineType ||
      "-",
    location: booking.location || user.location || "-",
    start: Number(bill.startingReading || 0),
    end: Number(bill.closingReading || 0),
    hours: Number(
      bill.totalHours ??
        Number(bill.closingReading || 0) -
          Number(bill.startingReading || 0)
    ),
    amount: Number(bill.amount || 0),
    shiftingCharge: Number(bill.shiftingCharge || 0),
    tipper: Number(bill.tipper || 0),
    batta: Number(bill.batta || 0),
    adminNote: bill.adminNote || "",
  };
};

const formatJob = (job) => {
  const user =
    job.userId && typeof job.userId === "object"
      ? job.userId
      : {};

  const operator =
    job.operatorId && typeof job.operatorId === "object"
      ? job.operatorId
      : {};

  const customerBill = job.customerBill || null;
  const wageBill = job.operatorWageBill || null;

  const hours = customerBill
    ? Number(
        customerBill.totalHours ??
          Number(customerBill.closingReading || 0) -
            Number(customerBill.startingReading || 0)
      )
    : 0;

  return {
    _id: job._id,
    operatorId: operator._id || job.operatorId,
    operator: getName(operator),
    customer: user.username || job.customerName || "-",
    phone: user.phone || "-",
    job:
      job.service ||
      job.serviceName ||
      job.serviceType ||
      "Machine Service",
    machine:
      job.machineName ||
      getName(job.machine) ||
      job.machineType ||
      "-",
    location: job.location || user.location || "-",
    date: job.updatedAt || job.date || job.createdAt,
    hours,
    hasCustomerBill: Boolean(customerBill),
    wageBill: wageBill
      ? {
          _id: wageBill._id,
          hours: Number(wageBill.workingHours || 0),
          rate: Number(wageBill.ratePerHour || 0),
          total: Number(wageBill.totalAmount || 0),
          status: wageBill.paymentStatus || "Pending",
          date: wageBill.paymentDate,
          method: wageBill.paymentMethod,
          transaction: wageBill.transactionId || "",
        }
      : null,
  };
};

export default function OperatorBillsPayments() {
  const [activeTab, setActiveTab] = useState("bills");
  const [bills, setBills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [wageBills, setWageBills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedWageBill, setSelectedWageBill] = useState(null);

  const [createModal, setCreateModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const [saving, setSaving] = useState(false);

  const [ratePerHour, setRatePerHour] = useState("");

  const [paymentForm, setPaymentForm] = useState({
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "Bank Transfer",
    transactionId: "",
  });

  // ======================================
  // FETCH ALL DATABASE DATA
  // ======================================
  const fetchAllData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      setError("");

      const [billResponse, jobResponse, wageResponse] =
        await Promise.all([
          API.get("/bills/admin/all", config()),
          API.get("/operator-wages/admin/completed-jobs", config()),
          API.get("/operator-wages/admin/all", config()),
        ]);

      const billData = billResponse.data;
      const jobData = jobResponse.data;
      const wageData = wageResponse.data;

      const billList = Array.isArray(billData)
        ? billData
        : billData.bills || billData.data || [];

      const jobList = Array.isArray(jobData)
        ? jobData
        : jobData.jobs || jobData.data || [];

      const wageList = Array.isArray(wageData)
        ? wageData
        : wageData.wageBills || wageData.data || [];

      setBills(billList.map(formatBill));
      setJobs(jobList.map(formatJob));

      setWageBills(
        wageList.map((item) => {
          const operator =
            item.operatorId &&
            typeof item.operatorId === "object"
              ? item.operatorId
              : {};

          const booking =
            item.bookingId &&
            typeof item.bookingId === "object"
              ? item.bookingId
              : {};

          return {
            _id: item._id,
            id: `OW-${String(item._id).slice(-6).toUpperCase()}`,
            bookingId: booking._id || item.bookingId,
            operator: getName(operator),
            job:
              booking.service ||
              booking.serviceName ||
              booking.serviceType ||
              "Machine Service",
            hours: Number(item.workingHours || 0),
            rate: Number(item.ratePerHour || 0),
            amount: Number(item.totalAmount || 0),
            status: item.paymentStatus || "Pending",
            date: item.createdAt,
            paymentDate: item.paymentDate,
            method: item.paymentMethod || "-",
            transaction: item.transactionId || "-",
          };
        })
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load data. Check server and admin login."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }

    fetchAllData();
  }, []);

  // ======================================
  // FILTERING
  // ======================================
  const filteredBills = useMemo(
    () =>
      bills.filter((bill) => {
        const text = [
          bill.id,
          bill.operator,
          bill.customer,
          bill.job,
          bill.machine,
        ]
          .join(" ")
          .toLowerCase();

        return (
          text.includes(search.toLowerCase()) &&
          (filter === "All" || bill.status === filter)
        );
      }),
    [bills, search, filter]
  );

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const text = [
          job.operator,
          job.customer,
          job.job,
          job.machine,
          job.location,
        ]
          .join(" ")
          .toLowerCase();

        const status = job.wageBill
          ? job.wageBill.status
          : "Pending";

        return (
          text.includes(search.toLowerCase()) &&
          (filter === "All" || status === filter)
        );
      }),
    [jobs, search, filter]
  );

  const filteredWageBills = useMemo(
    () =>
      wageBills.filter((bill) => {
        const text = [
          bill.id,
          bill.operator,
          bill.job,
          bill.transaction,
        ]
          .join(" ")
          .toLowerCase();

        return (
          text.includes(search.toLowerCase()) &&
          (filter === "All" || bill.status === filter)
        );
      }),
    [wageBills, search, filter]
  );

  // ======================================
  // SUMMARY
  // ======================================
  const pendingBills = bills.filter(
    (bill) => bill.status === "Pending"
  ).length;

  const approvedBills = bills.filter(
    (bill) => bill.status === "Approved"
  ).length;

  const totalPaid = wageBills
    .filter((bill) => bill.status === "Paid")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const unpaidWageBills = wageBills.filter(
    (bill) => bill.status === "Pending"
  ).length;

  const jobsWithoutWageBill = jobs.filter(
    (job) => !job.wageBill
  ).length;

  // ======================================
  // CREATE OPERATOR WAGE BILL
  // ======================================
  const openCreateModal = (job) => {
    if (!job.hasCustomerBill || job.hours <= 0) {
      alert(
        "Customer bill and valid working hours are required before creating the operator wage bill."
      );
      return;
    }

    setSelectedJob(job);
    setRatePerHour("");
    setCreateModal(true);
  };

  const createWageBill = async (e) => {
    e.preventDefault();

    if (!selectedJob) return;

    const rate = Number(ratePerHour);

    if (!Number.isFinite(rate) || rate <= 0) {
      alert("Please enter a valid hourly wage.");
      return;
    }

    try {
      setSaving(true);

      await API.post(
        "/operator-wages/admin/create",
        {
          bookingId: selectedJob._id,
          ratePerHour: rate,
        },
        config()
      );

      setCreateModal(false);
      setSelectedJob(null);
      setRatePerHour("");

      await fetchAllData();

      alert("Operator wage bill created successfully.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to create operator wage bill."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // OPEN PAYMENT MODAL
  // ======================================
  const openPaymentModal = (bill) => {
    setSelectedWageBill(bill);

    setPaymentForm({
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: "Bank Transfer",
      transactionId: "",
    });

    setPaymentModal(true);
  };

  // ======================================
  // PROCESS OPERATOR WAGE PAYMENT
  // ======================================
  const processPayment = async (e) => {
    e.preventDefault();

    if (!selectedWageBill) return;

    try {
      setSaving(true);

      await API.patch(
        `/operator-wages/admin/${selectedWageBill._id}/pay`,
        paymentForm,
        config()
      );

      setPaymentModal(false);
      setSelectedWageBill(null);

      await fetchAllData();

      alert("Operator payment completed successfully.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to process operator payment."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] p-5">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <h2 className="text-xl font-bold text-[#0B1D2B]">
            Admin Login Required
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please login to manage operator bills and payments.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
        <RefreshCw className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-yellow-600">
              ADMIN MANAGEMENT
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
              Operator Bills & Payments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer bills and operator wages separately.
            </p>
          </div>

          <button
            onClick={() => fetchAllData(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0B1D2B] px-5 py-3 font-semibold text-white hover:bg-[#17384D] disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => fetchAllData(true)}
              className="ml-3 font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Customer Bills"
            value={bills.length}
            icon={<FileText />}
            color="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            title="Pending Customer Bills"
            value={pendingBills}
            icon={<Clock />}
            color="bg-amber-50 text-amber-600"
          />
          <SummaryCard
            title="Approved Customer Bills"
            value={approvedBills}
            icon={<CheckCircle2 />}
            color="bg-green-50 text-green-600"
          />
          <SummaryCard
            title="Operator Wages Paid"
            value={money(totalPaid)}
            icon={<Wallet />}
            color="bg-purple-50 text-purple-600"
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2">
          <TabButton
            active={activeTab === "bills"}
            onClick={() => {
              setActiveTab("bills");
              setFilter("All");
              setSearch("");
            }}
            icon={<FileText size={17} />}
          >
            Customer Bills
          </TabButton>

          <TabButton
            active={activeTab === "jobs"}
            onClick={() => {
              setActiveTab("jobs");
              setFilter("All");
              setSearch("");
            }}
            icon={<Truck size={17} />}
          >
            Completed Jobs ({jobs.length})
          </TabButton>

          <TabButton
            active={activeTab === "payments"}
            onClick={() => {
              setActiveTab("payments");
              setFilter("All");
              setSearch("");
            }}
            icon={<Wallet size={17} />}
          >
            Operator Wage Bills ({wageBills.length})
          </TabButton>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search operator, customer, job..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={17} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
            >
              <option value="All">All Status</option>
              {activeTab === "bills" && (
                <>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
              {(activeTab === "jobs" || activeTab === "payments") && (
                <>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* CUSTOMER BILLS */}
        {activeTab === "bills" && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-[#0B1D2B]">
                Operator Submitted Customer Bills
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Customer bill amounts are separate from operator wages.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Bill ID</th>
                    <th className="px-5 py-4">Operator</th>
                    <th className="px-5 py-4">Customer / Job</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-[#0B1D2B]">
                        {bill.id}
                      </td>
                      <td className="px-5 py-4">{bill.operator}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{bill.customer}</p>
                        <p className="text-xs text-gray-500">{bill.job}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {dateFormat(bill.date)}
                      </td>
                      <td className="px-5 py-4 font-bold">
                        {money(bill.total)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={bill.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-[#0B1D2B] hover:border-yellow-400 hover:bg-yellow-50"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBills.length === 0 && (
                    <EmptyRow columns={7} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPLETED JOBS */}
        {activeTab === "jobs" && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-[#0B1D2B]">
                Completed Jobs
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Create a separate operator wage bill for each completed job.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Booking ID</th>
                    <th className="px-5 py-4">Operator</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Job / Machine</th>
                    <th className="px-5 py-4">Working Hours</th>
                    <th className="px-5 py-4">Wage Bill</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-[#0B1D2B]">
                        {String(job._id).slice(-6).toUpperCase()}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {job.operator}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{job.customer}</p>
                        <p className="text-xs text-gray-500">
                          {job.phone}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{job.job}</p>
                        <p className="text-xs text-gray-500">
                          {job.machine}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#0B1D2B]">
                        {job.hours > 0 ? `${job.hours} hrs` : "-"}
                      </td>
                      <td className="px-5 py-4">
                        {job.wageBill ? (
                          <div>
                            <StatusBadge status={job.wageBill.status} />
                            <p className="mt-1 font-bold">
                              {money(job.wageBill.total)}
                            </p>
                          </div>
                        ) : (
                          <StatusBadge status="Pending" />
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {job.wageBill ? (
                          <span className="text-xs font-semibold text-green-700">
                            Bill Created
                          </span>
                        ) : (
                          <button
                            onClick={() => openCreateModal(job)}
                            disabled={!job.hasCustomerBill || job.hours <= 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-3 py-2 text-xs font-bold text-[#0B1D2B] hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FileText size={15} />
                            Create Operator Bill
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredJobs.length === 0 && (
                    <EmptyRow columns={7} />
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
              {jobsWithoutWageBill} completed jobs are waiting for an operator wage bill.
            </div>
          </div>
        )}

        {/* OPERATOR WAGE BILLS / PAYMENTS */}
        {activeTab === "payments" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Total Wage Bills"
                value={wageBills.length}
                icon={<FileText />}
                color="bg-blue-50 text-blue-600"
              />
              <SummaryCard
                title="Payment Pending"
                value={unpaidWageBills}
                icon={<Clock />}
                color="bg-amber-50 text-amber-600"
              />
              <SummaryCard
                title="Total Paid"
                value={money(totalPaid)}
                icon={<Wallet />}
                color="bg-green-50 text-green-600"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-bold text-[#0B1D2B]">
                  Operator Wage Bill History
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Review wage bills and process pending payments.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Wage Bill ID</th>
                      <th className="px-5 py-4">Operator</th>
                      <th className="px-5 py-4">Working Hours</th>
                      <th className="px-5 py-4">Rate / Hour</th>
                      <th className="px-5 py-4">Total Wage</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Payment Date</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredWageBills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-semibold text-[#0B1D2B]">
                          {bill.id}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {bill.operator}
                        </td>
                        <td className="px-5 py-4">
                          {bill.hours} hrs
                        </td>
                        <td className="px-5 py-4">
                          {money(bill.rate)}
                        </td>
                        <td className="px-5 py-4 font-bold text-[#0B1D2B]">
                          {money(bill.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={bill.status} />
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {dateFormat(bill.paymentDate)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {bill.status === "Pending" ? (
                            <button
                              onClick={() => openPaymentModal(bill)}
                              className="rounded-lg bg-[#F5C518] px-3 py-2 text-xs font-bold text-[#0B1D2B] hover:bg-yellow-400"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-green-700">
                              Payment Done
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredWageBills.length === 0 && (
                      <EmptyRow columns={8} />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CUSTOMER BILL DETAILS MODAL */}
      {selectedBill && (
        <Modal
          title="Customer Bill Details"
          onClose={() => setSelectedBill(null)}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-500">Bill ID</p>
                <h3 className="mt-1 font-bold text-[#0B1D2B]">
                  {selectedBill.id}
                </h3>
              </div>
              <StatusBadge status={selectedBill.status} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Operator" value={selectedBill.operator} />
              <Detail label="Customer" value={selectedBill.customer} />
              <Detail label="Phone" value={selectedBill.phone} />
              <Detail label="Job" value={selectedBill.job} />
              <Detail label="Machine" value={selectedBill.machine} />
              <Detail label="Location" value={selectedBill.location} />
              <Detail
                label="Starting Reading"
                value={`${selectedBill.start} hrs`}
              />
              <Detail
                label="Closing Reading"
                value={`${selectedBill.end} hrs`}
              />
              <Detail
                label="Working Hours"
                value={`${selectedBill.hours} hrs`}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <AmountDetail
                label="Work Amount"
                value={selectedBill.amount}
              />
              <AmountDetail
                label="Shifting Charge"
                value={selectedBill.shiftingCharge}
              />
              <AmountDetail
                label="Tipper"
                value={selectedBill.tipper}
              />
              <AmountDetail
                label="Batta"
                value={selectedBill.batta}
              />
              <div className="flex justify-between border-t pt-3 font-bold">
                <span>Customer Bill Total</span>
                <span>{money(selectedBill.total)}</span>
              </div>
            </div>

            <Detail
              label="Admin Note"
              value={selectedBill.adminNote || "No admin note"}
            />
          </div>
        </Modal>
      )}

      {/* CREATE OPERATOR WAGE BILL MODAL */}
      {createModal && selectedJob && (
        <Modal
          title="Create Operator Wage Bill"
          onClose={() => {
            if (!saving) {
              setCreateModal(false);
              setSelectedJob(null);
            }
          }}
        >
          <form onSubmit={createWageBill} className="space-y-5">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Completed Job</p>
              <h3 className="mt-1 font-bold text-[#0B1D2B]">
                {selectedJob.job}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Detail
                  label="Operator"
                  value={selectedJob.operator}
                />
                <Detail
                  label="Customer"
                  value={selectedJob.customer}
                />
                <Detail
                  label="Machine"
                  value={selectedJob.machine}
                />
                <Detail
                  label="Booking ID"
                  value={String(selectedJob._id).slice(-8)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                <Clock size={17} />
                Working Hours from Customer Bill
              </div>
              <h2 className="mt-2 text-3xl font-bold text-[#0B1D2B]">
                {selectedJob.hours} Hours
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                Calculated from closing reading minus starting reading.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Operator Wage Per Hour (₹)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={ratePerHour}
                onChange={(e) => setRatePerHour(e.target.value)}
                placeholder="Enter hourly wage"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
              />
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1D2B]">
                <Calculator size={17} />
                Wage Calculation
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-600">Working Hours</span>
                <span className="font-semibold">
                  {selectedJob.hours} hrs
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600">Rate Per Hour</span>
                <span className="font-semibold">
                  {money(ratePerHour)}
                </span>
              </div>

              <div className="mt-3 flex justify-between border-t border-yellow-200 pt-3">
                <span className="font-bold text-[#0B1D2B]">
                  Total Operator Wage
                </span>
                <span className="text-xl font-bold text-green-700">
                  {money(selectedJob.hours * Number(ratePerHour || 0))}
                </span>
              </div>
            </div>

            <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
              This creates an operator wage bill with Pending payment status.
              You can process the payment from the Operator Wage Bills tab.
              This amount is separate from the customer's bill.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setCreateModal(false);
                  setSelectedJob(null);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-[#F5C518] px-4 py-3 text-sm font-bold text-[#0B1D2B] hover:bg-yellow-400 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Wage Bill"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* PROCESS PAYMENT MODAL */}
      {paymentModal && selectedWageBill && (
        <Modal
          title="Process Operator Wage Payment"
          onClose={() => {
            if (!saving) {
              setPaymentModal(false);
              setSelectedWageBill(null);
            }
          }}
        >
          <form onSubmit={processPayment} className="space-y-5">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs text-gray-500">Operator</p>
              <h3 className="mt-1 font-bold text-[#0B1D2B]">
                {selectedWageBill.operator}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Detail
                  label="Working Hours"
                  value={`${selectedWageBill.hours} hrs`}
                />
                <Detail
                  label="Rate Per Hour"
                  value={money(selectedWageBill.rate)}
                />
              </div>

              <div className="mt-4 border-t border-green-200 pt-3">
                <p className="text-xs text-gray-500">
                  Total Operator Wage
                </p>
                <h2 className="mt-1 text-2xl font-bold text-green-700">
                  {money(selectedWageBill.amount)}
                </h2>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                required
                value={paymentForm.paymentDate}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentDate: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
              >
                <option>Bank Transfer</option>
                <option>UPI</option>
                <option>Cash</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Transaction / Reference ID
              </label>
              <input
                value={paymentForm.transactionId}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    transactionId: e.target.value,
                  })
                }
                placeholder="Optional transaction ID"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setPaymentModal(false);
                  setSelectedWageBill(null);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-[#F5C518] px-4 py-3 text-sm font-bold text-[#0B1D2B] hover:bg-yellow-400 disabled:opacity-50"
              >
                {saving ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ======================================
// REUSABLE COMPONENTS
// ======================================
function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          {React.cloneElement(icon, { size: 22 })}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#0B1D2B] text-white shadow-sm"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusStyle[status] ||
        "border-gray-200 bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}

function AmountDetail({ label, value }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-800">
        {money(value)}
      </span>
    </div>
  );
}

function EmptyRow({ columns }) {
  return (
    <tr>
      <td colSpan={columns} className="px-5 py-12 text-center">
        <FileText size={30} className="mx-auto text-gray-300" />
        <p className="mt-2 font-semibold text-gray-500">
          No records found
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Try changing your search or filter.
        </p>
      </td>
    </tr>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <h2 className="font-bold text-[#0B1D2B]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}