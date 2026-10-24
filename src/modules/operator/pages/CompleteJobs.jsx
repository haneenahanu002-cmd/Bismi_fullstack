import React, { useState } from "react";
import {
  ArrowLeft,
  Clock3,
  UserRound,
  Truck,
  FileText,
  IndianRupee,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function CompleteJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workDescription, setWorkDescription] = useState(
    "Land clearing of site area."
  );

  const [additionalCharges, setAdditionalCharges] = useState("500");

  const [endTime, setEndTime] = useState("03:15 PM");

  const createBill = () => {
    alert(
      "Design preview only. Bill creation will be connected to backend later."
    );

    navigate("/operator/bills");
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">

       

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Job & Create Bill
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Complete the job details and prepare the bill.
          </p>
        </div>

      </div>


      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Job Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
              <FileText size={19} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Job Information
            </h2>

          </div>


          <div className="space-y-5">

            <Info
              label="Booking ID"
              value={id || "BM1025"}
            />

            <Info
              label="Customer"
              value="Ameen"
              icon={<UserRound size={16} />}
            />

            <Info
              label="Machine"
              value="JCB 3DX"
              icon={<Truck size={16} />}
            />

            <Info
              label="Operator"
              value="Muhammed"
              icon={<UserRound size={16} />}
            />

          </div>

        </div>


        {/* Time Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
              <Clock3 size={19} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Time Details
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Start Time
              </label>

              <input
                value="10:05 AM"
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                End Time
              </label>

              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Total Hours
              </label>

              <input
                value="5 Hours 10 Minutes"
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-700"
              />
            </div>

          </div>

        </div>


        {/* Work Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Work Details
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Work Description
              </label>

              <textarea
                rows="5"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              />
            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Additional Charges
              </label>

              <div className="relative">

                <IndianRupee
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) =>
                    setAdditionalCharges(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Add any extra work or service charges.
              </p>

            </div>

          </div>

        </div>


        {/* Bill Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Bill Summary
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Machine Charge
              </span>

              <span className="font-semibold text-gray-900">
                ₹4,500
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Additional Charges
              </span>

              <span className="font-semibold text-gray-900">
                ₹{additionalCharges || "0"}
              </span>
            </div>

            <div className="border-t pt-4">

              <div className="flex justify-between">

                <span className="font-bold text-gray-900">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-yellow-600">
                  ₹
                  {4500 +
                    (Number(additionalCharges) || 0)}
                </span>

              </div>

            </div>

          </div>


          <button
            onClick={createBill}
            className="mt-6 w-full rounded-lg bg-yellow-500 py-3.5 text-sm font-bold text-black hover:bg-yellow-600"
          >
            Create Bill
          </button>

        </div>

      </div>

    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-xs text-gray-500">
        {icon}
        {label}
      </p>

      <p className="font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}