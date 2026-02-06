import React, { useState } from 'react';
import { NavLink, Link } from 'react-router';
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

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Classify', path: '/classify', icon: ScanLine },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/95 border-b border-slate-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-[#0f172a] transition-transform group-hover:scale-105">
                <Recycle size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">BinBot</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center max-w-xs text-sm bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 pl-1 pr-3 py-1 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 mr-2">
                    <User size={16} />
                  </div>
                  <span className="text-slate-200 font-medium mr-1">Alex M.</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-700">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="mr-2" /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="mr-2" /> Settings
                    </Link>
                    <div className="border-t border-slate-700 my-1"></div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 hover:text-red-300"
                      onClick={() => {
                        console.log('Logout clicked');
                        setIsProfileOpen(false);
                      }}
                    >
                      <LogOut size={16} className="mr-2" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500"
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
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-4 border-emerald-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </div>
          {/* Mobile User Section */}
          <div className="pt-4 pb-4 border-t border-slate-800">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                  <User size={20} />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">Alex Morgan</div>
                <div className="text-sm font-medium leading-none text-slate-400 mt-1">alex@ecocorp.com</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Profile
              </Link>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;