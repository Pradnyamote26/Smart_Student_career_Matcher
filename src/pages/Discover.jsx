import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowDownAZ, Loader2 } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard';
import { fetchOpportunities } from '../services/api';
import { getProfile } from '../utils/storage';
import { calculateMatchScore } from '../utils/matching';

export default function Discover() {
  const profile = getProfile();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match', 'deadline', 'newest'

  const categories = ['All', 'Internship', 'Hackathon', 'Scholarship', 'Certification', 'Competition', 'Workshop', 'Course'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchOpportunities();
      setOpportunities(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const opportunitiesWithScores = useMemo(() => {
    return opportunities.map(opp => {
      const matchResult = profile ? calculateMatchScore(profile, opp) : { score: 0, reasons: [] };
      return {
        ...opp,
        matchResult
      };
    });
  }, [profile, opportunities]);

  const filteredAndSortedOpportunities = useMemo(() => {
    let result = opportunitiesWithScores;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(opp => opp.category === selectedCategory);
    }

    // Filter by search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(opp => 
        opp.title.toLowerCase().includes(lowerSearch) ||
        opp.organization.toLowerCase().includes(lowerSearch) ||
        opp.skills.some(s => s.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchResult?.score || 0) - (a.matchResult?.score || 0);
      } else if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0; // fallback to newest/default
    });

    return result;
  }, [opportunitiesWithScores, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Discover Opportunities</h1>
        <p className="text-slate-600 mt-2">
          {profile 
            ? "We've analyzed and scored these opportunities based on your profile." 
            : "Complete your profile to unlock personalized matching and score."}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 sticky top-20 z-40">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Search by title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowDownAZ className="h-5 w-5 text-slate-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match">Best Match</option>
              <option value="deadline">Closing Soon</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 flex-shrink-0 mr-1" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-slate-900">Fetching Live Opportunities...</h3>
          <p className="text-slate-500 mt-2">Aggregating from Naukri, H2Skill, and global boards</p>
        </div>
      ) : filteredAndSortedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedOpportunities.map((opp, idx) => (
            <OpportunityCard key={opp.id} opportunity={opp} matchResult={opp.matchResult} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No opportunities found</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any matching opportunities. Try adjusting your search or filters.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="mt-6 text-indigo-600 font-medium hover:text-indigo-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
