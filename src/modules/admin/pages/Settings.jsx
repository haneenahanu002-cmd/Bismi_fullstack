
import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
  Save,
  Camera,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle,
  X,
} from "lucide-react";

const DEFAULT_PROFILE = {
  name: "Admin",
  email: "admin@bismiearthmovers.com",
  phone: "+91 90371 92107",
  role: "Administrator",
  businessName: "Bismi Earth Movers",
  address: "Malappuram, Kerala, India",
  bio: "Managing earth-moving equipment, bookings and operations.",
  photo: "",
};

const DEFAULT_NOTIFICATIONS = {
  notifications: true,
  emailAlerts: true,
  bookingAlerts: true,
  paymentAlerts: true,
  operatorAlerts: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? { ...fallback, ...JSON.parse(value) } : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function Toggle({ title, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-yellow-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState(
    DEFAULT_NOTIFICATIONS
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const savedProfile = readStorage("bismi_admin_profile", DEFAULT_PROFILE);
    const savedNotifications = readStorage(
      "bismi_admin_notifications",
      DEFAULT_NOTIFICATIONS
    );

    setProfile(savedProfile);
    setNotifications(savedNotifications);
    setPhotoPreview(savedProfile.photo || "");
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const updateProfile = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage("Please choose an image smaller than 2 MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      setPhotoPreview(result);
      setProfile((previous) => ({
        ...previous,
        photo: result,
      }));
      setMessage("");
    };

    reader.onerror = () => {
      showMessage("Unable to read this image.", "error");
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = (e) => {
    e?.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      showMessage("Name and email are required.", "error");
      return;
    }

    const updatedProfile = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      businessName: profile.businessName.trim(),
      address: profile.address.trim(),
    };

    if (!saveStorage("bismi_admin_profile", updatedProfile)) {
      showMessage(
        "Unable to save. Browser storage may be full.",
        "error"
      );
      return;
    }

    setProfile(updatedProfile);
    showMessage("Profile details saved successfully.");
  };

  const saveGeneral = (e) => {
    e.preventDefault();

    if (!profile.businessName.trim() || !profile.address.trim()) {
      showMessage("Business name and address are required.", "error");
      return;
    }

    saveProfile();
  };

  const updateNotification = (key, value) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: value,
    }));
    setMessage("");
  };

  const saveNotifications = () => {
    if (!saveStorage("bismi_admin_notifications", notifications)) {
      showMessage("Unable to save notification preferences.", "error");
      return;
    }

    showMessage("Notification preferences saved.");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showMessage("Please complete all password fields.", "error");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showMessage(
        "New password must contain at least 8 characters.",
        "error"
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("New passwords do not match.", "error");
      return;
    }

    // A secure password change must be verified by the backend.
    showMessage(
      "Password changes require backend authentication. No password was changed.",
      "error"
    );
  };

  const tabs = [
    { name: "General", icon: SettingsIcon },
    { name: "Profile", icon: User },
    { name: "Security", icon: Lock },
    { name: "Notifications", icon: Bell },
  ];

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account, business profile and preferences.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div
          role="status"
          className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle size={19} className="shrink-0" />
          ) : (
            <X size={19} className="shrink-0" />
          )}
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-auto"
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Navigation */}
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          <p className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Account Settings
          </p>

          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => changeTab(name)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                activeTab === name
                  ? "bg-yellow-100 font-semibold text-yellow-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}

          <div className="mt-3 border-t border-gray-100 p-3">
            <div className="flex items-center gap-3">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Admin"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-800">
                  {profile.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {profile.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          {/* GENERAL */}
          {activeTab === "General" && (
            <form
              onSubmit={saveGeneral}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <SectionHeading
                icon={SettingsIcon}
                title="General Settings"
                description="Configure your business information."
              />

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    name="businessName"
                    value={profile.businessName}
                    onChange={updateProfile}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Business Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={updateProfile}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Business Address *
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={profile.address}
                    onChange={updateProfile}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-lg bg-yellow-50 p-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <Building2 size={18} />
                      Business Information
                    </div>
                    <p className="mt-2">
                      Update these details to keep your admin settings
                      current. This local demo does not automatically
                      update invoices or other modules.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 p-5">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600"
                >
                  <Save size={17} />
                  Save General Settings
                </button>
              </div>
            </form>
          )}

          {/* PROFILE */}
          {activeTab === "Profile" && (
            <form
              onSubmit={saveProfile}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <SectionHeading
                icon={User}
                title="Admin Profile"
                description="Manage your personal account information."
              />

              <div className="border-b border-gray-100 p-6">
                <p className="mb-4 text-sm font-semibold text-gray-800">
                  Profile Photo
                </p>

                <div className="flex flex-wrap items-center gap-5">
                  <div className="relative">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="h-24 w-24 rounded-full border-2 border-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-3xl font-bold text-yellow-800">
                        {profile.name?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                    )}

                    <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-yellow-500 text-black hover:bg-yellow-600">
                      <Camera size={17} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {profile.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.role}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      JPG, PNG or WEBP · Maximum 2 MB
                    </p>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview("");
                          setProfile((previous) => ({
                            ...previous,
                            photo: "",
                          }));
                        }}
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="name"
                      value={profile.name}
                      onChange={updateProfile}
                      className={`${inputClass} pl-10`}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={updateProfile}
                      className={`${inputClass} pl-10`}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={updateProfile}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    value={profile.role}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Role changes require administrator authorization.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={updateProfile}
                      rows={2}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    About
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={updateProfile}
                    rows={3}
                    className={inputClass}
                    placeholder="Write a short profile description"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 p-5">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600"
                >
                  <Save size={17} />
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* SECURITY */}
          {activeTab === "Security" && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <SectionHeading
                icon={ShieldCheck}
                title="Security Settings"
                description="Manage your account protection."
              />

              <div className="space-y-6 p-6">
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={22}
                      className="shrink-0 text-yellow-700"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Account Security
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        A real password change must verify your current
                        password through the backend. This form will not
                        change or store passwords locally.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((previous) => ({
                            ...previous,
                            currentPassword: e.target.value,
                          }))
                        }
                        className={`${inputClass} pr-12`}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-label="Toggle current password visibility"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((previous) => ({
                          ...previous,
                          newPassword: e.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="At least 8 characters"
                      minLength={8}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((previous) => ({
                            ...previous,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className={`${inputClass} pr-12`}
                        placeholder="Re-enter new password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-label="Toggle confirmation password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600"
                  >
                    <Lock size={17} />
                    Update Password
                  </button>
                </form>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-semibold text-gray-900">
                    Security Recommendations
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>• Use a unique password with at least 8 characters.</li>
                    <li>• Never share your admin login details.</li>
                    <li>• Always log out when using a shared computer.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "Notifications" && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <SectionHeading
                icon={Bell}
                title="Notification Preferences"
                description="Choose the types of alerts you want to receive."
              />

              <div className="divide-y divide-gray-100">
                <Toggle
                  title="System Notifications"
                  description="Enable or disable application notifications."
                  enabled={notifications.notifications}
                  onChange={(value) =>
                    updateNotification("notifications", value)
                  }
                />

                <Toggle
                  title="Email Alerts"
                  description="Receive important alerts through email."
                  enabled={notifications.emailAlerts}
                  onChange={(value) =>
                    updateNotification("emailAlerts", value)
                  }
                />

                <Toggle
                  title="Booking Alerts"
                  description="Get notified about new booking requests."
                  enabled={notifications.bookingAlerts}
                  onChange={(value) =>
                    updateNotification("bookingAlerts", value)
                  }
                />

                <Toggle
                  title="Payment Alerts"
                  description="Get notified about payments and billing updates."
                  enabled={notifications.paymentAlerts}
                  onChange={(value) =>
                    updateNotification("paymentAlerts", value)
                  }
                />

                <Toggle
                  title="Operator Alerts"
                  description="Receive updates about operator assignments and job status."
                  enabled={notifications.operatorAlerts}
                  onChange={(value) =>
                    updateNotification("operatorAlerts", value)
                  }
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-gray-500">
                  Preferences are stored locally. Email and push delivery
                  need notification service integration.
                </p>
                <button
                  type="button"
                  onClick={saveNotifications}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600"
                >
                  <Save size={17} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
