import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Settings,
  CalendarDays,
  Eye,
  X,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const machinesData = [
  {
    id: "MCH-001",
    name: "JCB 3DX",
    model: "3DX",
    type: "Backhoe Loader",
    location: "Manjeri, Malappuram",
    status: "Available",
    rate: 800,
    year: 2024,
    hours: "2,450 hrs",
    description:
      "Powerful and reliable JCB machine suitable for excavation, earth moving and site cleaning.",
    features: [
      "Land Excavation",
      "Earth Moving",
      "Site Cleaning",
      "Road Work",
    ],
  },
  {
    id: "MCH-002",
    name: "JCB 4DX",
    model: "4DX",
    type: "Backhoe Loader",
    location: "Perinthalmanna, Malappuram",
    status: "Available",
    rate: 800,
    year: 2025,
    hours: "1,820 hrs",
    description:
      "Heavy-duty JCB machine suitable for foundation work, excavation and construction projects.",
    features: [
      "Foundation Work",
      "Land Excavation",
      "Earth Moving",
      "Road Work",
    ],
  },
  {
    id: "MCH-003",
    name: "JCB 3DX",
    model: "3DX",
    type: "Backhoe Loader",
    location: "Kondotty, Malappuram",
    status: "In Use",
    rate: 800,
    year: 2023,
    hours: "3,120 hrs",
    description:
      "Well-maintained JCB 3DX currently assigned to an ongoing construction project.",
    features: [
      "Site Cleaning",
      "Earth Moving",
      "Excavation",
    ],
  },
  {
    id: "MCH-004",
    name: "JCB 4DX",
    model: "4DX",
    type: "Backhoe Loader",
    location: "Wandoor, Malappuram",
    status: "Available",
    rate: 800,
    year: 2024,
    hours: "2,050 hrs",
    description:
      "Reliable heavy-duty machine for large-scale earth moving and construction work.",
    features: [
      "Earth Moving",
      "Foundation Work",
      "Road Work",
      "Excavation",
    ],
  },
];

export default function UserMachines() {
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");

  const filteredMachines =
    statusFilter === "All"
      ? machinesData
      : machinesData.filter(
          (machine) => machine.status === statusFilter
        );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
            Machines
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View available JCB machines and their details
          </p>
        </div>

        {/* Filter */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
        >
          <option value="All">All Machines</option>
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
        </select>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Machines
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0B1D2B]">
            {machinesData.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {
              machinesData.filter(
                (machine) => machine.status === "Available"
              ).length
            }
          </h2>
        </div>

        <div className="col-span-2 rounded-2xl bg-white p-5 shadow-sm lg:col-span-1">
          <p className="text-sm text-gray-500">
            Currently In Use
          </p>

          <h2 className="mt-2 text-2xl font-bold text-orange-600">
            {
              machinesData.filter(
                (machine) => machine.status === "In Use"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* =====================================================
          MACHINE CARDS
      ===================================================== */}

      {filteredMachines.length > 0 ? (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredMachines.map((machine) => (

            <div
              key={machine.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* Machine Image Area */}

              <div className="relative flex h-48 items-center justify-center bg-[#0B1D2B]">

                <Truck
                  size={90}
                  strokeWidth={1.3}
                  className="text-yellow-400"
                />

                {/* Status */}

                <span
                  className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    machine.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      machine.status === "Available"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  />

                  {machine.status}
                </span>

              </div>

              {/* Card Content */}

              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h2 className="text-xl font-bold text-[#0B1D2B]">
                      {machine.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {machine.type}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-lg font-bold text-[#0B1D2B]">
                      ₹{machine.rate}
                    </p>

                    <p className="text-xs text-gray-400">
                      / hour
                    </p>

                  </div>

                </div>

                {/* Location */}

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">

                  <MapPin
                    size={17}
                    className="text-yellow-600"
                  />

                  {machine.location}

                </div>

                {/* Machine Info */}

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-gray-50 p-3">

                    <p className="text-xs text-gray-400">
                      Model
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#0B1D2B]">
                      {machine.model}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">

                    <p className="text-xs text-gray-400">
                      Year
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#0B1D2B]">
                      {machine.year}
                    </p>

                  </div>

                </div>

                {/* Buttons */}

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() =>
                      setSelectedMachine(machine)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50"
                  >
                    <Eye size={17} />

                    View Details
                  </button>

                  <button
                    disabled={machine.status !== "Available"}
                    onClick={() => {
                      if (machine.status === "Available") {
                        alert(
                          `${machine.name} selected. Please go to My Bookings to book a slot.`
                        );
                      }
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                      machine.status === "Available"
                        ? "bg-yellow-400 text-[#0B1D2B] hover:bg-yellow-500"
                        : "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                  >
                    Book
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* Empty */

        <div className="rounded-2xl bg-white px-5 py-16 text-center shadow-sm">

          <Truck
            size={45}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            No machines found
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Try changing the machine status filter.
          </p>

        </div>

      )}

      {/* =====================================================
          MACHINE DETAILS MODAL
      ===================================================== */}

      {selectedMachine && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div>

                <h2 className="text-xl font-bold text-[#0B1D2B]">
                  Machine Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedMachine.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedMachine(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Machine Top */}

            <div className="flex flex-col gap-5 p-5 sm:flex-row">

              <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-2xl bg-[#0B1D2B] sm:w-48">

                <Truck
                  size={75}
                  strokeWidth={1.3}
                  className="text-yellow-400"
                />

              </div>

              <div>

                <div className="flex items-center gap-3">

                  <h3 className="text-2xl font-bold text-[#0B1D2B]">
                    {selectedMachine.name}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedMachine.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {selectedMachine.status}
                  </span>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedMachine.type}
                </p>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {selectedMachine.description}
                </p>

              </div>

            </div>

            {/* Details Grid */}

            <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2">

              <MachineDetail
                icon={<Settings size={17} />}
                label="Model"
                value={selectedMachine.model}
              />

              <MachineDetail
                icon={<CalendarDays size={17} />}
                label="Manufacturing Year"
                value={selectedMachine.year}
              />

              <MachineDetail
                icon={<Clock3 size={17} />}
                label="Working Hours"
                value={selectedMachine.hours}
              />

              <MachineDetail
                icon={<MapPin size={17} />}
                label="Location"
                value={selectedMachine.location}
              />

              <MachineDetail
                icon={<IndianRupeeIcon />}
                label="Hourly Rate"
                value={`₹${selectedMachine.rate} / hour`}
              />

            </div>

            {/* Features */}

            <div className="p-5">

              <h3 className="mb-3 text-sm font-bold text-[#0B1D2B]">
                Suitable For
              </h3>

              <div className="flex flex-wrap gap-2">

                {selectedMachine.features.map(
                  (feature) => (

                    <span
                      key={feature}
                      className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700"
                    >
                      {feature}
                    </span>

                  )
                )}

              </div>

            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  setSelectedMachine(null)
                }
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              {selectedMachine.status === "Available" && (

                <button
                  onClick={() => {
                    setSelectedMachine(null);
                    alert(
                      `${selectedMachine.name} selected for booking.`
                    );
                  }}
                  className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500"
                >
                  Book This Machine
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// DETAIL COMPONENT
// =====================================================

function MachineDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="flex items-center gap-2 text-xs text-gray-400">
        {icon}
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#0B1D2B]">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// RUPEE ICON
// =====================================================

function IndianRupeeIcon() {
  return (
    <span className="text-sm font-bold">
      ₹
    </span>
  );
}