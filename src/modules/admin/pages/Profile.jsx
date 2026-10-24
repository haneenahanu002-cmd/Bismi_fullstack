import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit,
  Camera,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your admin profile.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Top */}
        <div className="border-b p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              {/* Profile Image */}
              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-2xl font-bold text-yellow-700">
                  AD
                </div>

                <button
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-black shadow hover:bg-yellow-600"
                  title="Change photo"
                >
                  <Camera size={15} />
                </button>

              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Admin
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Bismi Earth Movers
                </p>

                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  <ShieldCheck size={13} />
                  Administrator
                </span>
              </div>

            </div>

            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600"
            >
              <Edit size={17} />
              Edit Profile
            </button>

          </div>

        </div>


        {/* Personal Information */}
        <div className="p-6">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <User size={17} />
                Full Name
              </div>

              <p className="font-semibold text-gray-900">
                Admin
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <Mail size={17} />
                Email Address
              </div>

              <p className="font-semibold text-gray-900">
                admin@bismiearthmovers.com
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <Phone size={17} />
                Phone Number
              </div>

              <p className="font-semibold text-gray-900">
                +91 90371 92107
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={17} />
                Location
              </div>

              <p className="font-semibold text-gray-900">
                Malappuram, Kerala
              </p>
            </div>

          </div>

        </div>


        {/* Account Information */}
        <div className="border-t p-6">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Account Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            <div>
              <p className="text-xs text-gray-500">
                Role
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                Administrator
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Account Status
              </p>

              <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Active
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Member Since
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                September 2026
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}