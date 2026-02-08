import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Leaf, 
  Recycle, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  MoreHorizontal
} from 'lucide-react';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const formatBinLabel = (binColor) => {
    const value = String(binColor || '').trim().toLowerCase();
    if (value.includes('green')) return 'Green Bin';
    if (value.includes('blue')) return 'Blue Bin';
    if (value.includes('black')) return 'Black Bin';
    if (!value) return 'Black Bin';
    return `${value.charAt(0).toUpperCase()}${value.slice(1)} Bin`;
  };

  const formatWasteType = (wasteType) => {
    const value = String(wasteType || '').trim();
    if (!value) return '';
    const normalized = value.replace(/[-_]/g, ' ');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const formatDateTime = (timestamp) => {
    const dateObj = new Date(timestamp);
    if (Number.isNaN(dateObj.getTime())) {
      return { date: '', time: '' };
    }
    return {
      date: dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      time: dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`http://localhost:3000/api/waste/history?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to fetch history');
        }

        const records = payload?.data?.history || payload?.data || [];
        const pagination = payload?.data?.pagination;
        const normalized = Array.isArray(records)
          ? records.map((record, index) => {
              const { date, time } = formatDateTime(record?.createdAt);
              return {
                id: record?._id || record?.id || `${record?.createdAt || 'item'}-${index}`,
                item: record?.wasteName || record?.inputValue || '',
                type: formatWasteType(record?.wasteType),
                bin: formatBinLabel(record?.binColor),
                date,
                time,
              };
            })
          : [];

        if (isMounted) {
          setHistoryItems(normalized);
          if (pagination && typeof pagination.total === 'number') {
            setTotalCount(pagination.total);
          } else {
            setTotalCount(normalized.length);
          }
          if (pagination && typeof pagination.pages === 'number') {
            setTotalPages(pagination.pages || 1);
          } else {
            setTotalPages(1);
          }
        }
      } catch (error) {
        if (isMounted) {
          setHistoryItems([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [page, limit]);

  const getBinStyles = (bin) => {
    switch (bin) {
      case 'Green Bin':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Blue Bin':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Black Bin':
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getIcon = (bin) => {
    switch (bin) {
      case 'Green Bin': return <Leaf size={14} />;
      case 'Blue Bin': return <Recycle size={14} />;
      default: return <Trash2 size={14} />;
    }
  };

  const showEmptyState = !loading && historyItems.length === 0;
  const totalResults = Number.isInteger(totalCount) ? totalCount : historyItems.length;
  const canGoPrev = !loading && page > 1;
  const canGoNext = !loading && page < totalPages;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
          <p className="mt-1 text-slate-400">Review your past waste classifications.</p>
        </div>
        
        {/* Optional Action Bar (Visual Only) */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 2. Main History Content */}
      <div className="bg-slate-800/50 border border-slate-800 rounded-xl shadow-sm overflow-hidden backdrop-blur-sm">
        
        {historyItems.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Classification</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Bin Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {historyItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-800/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-white">{item.item}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{item.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBinStyles(item.bin)}`}>
                          {getIcon(item.bin)}
                          {item.bin}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-300">{item.date}</span>
                          <span className="text-xs text-slate-500">{item.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-700 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-800">
              {historyItems.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{item.item}</h3>
                      <p className="text-sm text-slate-400">{item.type}</p>
                    </div>
                    <button className="text-slate-500 hover:text-white">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBinStyles(item.bin)}`}>
                      {getIcon(item.bin)}
                      {item.bin}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={12} />
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Footer (Visual Only) */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <span className="text-sm text-slate-500">Showing {historyItems.length} of {totalResults} results</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm text-slate-400 border border-slate-700 rounded hover:bg-slate-800 disabled:opacity-50"
                  disabled={!canGoPrev}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 text-sm text-slate-400 border border-slate-700 rounded hover:bg-slate-800 disabled:opacity-50"
                  disabled={!canGoNext}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : showEmptyState ? (
          /* 3. Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-slate-900/50 p-4 rounded-full mb-4 border border-slate-800">
              <Clock size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No waste classifications yet</h3>
            <p className="text-slate-400 max-w-sm text-sm mb-6">
              Start classifying items to build your history and track your environmental impact.
            </p>
            <a href="/classify" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-medium rounded-lg transition-colors text-sm">
              Classify Your First Item
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default History;
