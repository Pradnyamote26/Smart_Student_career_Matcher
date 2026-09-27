import { Bookmark, MapPin, Calendar, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isBookmarked, toggleBookmark } from '../utils/storage';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function OpportunityCard({ opportunity, matchResult, index = 0 }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(opportunity.id));
  }, [opportunity.id]);

  const handleBookmark = (e) => {
    e.preventDefault();
    toggleBookmark(opportunity.id);
    setBookmarked(!bookmarked);
  };

  const getMatchColor = (score) => {
    if (!score) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (score >= 80) return 'bg-green-50 text-green-700 border-green-200';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="h-full"
    >
      <Tilt 
        tiltMaxAngleX={4} 
        tiltMaxAngleY={4} 
        glareEnable={true} 
        glareMaxOpacity={0.15} 
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="1rem"
        scale={1.02}
        transitionSpeed={1500}
        className="h-full"
      >
        <Link to={`/opportunity/${opportunity.id}`} className="block group h-full">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl transition-all hover:border-indigo-300 relative h-full flex flex-col">
        
        {/* Match Score Badge */}
        {matchResult && matchResult.score > 0 && (
          <div className="absolute top-6 right-6">
            <div className={`inline-flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 shadow-sm ${getMatchColor(matchResult.score)}`}>
              <span className="font-bold text-lg leading-none">{matchResult.score}%</span>
              <span className="text-[10px] font-medium uppercase tracking-wider">Match</span>
            </div>
          </div>
        )}

        <div className="mb-4 pr-16">
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-3">
            {opportunity.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {opportunity.title}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">{opportunity.organization}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-5">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-slate-400" />
            <span>{opportunity.location} ({opportunity.mode})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} className="text-slate-400" />
            <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-5 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {opportunity.skills.map(skill => (
              <span key={skill} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Why this matches you */}
        {matchResult && matchResult.score > 0 && matchResult.reasons && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5">
            <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Why this matches you</p>
            <ul className="space-y-1.5">
              {matchResult.reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{reason}</span>
                </li>
              ))}
              {matchResult.reasons.length > 3 && (
                <li className="text-xs text-indigo-600 font-medium pl-6">+{matchResult.reasons.length - 3} more reasons</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-lg border transition-colors ${
              bookmarked 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <Bookmark size={20} className={bookmarked ? "fill-indigo-600" : ""} />
          </button>
          <div className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
            View Details
          </div>
        </div>
        </div>
      </Link>
      </Tilt>
    </motion.div>
  );
}
