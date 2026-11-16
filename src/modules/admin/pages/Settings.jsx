
import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
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
  Loader2,
} from "lucide-react";

const API = "http://localhost:5000/api/settings";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  phone: "",
  role: "admin",
  address: "",
  bio: "",
  photo: "",
};

const DEFAULT_BUSINESS = {
  businessName: "",
  phone: "",
  address: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

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
  const [business, setBusiness] = useState(DEFAULT_BUSINESS);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // GET ADMIN SETTINGS
  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/admin`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load settings.");
      }

      setProfile({
        ...DEFAULT_PROFILE,
        ...data.profile,
      });

      setBusiness({
        ...DEFAULT_BUSINESS,
        ...data.business,
      });

      setPhotoPreview(data.profile?.photo || "");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UPDATE PROFILE INPUTS
  const updateProfile = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // UPDATE BUSINESS INPUTS
  const updateBusiness = (e) => {
    const { name, value } = e.target;

    setBusiness((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // PROFILE PHOTO
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

  // SAVE PROFILE
  const saveProfile = async (e) => {
    e?.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      showMessage("Name and email are required.", "error");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/admin/profile`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
          photo: profile.photo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      setProfile((previous) => ({
        ...previous,
        ...data.profile,
      }));

      setPhotoPreview(data.profile?.photo || "");

      showMessage(data.message || "Profile updated successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // SAVE BUSINESS SETTINGS
  const saveBusiness = async (e) => {
    e.preventDefault();

    if (!business.businessName.trim() || !business.address.trim()) {
      showMessage("Business name and address are required.", "error");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/admin/business`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(business),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Business update failed.");
      }

      setBusiness({
        ...DEFAULT_BUSINESS,
        ...data.business,
      });

      showMessage(data.message || "Business settings saved.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Please complete all password fields.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showMessage(
        "New password must contain at least 8 characters.",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("New passwords do not match.", "error");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/admin/change-password`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password update failed.");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showMessage(data.message || "Password changed successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // SETTINGS TABS
  const tabs = [
    { name: "General", icon: SettingsIcon },
    { name: "Profile", icon: User },
    { name: "Security", icon: Lock },
  ];

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMessage("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-gray-600">
        <Loader2 className="animate-spin" size={24} />
        Loading admin settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and business information.
        </p>
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
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

        {/* SIDEBAR */}
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
                <p className="truncate text-xs capitalize text-gray-500">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">

          {/* GENERAL SETTINGS */}
          {activeTab === "General" && (
            <form
              onSubmit={saveBusiness}
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
                    value={business.businessName}
                    onChange={updateBusiness}
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
                    value={business.phone}
                    onChange={updateBusiness}
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
                    value={business.address}
                    onChange={updateBusiness}
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
                      These details are saved in your database.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 p-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* PROFILE SETTINGS */}
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

              {/* PROFILE PHOTO */}
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

                    <p className="mt-1 text-sm capitalize text-gray-500">
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

              {/* PROFILE DETAILS */}
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
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Personal Address
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
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 p-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* SECURITY SETTINGS */}
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
                        Your current password will be verified by the server.
                        The new password will be securely hashed before saving.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-5"
                >
                  {/* CURRENT PASSWORD */}
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
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* NEW PASSWORD */}
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
                      minLength={8}
                      required
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
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
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-600 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Lock size={17} />
                    )}
                    Update Password
                  </button>
                </form>

                {/* SECURITY RECOMMENDATIONS */}
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
        </main>
      </div>
    </div>
  );
}
