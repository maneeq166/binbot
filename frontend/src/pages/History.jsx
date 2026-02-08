import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Leaf, 
  Recycle, 
  Trash2, 
  Filter, 
  Download,
  MoreHorizontal
} from 'lucide-react';
import { getWasteHistory } from '../api/waste';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const isMountedRef = useRef(false);
  const copyTimerRef = useRef(null);
  const navigate = useNavigate();

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

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await getWasteHistory(page, limit);
      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to fetch history');
      }

      const records = payload?.data?.history || [];
      const pagination = payload?.data?.pagination;
      const normalized = Array.isArray(records)
        ? records.map((record, index) => {
            const { date, time } = formatDateTime(record?.createdAt || record?.updatedAt);
            return {
              id: record?._id || record?.id || `${record?.createdAt || 'item'}-${index}`,
              item: record?.wasteName || record?.inputValue || record?.wastename || 'Unknown item',
              type: formatWasteType(record?.wasteType) || 'Unclassified',
              bin: formatBinLabel(record?.binColor),
              date,
              time,
            };
          })
        : [];

      if (isMountedRef.current) {
        setHistoryItems(normalized);
        setActiveMenuId(null);
        if (pagination && typeof pagination.total === 'number') {
          setTotalCount(pagination.total);
        } else {
          setTotalCount(normalized.length);
        }
        if (pagination && typeof pagination.pages === 'number') {
          const nextPages = pagination.pages || 1;
          setTotalPages(nextPages);
          if (page > nextPages) {
            setPage(nextPages);
          }
        } else {
          setTotalPages(1);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setHistoryItems([]);
        setTotalCount(0);
        setTotalPages(1);
        setError(error?.message || 'Unable to load history.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [limit, page]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchHistory();
    return () => {
      isMountedRef.current = false;
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, [fetchHistory]);

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

  const handleCopyItem = async (item) => {
    const value = String(item?.item || '').trim();
    if (!value || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(item.id);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy item name', err);
    }
  };

  const handleReclassify = (item) => {
    const value = String(item?.item || '').trim();
    if (!value) return;
    const params = new URLSearchParams({ query: value });
    navigate(`/classify?${params.toString()}`);
  };

  const toggleMenu = (id) => {
    setActiveMenuId((current) => (current === id ? null : id));
  };

  const showEmptyState = !loading && historyItems.length === 0;
  const totalResults = Number.isInteger(totalCount) ? totalCount : historyItems.length;
  const canGoPrev = !loading && page > 1;
  const canGoNext = !loading && page < totalPages;
  const hasClipboard = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText);

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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-slate-900/50 p-4 rounded-full mb-4 border border-slate-800">
              <Clock size={28} className="text-slate-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Loading history</h3>
            <p className="text-slate-400 max-w-sm text-sm">
              Fetching your latest waste classifications.
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-rose-500/10 p-4 rounded-full mb-4 border border-rose-500/20">
              <Trash2 size={28} className="text-rose-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Unable to load history</h3>
            <p className="text-slate-400 max-w-sm text-sm mb-6">{error}</p>
            <button
              type="button"
              onClick={fetchHistory}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : historyItems.length > 0 ? (
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
                          <span className="text-sm text-slate-300">{item.date || '--'}</span>
                          <span className="text-xs text-slate-500">{item.time || '--'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-flex justify-end">
                          <button
                            type="button"
                            onClick={() => toggleMenu(item.id)}
                            className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-700 transition-colors"
                            aria-haspopup="menu"
                            aria-expanded={activeMenuId === item.id}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {activeMenuId === item.id && (
                            <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border border-slate-700 bg-slate-900/95 shadow-lg backdrop-blur-sm p-1 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  handleReclassify(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                              >
                                Reclassify item
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyItem(item)}
                                disabled={!hasClipboard || !item.item}
                                className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-md transition-colors disabled:text-slate-500 disabled:hover:bg-transparent"
                              >
                                {copiedId === item.id ? 'Copied' : 'Copy item name'}
                              </button>
                              {!hasClipboard && (
                                <div className="px-3 pb-2 text-[11px] text-slate-500">
                                  Clipboard not available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
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
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.id)}
                        className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-700 transition-colors"
                        aria-haspopup="menu"
                        aria-expanded={activeMenuId === item.id}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 top-8 z-10 w-48 rounded-lg border border-slate-700 bg-slate-900/95 shadow-lg backdrop-blur-sm p-1 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              handleReclassify(item);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                          >
                            Reclassify item
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyItem(item)}
                            disabled={!hasClipboard || !item.item}
                            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-md transition-colors disabled:text-slate-500 disabled:hover:bg-transparent"
                          >
                            {copiedId === item.id ? 'Copied' : 'Copy item name'}
                          </button>
                          {!hasClipboard && (
                            <div className="px-3 pb-2 text-[11px] text-slate-500">
                              Clipboard not available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBinStyles(item.bin)}`}>
                      {getIcon(item.bin)}
                      {item.bin}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={12} />
                      <span>{item.date || '--'}</span>
                      <span className="text-slate-600">|</span>
                      <span>{item.time || '--'}</span>
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
