// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart3, 
//   TrendingUp, 
//   Leaf, 
//   Trash2, 
//   Info, 
//   ArrowUpRight, 
//   AlertCircle
// } from 'lucide-react';
// import { getDashboardAnalytics } from '../api/dashboard';

// const Analytics = () => {
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const data = await getDashboardAnalytics();
//         if (data.success) {
//           setAnalyticsData(data.data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch analytics:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchAnalytics();
//   }, []);

//   const safeNumber = (value) => {
//     const parsed = Number(value);
//     return Number.isFinite(parsed) ? parsed : 0;
//   };

//   const clampPercent = (value) => {
//     const parsed = safeNumber(value);
//     const rounded = Math.round(parsed * 10) / 10;
//     return Math.min(100, Math.max(0, rounded));
//   };

//   const analytics = analyticsData || {
//     bioVsNonBioPercentage: { biodegradable: 0, "non-biodegradable": 0 },
//     binUsagePercentage: { green: 0, blue: 0, black: 0 },
//     totalClassificationsOverTime: []
//   };

//   const activitySeries = Array.isArray(analytics.totalClassificationsOverTime)
//     ? analytics.totalClassificationsOverTime
//     : [];

//   const totalClassifications = activitySeries.reduce((sum, entry) => sum + safeNumber(entry.count), 0);
//   const activeDays = activitySeries.length;
//   const avgPerDay = activeDays > 0 ? Math.round((totalClassifications / activeDays) * 10) / 10 : 0;
//   const lastActiveDate = activeDays > 0 ? activitySeries[activitySeries.length - 1].date : null;

//   const bioPercent = clampPercent(analytics.bioVsNonBioPercentage?.biodegradable);
//   const nonBioPercent = clampPercent(analytics.bioVsNonBioPercentage?.["non-biodegradable"]);
//   const greenPercent = clampPercent(analytics.binUsagePercentage?.green);
//   const bluePercent = clampPercent(analytics.binUsagePercentage?.blue);
//   const blackPercent = clampPercent(analytics.binUsagePercentage?.black);

//   const biodegradableCount = totalClassifications > 0
//     ? Math.round((bioPercent / 100) * totalClassifications)
//     : 0;
//   const nonBiodegradableCount = totalClassifications > 0
//     ? Math.max(0, totalClassifications - biodegradableCount)
//     : 0;
//   const greenBinCount = totalClassifications > 0
//     ? Math.round((greenPercent / 100) * totalClassifications)
//     : 0;
//   const blueBinCount = totalClassifications > 0
//     ? Math.round((bluePercent / 100) * totalClassifications)
//     : 0;
//   const blackBinCount = totalClassifications > 0
//     ? Math.max(0, totalClassifications - greenBinCount - blueBinCount)
//     : 0;

//   const computeTrend = (series) => {
//     if (!Array.isArray(series) || series.length < 2) {
//       return null;
//     }

//     const windowSize = Math.min(7, Math.floor(series.length / 2));
//     if (windowSize < 1) {
//       return null;
//     }

//     const recent = series.slice(-windowSize);
//     const previous = series.slice(-(windowSize * 2), -windowSize);
//     const recentSum = recent.reduce((sum, entry) => sum + safeNumber(entry.count), 0);
//     const previousSum = previous.reduce((sum, entry) => sum + safeNumber(entry.count), 0);

//     if (previousSum === 0) {
//       return null;
//     }

//     const delta = Math.round(((recentSum - previousSum) / previousSum) * 100);
//     return {
//       delta,
//       label: `${delta > 0 ? '+' : ''}${delta}%`,
//       up: delta >= 0,
//       windowSize
//     };
//   };

//   const trendSummary = computeTrend(activitySeries);
//   const diversionRate = Math.min(100, Math.max(0, Math.round(greenPercent + bluePercent)));

//   const insights = [];
//   if (totalClassifications > 0) {
//     if (diversionRate >= 70) {
//       insights.push({
//         type: 'positive',
//         text: `Great work. ${diversionRate}% of your items were diverted from landfill.`
//       });
//     } else if (diversionRate > 0) {
//       insights.push({
//         type: 'suggestion',
//         text: `${diversionRate}% of items were diverted. Aim to increase green and blue bin usage.`
//       });
//     }

//     if (bioPercent >= 60) {
//       insights.push({
//         type: 'positive',
//         text: `Biodegradable items make up ${bioPercent}% of your classifications.`
//       });
//     } else if (nonBioPercent >= 60) {
//       insights.push({
//         type: 'suggestion',
//         text: `Non-biodegradable items are ${nonBioPercent}% of your total. Consider reducing landfill waste.`
//       });
//     }

//     if (trendSummary && trendSummary.delta !== 0) {
//       insights.push({
//         type: trendSummary.up ? 'positive' : 'suggestion',
//         text: trendSummary.up
//           ? `Activity is up ${trendSummary.delta}% over the last ${trendSummary.windowSize} days.`
//           : `Activity is down ${Math.abs(trendSummary.delta)}% over the last ${trendSummary.windowSize} days.`
//       });
//     }
//   }

//   const hasData = totalClassifications > 0 && !loading;
//   const formatNumber = (value) => safeNumber(value).toLocaleString();

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
//       {/* 1. Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
//           <p className="mt-1 text-slate-400">Understand your waste segregation impact and trends.</p>
//         </div>
        
//         {/* Date Range Picker (Visual Only) */}
//         <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-800 rounded-lg p-1">
//           <button className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 rounded shadow-sm">Last 30 Days</button>
//           <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">3 Months</button>
//           <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Year</button>
//         </div>
//       </div>

//       {hasData ? (
//         <div className="space-y-6">
          
//           {/* 2. Summary Metrics Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Total Waste Card */}
//             <SummaryCard 
//               title="Total Waste Classified" 
//               value={formatNumber(totalClassifications)} 
//               unit="items"
//               trend={trendSummary?.label} 
//               trendUp={trendSummary?.up}
//               icon={<BarChart3 size={20} className="text-blue-400" />}
//               color="blue"
//             />
//             {/* Biodegradable Card */}
//             <SummaryCard 
//               title="Biodegradable" 
//               value={formatNumber(biodegradableCount)} 
//               unit="items"
//               subtext={`${bioPercent}% of total waste`}
//               icon={<Leaf size={20} className="text-emerald-400" />}
//               color="emerald"
//             />
//             {/* Non-Biodegradable Card */}
//             <SummaryCard 
//               title="Non-Biodegradable" 
//               value={formatNumber(nonBiodegradableCount)} 
//               unit="items"
//               subtext={`${nonBioPercent}% of total waste`}
//               icon={<Trash2 size={20} className="text-slate-400" />}
//               color="slate"
//             />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
//             {/* 3. Bin Usage Breakdown */}
//             <div className="lg:col-span-2 bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-white">Bin Usage Distribution</h3>
//                 <span className="text-xs text-slate-500 flex items-center gap-1">
//                   <Info size={12} /> based on classification history
//                 </span>
//               </div>

//               <div className="space-y-6">
//                 {/* Green Bin Bar */}
//                 <BinProgressBar 
//                   label="Green Bin (Compost)" 
//                   percentage={greenPercent} 
//                   count={`${formatNumber(greenBinCount)} items`} 
//                   color="bg-emerald-500" 
//                   textColor="text-emerald-400" 
//                 />

//                 {/* Blue Bin Bar */}
//                 <BinProgressBar 
//                   label="Blue Bin (Recycling)" 
//                   percentage={bluePercent} 
//                   count={`${formatNumber(blueBinCount)} items`} 
//                   color="bg-blue-500" 
//                   textColor="text-blue-400" 
//                 />

//                 {/* Black Bin Bar */}
//                 <BinProgressBar 
//                   label="Black Bin (Landfill)" 
//                   percentage={blackPercent} 
//                   count={`${formatNumber(blackBinCount)} items`} 
//                   color="bg-slate-500" 
//                   textColor="text-slate-400" 
//                 />
//               </div>

//               <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
//                  <div>
//                    <div className="text-2xl font-bold text-white">{formatNumber(activeDays)}</div>
//                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Active Days</div>
//                  </div>
//                  <div>
//                    <div className="text-2xl font-bold text-white">{avgPerDay}</div>
//                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg / Day</div>
//                  </div>
//                  <div>
//                    <div className="text-2xl font-bold text-white">{lastActiveDate || "--"}</div>
//                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Last Active</div>
//                  </div>
//               </div>
//             </div>

//             {/* 4. User Insights Section */}
//             <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
//               <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
//                 <TrendingUp size={20} className="text-emerald-500" />
//                 Key Insights
//               </h3>
              
//               <div className="space-y-4 flex-1">
//                 {insights.length > 0 ? (
//                   insights.map((insight, index) => (
//                     <InsightItem 
//                       key={index}
//                       text={insight.text}
//                       type={insight.type}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-sm text-slate-400">
//                     No insights yet. Classify more items to unlock trends.
//                   </p>
//                 )}
//               </div>

//               <button className="mt-6 w-full py-2.5 text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2">
//                 Download Report <ArrowUpRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : loading ? (
//         <div className="min-h-[400px] flex items-center justify-center">
//           <div className="text-white">Loading analytics...</div>
//         </div>
//       ) : (
//         /* 5. Empty / Initial State */
//         <div className="min-h-[400px] flex flex-col items-center justify-center bg-slate-800/30 border border-slate-800 border-dashed rounded-xl p-8 text-center">
//           <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm">
//             <BarChart3 size={32} className="text-slate-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-white mb-2">No analytics available yet</h3>
//           <p className="text-slate-400 max-w-md mx-auto mb-8">
//             We need a bit more data to generate insights. Start classifying your waste items to see your impact breakdown here.
//           </p>
//           <a href="/classify" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
//             Start Classifying Waste
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// /* --- Helper Components --- */

// const SummaryCard = ({ title, value, unit, trend, trendUp, icon, color, subtext }) => {
//   const colorClasses = {
//     blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
//     emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
//     slate: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
//   };

//   return (
//     <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
//       <div className="flex justify-between items-start mb-4">
//         <div className={`p-2.5 rounded-lg border ${colorClasses[color]}`}>
//           {icon}
//         </div>
//         {trend && (
//           <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
//             trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
//           }`}>
//             {trend}
//           </div>
//         )}
//       </div>
//       <div>
//         <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
//         <div className="flex items-baseline gap-2">
//           <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
//           <span className="text-xs text-slate-500 font-medium">{unit}</span>
//         </div>
//         {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
//       </div>
//     </div>
//   );
// };

// const BinProgressBar = ({ label, percentage, count, color, textColor }) => (
//   <div>
//     <div className="flex justify-between items-end mb-2">
//       <span className={`text-sm font-medium ${textColor}`}>{label}</span>
//       <div className="text-right">
//         <span className="text-white font-bold">{percentage}%</span>
//         <span className="text-xs text-slate-500 ml-2">({count})</span>
//       </div>
//     </div>
//     <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
//       <div 
//         className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   </div>
// );

// const InsightItem = ({ text, type }) => {
//   let icon;
//   let borderColor;

//   if (type === 'positive') {
//     icon = <TrendingUp size={16} className="text-emerald-400" />;
//     borderColor = 'border-l-emerald-500';
//   } else if (type === 'suggestion') {
//     icon = <AlertCircle size={16} className="text-amber-400" />;
//     borderColor = 'border-l-amber-500';
//   } else {
//     icon = <Info size={16} className="text-blue-400" />;
//     borderColor = 'border-l-blue-500';
//   }

//   return (
//     <div className={`bg-slate-900/50 border border-slate-800 rounded-r-lg border-l-4 ${borderColor} p-4`}>
//       <div className="flex gap-3">
//         <div className="mt-0.5 shrink-0">{icon}</div>
//         <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Trash2, 
  Info, 
  ArrowUpRight, 
  AlertCircle
} from 'lucide-react';
import { getDashboardAnalytics } from '../api/dashboard';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getDashboardAnalytics();
        if (data.success) {
          setAnalyticsData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const safeNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const clampPercent = (value) => {
    const parsed = safeNumber(value);
    const rounded = Math.round(parsed * 10) / 10;
    return Math.min(100, Math.max(0, rounded));
  };

  const analytics = analyticsData || {
    bioVsNonBioPercentage: { biodegradable: 0, "non-biodegradable": 0 },
    binUsagePercentage: { green: 0, blue: 0, black: 0 },
    totalClassificationsOverTime: []
  };

  const activitySeries = Array.isArray(analytics.totalClassificationsOverTime)
    ? analytics.totalClassificationsOverTime
    : [];

  const totalClassifications = activitySeries.reduce((sum, entry) => sum + safeNumber(entry.count), 0);
  const activeDays = activitySeries.length;
  const avgPerDay = activeDays > 0 ? Math.round((totalClassifications / activeDays) * 10) / 10 : 0;
  const lastActiveDate = activeDays > 0 ? activitySeries[activitySeries.length - 1].date : null;

  const bioPercent = clampPercent(analytics.bioVsNonBioPercentage?.biodegradable);
  const nonBioPercent = clampPercent(analytics.bioVsNonBioPercentage?.["non-biodegradable"]);
  const greenPercent = clampPercent(analytics.binUsagePercentage?.green);
  const bluePercent = clampPercent(analytics.binUsagePercentage?.blue);
  const blackPercent = clampPercent(analytics.binUsagePercentage?.black);

  const biodegradableCount = totalClassifications > 0
    ? Math.round((bioPercent / 100) * totalClassifications)
    : 0;
  const nonBiodegradableCount = totalClassifications > 0
    ? Math.max(0, totalClassifications - biodegradableCount)
    : 0;
  const greenBinCount = totalClassifications > 0
    ? Math.round((greenPercent / 100) * totalClassifications)
    : 0;
  const blueBinCount = totalClassifications > 0
    ? Math.round((bluePercent / 100) * totalClassifications)
    : 0;
  const blackBinCount = totalClassifications > 0
    ? Math.max(0, totalClassifications - greenBinCount - blueBinCount)
    : 0;

  const computeTrend = (series) => {
    if (!Array.isArray(series) || series.length < 2) {
      return null;
    }

    const windowSize = Math.min(7, Math.floor(series.length / 2));
    if (windowSize < 1) {
      return null;
    }

    const recent = series.slice(-windowSize);
    const previous = series.slice(-(windowSize * 2), -windowSize);
    const recentSum = recent.reduce((sum, entry) => sum + safeNumber(entry.count), 0);
    const previousSum = previous.reduce((sum, entry) => sum + safeNumber(entry.count), 0);

    if (previousSum === 0) {
      return null;
    }

    const delta = Math.round(((recentSum - previousSum) / previousSum) * 100);
    return {
      delta,
      label: `${delta > 0 ? '+' : ''}${delta}%`,
      up: delta >= 0,
      windowSize
    };
  };

  const trendSummary = computeTrend(activitySeries);
  const diversionRate = Math.min(100, Math.max(0, Math.round(greenPercent + bluePercent)));

  const insights = [];
  if (totalClassifications > 0) {
    if (diversionRate >= 70) {
      insights.push({
        type: 'positive',
        text: `Great work. ${diversionRate}% of your items were diverted from landfill.`
      });
    } else if (diversionRate > 0) {
      insights.push({
        type: 'suggestion',
        text: `${diversionRate}% of items were diverted. Aim to increase green and blue bin usage.`
      });
    }

    if (bioPercent >= 60) {
      insights.push({
        type: 'positive',
        text: `Biodegradable items make up ${bioPercent}% of your classifications.`
      });
    } else if (nonBioPercent >= 60) {
      insights.push({
        type: 'suggestion',
        text: `Non-biodegradable items are ${nonBioPercent}% of your total. Consider reducing landfill waste.`
      });
    }

    if (trendSummary && trendSummary.delta !== 0) {
      insights.push({
        type: trendSummary.up ? 'positive' : 'suggestion',
        text: trendSummary.up
          ? `Activity is up ${trendSummary.delta}% over the last ${trendSummary.windowSize} days.`
          : `Activity is down ${Math.abs(trendSummary.delta)}% over the last ${trendSummary.windowSize} days.`
      });
    }
  }

  const hasData = totalClassifications > 0 && !loading;
  const formatNumber = (value) => safeNumber(value).toLocaleString();

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#070915] font-sans">
      
      {/* 1. Elite Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#070915]">
        {/* Deep vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070915_100%)] z-10" />
        
        {/* Subtle noise texture simulation */}
        <div 
          className="absolute inset-0 opacity-[0.03] z-0 mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-[#674E98]/15 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-5%] w-[800px] h-[800px] bg-[#917FBA]/10 blur-[180px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D3B4D2]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* 2. Page Header — Premium hierarchy */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#44356F] via-[#674E98]/50 to-transparent" />
          
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-sm mb-3">Analytics</h1>
            <p className="text-[#ACA7B6] font-medium text-lg tracking-wide opacity-90">Understand your waste segregation impact and trends.</p>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex items-center p-1 bg-[#070915]/80 backdrop-blur-xl border border-[#44356F]/80 rounded-xl shadow-[0_8px_30px_rgba(7,9,21,0.6)] ring-1 ring-[#FAFAF9]/5">
            <button className="px-5 py-2.5 text-sm font-bold text-[#070915] bg-gradient-to-r from-[#ACA7B6] to-[#FAFAF9] rounded-lg shadow-sm transition-all duration-300">Last 30 Days</button>
            <button className="px-5 py-2.5 text-sm font-semibold text-[#ACA7B6] hover:text-[#FAFAF9] rounded-lg transition-colors duration-200">3 Months</button>
            <button className="px-5 py-2.5 text-sm font-semibold text-[#ACA7B6] hover:text-[#FAFAF9] rounded-lg transition-colors duration-200">Year</button>
          </div>
        </div>

        {hasData ? (
          <div className="space-y-10">
            
            {/* 3. Summary Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SummaryCard 
                title="Total Classified" 
                value={formatNumber(totalClassifications)} 
                unit="items"
                trend={trendSummary?.label} 
                trendUp={trendSummary?.up}
                icon={<BarChart3 size={24} className="text-[#917FBA]" strokeWidth={2} />}
                color="violet"
              />
              <SummaryCard 
                title="Biodegradable" 
                value={formatNumber(biodegradableCount)} 
                unit="items"
                subtext={`${bioPercent}% of total`}
                icon={<Leaf size={24} className="text-[#D3B4D2]" strokeWidth={2} />}
                color="pink"
              />
              <SummaryCard 
                title="Non-Biodegradable" 
                value={formatNumber(nonBiodegradableCount)} 
                unit="items"
                subtext={`${nonBioPercent}% of total`}
                icon={<Trash2 size={24} className="text-[#ACA7B6]" strokeWidth={2} />}
                color="slate"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 4. Bin Usage Card — Centerpiece */}
              <div className="lg:col-span-7 bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] p-10 shadow-[0_20px_60px_-15px_rgba(7,9,21,0.8)] ring-1 ring-[#FAFAF9]/5 transition-all duration-500 hover:border-[#674E98]/50 hover:shadow-[0_25px_65px_-15px_rgba(103,78,152,0.2)] flex flex-col relative overflow-hidden group">
                
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#917FBA]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <h3 className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight">Distribution</h3>
                  <span className="text-[11px] font-bold text-[#ACA7B6] uppercase tracking-widest flex items-center gap-2 bg-[#070915]/60 px-4 py-2 rounded-full border border-[#44356F]/50 shadow-inner">
                    <Info size={14} className="text-[#674E98]" /> Based on history
                  </span>
                </div>

                <div className="space-y-8 flex-1 flex flex-col justify-center relative z-10">
                  <BinProgressBar 
                    label="Green Bin (Compost)" 
                    percentage={greenPercent} 
                    count={`${formatNumber(greenBinCount)} items`} 
                    color="bg-gradient-to-r from-[#674E98] to-[#917FBA]" 
                    glowColor="shadow-[0_0_15px_rgba(145,127,186,0.5)]"
                    textColor="text-[#D3B4D2]" 
                  />
                  <BinProgressBar 
                    label="Blue Bin (Recycling)" 
                    percentage={bluePercent} 
                    count={`${formatNumber(blueBinCount)} items`} 
                    color="bg-gradient-to-r from-[#44356F] to-[#674E98]" 
                    glowColor="shadow-[0_0_15px_rgba(103,78,152,0.5)]"
                    textColor="text-[#917FBA]" 
                  />
                  <BinProgressBar 
                    label="Black Bin (Landfill)" 
                    percentage={blackPercent} 
                    count={`${formatNumber(blackBinCount)} items`} 
                    color="bg-gradient-to-r from-[#25233F] to-[#44356F]" 
                    glowColor="shadow-[0_0_15px_rgba(68,53,111,0.5)]"
                    textColor="text-[#ACA7B6]" 
                  />
                </div>

                <div className="mt-12 pt-8 border-t border-[#44356F]/40 grid grid-cols-3 gap-6 text-center relative z-10">
                   <div className="bg-[#070915]/40 backdrop-blur-md p-5 rounded-2xl border border-[#44356F]/30 hover:border-[#674E98]/50 hover:bg-[#25233F]/40 transition-all duration-300">
                     <div className="text-3xl font-extrabold text-[#FAFAF9] tracking-tight">{formatNumber(activeDays)}</div>
                     <div className="text-[10px] font-bold text-[#ACA7B6] uppercase tracking-widest mt-2">Active Days</div>
                   </div>
                   <div className="bg-[#070915]/40 backdrop-blur-md p-5 rounded-2xl border border-[#44356F]/30 hover:border-[#674E98]/50 hover:bg-[#25233F]/40 transition-all duration-300">
                     <div className="text-3xl font-extrabold text-[#FAFAF9] tracking-tight">{avgPerDay}</div>
                     <div className="text-[10px] font-bold text-[#ACA7B6] uppercase tracking-widest mt-2">Avg / Day</div>
                   </div>
                   <div className="bg-[#070915]/40 backdrop-blur-md p-5 rounded-2xl border border-[#44356F]/30 hover:border-[#674E98]/50 hover:bg-[#25233F]/40 transition-all duration-300">
                     <div className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight mt-1">{lastActiveDate || "--"}</div>
                     <div className="text-[10px] font-bold text-[#ACA7B6] uppercase tracking-widest mt-2">Last Active</div>
                   </div>
                </div>
              </div>

              {/* 5. Insights Panel — Intelligent premium */}
              <div className="lg:col-span-5 bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[32px] p-10 shadow-[0_20px_60px_-15px_rgba(7,9,21,0.8)] ring-1 ring-[#FAFAF9]/5 flex flex-col transition-all duration-500 hover:border-[#674E98]/50 hover:shadow-[0_25px_65px_-15px_rgba(103,78,152,0.2)] relative overflow-hidden group">
                
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D3B4D2]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="text-2xl font-extrabold text-[#FAFAF9] mb-10 flex items-center gap-3 tracking-tight relative z-10">
                  <div className="p-2.5 bg-[#070915]/60 rounded-xl border border-[#44356F]/50 shadow-inner">
                    <TrendingUp size={22} className="text-[#D3B4D2]" />
                  </div>
                  Key Insights
                </h3>
                
                <div className="space-y-5 flex-1 relative z-10">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <InsightItem 
                        key={index}
                        text={insight.text}
                        type={insight.type}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-[#070915]/40 rounded-2xl border border-[#44356F]/30 border-dashed backdrop-blur-md">
                      <p className="text-base font-medium text-[#ACA7B6] leading-relaxed">
                        No insights yet. Classify more items to unlock trends.
                      </p>
                    </div>
                  )}
                </div>

                <button className="mt-10 w-full py-4.5 text-sm font-bold text-[#FAFAF9] bg-[#070915]/60 backdrop-blur-xl border border-[#44356F]/80 hover:bg-[#25233F]/80 hover:border-[#917FBA]/60 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(7,9,21,0.4)] hover:shadow-[0_8px_25px_rgba(145,127,186,0.25)] hover:scale-[1.015] relative overflow-hidden z-10">
                  <span className="absolute inset-0 bg-gradient-to-b from-[#FAFAF9]/5 to-transparent pointer-events-none" />
                  Download Report <ArrowUpRight size={18} strokeWidth={2.5} className="text-[#917FBA]" />
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          /* 7. Loading State */
          <div className="min-h-[500px] flex flex-col items-center justify-center">
             <div className="p-6 bg-[#25233F]/40 backdrop-blur-xl rounded-3xl border border-[#44356F]/50 shadow-[0_0_40px_rgba(103,78,152,0.15)] mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#674E98]/10 to-transparent animate-[shimmer_2s_infinite]" />
                <BarChart3 size={40} className="text-[#917FBA] animate-pulse" strokeWidth={1.5} />
             </div>
            <div className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-sm">Analyzing data...</div>
          </div>
        ) : (
          /* 6. Empty State */
          <div className="min-h-[500px] flex flex-col items-center justify-center bg-[#25233F]/20 backdrop-blur-2xl border border-[#44356F]/40 border-dashed rounded-[32px] p-12 text-center shadow-[0_20px_60px_-15px_rgba(7,9,21,0.8)] relative overflow-hidden group transition-all duration-500 hover:border-[#674E98]/40 hover:bg-[#25233F]/30">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#674E98]/10 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="w-24 h-24 bg-[#070915]/80 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 shadow-[inset_0_2px_20px_rgba(103,78,152,0.2),0_10px_30px_rgba(7,9,21,0.6)] border border-[#44356F]/60 group-hover:border-[#917FBA]/50 transition-colors duration-500 relative z-10">
              <BarChart3 size={44} className="text-[#674E98] group-hover:text-[#917FBA] transition-colors duration-500" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl font-extrabold text-[#FAFAF9] mb-4 tracking-tight relative z-10 drop-shadow-sm">No analytics available</h3>
            
            <p className="text-[#ACA7B6] max-w-md mx-auto mb-12 text-lg font-medium leading-relaxed relative z-10">
              We need a bit more data to generate insights. Start classifying your waste items to see your impact breakdown here.
            </p>
            
            <a 
              href="/classify" 
              className="px-10 py-4.5 bg-gradient-to-r from-[#674E98] to-[#917FBA] text-[#070915] font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(103,78,152,0.3)] hover:shadow-[0_15px_40px_rgba(145,127,186,0.5)] transform hover:-translate-y-1 hover:scale-[1.02] ring-1 ring-[#FAFAF9]/20 relative overflow-hidden z-10 group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF9]/20 to-transparent pointer-events-none" />
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-[#FAFAF9]/30 to-transparent skew-x-[45deg] group-hover/btn:animate-[shine_1.5s_ease-out_forwards]" />
              <span className="relative drop-shadow-sm">Start Classifying Waste</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Helper Components --- */

const SummaryCard = ({ title, value, unit, trend, trendUp, icon, color, subtext }) => {
  const colorClasses = {
    violet: 'bg-[#674E98]/15 text-[#917FBA] border-[#674E98]/40 shadow-[0_0_20px_rgba(103,78,152,0.2)]',
    pink: 'bg-[#917FBA]/15 text-[#D3B4D2] border-[#917FBA]/40 shadow-[0_0_20px_rgba(145,127,186,0.2)]',
    slate: 'bg-[#070915]/60 text-[#ACA7B6] border-[#44356F]/60 shadow-[0_0_20px_rgba(37,35,63,0.4)]',
  };

  return (
    <div className="bg-[#25233F]/30 backdrop-blur-2xl border border-[#44356F]/60 rounded-[28px] p-8 hover:bg-[#25233F]/50 hover:border-[#674E98]/50 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-10px_rgba(7,9,21,0.8),0_0_30px_rgba(103,78,152,0.15)] transition-all duration-500 relative overflow-hidden group ring-1 ring-[#FAFAF9]/5">
      
      {/* Top highlight line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FAFAF9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FAFAF9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={`p-4 rounded-2xl border backdrop-blur-md ${colorClasses[color]}`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-[11px] font-extrabold px-3.5 py-2 rounded-full tracking-widest uppercase border shadow-sm ${
              trendUp ? 'text-[#D3B4D2] bg-[#917FBA]/15 border-[#917FBA]/30' : 'text-[#ACA7B6] bg-[#070915]/50 border-[#44356F]/50'
            }`}>
              {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-[#ACA7B6] text-sm font-bold tracking-widest uppercase mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-md">{value}</span>
            <span className="text-base text-[#674E98] font-bold">{unit}</span>
          </div>
          {subtext && (
            <div className="mt-4">
               <span className="text-xs font-bold text-[#ACA7B6]/90 bg-[#070915]/60 px-3 py-1.5 rounded-lg border border-[#44356F]/40 shadow-inner inline-block tracking-wide">
                 {subtext}
               </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BinProgressBar = ({ label, percentage, count, color, glowColor, textColor }) => (
  <div className="group/bar">
    <div className="flex justify-between items-end mb-3.5">
      <span className={`text-sm font-extrabold tracking-widest uppercase ${textColor}`}>{label}</span>
      <div className="text-right flex items-center gap-3">
        <span className="text-xs font-bold text-[#ACA7B6] bg-[#070915]/60 px-2.5 py-1 rounded-md border border-[#44356F]/40 shadow-inner">{count}</span>
        <span className="text-[#FAFAF9] font-extrabold text-xl">{percentage}%</span>
      </div>
    </div>
    <div className="h-4 w-full bg-[#070915]/80 rounded-full overflow-hidden border border-[#44356F]/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] p-[2px]">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color} ${glowColor} relative group-hover/bar:brightness-110`} 
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF9]/30 to-transparent rounded-full" />
      </div>
    </div>
  </div>
);

const InsightItem = ({ text, type }) => {
  let icon;
  let borderColor;
  let bgColor;

  if (type === 'positive') {
    icon = <TrendingUp size={20} className="text-[#D3B4D2]" strokeWidth={2.5} />;
    borderColor = 'border-l-[#D3B4D2]';
    bgColor = 'bg-[#917FBA]/10';
  } else if (type === 'suggestion') {
    icon = <AlertCircle size={20} className="text-[#674E98]" strokeWidth={2.5} />;
    borderColor = 'border-l-[#674E98]';
    bgColor = 'bg-[#44356F]/30';
  } else {
    icon = <Info size={20} className="text-[#917FBA]" strokeWidth={2.5} />;
    borderColor = 'border-l-[#917FBA]';
    bgColor = 'bg-[#674E98]/15';
  }

  return (
    <div className={`${bgColor} backdrop-blur-md border border-[#44356F]/60 rounded-r-2xl border-l-4 ${borderColor} p-6 hover:bg-[#25233F]/70 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(7,9,21,0.5)] transition-all duration-300 group/insight`}>
      <div className="flex gap-5 items-start">
        <div className="mt-0.5 shrink-0 bg-[#070915]/70 p-2.5 rounded-xl border border-[#44356F]/50 shadow-inner group-hover/insight:scale-110 transition-transform duration-300">{icon}</div>
        <p className="text-[15px] text-[#FAFAF9] font-medium leading-relaxed pt-1 opacity-90 group-hover/insight:opacity-100 transition-opacity">{text}</p>
      </div>
    </div>
  );
};

export default Analytics;