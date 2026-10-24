import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  BriefcaseBusiness,
  Truck,
  Edit3,
  Lock,
  Save,
} from "lucide-react";

export default function OpProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Abdul Rahman",
    email: "abdulrahman@gmail.com",
    phone: "+91 98765 43210",
    location: "Manjeri, Malappuram",
    operatorId: "OP-001",
    machine: "JCB 3DX",
    role: "Machine Operator",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your operator profile
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col items-center text-center">

            {/* Profile Image */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400 text-[#0B1D2B]">
              <User size={42} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#0B1D2B]">
              {profile.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {profile.role}
            </p>

            {/* Status */}
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Active
            </span>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">

            <div className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Operator ID
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {profile.operatorId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <Truck size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Assigned Machine
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {profile.machine}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Profile Details */}
        <div className="rounded-2xl bg-white shadow-sm lg:col-span-2">

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">

            <div>
              <h2 className="text-lg font-bold text-[#0B1D2B]">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your account information
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-[#0B1D2B] transition hover:bg-yellow-500"
              >
                <Edit3 size={17} />
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#0B1D2B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#142b3c]"
              >
                <Save size={17} />
                Save
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-80"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-80"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-80"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-80"
                />
              </div>
            </div>

          </div>

          {/* Account Information */}
          <div className="mx-5 mb-5 rounded-xl bg-gray-50 p-5 sm:mx-6 sm:mb-6">

            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck
                size={19}
                className="text-yellow-600"
              />

              <h3 className="font-semibold text-[#0B1D2B]">
                Account Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-gray-400">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {profile.role}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Account Status
                </p>

                <p className="mt-1 text-sm font-medium text-green-600">
                  Active
                </p>
              </div>

            </div>
          </div>

          {/* Security */}
          <div className="border-t border-gray-100 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                  <Lock size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#0B1D2B]">
                    Password
                  </h3>

                  <p className="text-xs text-gray-500">
                    Change your account password
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50"
              >
                Change Password
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}