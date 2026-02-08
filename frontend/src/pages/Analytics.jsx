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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="mt-1 text-slate-400">Understand your waste segregation impact and trends.</p>
        </div>
        
        {/* Date Range Picker (Visual Only) */}
        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-800 rounded-lg p-1">
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 rounded shadow-sm">Last 30 Days</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">3 Months</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Year</button>
        </div>
      </div>

      {hasData ? (
        <div className="space-y-6">
          
          {/* 2. Summary Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Waste Card */}
            <SummaryCard 
              title="Total Waste Classified" 
              value={formatNumber(totalClassifications)} 
              unit="items"
              trend={trendSummary?.label} 
              trendUp={trendSummary?.up}
              icon={<BarChart3 size={20} className="text-blue-400" />}
              color="blue"
            />
            {/* Biodegradable Card */}
            <SummaryCard 
              title="Biodegradable" 
              value={formatNumber(biodegradableCount)} 
              unit="items"
              subtext={`${bioPercent}% of total waste`}
              icon={<Leaf size={20} className="text-emerald-400" />}
              color="emerald"
            />
            {/* Non-Biodegradable Card */}
            <SummaryCard 
              title="Non-Biodegradable" 
              value={formatNumber(nonBiodegradableCount)} 
              unit="items"
              subtext={`${nonBioPercent}% of total waste`}
              icon={<Trash2 size={20} className="text-slate-400" />}
              color="slate"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 3. Bin Usage Breakdown */}
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Bin Usage Distribution</h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Info size={12} /> based on classification history
                </span>
              </div>

              <div className="space-y-6">
                {/* Green Bin Bar */}
                <BinProgressBar 
                  label="Green Bin (Compost)" 
                  percentage={greenPercent} 
                  count={`${formatNumber(greenBinCount)} items`} 
                  color="bg-emerald-500" 
                  textColor="text-emerald-400" 
                />

                {/* Blue Bin Bar */}
                <BinProgressBar 
                  label="Blue Bin (Recycling)" 
                  percentage={bluePercent} 
                  count={`${formatNumber(blueBinCount)} items`} 
                  color="bg-blue-500" 
                  textColor="text-blue-400" 
                />

                {/* Black Bin Bar */}
                <BinProgressBar 
                  label="Black Bin (Landfill)" 
                  percentage={blackPercent} 
                  count={`${formatNumber(blackBinCount)} items`} 
                  color="bg-slate-500" 
                  textColor="text-slate-400" 
                />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
                 <div>
                   <div className="text-2xl font-bold text-white">{formatNumber(activeDays)}</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Active Days</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-white">{avgPerDay}</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg / Day</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-white">{lastActiveDate || "--"}</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Last Active</div>
                 </div>
              </div>
            </div>

            {/* 4. User Insights Section */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Key Insights
              </h3>
              
              <div className="space-y-4 flex-1">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <InsightItem 
                      key={index}
                      text={insight.text}
                      type={insight.type}
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No insights yet. Classify more items to unlock trends.
                  </p>
                )}
              </div>

              <button className="mt-6 w-full py-2.5 text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                Download Report <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-white">Loading analytics...</div>
        </div>
      ) : (
        /* 5. Empty / Initial State */
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-slate-800/30 border border-slate-800 border-dashed rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <BarChart3 size={32} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No analytics available yet</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            We need a bit more data to generate insights. Start classifying your waste items to see your impact breakdown here.
          </p>
          <a href="/classify" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
            Start Classifying Waste
          </a>
        </div>
      )}
    </div>
  );
};

/* --- Helper Components --- */

const SummaryCard = ({ title, value, unit, trend, trendUp, icon, color, subtext }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    slate: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
  };

  return (
    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
          }`}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          <span className="text-xs text-slate-500 font-medium">{unit}</span>
        </div>
        {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

const BinProgressBar = ({ label, percentage, count, color, textColor }) => (
  <div>
    <div className="flex justify-between items-end mb-2">
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      <div className="text-right">
        <span className="text-white font-bold">{percentage}%</span>
        <span className="text-xs text-slate-500 ml-2">({count})</span>
      </div>
    </div>
    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const InsightItem = ({ text, type }) => {
  let icon;
  let borderColor;

  if (type === 'positive') {
    icon = <TrendingUp size={16} className="text-emerald-400" />;
    borderColor = 'border-l-emerald-500';
  } else if (type === 'suggestion') {
    icon = <AlertCircle size={16} className="text-amber-400" />;
    borderColor = 'border-l-amber-500';
  } else {
    icon = <Info size={16} className="text-blue-400" />;
    borderColor = 'border-l-blue-500';
  }

  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-r-lg border-l-4 ${borderColor} p-4`}>
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default Analytics;
