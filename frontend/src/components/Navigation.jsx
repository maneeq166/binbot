import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  ScanLine, 
  History, 
  BarChart3, 
  Menu, 
  X, 
  Recycle, 
  User, 
  LogOut, 
  Settings,
  ChevronDown 
} from 'lucide-react';
import { me } from '../api/auth';

const Navigation = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [profileName, setProfileName] = useState("User");
  const [profileEmail, setProfileEmail] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileName("User");
      setProfileEmail("");
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      const response = await me();
      if (!isMounted) return;

      if (response?.success && response?.data) {
        const username = response.data.username || "User";
        const displayName = username
          .replace(/[._-]+/g, " ")
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" ");

        setProfileName(displayName || "User");
        setProfileEmail(response.data.email || "");
      } else {
        setProfileName("User");
        setProfileEmail("");
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const navItems = isLoggedIn ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Classify', path: '/classify', icon: ScanLine },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ] : [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Login', path: '/login', icon: User },
    { name: 'Register', path: '/register', icon: ScanLine },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#070915]/85 backdrop-blur-xl border-b border-[#44356F]/40 shadow-[0_4px_30px_rgba(7,9,21,0.6)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="h-9 w-9 bg-gradient-to-br from-[#674E98] to-[#44356F] rounded-xl flex items-center justify-center text-[#FAFAF9] shadow-[0_0_15px_rgba(103,78,152,0.4)] ring-1 ring-[#917FBA]/30 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(145,127,186,0.6)] group-hover:scale-105 group-hover:-translate-y-[1px]">
                <Recycle size={20} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold text-[#FAFAF9] tracking-tight group-hover:drop-shadow-[0_0_8px_rgba(250,250,249,0.3)] transition-all duration-300">BinBot</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
                      isActive
                        ? 'bg-gradient-to-r from-[#25233F] to-[#25233F]/60 text-[#FAFAF9] shadow-[inset_0_1px_1px_rgba(145,127,186,0.15),0_4px_12px_rgba(7,9,21,0.5)] ring-1 ring-[#44356F]/80'
                        : 'text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#25233F]/40 hover:shadow-[0_4px_12px_rgba(7,9,21,0.3)] hover:-translate-y-[1px]'
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: User Profile & Mobile Toggle */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center max-w-xs text-sm bg-[#25233F]/60 backdrop-blur-md rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070915] focus:ring-[#917FBA]/50 pl-1.5 pr-4 py-1.5 border border-[#44356F]/60 hover:border-[#674E98]/80 hover:bg-[#25233F] hover:shadow-[0_0_20px_rgba(103,78,152,0.2)] hover:-translate-y-[1px] transition-all duration-300 ease-out"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#44356F] to-[#674E98] flex items-center justify-center text-[#FAFAF9] mr-2.5 shadow-inner ring-1 ring-[#917FBA]/20">
                      <User size={15} strokeWidth={2.5} />
                    </div>
                    <span className="text-[#FAFAF9] font-bold mr-1.5 tracking-wide">{profileName}</span>
                    <ChevronDown size={14} className={`text-[#ACA7B6] transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#917FBA]' : ''}`} />
                  </button>
                </div>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_10px_40px_rgba(7,9,21,0.8),0_0_20px_rgba(103,78,152,0.15)] bg-[#070915]/95 backdrop-blur-2xl ring-1 ring-[#674E98]/40 focus:outline-none z-50 border border-[#44356F]/60 overflow-hidden transform opacity-100 scale-100 transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-5 py-2.5 text-sm font-medium text-[#ACA7B6] hover:bg-gradient-to-r hover:from-[#25233F]/80 hover:to-transparent hover:text-[#FAFAF9] transition-all duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} className="mr-3 text-[#674E98]" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-5 py-2.5 text-sm font-medium text-[#ACA7B6] hover:bg-gradient-to-r hover:from-[#25233F]/80 hover:to-transparent hover:text-[#FAFAF9] transition-all duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} className="mr-3 text-[#674E98]" /> Settings
                      </Link>
                      <div className="border-t border-[#44356F]/50 my-2"></div>
                      <button
                        className="flex w-full items-center px-5 py-2.5 text-sm font-medium text-[#D3B4D2] hover:bg-gradient-to-r hover:from-[#674E98]/20 hover:to-transparent hover:text-[#FAFAF9] transition-all duration-200"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="mr-3 text-[#D3B4D2]" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/login" className="text-sm font-semibold text-[#ACA7B6] hover:text-[#FAFAF9] hover:drop-shadow-[0_0_8px_rgba(250,250,249,0.3)] transition-all duration-300">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold bg-gradient-to-r from-[#674E98] to-[#917FBA] text-[#070915] px-6 py-2.5 rounded-xl hover:from-[#917FBA] hover:to-[#D3B4D2] transition-all duration-300 shadow-[0_0_20px_rgba(103,78,152,0.3)] hover:shadow-[0_0_30px_rgba(145,127,186,0.6)] hover:scale-[1.02] hover:-translate-y-[1px] ring-1 ring-[#FAFAF9]/10"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-[#25233F]/50 backdrop-blur-sm inline-flex items-center justify-center p-2.5 rounded-xl text-[#ACA7B6] border border-[#44356F]/50 hover:text-[#FAFAF9] hover:bg-[#25233F] hover:border-[#674E98] hover:shadow-[0_0_15px_rgba(103,78,152,0.2)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070915] focus:ring-[#917FBA] transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#070915]/95 backdrop-blur-2xl border-b border-[#44356F]/50 shadow-[0_20px_40px_rgba(7,9,21,0.8)]">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#25233F] to-[#25233F]/40 text-[#FAFAF9] border-l-4 border-[#917FBA] shadow-[inset_0_1px_1px_rgba(145,127,186,0.1)]'
                      : 'text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#25233F]/50 hover:translate-x-1'
                  }`
                }
              >
                <item.icon size={20} className={({ isActive }) => isActive ? "text-[#917FBA]" : "text-[#674E98]"} />
                {item.name}
              </NavLink>
            ))}
          </div>
          {/* Mobile User Section */}
          {isLoggedIn ? (
            <div className="pt-5 pb-6 border-t border-[#44356F]/40 bg-[#070915]">
              <div className="flex items-center px-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#44356F] to-[#674E98] flex items-center justify-center text-[#FAFAF9] shadow-[0_4px_10px_rgba(7,9,21,0.5)] ring-2 ring-[#25233F]">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-bold leading-none text-[#FAFAF9] tracking-wide">{profileName}</div>
                  <div className="text-sm font-medium leading-none text-[#ACA7B6] mt-2">{profileEmail || " "}</div>
                </div>
              </div>
              <div className="mt-5 px-4 space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-[#ACA7B6] hover:text-[#FAFAF9] hover:bg-[#25233F]/50 hover:translate-x-1 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} className="text-[#674E98]" /> Your Profile
                </Link>
                <button
                  className="flex w-full items-center gap-3 text-left px-4 py-3 rounded-xl text-base font-semibold text-[#D3B4D2] hover:text-[#FAFAF9] hover:bg-[#674E98]/20 hover:translate-x-1 transition-all duration-300"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="text-[#D3B4D2]" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-5 pb-6 border-t border-[#44356F]/40 px-6 space-y-3 bg-[#070915]">
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl text-base font-bold text-[#ACA7B6] bg-[#25233F]/30 border border-[#44356F]/50 hover:text-[#FAFAF9] hover:bg-[#25233F] hover:border-[#674E98]/50 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl text-base font-bold text-[#070915] bg-gradient-to-r from-[#674E98] to-[#917FBA] hover:from-[#917FBA] hover:to-[#D3B4D2] shadow-[0_4px_20px_rgba(103,78,152,0.3)] hover:shadow-[0_4px_25px_rgba(145,127,186,0.5)] hover:-translate-y-[1px] transition-all duration-300 ring-1 ring-[#FAFAF9]/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;