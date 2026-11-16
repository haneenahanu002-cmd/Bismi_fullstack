
import { useEffect, useState } from "react";
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

import {
  getProfileAPI,
  updateProfileAPI,
  changePasswordAPI,
} from "../../../services/allApi";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [originalProfile, setOriginalProfile] = useState({});

  const [account, setAccount] = useState({
    id: "",
    status: "Active",
    createdAt: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  // Fetch logged-in user's profile
 const fetchProfile = async () => {
  try {
    setLoading(true);

    const response = await getProfileAPI();

    console.log("Profile API Response:", response.data);

    const user = response.data.user;

    if (!user) {
      throw new Error("User data not found in API response");
    }

    const profileData = {
      name: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
    };

    setProfile(profileData);
    setOriginalProfile(profileData);

    setAccount({
      id: user._id || user.id || "",
      status: "Active",
      createdAt: user.createdAt || "",
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    console.log("Error response:", error.response?.data);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Unable to load profile."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  // Profile input change
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Password input change
  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  // Save profile to database
  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required.");
      return;
    }

    try {
      setSaving(true);

     const response = await updateProfileAPI({
  username: profile.name.trim(),
  email: profile.email.trim(),
  phone: profile.phone.trim(),
  location: profile.location.trim(),
});
      const updatedUser =
        response.data.user ||
        response.data.profile ||
        response.data;

      const updatedProfile = {
        name:
          updatedUser.name ||
          updatedUser.username ||
          profile.name,
        email: updatedUser.email || profile.email,
        phone: updatedUser.phone ?? profile.phone,
        location: updatedUser.location ?? profile.location,
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser,
        })
      );

      setIsEditing(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Profile update error:", error);

      alert(
        error.response?.data?.message ||
        "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handlePasswordUpdate = async (e) => {
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

    if (passwords.newPassword.length < 6) {
      alert("New password must contain at least 6 characters.");
      return;
    }

    try {
      await changePasswordAPI({
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });

      alert("Password updated successfully!");

      setPasswords({
        current: "",
        newPassword: "",
        confirm: "",
      });

    } catch (error) {
      console.error("Password update error:", error);

      alert(
        error.response?.data?.message ||
        "Password update failed."
      );
    }
  };

  const memberSince = account.createdAt
    ? new Date(account.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="font-semibold text-[#0B1D2B]">
          Loading your profile...
        </p>
      </div>
    );
  }

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

        {/* Left Side */}
        <div className="xl:col-span-2">

          {/* Profile Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* Profile Header */}
            <div className="flex flex-col gap-5 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-slate-950">
                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#0B1D2B]">
                    {profile.name || "User"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {account.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  isEditing ? handleCancel() : setIsEditing(true)
                }
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
                      placeholder="Enter phone number"
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
                      placeholder="Enter your location"
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
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <Save size={17} />
                    {saving ? "Saving..." : "Save Changes"}
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

                {/* Confirm Password */}
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

                  <p className="break-all text-sm font-semibold text-gray-700">
                    {account.id || "Not available"}
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
                    {account.status}
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
                    {memberSince}
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
                <h3 className="font-bold">
                  Account Security
                </h3>

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
