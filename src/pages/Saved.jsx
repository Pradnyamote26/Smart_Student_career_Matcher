import { useEffect, useState, useMemo } from 'react';
import { getBookmarks, getProfile } from '../utils/storage';
import { fetchOpportunities } from '../services/api';
import { calculateMatchScore } from '../utils/matching';
import OpportunityCard from '../components/OpportunityCard';
import { Bookmark, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Saved() {
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const profile = getProfile();

  useEffect(() => {
    const updateBookmarks = () => setBookmarkedIds(getBookmarks());
    updateBookmarks();
    
    const loadData = async () => {
      setLoading(true);
      const data = await fetchOpportunities();
      setOpportunities(data);
      setLoading(false);
    };
    loadData();

    // Quick polling for demo simplicity
    const interval = setInterval(updateBookmarks, 1000);
    return () => clearInterval(interval);
  }, []);

  const savedOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => bookmarkedIds.includes(opp.id))
      .map(opp => ({
        ...opp,
        matchResult: profile ? calculateMatchScore(profile, opp) : null
      }));
  }, [bookmarkedIds, profile, opportunities]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Bookmark className="text-indigo-600" size={20} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Opportunities</h1>
          <p className="text-slate-600">Your bookmarked internships, hackathons, and more.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-slate-900">Loading saved items...</h3>
        </div>
      ) : savedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp, idx) => (
            <OpportunityCard key={opp.id} opportunity={opp} matchResult={opp.matchResult} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-slate-100 mb-6">
            <Bookmark className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No saved opportunities</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Your future opportunity list starts here. Explore our personalized recommendations and save the ones you like.
          </p>
          <Link 
            to="/discover"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Search size={18} /> Explore Opportunities
          </Link>
        </div>
      )}
    </div>
  );
}
