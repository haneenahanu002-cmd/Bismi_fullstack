
import React, { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Truck, Upload,
  AlertTriangle, CheckCircle2, Wrench, RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000/api/machines";

const emptyForm = {
  name: "",
  model: "",
  registration: "",
  status: "Available",
  image: "",
};

// Safely read backend response
async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON backend response:", text);

    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      throw new Error(
        `Backend HTML response received (${response.status}). Check backend server, API URL and MongoDB connection.`
      );
    }

    throw new Error("Backend returned an invalid response.");
  }
}

function StatusBadge({ status }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    "In Use": "bg-red-100 text-red-600",
    Maintenance: "bg-orange-100 text-orange-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
      styles[status] || "bg-gray-100 text-gray-600"
    }`}>
      {status}
    </span>
  );
}

export default function Machines() {
  const [machineList, setMachineList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [viewMachine, setViewMachine] = useState(null);
  const [deleteMachine, setDeleteMachine] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [imageError, setImageError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const getHeaders = (json = false) => {
    const token = localStorage.getItem("token");

    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // FETCH MACHINES
  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch machines.");
      }

      setMachineList(data.machines || []);
      return true;
    } catch (err) {
      console.error("Fetch Machines Error:", err);
      setError(err.message || "Something went wrong.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // SUMMARY
  const availableCount = machineList.filter(
    (m) => m.status === "Available"
  ).length;

  const inUseCount = machineList.filter(
    (m) => m.status === "In Use"
  ).length;

  const maintenanceCount = machineList.filter(
    (m) => m.status === "Maintenance"
  ).length;

  // SEARCH AND FILTER
  const filteredMachines = useMemo(() => {
    return machineList.filter((machine) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        machine.name?.toLowerCase().includes(query) ||
        machine.id?.toLowerCase().includes(query) ||
        machine.model?.toLowerCase().includes(query) ||
        machine.registration?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Status" ||
        machine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [machineList, search, statusFilter]);

  // STYLES
  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-gray-700";

  // OPEN ADD
  const openAddModal = () => {
    setEditingMachine(null);
    setForm({ ...emptyForm });
    setImageError("");
    setShowModal(true);
  };

  // OPEN EDIT
  const openEditModal = (machine) => {
    setEditingMachine(machine);

    setForm({
      name: machine.name || "",
      model: machine.model || "",
      registration: machine.registration || "",
      status: machine.status || "Available",
      image: machine.image || "",
    });

    setImageError("");
    setShowModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingMachine(null);
    setForm({ ...emptyForm });
    setImageError("");
  };

  // INPUT CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // IMAGE UPLOAD
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.onerror = () => {
      setImageError("Unable to read image.");
    };

    reader.readAsDataURL(file);
  };

  // ADD / UPDATE MACHINE
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (!localStorage.getItem("token")) {
      window.alert("Please login again. Authentication token missing.");
      return;
    }

    const normalizedRegistration = form.registration
      .trim()
      .toUpperCase();

    if (!form.name.trim() || !form.model.trim() || !normalizedRegistration) {
      window.alert("Please fill all required fields.");
      return;
    }

    const registrationExists = machineList.some(
      (machine) =>
        machine.registration?.toUpperCase() === normalizedRegistration &&
        machine._id !== editingMachine?._id
    );

    if (registrationExists) {
      window.alert("This registration number already exists.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        model: form.model.trim(),
        registration: normalizedRegistration,
        status: form.status,
        image: form.image,
      };

      const isEditing = Boolean(editingMachine);

      const url = isEditing
        ? `${API}/${editingMachine._id}`
        : API;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to save machine.");
      }

      // Close modal only after successful save
      setShowModal(false);
      setEditingMachine(null);
      setForm({ ...emptyForm });
      setImageError("");

      const refreshed = await fetchMachines();

      if (refreshed) {
        window.alert(
          isEditing
            ? "Machine updated successfully!"
            : "Machine added successfully!"
        );
      } else {
        window.alert(
          "Machine saved, but the list could not be refreshed. Click Refresh."
        );
      }
    } catch (err) {
      console.error("Save Machine Error:", err);
      window.alert(err.message || "Unable to save machine.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE MACHINE
  const confirmDelete = async () => {
    if (!deleteMachine || deleting) return;

    try {
      setDeleting(true);

      const response = await fetch(`${API}/${deleteMachine._id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete machine.");
      }

      setMachineList((previous) =>
        previous.filter((m) => m._id !== deleteMachine._id)
      );

      if (viewMachine?._id === deleteMachine._id) {
        setViewMachine(null);
      }

      setDeleteMachine(null);
      window.alert("Machine deleted successfully!");
    } catch (err) {
      console.error("Delete Machine Error:", err);
      window.alert(err.message || "Unable to delete machine.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-amber-800">
              Bismi Earth Movers / Admin
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Machines Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Add, view, edit and manage all machines and equipment.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchMachines}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-[#0B1D2B] hover:bg-amber-400"
            >
              <Plus size={19} />
              Add Machine
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={fetchMachines}
              className="text-sm font-bold text-red-700 hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Total Machines", value: machineList.length, icon: Truck, color: "text-gray-900" },
            { title: "Available", value: availableCount, icon: CheckCircle2, color: "text-green-700" },
            { title: "In Use", value: inUseCount, icon: Truck, color: "text-red-600" },
            { title: "Maintenance", value: maintenanceCount, icon: Wrench, color: "text-orange-600" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
                      {item.value}
                    </h2>
                  </div>
                  <Icon size={25} className={item.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* SEARCH AND FILTER */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, model or registration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-amber-500"
          >
            <option>All Status</option>
            <option>Available</option>
            <option>In Use</option>
            <option>Maintenance</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-5">
            <h2 className="text-lg font-bold text-gray-900">Machines List</h2>
            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredMachines.length} of {machineList.length} machines
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  {["Machine ID", "Machine", "Model", "Registration", "Status", "Actions"].map((heading) => (
                    <th key={heading} className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <RefreshCw size={30} className="mx-auto animate-spin text-amber-600" />
                      <p className="mt-3 text-sm text-gray-500">Loading machines...</p>
                    </td>
                  </tr>
                ) : filteredMachines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <Truck size={36} className="mx-auto text-gray-300" />
                      <h3 className="mt-3 font-bold text-gray-800">
                        {machineList.length === 0 ? "No machines added yet" : "No machines found"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {machineList.length === 0
                          ? "Click Add Machine to add your first machine."
                          : "Try another search term or change the status filter."}
                      </p>
                      {machineList.length === 0 ? (
                        <button
                          type="button"
                          onClick={openAddModal}
                          className="mt-4 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold"
                        >
                          <Plus size={16} className="mr-1 inline" />
                          Add First Machine
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All Status");
                          }}
                          className="mt-3 text-sm font-bold text-amber-800"
                        >
                          Reset filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredMachines.map((machine) => (
                    <tr key={machine._id} className="hover:bg-amber-50/40">
                      <td className="px-5 py-4 text-sm font-semibold text-amber-800">
                        {machine.id || `MCH-${machine._id?.slice(-6).toUpperCase()}`}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {machine.image ? (
                            <img
                              src={machine.image}
                              alt={machine.name}
                              className="h-14 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                              <Truck size={24} />
                            </div>
                          )}
                          <span className="font-semibold text-gray-800">{machine.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">{machine.model}</td>
                      <td className="px-5 py-4 text-sm font-medium">{machine.registration}</td>
                      <td className="px-5 py-4"><StatusBadge status={machine.status} /></td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewMachine(machine)}
                            className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"
                          >
                            <Eye size={15} /> View
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(machine)}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
                          >
                            <Pencil size={15} /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteMachine(machine)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D2B]/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Machine Management
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {editingMachine ? "Edit Machine" : "Add Machine"}
                </h2>
              </div>
              <button type="button" onClick={closeModal} disabled={saving}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                <div>
                  <label className={labelStyle}>Machine Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. JCB 3DX"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Model *</label>
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="e.g. 3DX"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Registration Number *</label>
                  <input
                    name="registration"
                    value={form.registration}
                    onChange={handleChange}
                    placeholder="KL-07-AB-1234"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Machine Status *</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelStyle}>Machine Image</label>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center hover:border-amber-500">
                    <Upload size={25} className="text-amber-800" />
                    <span className="mt-3 text-sm font-bold">Choose a machine image</span>
                    <span className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP · Max 5 MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imageError && (
                    <p className="mt-2 text-sm text-red-600">{imageError}</p>
                  )}

                  {form.image && (
                    <div className="mt-4 flex items-start gap-4 rounded-xl border p-3">
                      <img
                        src={form.image}
                        alt="Machine preview"
                        className="h-28 w-36 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold">Image Preview</p>
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, image: "" }))}
                          className="mt-3 text-sm font-semibold text-red-600"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-[#0B1D2B] disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : editingMachine ? (
                    <Pencil size={17} />
                  ) : (
                    <Plus size={18} />
                  )}
                  {saving ? "Saving..." : editingMachine ? "Update Machine" : "Add Machine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D2B]/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-xl font-bold">Machine Details</h2>
              <button type="button" onClick={() => setViewMachine(null)}>
                <X size={20} />
              </button>
            </div>

            {viewMachine.image ? (
              <img src={viewMachine.image} alt={viewMachine.name} className="h-56 w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-gray-100 text-gray-400">
                <Truck size={48} />
              </div>
            )}

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold">{viewMachine.name}</h3>
                <StatusBadge status={viewMachine.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Machine ID</p>
                  <p className="mt-1 font-bold">
                    {viewMachine.id || viewMachine._id}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="mt-1 font-bold">{viewMachine.model}</p>
                </div>
                <div className="col-span-2 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Registration Number</p>
                  <p className="mt-1 font-bold">{viewMachine.registration}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const machine = viewMachine;
                    setViewMachine(null);
                    openEditModal(machine);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold"
                >
                  <Pencil size={16} /> Edit Machine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteMachine && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1D2B]/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <h2 className="mt-4 text-xl font-bold">Delete Machine?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800">{deleteMachine.name}</span>{" "}
              ({deleteMachine.registration})? This will permanently remove this machine.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteMachine(null)}
                disabled={deleting}
                className="rounded-xl border px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {deleting ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
