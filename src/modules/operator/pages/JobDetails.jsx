import React from "react";
import {
  ArrowLeft,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  UserRound,
  Truck,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const bookingId = id || "BM1025";

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Job Details
            </h1>

            <p className="text-sm text-gray-500">
              Booking #{bookingId}
            </p>
          </div>

        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
          In Progress
        </span>

      </div>


      {/* Main */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_330px]">

        {/* Left */}
        <div className="space-y-6">

          {/* Booking */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <p className="text-sm text-gray-500">
                Booking ID
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {bookingId}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Land Clearing
              </p>

            </div>


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <InfoItem
                icon={<UserRound size={17} />}
                label="Customer"
                value="Ameen"
              />

              <InfoItem
                icon={<Phone size={17} />}
                label="Phone"
                value="+91 90371 23456"
              />

              <InfoItem
                icon={<MapPin size={17} />}
                label="Location"
                value="Manjeri, Malappuram"
              />

              <InfoItem
                icon={<CalendarDays size={17} />}
                label="Date"
                value="30 Sep 2026"
              />

              <InfoItem
                icon={<Clock3 size={17} />}
                label="Time"
                value="10:00 AM - 02:00 PM"
              />

              <InfoItem
                icon={<Truck size={17} />}
                label="Machine"
                value="JCB 3DX"
              />

            </div>

          </div>


          {/* Work Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Work Details
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

              <div>
                <p className="text-xs text-gray-500">
                  Start Time
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  10:05 AM
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  End Time
                </p>

                <p className="mt-1 font-semibold text-gray-400">
                  —
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Total Hours
                </p>

                <p className="mt-1 font-semibold text-gray-400">
                  —
                </p>
              </div>

            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500">
                Work Description
              </p>

              <p className="mt-2 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                Land clearing of site area.
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs text-gray-500">
                Additional Charges
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                ₹500
              </p>
            </div>

          </div>


          {/* Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-7 text-lg font-bold text-gray-900">
              Job Progress
            </h2>

            <div className="overflow-x-auto">

              <div className="flex min-w-[650px] items-start">

                <Step
                  title="Accepted"
                  time="09:45 AM"
                  active
                  completed
                />

                <Line completed />

                <Step
                  title="Started"
                  time="10:05 AM"
                  active
                  completed
                />

                <Line completed />

                <Step
                  title="In Progress"
                  time="10:30 AM"
                  active
                />

                <Line />

                <Step
                  title="Completed"
                  time="—"
                />

                <Line />

                <Step
                  title="Bill Created"
                  time="—"
                />

              </div>

            </div>

          </div>


          {/* Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-bold text-black hover:bg-yellow-600">
                <Play size={17} />
                Update Progress
              </button>

              <Link
                to={`/operator/jobs/${bookingId}/complete`}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#071521] px-5 py-3 text-sm font-bold text-white hover:bg-black"
              >
                <CheckCircle2 size={17} />
                Complete Job
              </Link>

            </div>

          </div>

        </div>


        {/* Right */}
        <div className="space-y-6">

          {/* Customer */}
          <SideCard title="Customer Details">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                AK
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Ameen
                </p>

                <p className="text-xs text-gray-500">
                  +91 90371 23456
                </p>
              </div>

            </div>

          </SideCard>


          {/* Machine */}
          <SideCard title="Machine Details">

            <div className="flex h-20 items-center justify-center rounded-lg bg-yellow-50">
              <Truck size={40} className="text-yellow-600" />
            </div>

            <p className="mt-4 font-bold text-gray-900">
              JCB 3DX
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Type: Backhoe Loader
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Capacity: 1.0 Ton
            </p>

          </SideCard>


          {/* Operator */}
          <SideCard title="Operator Details">

            <p className="font-bold text-gray-900">
              Muhammed
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Operator
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Experience: 3 Years
            </p>

          </SideCard>

        </div>

      </div>

    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs text-gray-500">
        {icon}
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

function SideCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <h2 className="mb-5 text-sm font-bold text-gray-900">
        {title}
      </h2>

      {children}

    </div>
  );
}

function Step({ title, time, active, completed }) {
  return (
    <div className="w-[105px] shrink-0 text-center">

      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border-4 ${
          completed
            ? "border-green-100 bg-green-600 text-white"
            : active
            ? "border-yellow-100 bg-yellow-500 text-black"
            : "border-gray-100 bg-white text-gray-300"
        }`}
      >
        {completed ? "✓" : active ? "●" : ""}
      </div>

      <p className="mt-3 text-xs font-semibold text-gray-700">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-gray-400">
        {time}
      </p>

    </div>
  );
}

function Line({ completed }) {
  return (
    <div
      className={`mt-4 h-1 min-w-[45px] flex-1 rounded ${
        completed ? "bg-green-500" : "bg-gray-200"
      }`}
    />
  );
}