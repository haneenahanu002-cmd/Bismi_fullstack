
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Eye,
  ArrowLeft,
  Printer,
  Pencil,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  RefreshCw,
} from "lucide-react";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

  const finalAmount =
    bill.adminFinalAmount !== null &&
    bill.adminFinalAmount !== undefined
      ? Number(bill.adminFinalAmount)
      : Number(bill.totalAmount || 0);

  const statusMap = {
    Pending: "Pending Approval",
    Approved: "Approved",
    Rejected: "Rejected",
  };

  return {
    _id: bill._id,

    id: `INV-${String(bill._id || "")
      .slice(-6)
      .toUpperCase()}`,

    bookingId: booking._id || bill.bookingId || "-",

    customer:
      user.username ||
      booking.customerName ||
      booking.username ||
      "-",

    phone: user.phone || booking.phone || "-",

    email: user.email || booking.email || "-",

    service:
      booking.service ||
      booking.serviceName ||
      booking.serviceType ||
      "-",

    machine:
      booking.machineName ||
      booking.machine ||
      booking.machineType ||
      "-",

    location:
      booking.location ||
      booking.siteLocation ||
      user.location ||
      "-",

    operator:
      operator.username ||
      operator.name ||
      "-",

    bookingDate:
      booking.date ||
      booking.bookingDate ||
      null,

    billDate:
      bill.billDate ||
      bill.createdAt ||
      null,

    siteName: bill.siteName || "-",

    startingReading: Number(bill.startingReading || 0),

    closingReading: Number(bill.closingReading || 0),

    totalHours: Number(
      bill.totalHours ??
        Number(bill.closingReading || 0) -
          Number(bill.startingReading || 0)
    ),

    amount: Number(bill.amount || 0),

    shiftingCharge: Number(bill.shiftingCharge || 0),

    tipper: Number(bill.tipper || 0),

    batta: Number(bill.batta || 0),

    originalTotal: Number(bill.totalAmount || 0),

    total: finalAmount,

    approvalStatus: bill.approvalStatus || "Pending",

    status:
      statusMap[bill.approvalStatus] ||
      "Pending Approval",

    adminNote: bill.adminNote || "",

    rejectionReason: bill.rejectionReason || "",
  };
};

const statusStyle = (status) => {
  if (status === "Approved") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-800";
};

export default function Bills() {
  const [bills, setBills] = useState([]);

  const [selectedBill, setSelectedBill] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [isEditing, setIsEditing] = useState(false);

  const [finalAmount, setFinalAmount] = useState("");

  const [adminNote, setAdminNote] = useState("");

  const [rejectionReason, setRejectionReason] = useState("");

  const [saving, setSaving] = useState(false);

  const [actionError, setActionError] = useState("");

  // ================= FETCH BILLS =================

  const fetchBills = async () => {
    try {
      setError("");

      const response = await API.get(
        "/bills/admin/all",
        getAuthConfig()
      );

      const responseData = response.data;

      const billList = Array.isArray(responseData)
        ? responseData
        : responseData.bills ||
          responseData.data ||
          [];

      const formattedBills = billList.map(formatBill);

      setBills(formattedBills);

      return formattedBills;
    } catch (err) {
      console.error("Fetch bills error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bills. Please check your login and server."
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ================= SUMMARY =================

  const pendingCount = bills.filter(
    (bill) => bill.approvalStatus === "Pending"
  ).length;

  const approvedCount = bills.filter(
    (bill) => bill.approvalStatus === "Approved"
  ).length;

  const rejectedCount = bills.filter(
    (bill) => bill.approvalStatus === "Rejected"
  ).length;

  const totalBillAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.total || 0),
    0
  );

  // ================= SEARCH & FILTER =================

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchesSearch = [
        bill.id,
        bill.customer,
        bill.operator,
        bill.service,
        bill.siteName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        bill.approvalStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [bills, search, filter]);

  // ================= OPEN BILL =================

  const openBill = (bill) => {
    setSelectedBill(bill);

    setFinalAmount(String(bill.total));

    setAdminNote(bill.adminNote || "");

    setRejectionReason(bill.rejectionReason || "");

    setIsEditing(false);

    setActionError("");
  };

  const closeBill = () => {
    setSelectedBill(null);

    setIsEditing(false);

    setActionError("");
  };

  // ================= EDIT BILL =================

  const startEditing = () => {
    if (
      !selectedBill ||
      selectedBill.approvalStatus !== "Pending"
    ) {
      return;
    }

    setFinalAmount(String(selectedBill.total));

    setAdminNote(selectedBill.adminNote || "");

    setIsEditing(true);

    setActionError("");
  };

  const cancelEditing = () => {
    setFinalAmount(String(selectedBill.total));

    setAdminNote(selectedBill.adminNote || "");

    setIsEditing(false);

    setActionError("");
  };

  // ================= SAVE EDIT =================

  const saveEdit = async () => {
    if (!selectedBill) return;

    const amount = Number(finalAmount);

    if (
      finalAmount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setActionError("Please enter a valid total amount.");

      return;
    }

    try {
      setSaving(true);

      setActionError("");

      await API.put(
        `/bills/admin/${selectedBill._id}`,
        {
          finalAmount: amount,
          adminNote,
        },
        getAuthConfig()
      );

      const updatedBills = await fetchBills();

      const updatedBill = updatedBills.find(
        (bill) => bill._id === selectedBill._id
      );

      if (updatedBill) {
        setSelectedBill(updatedBill);

        setFinalAmount(String(updatedBill.total));

        setAdminNote(updatedBill.adminNote || "");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Save bill error:", err);

      setActionError(
        err.response?.data?.message ||
          "Unable to save bill changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= APPROVE BILL =================

  const approveBill = async () => {
    if (!selectedBill) return;

    const amount = Number(finalAmount);

    if (
      finalAmount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setActionError("Please enter a valid final amount.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this bill?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      setActionError("");

      // Save admin final amount first
      await API.put(
        `/bills/admin/${selectedBill._id}`,
        {
          finalAmount: amount,
          adminNote,
        },
        getAuthConfig()
      );

      // Approve bill
      await API.patch(
        `/bills/admin/${selectedBill._id}/approve`,
        {},
        getAuthConfig()
      );

      const updatedBills = await fetchBills();

      const updatedBill = updatedBills.find(
        (bill) => bill._id === selectedBill._id
      );

      if (updatedBill) {
        setSelectedBill(updatedBill);

        setFinalAmount(String(updatedBill.total));

        setAdminNote(updatedBill.adminNote || "");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Approve bill error:", err);

      setActionError(
        err.response?.data?.message ||
          "Unable to approve bill."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= REJECT BILL =================

  const rejectBill = async () => {
    if (!selectedBill) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      setActionError("Please enter a rejection reason.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this bill?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      setActionError("");

      await API.patch(
        `/bills/admin/${selectedBill._id}/reject`,
        {
          rejectionReason: reason,
        },
        getAuthConfig()
      );

      const updatedBills = await fetchBills();

      const updatedBill = updatedBills.find(
        (bill) => bill._id === selectedBill._id
      );

      if (updatedBill) {
        setSelectedBill(updatedBill);

        setRejectionReason(
          updatedBill.rejectionReason || ""
        );
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Reject bill error:", err);

      setActionError(
        err.response?.data?.message ||
          "Unable to reject bill."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= PRINT =================

  const printBill = () => {
    window.print();
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw
            className="animate-spin mx-auto text-yellow-500"
            size={32}
          />

          <p className="mt-3 text-gray-600">
            Loading bills...
          </p>
        </div>
      </div>
    );
  }

  // ================= LOGIN CHECK =================

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Admin Login Required
          </h2>

          <p className="text-gray-500 mt-2">
            Please login to view and manage bills.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // BILL VIEW PAGE
  // =====================================================

  if (selectedBill) {
    const bill = selectedBill;

    const isPending =
      bill.approvalStatus === "Pending";

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }

            body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body * {
              visibility: hidden !important;
            }

            .print-area,
            .print-area * {
              visibility: visible !important;
            }

            .print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 15px !important;
              box-shadow: none !important;
              border: none !important;
            }

            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* TOP BUTTONS */}

        <div className="max-w-4xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            onClick={closeBill}
            className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Bills
          </button>

          <div className="flex flex-wrap gap-2">
            {isPending && !isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold"
              >
                <Pencil size={17} />
                Edit Bill
              </button>
            )}

            {isEditing && (
              <>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
                >
                  <X size={17} />
                  Cancel
                </button>
              </>
            )}

            <button
              onClick={printBill}
              className="flex items-center gap-2 bg-[#0B1D2B] hover:bg-[#18354a] text-white px-4 py-2 rounded-lg font-semibold"
            >
              <Printer size={17} />
              Print / Save PDF
            </button>
          </div>
        </div>

        {actionError && (
          <div className="max-w-4xl mx-auto mb-4 bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg no-print">
            {actionError}
          </div>
        )}

        {/* INVOICE */}

        <div className="print-area max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 p-6 md:p-10">
          {/* COMPANY HEADER */}

          <div className="text-center border-b-2 border-[#0B1D2B] pb-5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-[#0B1D2B]">
              BISMI
            </h1>

            <h2 className="text-xl md:text-2xl font-bold tracking-widest text-yellow-600">
              EARTH MOVERS
            </h2>

            <p className="text-sm tracking-[3px] text-gray-500 mt-1">
              PADINHATTUMMURI
            </p>

            <p className="text-xs text-gray-500 mt-2">
              EARTH MOVING & EXCAVATION SERVICES
            </p>
          </div>

          {/* BILL INFORMATION */}

          <div className="flex flex-col sm:flex-row justify-between gap-5 mt-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                BILL / INVOICE
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Invoice No:{" "}
                <span className="font-semibold text-gray-800">
                  {bill.id}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Booking ID:{" "}
                <span className="font-semibold text-gray-800">
                  {String(bill.bookingId || "")
                    .slice(-6)
                    .toUpperCase()}
                </span>
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-gray-500">
                Bill Date
              </p>

              <p className="font-semibold text-gray-800">
                {formatDate(bill.billDate)}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Site Name
              </p>

              <p className="font-semibold text-gray-800">
                {bill.siteName}
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${statusStyle(
                  bill.approvalStatus
                )}`}
              >
                {bill.status}
              </span>
            </div>
          </div>

          {/* CUSTOMER DETAILS */}

          <div className="mt-7">
            <h3 className="bg-[#0B1D2B] text-white px-4 py-2 font-semibold">
              CUSTOMER & JOB DETAILS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 p-4 border border-gray-200">
              <Info label="Customer Name" value={bill.customer} />

              <Info label="Phone Number" value={bill.phone} />

              <Info label="Email" value={bill.email} />

              <Info label="Service" value={bill.service} />

              <Info label="Machine" value={bill.machine} />

              <Info label="Operator" value={bill.operator} />

              <Info label="Location" value={bill.location} />

              <Info
                label="Booking Date"
                value={formatDate(bill.bookingDate)}
              />
            </div>
          </div>

          {/* MACHINE DETAILS */}

          <div className="mt-7">
            <h3 className="bg-[#0B1D2B] text-white px-4 py-2 font-semibold">
              MACHINE WORK DETAILS
            </h3>

            <div className="grid grid-cols-3 border border-gray-200 text-center">
              <div className="p-4 border-r border-gray-200">
                <p className="text-xs text-gray-500">
                  Starting Reading
                </p>

                <p className="text-lg font-bold text-gray-800 mt-1">
                  {bill.startingReading} hrs
                </p>
              </div>

              <div className="p-4 border-r border-gray-200">
                <p className="text-xs text-gray-500">
                  Closing Reading
                </p>

                <p className="text-lg font-bold text-gray-800 mt-1">
                  {bill.closingReading} hrs
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-500">
                  Total Hours
                </p>

                <p className="text-lg font-bold text-yellow-600 mt-1">
                  {bill.totalHours} hrs
                </p>
              </div>
            </div>
          </div>

          {/* AMOUNT BREAKDOWN */}

          <div className="mt-7">
            <h3 className="bg-[#0B1D2B] text-white px-4 py-2 font-semibold">
              BILL AMOUNT DETAILS
            </h3>

            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border border-gray-200">
                    Description
                  </th>

                  <th className="text-right p-3 border border-gray-200">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                <AmountRow
                  label="Work Amount"
                  value={bill.amount}
                />

                <AmountRow
                  label="Shifting Charge"
                  value={bill.shiftingCharge}
                />

                <AmountRow
                  label="Tipper Charge"
                  value={bill.tipper}
                />

                <AmountRow
                  label="Batta"
                  value={bill.batta}
                />
              </tbody>

              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="p-3 border border-gray-200">
                    Operator Submitted Total
                  </td>

                  <td className="p-3 border border-gray-200 text-right">
                    {money(bill.originalTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* FINAL TOTAL AMOUNT */}

          <div className="mt-6 border-2 border-yellow-400 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
              <div>
                <p className="text-sm font-bold text-gray-600">
                  TOTAL BILL AMOUNT
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Final amount payable by customer
                </p>
              </div>

              {isEditing ? (
                <div className="w-full sm:w-56">
                  <label className="text-xs font-semibold text-gray-600">
                    Edit Final Amount (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={finalAmount}
                    onChange={(e) =>
                      setFinalAmount(e.target.value)
                    }
                    className="w-full mt-1 border border-yellow-500 rounded-lg px-3 py-2 text-xl font-bold text-right outline-none focus:ring-2 focus:ring-yellow-300"
                    placeholder="Enter amount"
                  />
                </div>
              ) : (
                <p className="text-2xl font-extrabold text-[#0B1D2B]">
                  {money(bill.total)}
                </p>
              )}
            </div>
          </div>

          {/* ADMIN NOTE */}

          <div className="mt-5">
            <h3 className="font-bold text-gray-800 mb-2">
              Admin Note
            </h3>

            {isEditing ? (
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Enter admin note..."
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ) : (
              <div className="border border-gray-200 rounded-lg p-3 text-sm text-gray-600 min-h-12">
                {bill.adminNote || "No admin note added."}
              </div>
            )}
          </div>

          {/* REJECTION REASON */}

          {bill.approvalStatus === "Rejected" && (
            <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4">
              <p className="font-bold text-red-700">
                Rejection Reason
              </p>

              <p className="text-sm text-red-600 mt-1">
                {bill.rejectionReason || "No reason provided."}
              </p>
            </div>
          )}

          {/* SIGNATURE */}

          <div className="grid grid-cols-2 gap-10 mt-12">
            <div>
              <div className="border-t border-gray-400 pt-2 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Operator Signature
                </p>
              </div>
            </div>

            <div>
              <div className="border-t border-gray-400 pt-2 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Authorized Signature
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="text-center border-t border-gray-200 mt-8 pt-4">
            <p className="text-sm font-semibold text-[#0B1D2B]">
              Thank you for choosing BISMI EARTH MOVERS
            </p>

            <p className="text-xs text-gray-400 mt-1">
              This is a computer-generated bill.
            </p>
          </div>
        </div>

        {/* ADMIN APPROVAL SECTION */}

        {isPending && !isEditing && (
          <div className="max-w-4xl mx-auto mt-5 bg-white p-5 rounded-xl shadow-sm border border-gray-200 no-print">
            <h3 className="font-bold text-gray-800 mb-4">
              Admin Approval
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason
              </label>

              <textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(e.target.value)
                }
                placeholder="Enter rejection reason..."
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={approveBill}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {saving ? "Processing..." : "Approve Bill"}
              </button>

              <button
                onClick={rejectBill}
                disabled={saving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50"
              >
                <XCircle size={18} />
                Reject Bill
              </button>
            </div>
          </div>
        )}

        {!isPending && (
          <div className="max-w-4xl mx-auto mt-5 bg-white rounded-xl p-4 text-center text-sm text-gray-500 no-print">
            This bill is {bill.status.toLowerCase()}. Editing and approval actions are disabled.
          </div>
        )}
      </div>
    );
  }

  // =====================================================
  // BILL LIST PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1D2B]">
              Bills Management
            </h1>

            <p className="text-gray-500 mt-1">
              Review, edit and approve operator submitted bills.
            </p>
          </div>

          <button
            onClick={fetchBills}
            className="flex items-center justify-center gap-2 bg-[#0B1D2B] text-white px-4 py-2.5 rounded-lg hover:bg-[#18354a]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <SummaryCard
            title="Total Bills"
            value={bills.length}
            icon={<FileText size={22} />}
            color="bg-blue-100 text-blue-700"
          />

          <SummaryCard
            title="Pending Approval"
            value={pendingCount}
            icon={<Clock3 size={22} />}
            color="bg-yellow-100 text-yellow-700"
          />

          <SummaryCard
            title="Approved"
            value={approvedCount}
            icon={<CheckCircle2 size={22} />}
            color="bg-green-100 text-green-700"
          />

          <SummaryCard
            title="Rejected"
            value={rejectedCount}
            icon={<XCircle size={22} />}
            color="bg-red-100 text-red-700"
          />
        </div>

        {/* ALL BILLS TOTAL */}

        <div className="bg-[#0B1D2B] text-white rounded-xl p-5 mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <p className="text-sm text-gray-300">
              Total Amount of All Bills
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Includes the current final amount of each bill
            </p>
          </div>

          <p className="text-2xl md:text-3xl font-extrabold text-yellow-400">
            {money(totalBillAmount)}
          </p>
        </div>

        {/* SEARCH & FILTER */}

        <div className="bg-white rounded-xl shadow-sm p-4 mb-5 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill, customer, operator..."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="All">All Bills</option>
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* BILLS TABLE */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-lg text-[#0B1D2B]">
              All Submitted Bills
            </h2>
          </div>

          {filteredBills.length === 0 ? (
            <div className="text-center py-14">
              <FileText
                size={40}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-3">
                No bills found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-5 py-4">
                      Bill ID
                    </th>

                    <th className="text-left px-5 py-4">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4">
                      Service
                    </th>

                    <th className="text-left px-5 py-4">
                      Operator
                    </th>

                    <th className="text-right px-5 py-4">
                      Total Amount
                    </th>

                    <th className="text-left px-5 py-4">
                      Date
                    </th>

                    <th className="text-left px-5 py-4">
                      Status
                    </th>

                    <th className="text-center px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBills.map((bill) => (
                    <tr
                      key={bill._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-bold text-[#0B1D2B]">
                        {bill.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {bill.customer}
                        </p>

                        <p className="text-xs text-gray-400">
                          {bill.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {bill.service}
                      </td>

                      <td className="px-5 py-4">
                        {bill.operator}
                      </td>

                      <td className="px-5 py-4 text-right font-extrabold text-[#0B1D2B]">
                        {money(bill.total)}
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(bill.billDate)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                            bill.approvalStatus
                          )}`}
                        >
                          {bill.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => openBill(bill)}
                          className="inline-flex items-center gap-2 bg-[#0B1D2B] hover:bg-[#18354a] text-white px-3 py-2 rounded-lg text-xs font-semibold"
                        >
                          <Eye size={15} />
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-2xl font-extrabold text-[#0B1D2B] mt-1">
          {value}
        </p>
      </div>

      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

function AmountRow({ label, value }) {
  return (
    <tr>
      <td className="p-3 border border-gray-200 text-gray-700">
        {label}
      </td>

      <td className="p-3 border border-gray-200 text-right font-medium text-gray-800">
        {money(value)}
      </td>
    </tr>
  );
}
