import { useState, useEffect } from 'react';
import { User, GraduationCap, Briefcase, Code, Bookmark, Save, Scan, FileText, Cpu, CheckCircle, Target, Zap, ExternalLink } from 'lucide-react';
import { getProfile, saveProfile, loadDemoProfile } from '../utils/storage';
import { getAuthUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { parseResume } from '../utils/parser';

export default function Profile() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    branch: '',
    year: '',
    skills: [],
    interests: [],
    preferredCategories: [],
    careerGoal: '',
    preferredMode: 'Hybrid'
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const categories = ['Internship', 'Hackathon', 'Scholarship', 'Certification', 'Competition', 'Workshop', 'Course'];

  useEffect(() => {
    const existing = getProfile();
    if (existing) {
      setFormData(existing);
    } else {
      const authUser = getAuthUser();
      if (authUser) {
        setFormData(prev => ({ ...prev, name: authUser.name, email: authUser.email }));
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
        setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
        setInterestInput('');
      }
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const toggleCategory = (category) => {
    if (formData.preferredCategories.includes(category)) {
      setFormData({ ...formData, preferredCategories: formData.preferredCategories.filter(c => c !== category) });
    } else {
      setFormData({ ...formData, preferredCategories: [...formData.preferredCategories, category] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile(formData);
    setIsSaved(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleLoadDemo = () => {
    const demo = loadDemoProfile();
    setFormData(demo);
    setIsSaved(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const [isParsing, setIsParsing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState('');

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadedFile(file.name);
    setIsParsing(true);
    setScanStep(1);
    
    // Step 1: Scanning (UI delay for effect)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScanStep(2);
    
    // Parse the PDF
    const extractedData = await parseResume(file);
    
    // Step 2: Extracting Text (UI delay)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScanStep(3);
    
    // Step 3: AI Processing (UI delay)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsParsing(false);
    setScanStep(0);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        name: extractedData.name || prev.name,
        email: extractedData.email || prev.email,
        college: extractedData.college || prev.college,
        degree: extractedData.degree || prev.degree,
        branch: prev.branch || 'Computer Science',
        year: extractedData.year || prev.year,
        careerGoal: prev.careerGoal || 'Software Engineer',
        atsScore: extractedData.atsScore || null,
        skills: [...new Set([...prev.skills, ...extractedData.skills])],
        interests: [...new Set([...prev.interests, 'Artificial Intelligence', 'Web Development'])],
        preferredCategories: prev.preferredCategories.length > 0 ? prev.preferredCategories : ['Internship', 'Hackathon']
      };
      // Auto-save the new data immediately so the dashboard sees the ATS score without hitting "Save"
      saveProfile(newData);
      return newData;
    });

    toast.success(`Resume parsed! ATS Score: ${extractedData.atsScore}%. Found ${extractedData.skills.length} skills for ${extractedData.name}.`, { duration: 5000 });
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Student Profile</h1>
            {formData.atsScore && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${formData.atsScore >= 75 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                ATS Score: {formData.atsScore}%
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">Tell us about yourself to unlock personalized opportunity matching.</p>
        </div>
        <div className="flex gap-2">
          <label 
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors border flex items-center gap-2 cursor-pointer ${
              isParsing 
                ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="hidden" 
              onChange={handleUploadResume}
              disabled={isParsing}
            />
            {isParsing ? 'Parsing with AI...' : 'Upload Resume'}
          </label>
          <button 
            type="button"
            onClick={handleLoadDemo}
            className="text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            Load Demo
          </button>
        </div>
      </div>

      {/* AI Career Advisor */}
      {formData.atsScore && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-indigo-50">
                <Zap className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI Career Advisor</h2>
                <p className="text-slate-600 text-sm">Personalized insights based on your resume scan</p>
              </div>
            </div>
            
            {/* ATS Score Display */}
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-indigo-50">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">ATS Resume Score</p>
                <p className={`font-bold text-sm ${formData.atsScore >= 75 ? 'text-green-600' : 'text-amber-600'}`}>
                  {formData.atsScore >= 75 ? 'Excellent formatting' : 'Needs improvement'}
                </p>
              </div>
              <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-xl border-4 ${formData.atsScore >= 75 ? 'bg-green-50 text-green-700 border-green-400' : 'bg-amber-50 text-amber-700 border-amber-400'}`}>
                {formData.atsScore}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-indigo-100/50 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3">💡 Top Resume Suggestions</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                {formData.skills.length < 5 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>Add more technical skills to your profile to increase your match rate with internships.</span>
                  </li>
                )}
                {formData.atsScore < 75 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>Ensure your resume uses standard section headers (Experience, Education) and avoid complex multi-column layouts.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>Based on your interest in {formData.careerGoal || 'Tech'}, consider adding a portfolio link or GitHub repository.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>Tailor your resume specifically for {formData.preferredCategories[0] || 'Internships'} by highlighting relevant coursework.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-5 border border-indigo-100/50 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">🚀 Recommended Learning Path</h4>
              <p className="text-sm text-slate-600 mb-4">
                Based on your goal to become a <strong>{formData.careerGoal || 'Software Engineer'}</strong>, we recommend:
              </p>
              <div className="flex flex-col gap-3">
                <a 
                  href={`https://roadmap.sh/${
                    (formData.careerGoal || '').toLowerCase().includes('front') ? 'frontend' :
                    (formData.careerGoal || '').toLowerCase().includes('back') ? 'backend' :
                    (formData.careerGoal || '').toLowerCase().includes('data') ? 'data-analyst' :
                    (formData.careerGoal || '').toLowerCase().includes('design') || (formData.careerGoal || '').toLowerCase().includes('ui') ? 'design-system' :
                    (formData.careerGoal || '').toLowerCase().includes('devops') ? 'devops' :
                    (formData.careerGoal || '').toLowerCase().includes('android') ? 'android' :
                    'computer-science'
                  }`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between text-sm font-semibold bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <span className="flex items-center gap-2"><Target size={16} /> Step-by-Step Roadmap</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href={`https://www.coursera.org/search?query=${encodeURIComponent(formData.careerGoal || 'Software Engineer')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between text-sm font-semibold bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <span className="flex items-center gap-2"><Code size={16} /> Coursera Courses</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href={`https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(formData.careerGoal || 'Software Engineer')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between text-sm font-semibold bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span className="flex items-center gap-2"><FileText size={16} /> freeCodeCamp Guides</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Personal Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="Alex Sharma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="alex@example.com" />
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Education</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">College / University</label>
              <input required type="text" name="college" value={formData.college} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="Flora Institute of Technology" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
              <input required type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="B.Tech" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch / Specialization</label>
              <input required type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Year</label>
              <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Code className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Skills & Interests</h2>
          </div>
          
          <div className="space-y-6">
            {/* Skills Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills (Press Enter to add)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" 
                  placeholder="e.g. Python, React, Machine Learning" 
                />
                <button type="button" onClick={handleAddSkill} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-slate-700 transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-indigo-600">×</button>
                  </span>
                ))}
                {formData.skills.length === 0 && <span className="text-sm text-slate-400 italic">No skills added yet</span>}
              </div>
            </div>

            {/* Interests Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Interests / Areas of Focus</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={interestInput} 
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" 
                  placeholder="e.g. Artificial Intelligence, Web Development" 
                />
                <button type="button" onClick={handleAddInterest} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-slate-700 transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.interests.map((interest, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-sm font-medium">
                    {interest}
                    <button type="button" onClick={() => handleRemoveInterest(interest)} className="text-purple-400 hover:text-purple-600">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Career & Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Preferred Opportunity Types</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      formData.preferredCategories.includes(category)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Career Goal</label>
                <input type="text" name="careerGoal" value={formData.careerGoal} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="e.g. AI/ML Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Mode</label>
                <select name="preferredMode" value={formData.preferredMode} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="In-office">In-office</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          {isSaved && <span className="text-green-600 font-medium flex items-center gap-2">Profile saved successfully! ✓</span>}
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save size={20} />
            Save Profile & Match Me
          </button>
        </div>
      </form>

      {/* 3D AI Parser Modal */}
      <AnimatePresence>
        {isParsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, rotateX: 20 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.9, rotateX: -20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              style={{ perspective: 1000 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Cpu className="text-indigo-600" /> AI Resume Scanner
              </h3>

              {/* 3D Card Representation */}
              <div className="relative w-48 h-64 bg-slate-50 border-2 border-slate-200 rounded-lg shadow-inner flex flex-col items-center justify-center overflow-hidden mb-6" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(10deg)' }}>
                <FileText size={48} className="text-slate-300 mb-4" />
                <div className="w-2/3 h-2 bg-slate-200 rounded mb-2"></div>
                <div className="w-1/2 h-2 bg-slate-200 rounded mb-2"></div>
                <div className="w-3/4 h-2 bg-slate-200 rounded mb-2"></div>
                
                {/* Laser scan line */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.5)] z-10"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>

              {uploadedFile && (
                <div className="bg-slate-50 w-full rounded-lg px-4 py-2 border border-slate-200 flex items-center justify-center mb-6">
                  <span className="text-sm font-mono text-slate-600 truncate">{uploadedFile}</span>
                </div>
              )}

              {/* Status steps */}
              <div className="w-full space-y-4">
                <div className={`flex items-center gap-3 transition-opacity ${scanStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  {scanStep > 1 ? <CheckCircle className="text-green-500" size={20} /> : <Scan className={`text-indigo-500 ${scanStep === 1 ? 'animate-pulse' : ''}`} size={20} />}
                  <span className={`font-medium ${scanStep >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>Scanning Document...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${scanStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  {scanStep > 2 ? <CheckCircle className="text-green-500" size={20} /> : <FileText className={`text-indigo-500 ${scanStep === 2 ? 'animate-pulse' : ''}`} size={20} />}
                  <span className={`font-medium ${scanStep >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>Extracting Text & Layout...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${scanStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  {scanStep > 3 ? <CheckCircle className="text-green-500" size={20} /> : <Cpu className={`text-indigo-500 ${scanStep === 3 ? 'animate-spin' : ''}`} size={20} />}
                  <span className={`font-medium ${scanStep >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>AI Understanding Context...</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
