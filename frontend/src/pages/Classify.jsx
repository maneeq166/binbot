import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Image as ImageIcon,
  Type,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
  Recycle,
  Leaf,
  Trash2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { createWasteRecord } from '../api/waste/index.js';
import { wasteSchema } from '../validation/waste';

const Classify = () => {
  const [searchParams] = useSearchParams();
  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(wasteSchema),
    defaultValues: {
      query: '',
      mode: 'text'
    }
  });

  const mode = watch('mode');
  const query = watch('query');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [displayQuery, setDisplayQuery] = useState('');
  const prefillQuery = searchParams.get('query');

  useEffect(() => {
    if (!prefillQuery) return;
    setValue('mode', 'text');
    setValue('query', prefillQuery, { shouldValidate: true });
    setResult(null);
    setApiError(null);
    setResultId(null);
    setDisplayQuery('');
  }, [prefillQuery, setValue]);

  const classifyQuery = (value) => {
    const lowerQuery = value.toLowerCase();
    let mockResponse = {
      type: 'General Waste',
      bin: 'Black Bin',
      color: 'slate',
      suggestion: 'This item is not recyclable or compostable. Please dispose of it in the general waste bin.',
      icon: <Trash2 size={24} className="text-slate-400" />
    };

    if (lowerQuery.includes('apple') || lowerQuery.includes('banana') || lowerQuery.includes('food')) {
      mockResponse = {
        type: 'Biodegradable',
        bin: 'Green Bin',
        color: 'emerald',
        suggestion: 'Great job! This is organic waste. Place it in the green compost bin.',
        icon: <Leaf size={24} className="text-emerald-400" />
      };
    } else if (lowerQuery.includes('bottle') || lowerQuery.includes('can') || lowerQuery.includes('paper')) {
      mockResponse = {
        type: 'Recyclable',
        bin: 'Blue Bin',
        color: 'blue',
        suggestion: 'This item can be recycled. Please ensure it is clean and dry before placing in the blue bin.',
        icon: <Recycle size={24} className="text-blue-400" />
      };
    }

    return mockResponse;
  };

  const onSubmit = async ({ query }) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setResult(null);
    setApiError(null);
    setDisplayQuery(trimmedQuery);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockResponse = classifyQuery(trimmedQuery);
    setResult(mockResponse);
    setResultId(Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
    setIsLoading(false);

    setApiLoading(true);
    const res = await createWasteRecord({ wastename: trimmedQuery });
    if (res?.success === false) {
      setApiError(res?.message || 'Failed to save waste record');
    } else {
      reset({ query: '', mode });
    }
    setApiLoading(false);
  };

  const clearSearch = () => {
    reset({ query: '', mode });
    setResult(null);
    setApiLoading(false);
    setApiError(null);
    setResultId(null);
    setDisplayQuery('');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* 1. Page Header */}
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Classify Waste</h1>
        <p className="mt-2 text-slate-400">
          Identify the correct bin and disposal method for your items.
        </p>
      </header>

      {/* 2. Classification Mode Section */}
      <div className="bg-slate-800/50 p-1.5 rounded-xl border border-slate-800 inline-flex w-full sm:w-auto">
        <button
          onClick={() => { setValue('mode', 'text'); setResult(null); }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === 'text'
              ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Type size={16} />
          Text Input
        </button>
        <button
          onClick={() => { setValue('mode', 'image'); setResult(null); }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === 'image'
              ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ImageIcon size={16} />
          Image Upload
        </button>
      </div>

      {/* 3. Input Section */}
      <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm backdrop-blur-sm">
        
        {mode === 'text' ? (
          /* Text Classification Card */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="waste-input" className="block text-sm font-medium text-slate-300">
                Item Name
              </label>
              <div className="relative group">
                <input
                  id="waste-input"
                  type="text"
                  {...register('query')}
                  placeholder="e.g., Plastic bottle, Banana peel, Pizza box..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-10 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
                {query && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Enter the specific name of the waste item you wish to discard.
              </p>
              {errors.query && (
                <p className="text-xs text-red-400">
                  {errors.query.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!query.trim() || isLoading || apiLoading}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                  !query.trim() || isLoading || apiLoading
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-emerald-500 text-[#0f172a] hover:bg-emerald-400 hover:shadow-emerald-500/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Classify Item
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* 4. Image Upload Card (Placeholder) */
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-700 rounded-lg bg-slate-900/20">
            <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload an image</h3>
            <p className="text-slate-400 max-w-sm text-sm mb-6">
              Drag and drop an image here, or click to select a file.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400">
              <AlertCircle size={12} />
              Image classification is coming soon
            </div>
          </div>
        )}
      </div>

      {/* 5. Classification Result Section */}
      {result && mode === 'text' && !isLoading && (
        <>
          {apiLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={20} className="animate-spin text-emerald-400" />
              <span className="ml-2 text-slate-400">Saving waste record...</span>
            </div>
          )}
          {apiError && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">Error saving waste record: {apiError}</p>
            </div>
          )}
        </>
      )}
      {result && mode === 'text' && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`rounded-xl border overflow-hidden ${
            result.color === 'emerald' ? 'bg-emerald-900/10 border-emerald-500/20' :
            result.color === 'blue' ? 'bg-blue-900/10 border-blue-500/20' :
            'bg-slate-800 border-slate-700'
          }`}>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-start">
                
                {/* Waste Type Info */}
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg h-fit border ${
                    result.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20' :
                    result.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
                    'bg-slate-700/50 border-slate-600'
                  }`}>
                    {result.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{result.type}</h2>
                    <p className="text-sm text-slate-400">
                      Result for <span className="text-slate-200 font-medium">"{displayQuery}"</span>
                    </p>
                  </div>
                </div>

                {/* Bin Badge */}
                <div className={`px-5 py-3 rounded-lg border text-center min-w-[140px] ${
                  result.color === 'emerald' ? 'bg-emerald-500 text-[#0f172a] border-emerald-400' :
                  result.color === 'blue' ? 'bg-blue-500 text-white border-blue-400' :
                  'bg-slate-700 text-slate-200 border-slate-600'
                }`}>
                  <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-80 mb-0.5">
                    Target Bin
                  </span>
                  <span className="block text-lg font-bold">
                    {result.bin}
                  </span>
                </div>
              </div>

              {/* Suggestion */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex gap-3">
                  <CheckCircle2 size={20} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                      Disposal Suggestion
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {result.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="bg-slate-900/30 px-6 py-4 flex justify-between items-center border-t border-slate-700/30">
              <span className="text-xs text-slate-500 font-mono">ID: REF-{resultId}</span>
              <button 
                onClick={clearSearch}
                className="text-sm font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
              >
                Classify another item 
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Classify;
