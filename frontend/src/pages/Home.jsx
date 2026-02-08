import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Leaf, 
  Recycle, 
  ScanLine, 
  ShieldCheck, 
  Zap,
  LayoutDashboard
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">


      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-20 left-[20%] w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
          <div className="absolute top-40 right-[20%] w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-emerald-400 mb-8 hover:border-emerald-500/30 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            New: Enhanced sorting analytics available
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Smarter Waste Segregation,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              Made Simple.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            BinBot helps organizations and individuals identify waste correctly, choose the right disposal method, and track environmental impact in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500 text-[#0f172a] font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5"
            >
              Get Started Free <ArrowRight size={18} />
            </a>
            <a 
              href="/dashboard" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-800 text-white font-medium rounded-xl border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all transform hover:-translate-y-0.5"
            >
              <LayoutDashboard size={18} />
              View Dashboard Demo
            </a>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 bg-[#0b1120] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Streamlined Classification</h2>
            <p className="text-slate-400 text-lg">
              Identify and sort waste efficiently in three simple steps.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Connecting Line (Desktop) - Aligned with Icons */}
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-800 via-emerald-500/20 to-slate-800 z-0" />

            <StepCard 
              icon={<ScanLine size={24} />}
              step="01"
              title="Input Item"
              desc="Enter the waste item name or scan using our classify tool."
            />
            <StepCard 
              icon={<Zap size={24} />}
              step="02"
              title="Instant Analysis"
              desc="BinBot categorizes the material properties instantly."
            />
            <StepCard 
              icon={<CheckCircle size={24} />}
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
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Why choose BinBot?</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We provide the essential data layer for sustainable waste management, helping you reduce contamination and improve recycling rates without the complexity.
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
          
          {/* Static Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/5">
            {/* Window Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <div className="h-2 w-32 bg-slate-800 rounded-full mx-auto sm:mx-0" />
            </div>

            {/* Dashboard Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <StatCard 
                label="Total Analyzed" 
                value="1,248" 
                barColor="bg-emerald-500" 
                barWidth="w-3/4" 
              />
              <StatCard 
                label="Diversion Rate" 
                value="68%" 
                barColor="bg-blue-500" 
                barWidth="w-2/3" 
              />
              <StatCard 
                label="Accuracy" 
                value="99%" 
                barColor="bg-purple-500" 
                barWidth="w-[99%]" 
              />
              
              {/* Mock Chart */}
              <div className="md:col-span-3 mt-4 bg-slate-800/30 p-6 rounded-xl border border-slate-800/50 h-56 flex items-end justify-between gap-3">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 65, 80].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-slate-700/40 rounded-t-sm relative group hover:bg-emerald-500/20 transition-all duration-300" 
                    style={{ height: `${h}%` }}
                  >
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
           
           <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-white mb-6">
             Start making smarter waste choices today
           </h2>
           <p className="relative z-10 text-slate-400 text-lg mb-10 max-w-xl mx-auto">
             Join thousands of users who are reducing their carbon footprint with BinBot's intelligent classification system.
           </p>
           <a 
             href="/register" 
             className="relative z-10 inline-flex items-center justify-center px-10 py-4 bg-emerald-500 text-[#0f172a] font-bold text-lg rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5"
           >
             Create Your Free Account
           </a>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 bg-emerald-600 rounded flex items-center justify-center text-[#0f172a]">
                  <Recycle size={14} strokeWidth={3} />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">BinBot</span>
              </div>
              <p className="text-sm text-slate-500">
                Technology for a cleaner, sustainable tomorrow.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <FooterLink text="Login" href="/login" />
              <FooterLink text="Register" href="/register" />
              <FooterLink text="Privacy Policy" href="#" />
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 pt-8 text-center md:text-left">
             <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} BinBot SaaS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- Helper Components --- */

const StepCard = ({ icon, step, title, desc }) => (
  <div className="relative bg-slate-800/80 border border-slate-700/50 p-8 rounded-2xl z-10 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm">
    <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center mb-6 text-white shadow-inner group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-emerald-500 font-mono text-xs font-bold tracking-widest uppercase mb-3">Step {step}</span>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 group h-full">
    <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-5 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const StatCard = ({ label, value, barColor, barWidth }) => (
  <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-800/50">
    <div className="text-sm font-medium text-slate-400 mb-2">{label}</div>
    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    <div className="mt-3 h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
      <div className={`h-full ${barColor} rounded-full ${barWidth}`} />
    </div>
  </div>
);

const FooterLink = ({ text, href }) => (
  <a 
    href={href} 
    className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
  >
    {text}
  </a>
);

export default Home;