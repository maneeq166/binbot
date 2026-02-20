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
      icon: <Trash2 size={24} className="text-[#ACA7B6]" />
    };

    if (lowerQuery.includes('apple') || lowerQuery.includes('banana') || lowerQuery.includes('food')) {
      mockResponse = {
        type: 'Biodegradable',
        bin: 'Green Bin',
        color: 'emerald',
        suggestion: 'Great job! This is organic waste. Place it in the green compost bin.',
        icon: <Leaf size={24} className="text-[#917FBA]" />
      };
    } else if (lowerQuery.includes('bottle') || lowerQuery.includes('can') || lowerQuery.includes('paper')) {
      mockResponse = {
        type: 'Recyclable',
        bin: 'Blue Bin',
        color: 'blue',
        suggestion: 'This item can be recycled. Please ensure it is clean and dry before placing in the blue bin.',
        icon: <Recycle size={24} className="text-[#D3B4D2]" />
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
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#070915] font-sans">
      
      {/* Premium Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-[#674E98]/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[#917FBA]/10 blur-[130px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-10">
        
        {/* 1. Page Header */}
        <header className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAF9] tracking-tight drop-shadow-sm">Classify Waste</h1>
          <p className="mt-3 text-[#ACA7B6] text-lg font-medium">
            Identify the correct bin and disposal method for your items.
          </p>
        </header>

        {/* 2. Classification Mode Section */}
        <div className="bg-[#25233F]/60 p-1.5 rounded-2xl border border-[#44356F]/60 inline-flex w-full sm:w-auto backdrop-blur-md shadow-[0_8px_30px_rgba(7,9,21,0.5)]">
          <button
            onClick={() => { setValue('mode', 'text'); setResult(null); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === 'text'
                ? 'bg-[#674E98] text-[#FAFAF9] shadow-[0_4px_15px_rgba(103,78,152,0.4)] ring-1 ring-[#917FBA]/40'
                : 'text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#44356F]/40'
            }`}
          >
            <Type size={18} strokeWidth={2.5} />
            Text Input
          </button>
          <button
            onClick={() => { setValue('mode', 'image'); setResult(null); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === 'image'
                ? 'bg-[#674E98] text-[#FAFAF9] shadow-[0_4px_15px_rgba(103,78,152,0.4)] ring-1 ring-[#917FBA]/40'
                : 'text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#44356F]/40'
            }`}
          >
            <ImageIcon size={18} strokeWidth={2.5} />
            Image Upload
          </button>
        </div>

        {/* 3. Input Section */}
        <div className="bg-[#25233F]/40 border border-[#44356F]/60 rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(7,9,21,0.6)] backdrop-blur-2xl relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-b from-[#674E98]/5 to-transparent pointer-events-none" />

          {mode === 'text' ? (
            /* Text Classification Card */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label htmlFor="waste-input" className="block text-sm font-semibold text-[#917FBA] uppercase tracking-wider ml-1">
                  Item Name
                </label>
                <div className="relative group/input">
                  <input
                    id="waste-input"
                    type="text"
                    {...register('query')}
                    placeholder="e.g., Plastic bottle, Banana peel, Pizza box..."
                    className="w-full bg-[#070915]/60 border border-[#44356F] rounded-2xl pl-5 pr-12 py-5 text-lg font-medium text-[#FAFAF9] placeholder-[#ACA7B6]/50 focus:outline-none focus:ring-2 focus:ring-[#674E98]/60 focus:border-[#917FBA] transition-all duration-300 shadow-inner"
                  />
                  {query && (
                    <button 
                      onClick={clearSearch}
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ACA7B6] hover:text-[#FAFAF9] p-1.5 rounded-full hover:bg-[#44356F]/60 transition-all duration-200"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-[#ACA7B6]/80 font-medium ml-1">
                  Enter the specific name of the waste item you wish to discard.
                </p>
                {errors.query && (
                  <p className="text-sm font-medium text-[#D3B4D2] ml-1">
                    {errors.query.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading || apiLoading}
                  className={`flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 ease-out ${
                    !query.trim() || isLoading || apiLoading
                      ? 'bg-[#25233F] text-[#ACA7B6]/50 border border-[#44356F]/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#674E98] to-[#917FBA] text-[#070915] hover:from-[#917FBA] hover:to-[#D3B4D2] hover:shadow-[0_8px_30px_rgba(145,127,186,0.5)] hover:-translate-y-1 hover:scale-[1.02] ring-1 ring-[#FAFAF9]/10'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search size={20} strokeWidth={2.5} />
                      Classify Item
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* 4. Image Upload Card (Placeholder) */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-[#44356F] rounded-2xl bg-[#070915]/30 relative z-10 transition-colors hover:bg-[#070915]/50 hover:border-[#674E98]/60">
              <div className="h-20 w-20 bg-[#25233F] rounded-full flex items-center justify-center mb-6 text-[#917FBA] border border-[#44356F] shadow-[0_4px_20px_rgba(103,78,152,0.2)]">
                <UploadCloud size={36} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#FAFAF9] mb-3 tracking-tight">Upload an image</h3>
              <p className="text-[#ACA7B6] max-w-sm text-base mb-8 font-medium">
                Drag and drop an image here, or click to select a file.
              </p>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#674E98]/10 border border-[#674E98]/30 text-xs font-bold text-[#D3B4D2] uppercase tracking-wider">
                <AlertCircle size={14} />
                Image classification coming soon
              </div>
            </div>
          )}
        </div>

        {/* 5. Classification Result Section */}
        {result && mode === 'text' && !isLoading && (
          <>
            {apiLoading && (
              <div className="flex items-center justify-center py-4 bg-[#25233F]/40 backdrop-blur-md rounded-xl border border-[#44356F]/50">
                <Loader2 size={20} className="animate-spin text-[#917FBA]" />
                <span className="ml-3 font-medium text-[#ACA7B6]">Saving waste record...</span>
              </div>
            )}
            {apiError && (
              <div className="bg-[#D3B4D2]/10 border border-[#D3B4D2]/30 rounded-2xl p-5 mb-4 backdrop-blur-md shadow-lg">
                <p className="text-[#D3B4D2] text-sm font-semibold flex items-center gap-2">
                  <AlertCircle size={18} />
                  Error saving waste record: {apiError}
                </p>
              </div>
            )}
          </>
        )}
        
        {result && mode === 'text' && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out pb-10">
            <div className={`rounded-3xl border overflow-hidden backdrop-blur-xl shadow-[0_12px_40px_rgba(7,9,21,0.7)] ring-1 ring-[#FAFAF9]/5 transition-all duration-300 ${
              result.color === 'emerald' ? 'bg-[#25233F]/70 border-[#917FBA]/40 shadow-[0_0_40px_rgba(145,127,186,0.15)]' :
              result.color === 'blue' ? 'bg-[#25233F]/70 border-[#D3B4D2]/40 shadow-[0_0_40px_rgba(211,180,210,0.15)]' :
              'bg-[#25233F]/70 border-[#44356F]'
            }`}>
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row justify-between gap-8 sm:items-start">
                  
                  {/* Waste Type Info */}
                  <div className="flex gap-5 items-start">
                    <div className={`p-4 rounded-2xl h-fit border shadow-inner ${
                      result.color === 'emerald' ? 'bg-[#917FBA]/10 border-[#917FBA]/30 shadow-[0_0_20px_rgba(145,127,186,0.2)]' :
                      result.color === 'blue' ? 'bg-[#D3B4D2]/10 border-[#D3B4D2]/30 shadow-[0_0_20px_rgba(211,180,210,0.2)]' :
                      'bg-[#44356F]/30 border-[#674E98]/40'
                    }`}>
                      {result.icon}
                    </div>
                    <div className="pt-1">
                      <h2 className="text-2xl font-extrabold text-[#FAFAF9] mb-1.5 tracking-tight">{result.type}</h2>
                      <p className="text-sm font-medium text-[#ACA7B6]">
                        Result for <span className="text-[#FAFAF9] font-bold">"{displayQuery}"</span>
                      </p>
                    </div>
                  </div>

                  {/* Bin Badge */}
                  <div className={`px-6 py-4 rounded-2xl border text-center min-w-[160px] shadow-lg ${
                    result.color === 'emerald' ? 'bg-gradient-to-br from-[#917FBA] to-[#674E98] text-[#FAFAF9] border-[#D3B4D2]/50' :
                    result.color === 'blue' ? 'bg-gradient-to-br from-[#D3B4D2] to-[#917FBA] text-[#070915] border-[#FAFAF9]/60' :
                    'bg-[#44356F] text-[#FAFAF9] border-[#674E98]'
                  }`}>
                    <span className="block text-[10px] uppercase tracking-widest font-extrabold opacity-90 mb-1">
                      Target Bin
                    </span>
                    <span className="block text-xl font-extrabold tracking-tight">
                      {result.bin}
                    </span>
                  </div>
                </div>

                {/* Suggestion */}
                <div className="mt-10 pt-8 border-t border-[#44356F]/50">
                  <div className="flex gap-4">
                    <CheckCircle2 size={24} className="text-[#917FBA] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <h3 className="text-sm font-bold text-[#FAFAF9] uppercase tracking-widest mb-2">
                        Disposal Suggestion
                      </h3>
                      <p className="text-[#ACA7B6] text-lg font-medium leading-relaxed">
                        {result.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="bg-[#070915]/60 px-8 py-5 flex justify-between items-center border-t border-[#44356F]/40 backdrop-blur-md">
                <span className="text-xs text-[#ACA7B6]/70 font-mono font-bold tracking-wider">ID: REF-{resultId}</span>
                <button 
                  onClick={clearSearch}
                  className="text-sm font-bold text-[#ACA7B6] hover:text-[#D3B4D2] flex items-center gap-2 transition-colors duration-200 group"
                >
                  Classify another item 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Classify;