import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Leaf, 
  Recycle, 
  ScanLine, 
  Trash2, 
  ShieldCheck, 
  Zap,
  ChevronRight
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* 1. Navigation */}
      <nav className="fixed w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-[#0f172a]">
                <Recycle size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">BinBot</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <a href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log in
              </a>
              <a 
                href="/register" 
                className="text-sm font-semibold bg-emerald-500 text-[#0f172a] px-4 py-2 rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-emerald-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            New: Enhanced sorting analytics available
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Smarter Waste Segregation,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
              Made Simple.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            BinBot helps organizations and individuals identify waste correctly, choose the right disposal method, and track environmental impact in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/register" 
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 text-[#0f172a] font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={18} />
            </a>
            <a 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 text-white font-medium rounded-xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center"
            >
              View Dashboard Demo
            </a>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Streamlined Classification</h2>
            <p className="text-slate-400">Identify and sort waste in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-slate-800 via-emerald-500/20 to-slate-800" />

            <StepCard 
              icon={<ScanLine size={24} className="text-white" />}
              step="01"
              title="Input Item"
              desc="Enter the waste item name or scan using our classify tool."
            />
            <StepCard 
              icon={<Zap size={24} className="text-white" />}
              step="02"
              title="Instant Analysis"
              desc="BinBot categorizes the material properties instantly."
            />
            <StepCard 
              icon={<CheckCircle size={24} className="text-white" />}
              step="03"
              title="Disposal Action"
              desc="Get directed to the Green, Blue, or Black bin immediately."
            />
          </div>
        </div>
      </section>

      {/* 4. Key Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why choose BinBot?</h2>
            <p className="text-slate-400 max-w-xl">
              We provide the data layer for sustainable waste management, helping you reduce contamination and improve recycling rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<ShieldCheck size={24} className="text-emerald-400" />}
              title="Accurate Suggestions"
              desc="Reduce sorting errors with our precise categorization database."
            />
            <FeatureCard 
              icon={<Leaf size={24} className="text-emerald-400" />}
              title="Eco-Friendly Habits"
              desc="Build better habits with consistent feedback and guidance."
            />
            <FeatureCard 
              icon={<BarChart3 size={24} className="text-emerald-400" />}
              title="Impact Tracking"
              desc="Visualize your diversion rates and landfill reduction over time."
            />
            <FeatureCard 
              icon={<Zap size={24} className="text-emerald-400" />}
              title="Fast & Simple"
              desc="Zero friction interface designed for quick daily usage."
            />
          </div>
        </div>
      </section>

      {/* 5. Analytics Preview */}
      <section className="py-24 bg-gradient-to-b from-[#0f172a] to-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Data that drives sustainability</h2>
          
          {/* Mock Dashboard UI */}
          <div className="relative max-w-4xl mx-auto bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Mock Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="h-2 w-32 bg-slate-800 rounded-full" />
            </div>

            {/* Mock Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Stat 1 */}
              <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400 mb-2">Total Analyzed</div>
                <div className="text-3xl font-bold text-white">1,248</div>
                <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4" />
                </div>
              </div>
              {/* Stat 2 */}
              <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400 mb-2">Diversion Rate</div>
                <div className="text-3xl font-bold text-white">68%</div>
                <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-2/3" />
                </div>
              </div>
              {/* Stat 3 */}
              <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400 mb-2">Accuracy</div>
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[99%]" />
                </div>
              </div>
              
              {/* Bottom Row - Mock Graph */}
              <div className="md:col-span-3 bg-slate-800/30 p-5 rounded-xl border border-slate-800 h-48 flex items-end justify-between px-6 pb-2 gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((h, i) => (
                  <div key={i} className="w-full bg-slate-700/50 hover:bg-emerald-500/50 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded text-white whitespace-nowrap">
                      {h} items
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
           
           <h2 className="relative z-10 text-3xl font-bold text-white mb-4">
             Start making smarter waste choices today
           </h2>
           <p className="relative z-10 text-slate-300 mb-8 max-w-xl mx-auto">
             Join thousands of users who are reducing their carbon footprint with BinBot's intelligent classification system.
           </p>
           <a 
             href="/register" 
             className="relative z-10 inline-flex items-center justify-center px-8 py-3.5 bg-emerald-500 text-[#0f172a] font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/20"
           >
             Create Your Free Account
           </a>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 bg-emerald-600 rounded flex items-center justify-center text-[#0f172a]">
                <Recycle size={14} strokeWidth={3} />
              </div>
              <span className="text-lg font-bold text-white">BinBot</span>
            </div>
            <p className="text-sm text-slate-500">
              Tech for a cleaner tomorrow.
            </p>
          </div>

          <div className="flex gap-8">
            <FooterLink text="Login" href="/login" />
            <FooterLink text="Register" href="/register" />
            <FooterLink text="Privacy Policy" href="#" />
          </div>

          <div className="text-xs text-slate-600">
            © {new Date().getFullYear()} BinBot SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- Helper Components --- */

const StepCard = ({ icon, step, title, desc }) => (
  <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-xl z-10 flex flex-col items-center text-center shadow-lg transition-transform hover:-translate-y-1">
    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-emerald-900/20 shadow-lg">
      {icon}
    </div>
    <span className="text-emerald-500 font-mono text-sm font-bold tracking-wider mb-2">STEP {step}</span>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-xl hover:bg-slate-800/60 transition-colors group">
    <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-800">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const FooterLink = ({ text, href }) => (
  <a href={href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
    {text}
  </a>
);

export default Home;