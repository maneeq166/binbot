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
               item: record?.itemName || record?.inputValue || record?.wastename || 'Unknown item',
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
        return 'bg-[#917FBA]/15 text-[#D3B4D2] border-[#917FBA]/30 shadow-[0_0_15px_rgba(145,127,186,0.15)]';
      case 'Blue Bin':
        return 'bg-[#674E98]/15 text-[#917FBA] border-[#674E98]/30 shadow-[0_0_15px_rgba(103,78,152,0.15)]';
      case 'Black Bin':
        return 'bg-[#25233F]/80 text-[#ACA7B6] border-[#44356F]/60 shadow-[0_0_15px_rgba(37,35,63,0.3)]';
      default:
        return 'bg-[#25233F]/50 text-[#ACA7B6] border-[#44356F]/40';
    }
  };

  const getIcon = (bin) => {
    switch (bin) {
      case 'Green Bin': return <Leaf size={14} className="text-[#D3B4D2]" />;
      case 'Blue Bin': return <Recycle size={14} className="text-[#917FBA]" />;
      default: return <Trash2 size={14} className="text-[#ACA7B6]" />;
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
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#070915] font-sans">
      
      {/* Premium Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] right-[15%] w-[500px] h-[500px] bg-[#674E98]/10 blur-[130px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-[#917FBA]/5 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* 1. Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-sm">History</h1>
            <p className="mt-2 text-[#ACA7B6] font-medium text-lg">Review your past waste classifications.</p>
          </div>
          
          {/* Optional Action Bar (Visual Only) */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2.5 px-4 py-2.5 bg-[#25233F]/60 backdrop-blur-md border border-[#44356F]/60 rounded-xl text-sm font-semibold text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#25233F] hover:border-[#674E98]/50 hover:shadow-[0_4px_15px_rgba(103,78,152,0.2)] transition-all duration-300">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2.5 px-4 py-2.5 bg-[#25233F]/60 backdrop-blur-md border border-[#44356F]/60 rounded-xl text-sm font-semibold text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#25233F] hover:border-[#674E98]/50 hover:shadow-[0_4px_15px_rgba(103,78,152,0.2)] transition-all duration-300">
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* 2. Main History Content */}
        <div className="bg-[#25233F]/40 border border-[#44356F]/50 rounded-3xl shadow-[0_12px_40px_rgba(7,9,21,0.6)] overflow-hidden backdrop-blur-xl ring-1 ring-[#FAFAF9]/5 transition-all duration-300">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="bg-[#25233F]/60 p-5 rounded-2xl mb-6 border border-[#44356F]/60 shadow-inner">
                <Clock size={36} className="text-[#917FBA] animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-[#FAFAF9] mb-2 tracking-tight">Loading history</h3>
              <p className="text-[#ACA7B6] max-w-sm text-base font-medium">
                Fetching your latest waste classifications.
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="bg-[#D3B4D2]/10 p-5 rounded-2xl mb-6 border border-[#D3B4D2]/20 shadow-[0_0_30px_rgba(211,180,210,0.15)]">
                <Trash2 size={36} className="text-[#D3B4D2]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAFAF9] mb-2 tracking-tight">Unable to load history</h3>
              <p className="text-[#ACA7B6] max-w-sm text-base font-medium mb-8">{error}</p>
              <button
                type="button"
                onClick={fetchHistory}
                className="px-8 py-3 bg-[#25233F] border border-[#44356F] rounded-xl text-sm font-bold text-[#FAFAF9] hover:bg-[#44356F] hover:border-[#674E98] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          ) : historyItems.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#070915]/60 border-b border-[#44356F]/60 backdrop-blur-md">
                      <th className="px-8 py-5 text-xs font-bold text-[#ACA7B6] uppercase tracking-widest">Item Name</th>
                      <th className="px-8 py-5 text-xs font-bold text-[#ACA7B6] uppercase tracking-widest">Classification</th>
                      <th className="px-8 py-5 text-xs font-bold text-[#ACA7B6] uppercase tracking-widest">Bin Type</th>
                      <th className="px-8 py-5 text-xs font-bold text-[#ACA7B6] uppercase tracking-widest">Date & Time</th>
                      <th className="px-8 py-5 text-xs font-bold text-[#ACA7B6] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#44356F]/40">
                    {historyItems.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#674E98]/10 transition-colors duration-200">
                        <td className="px-8 py-5">
                          <span className="font-semibold text-[#FAFAF9] text-[15px]">{item.item}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[15px] font-medium text-[#ACA7B6] group-hover:text-[#FAFAF9] transition-colors">{item.type}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border tracking-wide ${getBinStyles(item.bin)}`}>
                            {getIcon(item.bin)}
                            {item.bin}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[15px] font-medium text-[#ACA7B6] group-hover:text-[#FAFAF9] transition-colors">{item.date || '--'}</span>
                            <span className="text-xs font-medium text-[#44356F] group-hover:text-[#917FBA] transition-colors">{item.time || '--'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="relative inline-flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleMenu(item.id)}
                              className="text-[#ACA7B6] hover:text-[#FAFAF9] p-2 rounded-lg hover:bg-[#25233F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#917FBA]/50"
                              aria-haspopup="menu"
                              aria-expanded={activeMenuId === item.id}
                            >
                              <MoreHorizontal size={20} />
                            </button>
                            {activeMenuId === item.id && (
                              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-[#44356F]/80 bg-[#070915]/95 shadow-[0_10px_40px_rgba(7,9,21,0.8)] backdrop-blur-xl p-1.5 text-left ring-1 ring-[#FAFAF9]/5 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleReclassify(item);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#FAFAF9] hover:bg-[#25233F] hover:text-[#917FBA] rounded-lg transition-colors"
                                >
                                  Reclassify item
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyItem(item)}
                                  disabled={!hasClipboard || !item.item}
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#FAFAF9] hover:bg-[#25233F] hover:text-[#917FBA] rounded-lg transition-colors disabled:text-[#44356F] disabled:hover:bg-transparent"
                                >
                                  {copiedId === item.id ? 'Copied!' : 'Copy item name'}
                                </button>
                                {!hasClipboard && (
                                  <div className="px-4 pb-2 pt-1 text-xs text-[#44356F] font-medium">
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
              <div className="md:hidden divide-y divide-[#44356F]/40">
                {historyItems.map((item) => (
                  <div key={item.id} className="p-6 space-y-4 hover:bg-[#674E98]/5 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#FAFAF9] text-lg mb-1 tracking-tight">{item.item}</h3>
                        <p className="text-sm font-medium text-[#ACA7B6]">{item.type}</p>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.id)}
                          className="text-[#ACA7B6] hover:text-[#FAFAF9] p-2 rounded-lg hover:bg-[#25233F] transition-colors"
                          aria-haspopup="menu"
                          aria-expanded={activeMenuId === item.id}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-[#44356F]/80 bg-[#070915]/95 shadow-[0_10px_40px_rgba(7,9,21,0.8)] backdrop-blur-xl p-1.5 text-left ring-1 ring-[#FAFAF9]/5 animate-in fade-in zoom-in-95 duration-200">
                            <button
                              type="button"
                              onClick={() => {
                                handleReclassify(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#FAFAF9] hover:bg-[#25233F] hover:text-[#917FBA] rounded-lg transition-colors"
                            >
                              Reclassify item
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyItem(item)}
                              disabled={!hasClipboard || !item.item}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#FAFAF9] hover:bg-[#25233F] hover:text-[#917FBA] rounded-lg transition-colors disabled:text-[#44356F] disabled:hover:bg-transparent"
                            >
                              {copiedId === item.id ? 'Copied!' : 'Copy item name'}
                            </button>
                            {!hasClipboard && (
                              <div className="px-4 pb-2 pt-1 text-xs text-[#44356F] font-medium">
                                Clipboard not available
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#44356F]/30">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border ${getBinStyles(item.bin)}`}>
                        {getIcon(item.bin)}
                        {item.bin}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-medium text-[#ACA7B6]">
                        <Calendar size={14} className="text-[#674E98]" />
                        <span>{item.date || '--'}</span>
                        <span className="text-[#44356F]">|</span>
                        <span>{item.time || '--'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Footer */}
              <div className="px-8 py-5 border-t border-[#44356F]/60 bg-[#070915]/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm font-medium text-[#ACA7B6]">Showing <span className="text-[#FAFAF9] font-bold">{historyItems.length}</span> of <span className="text-[#FAFAF9] font-bold">{totalResults}</span> results</span>
                <div className="flex gap-3">
                  <button
                    className="px-5 py-2 text-sm font-bold text-[#FAFAF9] bg-[#25233F] border border-[#44356F] rounded-xl hover:bg-[#44356F] hover:border-[#674E98] disabled:opacity-40 disabled:hover:bg-[#25233F] disabled:hover:border-[#44356F] disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    disabled={!canGoPrev}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    className="px-5 py-2 text-sm font-bold text-[#FAFAF9] bg-[#25233F] border border-[#44356F] rounded-xl hover:bg-[#44356F] hover:border-[#674E98] disabled:opacity-40 disabled:hover:bg-[#25233F] disabled:hover:border-[#44356F] disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
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
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="bg-[#25233F]/40 p-5 rounded-2xl mb-6 border border-[#44356F]/50 shadow-[0_0_20px_rgba(103,78,152,0.15)]">
                <Clock size={36} className="text-[#674E98]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAFAF9] mb-3 tracking-tight">No classifications yet</h3>
              <p className="text-[#ACA7B6] max-w-sm text-base font-medium mb-8 leading-relaxed">
                Start classifying items to build your history and track your environmental impact over time.
              </p>
              <a 
                href="/classify" 
                className="px-8 py-3.5 bg-gradient-to-r from-[#674E98] to-[#917FBA] text-[#070915] font-bold rounded-xl hover:from-[#917FBA] hover:to-[#D3B4D2] transition-all duration-300 shadow-[0_8px_20px_rgba(103,78,152,0.3)] hover:shadow-[0_8px_25px_rgba(145,127,186,0.5)] transform hover:-translate-y-0.5"
              >
                Classify Your First Item
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default History;