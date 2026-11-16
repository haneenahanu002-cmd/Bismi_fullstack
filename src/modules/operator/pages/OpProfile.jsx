
import React, { useEffect, useState } from "react";
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
  X,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

const API = "https://bismiserver.onrender.com/api/auth";

export default function OpProfile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    operatorId: "",
    machine: "",
    role: "",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // OPERATOR TOKEN
  const getToken = () => {
    return (
      localStorage.getItem("operatorToken") ||
      localStorage.getItem("token")
    );
  };

  // GET PROFILE
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login again. Operator token not found.");
      }

      const response = await fetch(`${API}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch profile.");
      }

      const user = data.user;

      setProfile({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        operatorId:
          user.operatorId ||
          `OP-${String(user._id).slice(-6).toUpperCase()}`,
        machine: user.machine || user.assignedMachine || "-",
        role: user.role || "operator",
        status: user.status || "Active",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // PROFILE INPUT
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      setProfile((prev) => ({
        ...prev,
        username: data.user.username,
        email: data.user.email,
        phone: data.user.phone || "",
        location: data.user.location || "",
      }));

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // CANCEL PROFILE EDIT
  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  // PASSWORD INPUT
  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // UPDATE PASSWORD
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!passwordData.currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (
      passwordData.currentPassword === passwordData.newPassword
    ) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        throw new Error("Operator session expired. Please login again.");
      }

      const response = await fetch(`${API}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      console.log("Operator Change Password Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Password update failed.");
      }

      setSuccess("Password changed successfully!");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 disabled:cursor-not-allowed disabled:opacity-80";

  const passwordInputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-[#0B1D2B]" size={30} />
        <span className="ml-3 text-sm font-medium text-gray-600">
          Loading profile...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your operator profile
        </p>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT PROFILE CARD */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400 text-[#0B1D2B]">
              <User size={42} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#0B1D2B]">
              {profile.username}
            </h2>

            <p className="mt-1 text-sm capitalize text-gray-500">
              {profile.role}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {profile.status}
            </span>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">

            <div className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Operator ID</p>
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
                <p className="text-xs text-gray-400">Assigned Machine</p>
                <p className="text-sm font-semibold text-gray-700">
                  {profile.machine}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rounded-2xl bg-white shadow-sm lg:col-span-2">

          {/* PERSONAL INFORMATION HEADER */}
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
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-[#0B1D2B] hover:bg-yellow-500"
              >
                <Edit3 size={17} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#0B1D2B] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {/* PROFILE FIELDS */}
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

          {/* ACCOUNT INFORMATION */}
          <div className="mx-5 mb-5 rounded-xl bg-gray-50 p-5 sm:mx-6 sm:mb-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={19} className="text-yellow-600" />
              <h3 className="font-semibold text-[#0B1D2B]">
                Account Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Account Role</p>
                <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                  {profile.role}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Account Status</p>
                <p className="mt-1 text-sm font-medium text-green-600">
                  {profile.status}
                </p>
              </div>
            </div>
          </div>

          {/* PASSWORD SECTION */}
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
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setError("");
                  setSuccess("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>

            </div>

            {/* PASSWORD FORM */}
            {showPasswordForm && (
              <form
                onSubmit={handlePasswordSubmit}
                className="mt-6 space-y-5 rounded-xl bg-gray-50 p-5"
              >

                {/* CURRENT PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Current Password
                  </label>

                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                      className={`pl-10 ${passwordInputClass}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    New Password
                  </label>

                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                      className={`pl-10 ${passwordInputClass}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    Minimum 6 characters
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                      className={`pl-10 ${passwordInputClass}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0B1D2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#142b3c] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Updating..." : "Update Password"}
                </button>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
