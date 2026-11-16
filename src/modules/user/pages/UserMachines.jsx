
import React, { useEffect, useMemo, useState } from "react";
import {
  Truck,
  MapPin,
  Settings,
  CalendarDays,
  Eye,
  X,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCw,
  AlertCircle,
  Wrench,
} from "lucide-react";

const API_URL = "https://bismiserver.onrender.com/api/machines/user";

const UserMachines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Fetch machines added by Admin
  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view machines.");
        setMachines([]);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch machines");
      }

      setMachines(data.machines || []);
    } catch (err) {
      console.error("Fetch Machines Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchMachines();

  const interval = setInterval(() => {
    fetchMachines();
  }, 5000);

  return () => clearInterval(interval);
}, []);
  // Machine counts
  const totalMachines = machines.length;

  const availableMachines = machines.filter(
    (machine) => machine.status === "Available"
  ).length;

  const inUseMachines = machines.filter(
    (machine) => machine.status === "In Use"
  ).length;

  const maintenanceMachines = machines.filter(
    (machine) => machine.status === "Maintenance"
  ).length;

  // Search and status filter
  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (machine.name || "").toLowerCase().includes(searchText) ||
        (machine.model || "").toLowerCase().includes(searchText) ||
        (machine.registration || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || machine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [machines, search, statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";

      case "In Use":
        return "bg-blue-100 text-blue-700";

      case "Maintenance":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return <CheckCircle2 size={15} />;

      case "In Use":
        return <Clock3 size={15} />;

      case "Maintenance":
        return <Wrench size={15} />;

      default:
        return <AlertCircle size={15} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
            Our Machines
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Explore machines available for your work requirements.
          </p>
        </div>

        <button
          onClick={fetchMachines}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0B1D2B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18364d] disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Machines"
          value={totalMachines}
          icon={<Truck size={22} />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-700"
        />

        <StatCard
          title="Available"
          value={availableMachines}
          icon={<CheckCircle2 size={22} />}
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />

        <StatCard
          title="In Use"
          value={inUseMachines}
          icon={<Clock3 size={22} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />

        <StatCard
          title="Maintenance"
          value={maintenanceMachines}
          icon={<Wrench size={22} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />

      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search machine, model or registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Available", "In Use", "Maintenance"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-[#0B1D2B] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[250px] flex-col items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-yellow-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading machines...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle size={35} className="mx-auto text-red-500" />

          <p className="mt-3 font-semibold text-red-700">
            {error}
          </p>

          <button
            onClick={fetchMachines}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Machine Cards */}
      {!loading && !error && (
        <>
          {filteredMachines.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
              <Truck size={45} className="mx-auto text-gray-300" />

              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                No Machines Found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {machines.length === 0
                  ? "No machines have been added by Admin yet."
                  : "No machines match your search or selected filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredMachines.map((machine) => (
                <div
                  key={machine._id || machine.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* Image */}
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-100">

                    {machine.image ? (
                      <img
                        src={machine.image}
                        alt={machine.name || "Machine"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Truck size={65} strokeWidth={1.3} />
                        <span className="mt-2 text-xs">
                          No Image Available
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        machine.status
                      )}`}
                    >
                      {getStatusIcon(machine.status)}
                      {machine.status || "Unknown"}
                    </span>

                  </div>

                  {/* Details */}
                  <div className="p-5">

                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-[#0B1D2B]">
                        {machine.name || "Unnamed Machine"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {machine.model || "Model not provided"}
                      </p>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">

                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Settings size={16} />
                          Registration
                        </span>

                        <span className="font-medium text-gray-800">
                          {machine.registration || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Truck size={16} />
                          Machine Type
                        </span>

                        <span className="font-medium text-gray-800">
                          {machine.name || "-"}
                        </span>
                      </div>

                    </div>

                    <button
                      onClick={() => setSelectedMachine(machine)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1D2B] py-2.5 text-sm font-semibold text-white transition hover:bg-[#18364d]"
                    >
                      <Eye size={17} />
                      View Details
                    </button>

                    {machine.status === "Available" && (
                      <p className="mt-3 text-center text-xs font-medium text-green-600">
                        This machine is available for booking.
                      </p>
                    )}

                    {machine.status === "In Use" && (
                      <p className="mt-3 text-center text-xs font-medium text-blue-600">
                        Currently assigned to a booking.
                      </p>
                    )}

                    {machine.status === "Maintenance" && (
                      <p className="mt-3 text-center text-xs font-medium text-orange-600">
                        Currently under maintenance.
                      </p>
                    )}

                  </div>
                </div>
              ))}

            </div>
          )}
        </>
      )}

      {/* Machine Details Modal */}
      {selectedMachine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedMachine(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="text-xl font-bold text-[#0B1D2B]">
                Machine Details
              </h2>

              <button
                onClick={() => setSelectedMachine(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {selectedMachine.image && (
              <img
                src={selectedMachine.image}
                alt={selectedMachine.name || "Machine"}
                className="h-56 w-full bg-gray-100 object-cover"
              />
            )}

            <div className="space-y-4 p-5">

              <div>
                <h3 className="text-xl font-bold text-[#0B1D2B]">
                  {selectedMachine.name || "-"}
                </h3>

                <p className="text-sm text-gray-500">
                  {selectedMachine.model || "Model not provided"}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-500">
                  Status
                </span>

                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedMachine.status
                  )}`}
                >
                  {getStatusIcon(selectedMachine.status)}
                  {selectedMachine.status || "Unknown"}
                </span>
              </div>

              <DetailRow
                label="Registration Number"
                value={selectedMachine.registration}
              />

              <DetailRow
                label="Machine Name"
                value={selectedMachine.name}
              />

              <DetailRow
                label="Model"
                value={selectedMachine.model}
              />

              <DetailRow
                label="Added On"
                value={
                  selectedMachine.createdAt
                    ? new Date(selectedMachine.createdAt).toLocaleDateString(
                        "en-IN"
                      )
                    : "-"
                }
              />

              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-sm text-gray-700">
                  {selectedMachine.status === "Available"
                    ? "This machine is currently available. You can request a booking from the My Bookings page."
                    : selectedMachine.status === "In Use"
                    ? "This machine is currently in use and cannot be booked right now."
                    : "This machine is currently under maintenance and cannot be booked right now."}
                </p>
              </div>

              <button
                onClick={() => setSelectedMachine(null)}
                className="w-full rounded-lg bg-[#0B1D2B] py-3 text-sm font-semibold text-white hover:bg-[#18364d]"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Statistics Card
const StatCard = ({ title, value, icon, iconBg, iconColor }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
          {value}
        </h3>
      </div>

      <div className={`rounded-xl p-3 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
};

// Details Row
const DetailRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-800">
        {value || "-"}
      </span>
    </div>
  );
};

export default UserMachines;
