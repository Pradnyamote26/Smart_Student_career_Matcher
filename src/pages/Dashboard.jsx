import { useEffect, useState, useMemo } from 'react';
import { getProfile, getBookmarks, getApplications } from '../utils/storage';
import { fetchOpportunities } from '../services/api';
import { calculateMatchScore } from '../utils/matching';
import OpportunityCard from '../components/OpportunityCard';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Bookmark, Zap, CalendarDays, ArrowRight, Briefcase, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate('/profile');
      return;
    }
    setProfile(p);
    setBookmarkedIds(getBookmarks());
    
    const loadData = async () => {
      setLoading(true);
      const data = await fetchOpportunities();
      setOpportunities(data);
      
      // Load applications mapping to live data
      const apps = getApplications();
      const enrichedApps = apps.map(app => {
        const opp = data.find(o => o.id === app.id);
        return { ...app, title: opp?.title || 'Unknown Role', organization: opp?.organization || 'Unknown Company' };
      });
      setAppliedJobs(enrichedApps);
      setLoading(false);
    };
    
    loadData();
  }, [navigate]);

  const topMatches = useMemo(() => {
    if (!profile || opportunities.length === 0) return [];
    const scored = opportunities.map(opp => ({
      ...opp,
      matchResult: calculateMatchScore(profile, opp)
    }));
    return scored
      .filter(opp => opp.matchResult.score > 0)
      .sort((a, b) => b.matchResult.score - a.matchResult.score)
      .slice(0, 3);
  }, [profile, opportunities]);

  const chartData = useMemo(() => {
    if (!profile || opportunities.length === 0) return [];
    const scored = opportunities.map(opp => ({
      name: opp.category,
      score: calculateMatchScore(profile, opp).score
    })).filter(opp => opp.score > 0);
    
    // Group by category and take max score
    const grouped = {};
    scored.forEach(s => {
      if (!grouped[s.name] || grouped[s.name] < s.score) {
        grouped[s.name] = s.score;
      }
    });
    return Object.keys(grouped).map(k => ({ name: k, score: grouped[k] })).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [profile, opportunities]);

  const upcomingDeadlines = useMemo(() => {
    if (!profile || opportunities.length === 0) return [];
    const scored = opportunities.map(opp => ({
      ...opp,
      matchResult: calculateMatchScore(profile, opp)
    }));
    return scored
      .filter(opp => opp.matchResult.score >= 50)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  }, [profile, opportunities]);

  if (!profile) return null;
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-900">Crunching Live Matches...</h3>
        <p className="text-slate-500 mt-2">Connecting to live opportunity boards</p>
      </div>
    );
  }

  // Calculate profile completion roughly
  let completionFields = [profile.name, profile.email, profile.college, profile.degree, profile.branch, profile.year];
  let arrayFields = [profile.skills, profile.interests, profile.preferredCategories];
  
  let filled = completionFields.filter(f => f && f.length > 0).length + arrayFields.filter(a => a && a.length > 0).length;
  let total = completionFields.length + arrayFields.length;
  const completionPercentage = Math.round((filled / total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good afternoon, {profile.name.split(' ')[0]}</h1>
          <p className="text-slate-600 mt-2">Here is your personalized opportunity hub.</p>
        </div>
        <Link to="/discover" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
          <Zap size={18} /> Discover More
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Link to="/discover" className="block bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all h-full cursor-pointer group">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Top Matches</p>
              <h3 className="text-2xl font-bold text-slate-900">{topMatches.length > 0 ? '12+' : '0'}</h3>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Link to="/saved" className="block bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-purple-300 hover:shadow-md transition-all h-full cursor-pointer group">
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Bookmark size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Saved</p>
              <h3 className="text-2xl font-bold text-slate-900">{bookmarkedIds.length}</h3>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <a href="#deadline-radar" className="block bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 hover:shadow-md transition-all h-full cursor-pointer group" onClick={(e) => { e.preventDefault(); document.getElementById('deadline-radar')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Deadlines Soon</p>
              <h3 className="text-2xl font-bold text-slate-900">{upcomingDeadlines.length}</h3>
            </div>
          </a>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Link to="/profile" className="block bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all h-full cursor-pointer group">
            <div className="h-12 w-12 relative flex-shrink-0 group-hover:scale-110 transition-transform">
              <CircularProgressbar 
                value={completionPercentage} 
                text={`${completionPercentage}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: `rgba(79, 70, 229, ${completionPercentage / 100})`,
                  textColor: '#1e293b',
                  trailColor: '#f1f5f9',
                })} 
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Profile Strength</p>
              <span className="text-xs text-indigo-600 font-medium group-hover:underline">Update Profile</span>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Activity Chart */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Zap className="text-amber-500" size={20} /> Match Analytics
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#22c55e' : entry.score >= 50 ? '#6366f1' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Top Matches */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="text-indigo-600" size={20} /> Top Matches for You
              </h2>
              <Link to="/discover" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topMatches.map((opp, idx) => (
                <OpportunityCard key={opp.id} opportunity={opp} matchResult={opp.matchResult} index={idx} />
              ))}
              {topMatches.length === 0 && (
                <div className="col-span-full bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                  <p className="text-slate-600">Add more skills to your profile to get matches.</p>
                  <Link to="/profile" className="text-indigo-600 font-medium mt-2 inline-block">Update Profile</Link>
                </div>
              )}
            </div>
          </section>

          {/* Applications */}
          {appliedJobs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Briefcase className="text-blue-500" size={20} /> Your Applications
              </h2>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-100">
                  {appliedJobs.map(job => (
                    <li key={job.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <CheckCircle className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                          <p className="text-xs text-slate-500">{job.organization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {job.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Applied {new Date(job.dateApplied).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {/* Upcoming Deadlines */}
          <section id="deadline-radar" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="text-amber-500" size={20} /> Deadline Radar
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              {upcomingDeadlines.map(opp => {
                const today = new Date();
                const deadline = new Date(opp.deadline);
                const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={opp.id} className="flex gap-4 border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex flex-col items-center justify-center bg-slate-50 w-14 h-14 rounded-xl border border-slate-200 flex-shrink-0">
                      <span className="text-xs text-slate-500 font-medium uppercase">{deadline.toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-bold text-slate-900 leading-none mt-1">{deadline.getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 line-clamp-1">
                        <Link to={`/opportunity/${opp.id}`} className="hover:text-indigo-600 transition-colors">{opp.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 mb-1">{opp.organization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {diffDays <= 7 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            🔥 {diffDays} days left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            ⚠️ {diffDays} days left
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          {opp.matchResult.score}% Match
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {upcomingDeadlines.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No urgent deadlines coming up.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
