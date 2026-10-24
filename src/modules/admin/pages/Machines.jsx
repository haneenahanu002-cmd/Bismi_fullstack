
import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

const initialMachines = [
  {
    id: "MCH-001",
    name: "JCB 3DX",
    model: "3DX",
    registration: "KL-07-AB-1234",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1580901369227-308f6f40c442?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "MCH-002",
    name: "JCB 3DX",
    model: "3DX",
    registration: "KL-07-AB-5678",
    status: "In Use",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "MCH-003",
    name: "Tata Hitachi",
    model: "EX200",
    registration: "KL-07-CD-9012",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "MCH-004",
    name: "Hyundai Excavator",
    model: "R210",
    registration: "KL-07-CD-3456",
    status: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1532634896-26909d0d4b03?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "MCH-005",
    name: "Bulldozer",
    model: "D4R",
    registration: "KL-07-EF-7890",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1592911464331-1a5e9e2e8c8b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "MCH-006",
    name: "Tipper Lorry",
    model: "2518",
    registration: "KL-07-GH-4567",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=300&q=80",
  },
];

const emptyForm = {
  name: "",
  model: "",
  registration: "",
  status: "Available",
  image: "",
};

function StatusBadge({ status }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    "In Use": "bg-red-100 text-red-600",
    Maintenance: "bg-orange-100 text-orange-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

export default function Machines() {
  const [machines, setMachines] = useState(initialMachines);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingMachine, setEditingMachine] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [deletingMachine, setDeletingMachine] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  const filteredMachines = machines.filter((machine) => {
    const query = search.toLowerCase();

    const matchesSearch =
      machine.name.toLowerCase().includes(query) ||
      machine.id.toLowerCase().includes(query) ||
      machine.registration.toLowerCase().includes(query) ||
      machine.model.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All Status" ||
      machine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingMachine(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setImagePreview("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (machine) => {
    setEditingMachine(machine);
    setForm({
      name: machine.name,
      model: machine.model,
      registration: machine.registration,
      status: machine.status,
      image: machine.image || "",
    });
    setImageFile(null);
    setImagePreview(machine.image || "");
    setError("");
    setShowModal(true);
  };

  const closeFormModal = () => {
    setShowModal(false);
    setEditingMachine(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setImagePreview("");
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.onerror = () => {
      setError("Unable to read this image. Please try another file.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const model = form.model.trim();
    const registration = form.registration.trim().toUpperCase();

    if (!name || !model || !registration) {
      setError("Please fill in all required fields.");
      return;
    }

    const duplicateRegistration = machines.some(
      (machine) =>
        machine.registration.toLowerCase() ===
          registration.toLowerCase() &&
        machine.id !== editingMachine?.id
    );

    if (duplicateRegistration) {
      setError("This registration number already exists.");
      return;
    }

    const machineData = {
      name,
      model,
      registration,
      status: form.status,
      image: imagePreview || "",
    };

    if (editingMachine) {
      setMachines((previous) =>
        previous.map((machine) =>
          machine.id === editingMachine.id
            ? { ...machine, ...machineData }
            : machine
        )
      );
    } else {
      const nextNumber =
        machines.reduce((max, machine) => {
          const number = Number(machine.id.replace("MCH-", ""));
          return Math.max(max, number || 0);
        }, 0) + 1;

      const newMachine = {
        id: `MCH-${String(nextNumber).padStart(3, "0")}`,
        ...machineData,
      };

      setMachines((previous) => [...previous, newMachine]);
    }

    closeFormModal();
  };

  const openViewModal = (machine) => {
    setSelectedMachine(machine);
    setShowViewModal(true);
  };

  const openDeleteModal = (machine) => {
    setDeletingMachine(machine);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deletingMachine) return;

    setMachines((previous) =>
      previous.filter((machine) => machine.id !== deletingMachine.id)
    );

    setShowDeleteModal(false);
    setDeletingMachine(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Machines Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all earth-moving machines and equipment.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-600"
        >
          <Plus size={18} />
          Add Machine
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Machines",
            value: machines.length,
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            label: "Available",
            value: machines.filter((m) => m.status === "Available").length,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "In Use",
            value: machines.filter((m) => m.status === "In Use").length,
            color: "bg-red-100 text-red-700",
          },
          {
            label: "Maintenance",
            value: machines.filter((m) => m.status === "Maintenance").length,
            color: "bg-orange-100 text-orange-700",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">{item.label}</p>
              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${item.color}`}
              >
                {item.label === "Total Machines" ? "Total" : "Status"}
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name, ID, model or registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} py-3 pl-11`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass}
        >
          <option>All Status</option>
          <option>Available</option>
          <option>In Use</option>
          <option>Maintenance</option>
        </select>
      </div>

      {/* Machines Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">All Machines</h2>
          <span className="text-sm text-gray-500">
            {filteredMachines.length} machines
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "ID",
                  "Machine Name",
                  "Model",
                  "Registration No.",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`px-5 py-4 text-xs font-bold text-gray-600 ${
                      heading === "Actions" ? "text-center" : "text-left"
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredMachines.map((machine) => (
                <tr
                  key={machine.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-yellow-50/40"
                >
                  <td className="px-5 py-4 text-sm font-medium text-gray-700">
                    {machine.id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {machine.image ? (
                        <img
                          src={machine.image}
                          alt={machine.name}
                          className="h-12 w-14 rounded-lg border border-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-14 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <ImageIcon size={22} />
                        </div>
                      )}

                      <span className="text-sm font-semibold text-gray-800">
                        {machine.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {machine.model}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {machine.registration}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={machine.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => openViewModal(machine)}
                        title="View machine"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => openEditModal(machine)}
                        title="Edit machine"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-100 hover:text-yellow-700"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(machine)}
                        title="Delete machine"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMachines.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    <Search className="mx-auto mb-2 text-gray-300" size={30} />
                    No machines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Information */}
        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredMachines.length} of {machines.length} machines
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="rounded-lg border border-gray-200 p-2 text-gray-400 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-black">
              1
            </span>
            <button
              disabled
              className="rounded-lg border border-gray-200 p-2 text-gray-400 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFormModal();
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingMachine ? "Edit Machine" : "Add Machine"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {editingMachine
                    ? "Update machine information"
                    : "Enter the details of your new machine"}
                </p>
              </div>

              <button
                onClick={closeFormModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <FormField label="Machine Name *">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. JCB 3DX"
                  className={inputClass}
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Model *">
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="e.g. 3DX"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Registration Number *">
                  <input
                    name="registration"
                    value={form.registration}
                    onChange={handleChange}
                    placeholder="KL-07-AB-1234"
                    className={inputClass}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Machine Status *">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Available</option>
                  <option>In Use</option>
                  <option>Maintenance</option>
                </select>
              </FormField>

              {/* File Upload */}
              <FormField label="Machine Image">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center transition hover:border-yellow-500 hover:bg-yellow-50/50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Machine preview"
                      className="mb-3 h-32 w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="mb-3 rounded-full bg-yellow-100 p-3 text-yellow-700">
                      <Upload size={24} />
                    </div>
                  )}

                  <span className="text-sm font-semibold text-gray-800">
                    {imageFile
                      ? imageFile.name
                      : imagePreview
                      ? "Choose another image"
                      : "Choose an image file"}
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG or WEBP · Maximum 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                      setForm((previous) => ({
                        ...previous,
                        image: "",
                      }));
                    }}
                    className="mt-2 text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </FormField>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-600"
                >
                  {editingMachine ? (
                    <>
                      <Pencil size={16} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Machine
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MACHINE MODAL */}
      {showViewModal && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Machine Details
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedMachine.id}
                </p>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {selectedMachine.image ? (
                <img
                  src={selectedMachine.image}
                  alt={selectedMachine.name}
                  className="mb-5 h-48 w-full rounded-xl bg-gray-50 object-contain"
                />
              ) : (
                <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <ImageIcon size={42} />
                </div>
              )}

              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedMachine.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Machine ID: {selectedMachine.id}
                  </p>
                </div>
                <StatusBadge status={selectedMachine.status} />
              </div>

              <div className="space-y-4 rounded-xl bg-gray-50 p-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-gray-500">Model</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {selectedMachine.model}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-sm text-gray-500">
                    Registration
                  </span>
                  <span className="text-right text-sm font-semibold text-gray-800">
                    {selectedMachine.registration}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedMachine);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-semibold text-black hover:bg-yellow-600"
                >
                  <Pencil size={16} />
                  Edit Machine
                </button>

                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-center text-lg font-bold text-gray-900">
              Delete Machine?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingMachine.name}
              </span>{" "}
              ({deletingMachine.id})? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingMachine(null);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
