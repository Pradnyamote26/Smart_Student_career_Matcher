import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, LayoutDashboard, Bookmark, User, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProfile } from '../utils/storage';
import { getAuthUser, logoutUser } from '../utils/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const updateAuthAndProfile = () => {
      setProfile(getProfile());
      setAuthUser(getAuthUser());
    };
    updateAuthAndProfile();
    const interval = setInterval(updateAuthAndProfile, 1000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Saved', path: '/saved', icon: Bookmark },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">O</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Opportunity<span className="text-indigo-600">OS</span></span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path) 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {authUser ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{profile ? profile.name : authUser.name}</p>
                    <p className="text-xs text-slate-500">{profile ? 'Student Profile' : 'Complete Profile'}</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    {profile && profile.name ? profile.name.charAt(0).toUpperCase() : authUser.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Login / Sign Up
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.name}
                </Link>
              );
            })}
            {authUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === '/profile'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-slate-50 hover:border-red-300"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === '/auth'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
