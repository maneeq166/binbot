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
      <div className="min-h-screen bg-[#070915] text-[#FAFAF9] font-sans pb-12 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow for loading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#674E98]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex flex-col items-center gap-4 text-[#ACA7B6] z-10">
          <LoaderCircle size={32} className="animate-spin text-[#917FBA]" strokeWidth={2} />
          <span className="font-medium tracking-wide">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070915] text-[#FAFAF9] font-sans pb-12 flex items-center justify-center relative">
        <div className="text-[#ACA7B6] bg-[#25233F]/40 px-8 py-4 rounded-2xl border border-[#44356F]/50 backdrop-blur-xl">Unable to load profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070915] text-[#FAFAF9] font-sans pb-20 relative overflow-hidden">
      
      {/* Premium Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[0%] left-[20%] w-[600px] h-[600px] bg-[#674E98]/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#917FBA]/10 blur-[130px] rounded-full mix-blend-screen" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-sm">Your Profile</h1>
        <p className="mt-2 text-[#ACA7B6] font-medium text-lg">Manage your account details and preferences.</p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Identity & Security */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Identity Card */}
            <div className="bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] p-8 shadow-[0_12px_40px_rgba(7,9,21,0.6)] ring-1 ring-[#FAFAF9]/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-[#674E98]/50 transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#917FBA]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="h-28 w-28 bg-gradient-to-br from-[#44356F] to-[#674E98] rounded-full flex items-center justify-center border-[6px] border-[#070915] shadow-[0_0_25px_rgba(103,78,152,0.4)] ring-1 ring-[#917FBA]/20 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-4xl font-extrabold text-[#FAFAF9] drop-shadow-md">
                    {user.firstName[0]}
                    {user.lastName ? user.lastName[0] : ""}
                  </span>
                </div>
                <div
                  className={`absolute bottom-1 right-1 h-7 w-7 border-4 border-[#070915] rounded-full shadow-sm ${
                    user.status === "Active" ? "bg-[#917FBA] shadow-[0_0_10px_rgba(145,127,186,0.5)]" : "bg-[#44356F]"
                  }`}
                  title={user.status}
                />
              </div>

              {/* Identity Info */}
              <h2 className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm font-medium text-[#ACA7B6] mt-1 mb-3">{user.role}</p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#917FBA]/15 text-[#D3B4D2] border border-[#917FBA]/30 shadow-inner">
                <CheckCircle2 size={14} strokeWidth={2.5} />
                {user.status}
              </div>

              {/* Edit Button */}
              <button className="mt-8 w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#070915]/60 backdrop-blur-md border border-[#44356F]/80 rounded-xl text-sm font-bold text-[#FAFAF9] hover:bg-[#25233F]/80 hover:border-[#917FBA]/60 hover:shadow-[0_8px_20px_rgba(103,78,152,0.2)] transition-all duration-300 hover:-translate-y-0.5">
                <Edit2 size={16} className="text-[#917FBA]" />
                Edit Profile
              </button>
            </div>

            {/* Account Status / Security */}
            <div className="bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] p-8 shadow-[0_12px_40px_rgba(7,9,21,0.6)] ring-1 ring-[#FAFAF9]/5 hover:border-[#674E98]/40 transition-all duration-300">
              <h3 className="text-lg font-extrabold text-[#FAFAF9] mb-6 flex items-center gap-3 tracking-tight">
                <Shield size={20} className="text-[#917FBA]" />
                Security
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#ACA7B6]">Password</span>
                  <button className="text-[#917FBA] hover:text-[#D3B4D2] font-bold transition-colors">Update</button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#ACA7B6]">2FA</span>
                  <span className="text-[#44356F] font-bold bg-[#070915]/50 px-3 py-1 rounded-md border border-[#44356F]/30">Disabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Settings */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Account Information */}
            <section className="bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] shadow-[0_12px_40px_rgba(7,9,21,0.6)] ring-1 ring-[#FAFAF9]/5 overflow-hidden hover:border-[#674E98]/40 transition-all duration-300 relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FAFAF9]/10 to-transparent" />
              <div className="px-8 py-6 border-b border-[#44356F]/50 bg-[#070915]/30">
                <h3 className="text-xl font-extrabold text-[#FAFAF9] tracking-tight">Account Information</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField label="Username" value={user.username} icon={<User size={18} />} />
                <InfoField label="Email Address" value={user.email} icon={<Mail size={18} />} />
                <InfoField label="Date Joined" value={user.joined} icon={<Calendar size={18} />} />
                <InfoField label="Last Activity" value={user.lastActivity} icon={<Clock size={18} />} />
              </div>
            </section>

            {/* Usage Summary */}
            <section className="bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] shadow-[0_12px_40px_rgba(7,9,21,0.6)] ring-1 ring-[#FAFAF9]/5 overflow-hidden hover:border-[#674E98]/40 transition-all duration-300">
              <div className="px-8 py-6 border-b border-[#44356F]/50 bg-[#070915]/30">
                <h3 className="text-xl font-extrabold text-[#FAFAF9] tracking-tight">Impact Summary</h3>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                  label="Items Analyzed"
                  value={user.stats.totalItems.toLocaleString()}
                  icon={<Activity size={20} className="text-[#917FBA]" />}
                />
                <StatCard
                  label="Biodegradable"
                  value={user.stats.biodegradableCount.toLocaleString()}
                  icon={<Leaf size={20} className="text-[#D3B4D2]" />}
                />
                <StatCard
                  label="Non-Bio"
                  value={user.stats.nonBiodegradableCount.toLocaleString()}
                  icon={<Trash2 size={20} className="text-[#ACA7B6]" />}
                />
              </div>
            </section>

            {/* Preferences */}
            <section className="bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] shadow-[0_12px_40px_rgba(7,9,21,0.6)] ring-1 ring-[#FAFAF9]/5 overflow-hidden hover:border-[#674E98]/40 transition-all duration-300">
              <div className="px-8 py-6 border-b border-[#44356F]/50 bg-[#070915]/30">
                <h3 className="text-xl font-extrabold text-[#FAFAF9] tracking-tight">Preferences</h3>
              </div>
              <div className="p-8 space-y-8">
                {/* Notification Row */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#070915]/60 rounded-xl text-[#917FBA] border border-[#44356F]/50 shadow-inner group-hover:border-[#674E98]/50 transition-colors">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#FAFAF9]">Notifications</p>
                      <p className="text-sm font-medium text-[#ACA7B6] mt-0.5">Receive weekly impact summaries</p>
                    </div>
                  </div>
                  {/* Premium Toggle */}
                  <div className="w-12 h-6 bg-gradient-to-r from-[#674E98] to-[#917FBA] rounded-full relative cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-[#FAFAF9] rounded-full shadow-sm" />
                  </div>
                </div>

                {/* Theme Row */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#070915]/60 rounded-xl text-[#917FBA] border border-[#44356F]/50 shadow-inner group-hover:border-[#674E98]/50 transition-colors">
                      <Moon size={20} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#FAFAF9]">Theme</p>
                      <p className="text-sm font-medium text-[#ACA7B6] mt-0.5">Dark mode is enabled by default</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#D3B4D2] bg-[#070915]/80 px-4 py-2 rounded-lg border border-[#44356F]/60 shadow-inner tracking-wide uppercase">
                    System Default
                  </span>
                </div>

                {/* Language Row */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#070915]/60 rounded-xl text-[#917FBA] border border-[#44356F]/50 shadow-inner group-hover:border-[#674E98]/50 transition-colors">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#FAFAF9]">Language</p>
                      <p className="text-sm font-medium text-[#ACA7B6] mt-0.5">Platform language</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#FAFAF9] bg-[#070915]/40 px-4 py-2 rounded-lg border border-[#44356F]/30">English (US)</span>
                </div>
              </div>
            </section>

            {/* Logout Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl border border-[#44356F]/60 text-[#D3B4D2] bg-[#25233F]/30 hover:text-[#FAFAF9] hover:border-[#674E98] hover:bg-[#674E98]/20 hover:shadow-[0_8px_20px_rgba(103,78,152,0.2)] transition-all duration-300 text-sm font-bold backdrop-blur-md transform hover:-translate-y-0.5"
              >
                <LogOut size={18} strokeWidth={2.5} />
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
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-extrabold text-[#ACA7B6] uppercase tracking-widest">
      <span className="text-[#674E98]">{icon}</span> {label}
    </label>
    <div className="text-[15px] font-bold text-[#FAFAF9] bg-[#070915]/50 border border-[#44356F]/50 px-4 py-3.5 rounded-xl shadow-inner break-words">
      {value}
    </div>
  </div>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-[#070915]/40 border border-[#44356F]/50 rounded-2xl p-5 flex flex-col justify-center text-center hover:border-[#674E98]/60 hover:bg-[#25233F]/40 transition-all duration-300 hover:shadow-[0_4px_15px_rgba(103,78,152,0.15)] group">
    <div className="flex justify-center mb-3">
      <div className="p-2.5 bg-[#25233F]/50 rounded-xl border border-[#44356F]/40 shadow-inner group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-extrabold text-[#FAFAF9] mb-1 tracking-tight">{value}</div>
    <div className="text-[11px] font-bold text-[#ACA7B6] uppercase tracking-widest">{label}</div>
  </div>
);

export default Profile;