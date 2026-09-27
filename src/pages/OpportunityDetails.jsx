import { useParams, Link } from 'react-router-dom';
import { fetchOpportunities } from '../services/api';
import { getProfile, isBookmarked, toggleBookmark, applyForOpportunity, hasApplied } from '../utils/storage';
import { calculateMatchScore } from '../utils/matching';
import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, ExternalLink, MapPin, Calendar, Building, Zap, CheckCircle2, Clock, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OpportunityDetails() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchOpportunities();
      const opp = data.find(o => o.id === id);
      if (opp) {
        setOpportunity(opp);
        setBookmarked(isBookmarked(opp.id));
        setApplied(hasApplied(opp.id));
        
        const profile = getProfile();
        if (profile) {
          setMatchResult(calculateMatchScore(profile, opp));
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleBookmark = () => {
    toggleBookmark(opportunity.id);
    setBookmarked(!bookmarked);
    if (!bookmarked) {
      toast.success('Opportunity saved!');
    } else {
      toast('Opportunity removed from saved.');
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!applied) {
      applyForOpportunity(opportunity.id);
      setApplied(true);
      toast.success('Successfully applied! We will track this in your dashboard.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-900">Loading Opportunity...</h3>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Opportunity not found</h2>
        <Link to="/discover" className="text-indigo-600 hover:underline">Return to Discover</Link>
      </div>
    );
  }

  const getMatchColor = (score) => {
    if (!score) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (score >= 80) return 'bg-green-50 text-green-700 border-green-200';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/discover" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to opportunities
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-10 border-b border-slate-200 relative">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 pr-16 md:pr-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 uppercase tracking-wider">
                  {opportunity.category}
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/10">
                  {opportunity.mode}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
                {opportunity.title}
              </h1>
              <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                <Building size={20} className="text-slate-400" />
                {opportunity.organization}
              </div>
            </div>

            {/* Match Score */}
            {matchResult && matchResult.score > 0 && (
              <div className="absolute top-6 right-6 md:relative md:top-0 md:right-0 flex-shrink-0">
                <div className={`flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 shadow-sm ${getMatchColor(matchResult.score)}`}>
                  <span className="font-bold text-2xl sm:text-3xl leading-none mb-1">{matchResult.score}%</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80">Match</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><MapPin size={18} className="text-slate-400" /></div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-slate-900">{opportunity.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><Calendar size={18} className="text-slate-400" /></div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Deadline</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(opportunity.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 bg-slate-50">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                About the opportunity
              </h3>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>{opportunity.description}</p>
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                Eligibility
              </h3>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-slate-600 text-sm">{opportunity.eligibility}</p>
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                Benefits & Perks
              </h3>
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                <p className="text-green-800 text-sm font-medium">{opportunity.benefits}</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why it matches */}
            {matchResult && matchResult.score > 0 && (
              <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm overflow-hidden">
                <div className="bg-indigo-50/50 px-5 py-3 border-b border-indigo-100 flex items-center gap-2">
                  <Zap size={18} className="text-indigo-600" />
                  <h4 className="font-bold text-indigo-900 text-sm">Why this matches you</h4>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {matchResult.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                        <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map(skill => {
                  const isMatch = matchResult?.matchingSkills?.includes(skill.toLowerCase());
                  return (
                    <span 
                      key={skill} 
                      className={`inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                        isMatch 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {skill}
                      {isMatch && <CheckCircle2 size={12} className="ml-1 text-green-600" />}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Timeline
              </h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {opportunity.importantDates}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-6 sm:px-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="w-full sm:w-auto">
            <button 
              onClick={handleBookmark}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                bookmarked
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark size={20} className={bookmarked ? "fill-indigo-600" : ""} />
              {bookmarked ? 'Saved' : 'Save Opportunity'}
            </button>
          </div>
          
          <div className="w-full sm:w-auto flex-1 max-w-sm">
            <button 
              onClick={handleApply}
              disabled={applied}
              className={`w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-sm transition-all ${
                applied 
                  ? 'bg-green-500 text-white cursor-default shadow-md' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
              }`}
            >
              {applied ? (
                <>
                  <Check size={18} />
                  Applied Successfully
                </>
              ) : (
                <>
                  Apply Externally
                  <ExternalLink size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
