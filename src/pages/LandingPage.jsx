import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Zap, Shield, Search, Bookmark } from 'lucide-react';
import { loadDemoProfile } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleDemo = () => {
    loadDemoProfile();
    navigate('/discover');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
          >
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-50/50 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
                  Built for GDG FIT Pune Hackathon
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              One Profile.<br/>
              Every Opportunity.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Smarter Matches.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 font-medium">
              Students miss out on valuable internships, hackathons, and scholarships because information is scattered. OpportunityOS centralizes discovery and matches you based on your skills, interests, and goals.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/discover"
                className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center gap-2 group"
              >
                Explore Opportunities
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/profile" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
                Build My Profile <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-6 flex items-center">
              <button onClick={handleDemo} className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                <Sparkles size={16} /> Fast-track: Load Demo Profile
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32"
          >
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none relative">
              <Tilt 
                tiltMaxAngleX={8} 
                tiltMaxAngleY={8} 
                perspective={1000} 
                scale={1.02} 
                transitionSpeed={2000}
                glareEnable={true}
                glareMaxOpacity={0.2}
                glarePosition="all"
                className="relative z-20"
              >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative flex justify-center items-center"
              >
                {/* Glow effect behind student */}
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[100px] opacity-30 w-64 h-64 mx-auto"></div>
                <img 
                  src="/student-3d.png" 
                  alt="3D Student" 
                  className="relative z-10 w-[500px] h-auto object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)]"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </motion.div>
              </Tilt>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Stop Searching. Start Matching.</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to land your next big break
          </p>
        </div>
        
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <Target className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Smart Matching
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Our algorithm scores every opportunity against your skills, interests, and goals to find perfect fits.</p>
              </dd>
            </div>
            
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <Search className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Personalized Discovery
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Stop browsing irrelevant listings. We explain exactly why an opportunity is recommended for you.</p>
              </dd>
            </div>
            
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Deadline Tracking
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Never miss an application deadline again with visual indicators and priority sorting.</p>
              </dd>
            </div>
            
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                One Hub
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                <p className="flex-auto">Manage bookmarks, track matches, and update your profile all from one clean, beautiful dashboard.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Stats */}
      <div className="bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-slate-400">Opportunities Analyzed</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">10K+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-slate-400">Personalized Discovery</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">95%</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-slate-400">Opportunity Categories</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">50+</dd>
            </div>
          </dl>
          <p className="text-center text-xs text-slate-500 mt-10">Note: Statistics above represent theoretical scale for demo purposes.</p>
        </div>
      </div>
    </div>
  );
}
