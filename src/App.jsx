import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Saved from './pages/Saved';
import OpportunityDetails from './pages/OpportunityDetails';
import Auth from './pages/Auth';
import { Toaster } from 'react-hot-toast';
import { getAuthUser } from './utils/auth';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  const ProtectedRoute = ({ children }) => {
    const user = getAuthUser();
    if (!user) {
      return <Navigate to="/auth" />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <Navbar />
      <main className="pb-16 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
            <Route path="/opportunity/:id" element={<PageTransition><OpportunityDetails /></PageTransition>} />
            <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><PageTransition><Saved /></PageTransition></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
