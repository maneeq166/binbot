import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getDashboardSummary } from '../api/dashboard';
import { getWasteHistory } from '../api/waste';
import { me } from '../api/auth';
import { 
  ScanLine, 
  Leaf, 
  Recycle, 
  Trash2, 
  Activity, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const nav = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const auth = useCallback(() => {
    if(!localStorage.getItem("token")){
      toast.info("Please login!")
      nav("/login");
      return false;
    }
    return true;
  }, [nav]);

  useEffect(()=>{
      const isAuthed = auth();
      if (!isAuthed) {
        setIsLoading(false);
        return;
      }
      let isActive = true;
      const run = async () => {
        setIsLoading(true);
        try {
          const result = await getDashboardSummary();
          if (!isActive) return;
          if (result?.success) {
            setDashboardData(result.data ?? null);
          } else {
            toast.error(result?.message || "Failed to load dashboard data");
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to load dashboard data");
        } finally {
          if (isActive) setIsLoading(false);
        }
      };
      run();
      return () => {
        isActive = false;
      };
   },[nav, auth])

   useEffect(() => {
     const fetchUser = async () => {
       try {
         const userData = await me();
         if (userData.success) {
           setUser(userData.data);
         }
       } catch (error) {
         console.log('Failed to fetch user data:', error);
       }
     };
     fetchUser();
   }, []);

   useEffect(() => {
     const fetchRecentActivity = async () => {
       try {
         const result = await getWasteHistory(1, 5);
         if (result.success) {
           setRecentActivity(result.data.history || []);
         }
       } catch (error) {
         console.log('Failed to fetch recent activity:', error);
       }
     };
     fetchRecentActivity();
   }, []);

  const stats = useMemo(() => {
    const totalItems = Number(dashboardData?.totalItems) || 0;
    const biodegradableCount = Number(dashboardData?.biodegradableCount) || 0;
    const nonBiodegradableCount = Number(dashboardData?.nonBiodegradableCount) || 0;
    const biodegradablePct = totalItems > 0 ? Math.round((biodegradableCount / totalItems) * 100) : 0;
    const nonBiodegradablePct = totalItems > 0 ? Math.round((nonBiodegradableCount / totalItems) * 100) : 0;
    const divertedKg = dashboardData?.divertedKg ? Number(dashboardData.divertedKg).toFixed(1) : ((Number(dashboardData?.binUsage?.green || 0) + Number(dashboardData?.binUsage?.blue || 0)) * 0.1).toFixed(1);
    return {
      totalItems,
      biodegradableCount,
      nonBiodegradableCount,
      biodegradablePct,
      nonBiodegradablePct,
      divertedKg,
    };
  }, [dashboardData]);

   const username = useMemo(() => {
     if (!user?.username) return "User";
     return user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
   }, [user]);

   const getTimeAgo = (timestamp) => {
     const now = new Date();
     const past = new Date(timestamp);
     const diffMs = now - past;
     const diffMins = Math.floor(diffMs / (1000 * 60));
     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

     if (diffMins < 1) return 'Just now';
     if (diffMins < 60) return `${diffMins} mins ago`;
     if (diffHours < 24) return `${diffHours} hours ago`;
     return `${diffDays} days ago`;
   };

   const formattedActivity = useMemo(() => {
     return recentActivity.slice(0, 3).map(item => {
       const itemName = item.itemName || item.inputValue || 'Unknown item';
       const wasteType = item.wasteType === 'biodegradable' ? 'Compost' : item.wasteType === 'non-biodegradable' ? (item.binColor === 'blue' ? 'Recycle' : 'Landfill') : 'Unknown';
       const timeAgo = getTimeAgo(item.createdAt);
       const status = 'Correct'; // Assume correct for now
       return {
         desc: `${itemName} classified as ${wasteType}`,
         time: timeAgo,
         status
       };
     });
   }, [recentActivity]);

  return (
    <div className="min-h-screen bg-[#070915] text-[#FAFAF9] font-sans pt-16 relative overflow-hidden">

      {/* Atmospheric Background Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#674E98]/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#917FBA]/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3B4D2]/5 blur-[150px] rounded-full" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#25233F]/60 backdrop-blur-xl border border-[#44356F]/60 shadow-[0_8px_40px_rgba(7,9,21,0.6)] group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#674E98]/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 p-8 sm:p-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FAFAF9] tracking-tight mb-3 drop-shadow-sm">
              Welcome back, {username}!
            </h1>
            <p className="text-[#ACA7B6] max-w-xl text-lg mb-10 font-medium">
              You've diverted <span className="text-[#917FBA] font-bold drop-shadow-sm">{stats.divertedKg}kg</span> of waste from landfills this month.
            </p>
            <button
              onClick={() => nav("/classify")}
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#674E98] to-[#917FBA] hover:from-[#917FBA] hover:to-[#D3B4D2] text-[#070915] font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(103,78,152,0.3)] hover:shadow-[0_8px_25px_rgba(145,127,186,0.5)] transform hover:-translate-y-0.5 hover:scale-[1.02] ring-1 ring-[#FAFAF9]/10"
            >
              <ScanLine size={20} strokeWidth={2.5} />
              Classify Waste Now
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#917FBA]/10 to-transparent pointer-events-none" />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Items Analyzed"
            value={stats.totalItems.toLocaleString()}
            trend={isLoading ? "Loading..." : "+12% vs last month"}
            icon={<Activity size={22} className="text-[#917FBA]" />}
          />
          <StatCard
            title="Biodegradable"
            value={stats.biodegradableCount.toLocaleString()}
            sub={`${stats.biodegradablePct}% of total`}
            icon={<Leaf size={22} className="text-[#D3B4D2]" />}
          />
          <StatCard
            title="Non-Biodegradable"
            value={stats.nonBiodegradableCount.toLocaleString()}
            sub={`${stats.nonBiodegradablePct}% of total`}
            icon={<Trash2 size={22} className="text-[#ACA7B6]" />}
          />
          <StatCard
            title="Bin Accuracy"
            value="98.5%"
            trend={isLoading ? "Loading..." : "Top tier performance"}
            icon={<TrendingUp size={22} className="text-[#917FBA]" />}
          />
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-[#25233F]/40 backdrop-blur-xl border border-[#44356F]/50 rounded-3xl p-8 shadow-[0_8px_30px_rgba(7,9,21,0.5)] transition-all duration-300 hover:border-[#674E98]/40 hover:shadow-[0_8px_40px_rgba(103,78,152,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-[#FAFAF9] tracking-tight">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {formattedActivity.length > 0 ? formattedActivity.map((item, index) => (
                <ActivityItem
                  key={index}
                  desc={item.desc}
                  time={item.time}
                  status={item.status}
                />
              )) : (
                <div className="text-center py-8">
                  <p className="text-[#ACA7B6] text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#25233F]/40 backdrop-blur-xl border border-[#44356F]/50 rounded-3xl p-8 shadow-[0_8px_30px_rgba(7,9,21,0.5)] flex flex-col hover:border-[#674E98]/40 transition-all duration-300">
            <h3 className="text-xl font-extrabold text-[#FAFAF9] tracking-tight mb-8 flex items-center gap-3">
              <AlertCircle size={22} className="text-[#917FBA]" />
              Segregation Tips
            </h3>
            
            <div className="flex-1 space-y-4">
              <div className="p-6 rounded-2xl bg-[#070915]/50 border border-[#44356F]/40 shadow-inner group hover:border-[#674E98]/50 transition-colors duration-300">
                <div className="inline-block text-[11px] font-extrabold text-[#D3B4D2] uppercase tracking-widest bg-[#674E98]/20 px-3 py-1.5 rounded-full border border-[#674E98]/30 mb-4">
                  Tip of the day
                </div>
                <p className="text-[#ACA7B6] mt-1 text-[15px] font-medium leading-relaxed">
                  Always rinse plastic containers before placing them in the blue bin.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* Helper Components */

const StatCard = ({ title, value, sub, trend, icon }) => (
  <div className="bg-[#25233F]/40 backdrop-blur-xl border border-[#44356F]/50 p-6 rounded-3xl hover:bg-[#25233F]/60 hover:border-[#674E98]/60 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,9,21,0.6)] transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#674E98]/5 rounded-full blur-2xl group-hover:bg-[#674E98]/10 transition-colors pointer-events-none" />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-[#070915]/50 rounded-2xl border border-[#44356F]/60 shadow-inner group-hover:border-[#917FBA]/40 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="text-[11px] font-bold tracking-wide text-[#917FBA] bg-[#674E98]/20 px-3 py-1.5 rounded-full border border-[#674E98]/30">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-[#ACA7B6] text-sm font-semibold tracking-wide mb-1.5">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#FAFAF9] tracking-tight">{value}</span>
        </div>
        {sub && <p className="text-xs font-medium text-[#ACA7B6]/80 mt-2">{sub}</p>}
      </div>
    </div>
  </div>
);

const ActivityItem = ({ desc, time, status }) => (
  <div className="flex items-center justify-between p-4 sm:p-5 bg-[#070915]/40 rounded-2xl border border-[#44356F]/40 hover:-translate-y-0.5 hover:border-[#674E98]/60 hover:bg-[#25233F]/40 hover:shadow-[0_8px_20px_rgba(7,9,21,0.4)] transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#25233F] border border-[#44356F] text-[#917FBA] shadow-inner group-hover:border-[#917FBA]/40 group-hover:text-[#D3B4D2] transition-colors">
        <Recycle size={20} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#FAFAF9] group-hover:text-[#D3B4D2] transition-colors">{desc}</p>
        <p className="text-xs font-medium text-[#ACA7B6] mt-1">{time}</p>
      </div>
    </div>
    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D3B4D2] border border-[#674E98]/40 bg-[#674E98]/20 px-3 py-1.5 rounded-full shadow-sm">
      {status}
    </span>
  </div>
);

export default Dashboard;