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
    <div className="min-h-screen bg-[#070915] text-[#FAFAF9] font-sans selection:bg-[#674E98]/30">
      
      {/* 1. Hero Section */}
      {/* Premium Atmospheric Hero Section */}
      <section className="relative pt-28 pb-24 lg:pt-32 lg:pb-32 overflow-hidden bg-[#070915] min-h-[90vh] flex flex-col items-center justify-center">
        
        {/* 1. Deep Atmospheric Background & Light Sources */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-15%] right-[-5%] w-[800px] h-[800px] bg-[#674E98]/20 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#917FBA]/15 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D3B4D2]/10 blur-[120px] rounded-full" />
        </div>

        {/* 2. Signature Orbital Rings (Sustainability / System Metaphor) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#44356F]/30 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-[#25233F]/50 rounded-full pointer-events-none opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-[#25233F]/30 rounded-full pointer-events-none opacity-40" />

        {/* 3. Subtle Technical Grid Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ACA7B6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)'
          }}
        />

        {/* 4. Experimental Floating Glass Badges (Desktop Only) */}
        <div className="hidden lg:flex absolute top-[22%] left-[12%] flex-col items-start gap-1 p-4 rounded-2xl bg-[#25233F]/20 backdrop-blur-xl border border-[#44356F]/50 shadow-[0_16px_40px_rgba(7,9,21,0.6)] transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-default">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-[#917FBA] shadow-[0_0_8px_#917FBA] animate-pulse"></div>
             <span className="text-[10px] font-bold text-[#ACA7B6] uppercase tracking-widest">Live Diversion</span>
          </div>
          <span className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight">
            14.2<span className="text-sm font-medium text-[#ACA7B6] ml-1">kg</span>
          </span>
        </div>

        <div className="hidden lg:flex absolute bottom-[25%] right-[12%] flex-col gap-1.5 p-4.5 rounded-2xl bg-[#070915]/40 backdrop-blur-xl border border-[#674E98]/30 shadow-[0_16px_40px_rgba(7,9,21,0.6)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-default">
          <div className="flex items-center gap-2 text-[#ACA7B6] text-[10px] font-bold uppercase tracking-widest">
            <svg className="w-3.5 h-3.5 text-[#D3B4D2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Classification
          </div>
          <span className="text-xl font-bold text-[#FAFAF9] flex items-baseline gap-1.5">
            99.8% <span className="text-xs font-semibold text-[#917FBA] tracking-wide">Accuracy</span>
          </span>
        </div>

        {/* Core Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Enhanced Announcement Pill */}
          <div className="group relative inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#070915]/60 backdrop-blur-md border border-[#44356F] text-xs font-semibold text-[#D3B4D2] mb-10 hover:border-[#917FBA]/60 transition-all duration-300 shadow-[0_0_20px_rgba(37,35,63,0.5)] cursor-pointer">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#674E98]/10 to-[#917FBA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D3B4D2] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#917FBA]"></span>
            </span>
            <span className="relative tracking-wide">New: Enhanced sorting analytics available</span>
            <svg className="relative w-3.5 h-3.5 text-[#ACA7B6] group-hover:text-[#FAFAF9] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Premium Typography Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold text-[#FAFAF9] tracking-tight mb-8 leading-[1.05] drop-shadow-sm">
            Smarter Waste Segregation,<br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              {/* Text Glow Layer */}
              <span className="absolute -inset-2 bg-gradient-to-r from-[#674E98] via-[#917FBA] to-[#D3B4D2] blur-2xl opacity-40 mix-blend-screen pointer-events-none" aria-hidden="true"></span>
              {/* Actual Text */}
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FAFAF9] via-[#D3B4D2] to-[#917FBA]">
                Made Simple.
              </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#ACA7B6] mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            BinBot helps organizations and individuals identify waste correctly, choose the right disposal method, and track environmental impact in real-time.
          </p>
          
          {/* Tactical & Powerful CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            {/* Primary CTA */}
            <a 
              href="/register" 
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#674E98] text-[#FAFAF9] font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(103,78,152,0.3)] hover:shadow-[0_0_35px_rgba(145,127,186,0.5)]"
            >
              {/* Inner highlight for 3D tactile feel */}
              <div className="absolute inset-0 rounded-2xl border border-[#FAFAF9]/20 pointer-events-none" />
              {/* Hover gradient sweep */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF9]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <span className="relative drop-shadow-md">Get Started Free</span>
              <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            {/* Secondary CTA */}
            <a 
              href="/dashboard" 
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25233F]/40 backdrop-blur-md text-[#FAFAF9] font-semibold text-lg rounded-2xl border border-[#44356F] hover:bg-[#44356F]/60 hover:border-[#917FBA]/50 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 text-[#ACA7B6] group-hover:text-[#D3B4D2] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              View Dashboard Demo
            </a>
          </div>
          
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="py-24 bg-[#070915] border-y border-[#44356F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#FAFAF9] mb-4">Streamlined Classification</h2>
            <p className="text-[#ACA7B6] text-lg">
              Identify and sort waste efficiently in three simple steps.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Connecting Line (Desktop) - Aligned with Icons */}
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#25233F] via-[#674E98]/40 to-[#25233F] z-0" />

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

      {/* 3. Key Benefits */}
      <section className="py-24 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-[#25233F]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#FAFAF9] mb-6">Why choose BinBot?</h2>
            <p className="text-[#ACA7B6] text-lg leading-relaxed">
              We provide the essential data layer for sustainable waste management, helping you reduce contamination and improve recycling rates without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<ShieldCheck size={24} className="text-[#917FBA]" />}
              title="Accurate Suggestions"
              desc="Reduce sorting errors with our precise categorization database."
            />
            <FeatureCard 
              icon={<Leaf size={24} className="text-[#D3B4D2]" />}
              title="Eco-Friendly Habits"
              desc="Build better habits with consistent feedback and guidance."
            />
            <FeatureCard 
              icon={<BarChart3 size={24} className="text-[#917FBA]" />}
              title="Impact Tracking"
              desc="Visualize your diversion rates and landfill reduction over time."
            />
            <FeatureCard 
              icon={<Zap size={24} className="text-[#D3B4D2]" />}
              title="Fast & Simple"
              desc="Zero friction interface designed for quick daily usage."
            />
          </div>
        </div>
      </section>

      {/* 4. Analytics Preview */}
      <section className="py-24 bg-gradient-to-b from-[#070915] to-[#25233F]/10 border-t border-[#44356F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#FAFAF9] mb-12">Data that drives sustainability</h2>
          
          {/* Static Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto bg-[#070915] rounded-2xl border border-[#44356F] shadow-2xl shadow-[#070915]/50 overflow-hidden ring-1 ring-[#FAFAF9]/5">
            {/* Window Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-[#44356F] bg-[#25233F]/50 backdrop-blur-sm">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#44356F] hover:bg-[#674E98] transition-colors" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#44356F] hover:bg-[#917FBA] transition-colors" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#44356F] hover:bg-[#D3B4D2] transition-colors" />
              </div>
              <div className="h-2 w-32 bg-[#44356F]/50 rounded-full mx-auto sm:mx-0" />
            </div>

            {/* Dashboard Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <StatCard 
                label="Total Analyzed" 
                value="1,248" 
                barColor="bg-[#674E98]" 
                barWidth="w-3/4" 
              />
              <StatCard 
                label="Diversion Rate" 
                value="68%" 
                barColor="bg-[#917FBA]" 
                barWidth="w-2/3" 
              />
              <StatCard 
                label="Accuracy" 
                value="99%" 
                barColor="bg-[#D3B4D2]" 
                barWidth="w-[99%]" 
              />
              
              {/* Mock Chart */}
              <div className="md:col-span-3 mt-4 bg-[#25233F]/20 p-6 rounded-xl border border-[#44356F]/50 h-64 flex items-end justify-between gap-3 relative">
                <div className="absolute top-6 left-6 text-sm font-medium text-[#ACA7B6]">Weekly Activity Overview</div>
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 65, 80].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-[#44356F]/30 rounded-t-md relative group hover:bg-gradient-to-t hover:from-[#674E98]/40 hover:to-[#917FBA]/60 transition-all duration-300" 
                    style={{ height: `${h}%` }}
                  >
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#25233F]/80 to-[#25233F]/40 border border-[#44356F]/70 rounded-3xl p-8 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#070915]/80 backdrop-blur-xl ring-1 ring-[#FAFAF9]/5">
           
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#674E98]/15 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none mix-blend-screen" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#917FBA]/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none mix-blend-screen" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D3B4D2]/5 rounded-full blur-[150px] pointer-events-none" />
           
           <h2 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#FAFAF9] tracking-tight mb-6 drop-shadow-sm">
             Start making smarter waste choices today
           </h2>
           
           <p className="relative z-10 text-[#ACA7B6] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
             Join thousands of users who are reducing their carbon footprint with BinBot's intelligent classification system.
           </p>
           
           <div className="relative z-10 flex flex-col items-center gap-6">
             <a 
               href="/register" 
               className="inline-flex items-center justify-center px-10 py-4 bg-[#674E98] text-[#FAFAF9] font-bold text-lg rounded-xl border border-[#917FBA]/50 hover:bg-[#917FBA] hover:border-[#D3B4D2]/80 transition-all duration-300 ease-out shadow-lg shadow-[#674E98]/30 hover:shadow-2xl hover:shadow-[#917FBA]/40 transform hover:-translate-y-1 hover:scale-[1.02]"
             >
               Create Your Free Account
             </a>
           </div>
           
        </div>
      </section>
      {/* 7. Footer */}
      <footer className="border-t border-[#44356F]/40 bg-[#070915] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
            
            {/* Brand Area */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-[#44356F] to-[#25233F] border border-[#674E98]/40 rounded-xl flex items-center justify-center text-[#FAFAF9] shadow-md shadow-[#674E98]/10">
                  <Recycle size={20} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight">BinBot</span>
              </div>
              <p className="text-[#ACA7B6] mt-5 max-w-xs text-center md:text-left leading-relaxed text-sm">
                Technology for a cleaner, sustainable tomorrow.
              </p>
            </div>

            {/* Links Section */}
            <div className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-4 pt-2">
              <FooterLink text="Login" href="/login" />
              <FooterLink text="Register" href="/register" />
              <FooterLink text="Privacy Policy" href="#" />
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-[#44356F]/40 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#ACA7B6]">
              © {new Date().getFullYear()} BinBot SaaS. All rights reserved.
            </p>
            <p className="text-xs font-medium text-[#917FBA] tracking-wide opacity-80">
              Built for a cleaner future
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

/* --- Helper Components --- */

const StepCard = ({ icon, step, title, desc }) => (
  <div className="relative bg-[#25233F]/40 border border-[#44356F]/50 p-8 rounded-2xl z-10 flex flex-col items-center text-center shadow-lg transition-all duration-300 hover:bg-[#25233F] hover:border-[#674E98]/50 hover:-translate-y-2 hover:shadow-2xl backdrop-blur-sm group">
    <div className="w-16 h-16 bg-[#070915] rounded-2xl border border-[#44356F] flex items-center justify-center mb-6 text-[#917FBA] shadow-inner group-hover:scale-110 group-hover:text-[#D3B4D2] group-hover:border-[#674E98] transition-all duration-300">
      {icon}
    </div>
    <span className="text-[#674E98] font-mono text-xs font-bold tracking-widest uppercase mb-3">Step {step}</span>
    <h3 className="text-xl font-bold text-[#FAFAF9] mb-3">{title}</h3>
    <p className="text-[#ACA7B6] leading-relaxed text-sm">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#25233F]/30 border border-[#44356F]/60 p-6 rounded-2xl hover:bg-[#25233F]/80 hover:border-[#674E98]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group h-full flex flex-col backdrop-blur-sm">
    <div className="bg-[#070915] w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#44356F] group-hover:border-[#917FBA]/50 group-hover:bg-[#25233F] transition-all duration-300 shadow-sm">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-[#FAFAF9] mb-2">{title}</h3>
    <p className="text-sm text-[#ACA7B6] leading-relaxed flex-grow">{desc}</p>
  </div>
);

const StatCard = ({ label, value, barColor, barWidth }) => (
  <div className="bg-[#25233F]/40 p-6 rounded-xl border border-[#44356F]/50 hover:bg-[#25233F]/60 transition-colors duration-300">
    <div className="text-sm font-semibold text-[#ACA7B6] uppercase tracking-wider mb-2">{label}</div>
    <div className="text-4xl font-extrabold text-[#FAFAF9] tracking-tight">{value}</div>
    <div className="mt-4 h-2 w-full bg-[#070915] rounded-full overflow-hidden border border-[#44356F]/30 shadow-inner">
      <div className={`h-full ${barColor} rounded-full ${barWidth} relative`}>
        {/* Subtle highlight effect on the bar */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FAFAF9]/20 rounded-t-full"></div>
      </div>
    </div>
  </div>
);

const FooterLink = ({ text, href }) => (
  <a 
    href={href} 
    className="text-sm font-medium text-[#ACA7B6] hover:text-[#917FBA] transition-colors duration-200"
  >
    {text}
  </a>
);

export default Home;