import React, { useEffect, useMemo, useState } from 'react';
import { getDashboardSummary } from '../api/dashboard';
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


  const auth = ()=>{
    if(!localStorage.getItem("token")){
      toast.info("Please login!")
      nav("/login");
      return false;
    }
    return true;
  }

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
  },[nav])

  const stats = useMemo(() => {
    const totalItems = Number(dashboardData?.totalItems) || 0;
    const biodegradableCount = Number(dashboardData?.biodegradableCount) || 0;
    const nonBiodegradableCount = Number(dashboardData?.nonBiodegradableCount) || 0;
    const biodegradablePct = totalItems > 0 ? Math.round((biodegradableCount / totalItems) * 100) : 0;
    const nonBiodegradablePct = totalItems > 0 ? Math.round((nonBiodegradableCount / totalItems) * 100) : 0;
    const divertedKg = (biodegradableCount * 0.1).toFixed(1);
    return {
      totalItems,
      biodegradableCount,
      nonBiodegradableCount,
      biodegradablePct,
      nonBiodegradablePct,
      divertedKg,
    };
  }, [dashboardData]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pt-16">

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-emerald-900/20 border border-slate-800 shadow-lg">
          <div className="relative z-10 p-8 sm:p-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, Alex!
            </h1>
            <p className="text-slate-400 max-w-xl text-lg mb-8">
              You've diverted <span className="text-emerald-400 font-semibold">{stats.divertedKg}kg</span> of waste from landfills this month.
            </p>
            <button
              onClick={() => nav("/classify")}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-semibold py-3 px-6 rounded-lg transition-all shadow-md shadow-emerald-900/20 hover:shadow-emerald-900/40"
            >
              <ScanLine size={20} />
              Classify Waste Now
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Items Analyzed"
            value={stats.totalItems.toLocaleString()}
            trend={isLoading ? "Loading..." : "+12% vs last month"}
            icon={<Activity size={20} className="text-blue-400" />}
          />
          <StatCard
            title="Biodegradable"
            value={stats.biodegradableCount.toLocaleString()}
            sub={`${stats.biodegradablePct}% of total`}
            icon={<Leaf size={20} className="text-emerald-400" />}
          />
          <StatCard
            title="Non-Biodegradable"
            value={stats.nonBiodegradableCount.toLocaleString()}
            sub={`${stats.nonBiodegradablePct}% of total`}
            icon={<Trash2 size={20} className="text-amber-400" />}
          />
          <StatCard
            title="Bin Accuracy"
            value="98.5%"
            trend={isLoading ? "Loading..." : "Top tier performance"}
            icon={<TrendingUp size={20} className="text-purple-400" />}
          />
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              <ActivityItem
                desc="Apple Core classified as Compost"
                time="2 mins ago"
                status="Correct"
              />
              <ActivityItem
                desc="Water Bottle classified as Recycle"
                time="15 mins ago"
                status="Correct"
              />
              <ActivityItem
                desc="Cardboard Box classified as Recycle"
                time="1 hour ago"
                status="Review"
              />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-emerald-500" />
              Segregation Tips
            </h3>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  Tip of the day
                </span>
                <p className="text-slate-300 mt-2 text-sm">
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
  <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/10">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm">{title}</h3>
    <span className="text-2xl font-bold text-white">{value}</span>
    {sub && <p className="text-xs text-slate-500">{sub}</p>}
  </div>
);

const ActivityItem = ({ desc, time, status }) => (
  <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-800/50">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <Recycle size={18} />
      </div>
      <div>
        <p className="text-sm font-medium">{desc}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
    <span className="text-xs text-emerald-400 border border-emerald-400/10 px-2 py-1 rounded-full">
      {status}
    </span>
  </div>
);

export default Dashboard;
