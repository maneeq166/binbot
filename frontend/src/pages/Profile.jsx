import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Edit2,
  Shield,
  Bell,
  Moon,
  Globe,
  LogOut,
  CheckCircle2,
  Leaf,
  Trash2,
  Activity,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { me } from "../api/auth";

const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (isoDate) => {
  if (!isoDate) return "N/A";
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildProfileView = (userData) => {
  const username = userData?.username || "User";
  const normalized = username
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const firstName = normalized[0]
    ? normalized[0][0].toUpperCase() + normalized[0].slice(1)
    : "User";
  const lastName = normalized[1]
    ? normalized[1][0].toUpperCase() + normalized[1].slice(1)
    : "";

  const impact = userData?.impactSummary || {};
  const recent = userData?.recentActivity;

  return {
    firstName,
    lastName,
    username,
    email: userData?.email || "N/A",
    role: "Eco Member",
    joined: formatDate(userData?.createdAt),
    lastActivity: recent?.classifiedAt
      ? formatDateTime(recent.classifiedAt)
      : "No activity yet",
    status: userData?.isActive ? "Active" : "Inactive",
    stats: {
      totalItems: Number(impact.totalItems) || 0,
      biodegradableCount: Number(impact.biodegradableCount) || 0,
      nonBiodegradableCount: Number(impact.nonBiodegradableCount) || 0,
    },
  };
};

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login!");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      const response = await me();
      if (!isMounted) return;

      if (response?.success && response?.data) {
        setUser(buildProfileView(response.data));
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }

      setIsLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-12 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <LoaderCircle size={18} className="animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-12 flex items-center justify-center">
        <div className="text-slate-400">Unable to load profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-12">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Your Profile</h1>
        <p className="mt-1 text-slate-400">Manage your account details and preferences.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm backdrop-blur-sm flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="h-24 w-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-lg">
                  <span className="text-3xl font-bold text-emerald-500">
                    {user.firstName[0]}
                    {user.lastName ? user.lastName[0] : ""}
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 right-0 h-6 w-6 border-4 border-[#0f172a] rounded-full ${
                    user.status === "Active" ? "bg-emerald-500" : "bg-slate-500"
                  }`}
                  title={user.status}
                />
              </div>

              {/* Identity Info */}
              <h2 className="text-xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-slate-400 mb-1">{user.role}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={12} />
                {user.status}
              </div>

              {/* Edit Button */}
              <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all">
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>

            {/* Account Status / Meta */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                Security
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Password</span>
                  <button className="text-emerald-500 hover:text-emerald-400 font-medium">Update</button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">2FA</span>
                  <span className="text-slate-500">Disabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <section className="bg-slate-800/50 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">Account Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Username" value={user.username} icon={<User size={16} />} />
                <InfoField label="Email Address" value={user.email} icon={<Mail size={16} />} />
                <InfoField label="Date Joined" value={user.joined} icon={<Calendar size={16} />} />
                <InfoField label="Last Activity" value={user.lastActivity} icon={<Clock size={16} />} />
              </div>
            </section>

            {/* Usage Summary */}
            <section className="bg-slate-800/50 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">Impact Summary</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Items Analyzed"
                  value={user.stats.totalItems.toLocaleString()}
                  icon={<Activity size={18} className="text-blue-400" />}
                />
                <StatCard
                  label="Biodegradable"
                  value={user.stats.biodegradableCount.toLocaleString()}
                  icon={<Leaf size={18} className="text-emerald-400" />}
                />
                <StatCard
                  label="Non-Bio"
                  value={user.stats.nonBiodegradableCount.toLocaleString()}
                  icon={<Trash2 size={18} className="text-amber-400" />}
                />
              </div>
            </section>

            {/* Preferences */}
            <section className="bg-slate-800/50 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">Preferences</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Notification Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Notifications</p>
                      <p className="text-xs text-slate-400">Receive weekly impact summaries</p>
                    </div>
                  </div>
                  {/* Mock Toggle */}
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                {/* Theme Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                      <Moon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Theme</p>
                      <p className="text-xs text-slate-400">Dark mode is enabled by default</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    System Default
                  </span>
                </div>

                {/* Language Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Language</p>
                      <p className="text-xs text-slate-400">Platform language</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-300">English (US)</span>
                </div>
              </div>
            </section>

            {/* Logout Action */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-900/10 transition-all text-sm font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, icon }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
      {icon} {label}
    </label>
    <div className="text-sm font-medium text-white bg-slate-900/50 border border-slate-800/50 px-3 py-2.5 rounded-lg">
      {value}
    </div>
  </div>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col justify-center text-center hover:border-slate-700 transition-colors">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-xs text-slate-500 font-medium">{label}</div>
  </div>
);

export default Profile;
