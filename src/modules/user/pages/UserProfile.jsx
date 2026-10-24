import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Save,
  Edit3,
  KeyRound,
  CalendarDays,
} from "lucide-react";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Customer",
    email: "customer@gmail.com",
    phone: "+91 98765 43210",
    location: "Manjeri, Malappuram",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (
      !passwords.current ||
      !passwords.newPassword ||
      !passwords.confirm
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password updated successfully!");

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile Card */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Profile Header */}
            <div className="flex flex-col gap-5 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-slate-950">
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#0B1D2B]">
                    {profile.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Active Account
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Edit3 size={17} />

                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Personal Information */}
            <div className="p-5 sm:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-[#0B1D2B]">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Update your personal details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                        isEditing
                          ? "border-gray-300 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                        isEditing
                          ? "border-gray-300 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                        isEditing
                          ? "border-gray-300 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                        isEditing
                          ? "border-gray-300 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Save */}
              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-500 sm:w-auto"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
                  <Lock size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#0B1D2B]">
                    Change Password
                  </h2>

                  <p className="text-sm text-gray-500">
                    Keep your account secure
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handlePasswordUpdate}
              className="p-5 sm:p-6"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Current Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Current Password
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      placeholder="Current password"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    New Password
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1D2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#132c3d] sm:w-auto"
              >
                <Lock size={17} />
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Account Information */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
              <h2 className="font-bold text-[#0B1D2B]">
                Account Information
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your account details
              </p>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Account ID
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    USR-001
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2.5 text-green-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Account Status
                  </p>

                  <p className="text-sm font-semibold text-green-600">
                    Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-2.5 text-yellow-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Member Since
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    January 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl bg-[#0B1D2B] p-6 text-white shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-yellow-400 p-3 text-slate-950">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h3 className="font-bold">Account Security</h3>

                <p className="text-xs text-slate-400">
                  Keep your account protected
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              Never share your password with anyone. Use a strong
              password and update it regularly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}