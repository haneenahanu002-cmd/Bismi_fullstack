
import React, { useMemo, useState } from "react";
import {
  UserPlus,
  UserRound,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Truck,
  Search,
  X,
  Pencil,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

const initialOperators = [
  {
    id: "OPR001",
    name: "Arun Kumar",
    email: "arun@bismiearthmovers.com",
    phone: "9876543210",
    address: "Malappuram, Kerala",
    password: "Temporary123",
    machine: "JCB 3DX",
    status: "Active",
  },
  {
    id: "OPR002",
    name: "Rahul Das",
    email: "rahul@bismiearthmovers.com",
    phone: "9876543211",
    address: "Manjeri, Kerala",
    password: "Temporary123",
    machine: "JCB 4DX",
    status: "Active",
  },
  {
    id: "OPR003",
    name: "Navas K",
    email: "navas@bismiearthmovers.com",
    phone: "9876543212",
    address: "Perinthalmanna, Kerala",
    password: "Temporary123",
    machine: "Excavator",
    status: "Inactive",
  },
  {
    id: "OPR004",
    name: "Shameer Ali",
    email: "shameer@bismiearthmovers.com",
    phone: "9876543213",
    address: "Kottakkal, Kerala",
    password: "Temporary123",
    machine: "JCB 3DX",
    status: "Active",
  },
  {
    id: "OPR005",
    name: "Vishnu P",
    email: "vishnu@bismiearthmovers.com",
    phone: "9876543214",
    address: "Kondotty, Kerala",
    password: "Temporary123",
    machine: "JCB 4DX",
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  machine: "JCB 3DX",
  status: "Active",
};

export default function Operators() {
  const [operatorList, setOperatorList] = useState(initialOperators);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingOperator, setEditingOperator] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredOperators = useMemo(() => {
    return operatorList.filter((operator) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        operator.id.toLowerCase().includes(query) ||
        operator.name.toLowerCase().includes(query) ||
        operator.email.toLowerCase().includes(query) ||
        operator.machine.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || operator.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [operatorList, search, statusFilter]);

  const activeCount = operatorList.filter(
    (operator) => operator.status === "Active"
  ).length;

  const inactiveCount = operatorList.filter(
    (operator) => operator.status === "Inactive"
  ).length;

  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10";

  const labelStyle = "mb-2 block text-sm font-semibold text-gray-700";

  const openAddModal = () => {
    setEditingOperator(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (operator) => {
    setEditingOperator(operator);

    setForm({
      name: operator.name,
      email: operator.email,
      phone: operator.phone || "",
      address: operator.address || "",
      password: "",
      machine: operator.machine,
      status: operator.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOperator(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailExists = operatorList.some(
      (operator) =>
        operator.email.toLowerCase() === form.email.trim().toLowerCase() &&
        operator.id !== editingOperator?.id
    );

    if (emailExists) {
      window.alert("This email address is already registered.");
      return;
    }

    if (editingOperator) {
      setOperatorList((previous) =>
        previous.map((operator) =>
          operator.id === editingOperator.id
            ? {
                ...operator,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                machine: form.machine,
                status: form.status,
                password: form.password
                  ? form.password
                  : operator.password,
              }
            : operator
        )
      );

      window.alert("Operator updated successfully!");
    } else {
      const nextNumber =
        operatorList.reduce((maximum, operator) => {
          const number = Number(operator.id.replace("OPR", "")) || 0;
          return Math.max(maximum, number);
        }, 0) + 1;

      const newOperator = {
        id: `OPR${String(nextNumber).padStart(3, "0")}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
        machine: form.machine,
        status: form.status,
      };

      setOperatorList((previous) => [...previous, newOperator]);
      window.alert("Operator added successfully!");
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    setOperatorList((previous) =>
      previous.filter((operator) => operator.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
  };

  const toggleStatus = (operator) => {
    const nextStatus =
      operator.status === "Active" ? "Inactive" : "Active";

    setOperatorList((previous) =>
      previous.map((item) =>
        item.id === operator.id
          ? { ...item, status: nextStatus }
          : item
      )
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-amber-800">
              Bismi Earth Movers / Admin
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Operators
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add, edit and manage your machine operators.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-[#0B1D2B] shadow-sm transition hover:bg-amber-400"
          >
            <UserPlus size={18} />
            Add Operator
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Operators
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {operatorList.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Users size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Operators
                </p>
                <h2 className="mt-2 text-3xl font-bold text-green-700">
                  {activeCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Inactive Operators
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-700">
                  {inactiveCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <XCircle size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Operators list */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Operators List
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredOperators.length} operator
                {filteredOperators.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-3.5 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search operators..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Operator
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Assigned Machine
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
                {filteredOperators.map((operator) => (
                  <tr
                    key={operator.id}
                    className="transition hover:bg-amber-50/40"
                  >
                    {/* Operator */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900">
                          {operator.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="whitespace-nowrap font-semibold text-gray-900">
                            {operator.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {operator.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={15} className="text-gray-400" />
                        {operator.email}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={15} className="text-gray-400" />
                        {operator.phone || "Not provided"}
                      </div>

                      <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span>{operator.address || "Not provided"}</span>
                      </div>
                    </td>

                    {/* Machine */}
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                        <Truck size={17} />
                        {operator.machine}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">
                      <button
                        type="button"
                        onClick={() => toggleStatus(operator)}
                        title="Click to change status"
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                          operator.status === "Active"
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            operator.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                        {operator.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(operator)}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(operator)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredOperators.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <Search size={24} />
                      </div>

                      <h3 className="mt-4 font-bold text-gray-800">
                        No operators found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try a different search term or reset the filters.
                      </p>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 text-sm font-bold text-amber-800 hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
            Showing {filteredOperators.length} of {operatorList.length} operators
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D2B]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Operator Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {editingOperator ? "Edit Operator" : "Add Operator"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingOperator
                    ? "Update the operator information below."
                    : "Enter the details to create an operator profile."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                <div>
                  <label className={labelStyle}>
                    Full Name *
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`${inputStyle} pl-11`}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>
                    Email Address *
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`${inputStyle} pl-11`}
                      placeholder="operator@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>
                    Phone Number *
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={`${inputStyle} pl-11`}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>
                    Assign Machine *
                  </label>

                  <div className="relative">
                    <Truck
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <select
                      name="machine"
                      value={form.machine}
                      onChange={handleChange}
                      className={`${inputStyle} pl-11`}
                    >
                      <option value="JCB 3DX">JCB 3DX</option>
                      <option value="JCB 4DX">JCB 4DX</option>
                      <option value="Excavator">Excavator</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelStyle}>
                    Full Address *
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className={`${inputStyle} min-h-24 resize-y pl-11`}
                      placeholder="House name, place, district, PIN code"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>
                    {editingOperator
                      ? "Change Password (Optional)"
                      : "Temporary Password *"}
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputStyle} pl-11`}
                      placeholder={
                        editingOperator
                          ? "Leave blank to keep current"
                          : "Create a password"
                      }
                      minLength={12}
                      required={!editingOperator}
                      autoComplete="new-password"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Minimum 12 characters.
                  </p>
                </div>

                <div>
                  <label className={labelStyle}>
                    Operator Status *
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-[#0B1D2B] transition hover:bg-amber-400"
                >
                  {editingOperator ? (
                    <Pencil size={17} />
                  ) : (
                    <UserPlus size={17} />
                  )}

                  {editingOperator
                    ? "Update Operator"
                    : "Create Operator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1D2B]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Delete Operator?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800">
                {deleteTarget.name}
              </span>
              ? This action will remove the operator from this displayed list.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <Trash2 size={16} />
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
