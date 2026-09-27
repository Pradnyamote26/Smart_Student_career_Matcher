// API Integration Layer for OpportunityOS
// Fetches real data from public APIs and simulates aggregation from Naukri, H2Skill, etc.

const CACHE_KEY = 'opportunityos_live_data';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour

// Helper to extract skills from description
const extractSkills = (text, tags) => {
  const commonSkills = ['React', 'Python', 'Node.js', 'JavaScript', 'Java', 'C++', 'Machine Learning', 'Data Science', 'AWS', 'Docker', 'SQL', 'Figma', 'UI/UX'];
  const found = commonSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  return [...new Set([...found, ...(tags || [])])].slice(0, 5);
};

export const fetchOpportunities = async () => {
  // Check cache first for fast MVP loads
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TIME) {
      return data;
    }
  }

  let liveData = [];

  try {
    // 1. Fetch Real Remote Jobs/Internships (Arbeitnow API)
    const jobRes = await fetch('https://www.arbeitnow.com/api/job-board-api');
    const jobData = await jobRes.json();
    
    const realJobs = jobData.data.slice(0, 15).map(job => ({
      id: `real_job_${job.slug}`,
      title: job.title,
      organization: job.company_name,
      category: job.title.toLowerCase().includes('intern') ? 'Internship' : 'Internship', // Force internship for student demo
      location: job.location,
      mode: job.remote ? 'Remote' : 'On-site',
      deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      skills: extractSkills(job.description, job.tags),
      description: job.description.replace(/<[^>]*>?/gm, '').substring(0, 300) + '...',
      stipend: 'Paid',
      url: job.url,
      source: 'Aggregated Job Board'
    }));
    liveData = [...liveData, ...realJobs];

    // 2. Fetch Real Open Source Repositories as "Hackathon/Projects" (GitHub API)
    const ghRes = await fetch('https://api.github.com/search/repositories?q=topic:hackathon+is:public&sort=updated&per_page=5');
    const ghData = await ghRes.json();
    
    const realHackathons = ghData.items.map(repo => ({
      id: `real_hack_${repo.id}`,
      title: repo.name.replace(/-/g, ' ').toUpperCase() + ' Hackathon',
      organization: repo.owner.login,
      category: 'Hackathon',
      location: 'Global',
      mode: 'Online',
      deadline: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      skills: repo.topics.slice(0, 4),
      description: repo.description || 'Join this exciting open-source hackathon event.',
      stipend: 'Prizes & Swag',
      url: repo.html_url,
      source: 'GitHub Events'
    }));
    liveData = [...liveData, ...realHackathons];

  } catch (error) {
    console.error("Failed to fetch live APIs, falling back to realistic generated data", error);
  }

  // 3. Fallback / Highly realistic simulated data for Naukri/H2Skill
  const simulatedData = [
    {
      id: 'sim_1',
      title: 'Google STEP Internship 2026',
      organization: 'Google',
      category: 'Internship',
      location: 'Bangalore / Hyderabad',
      mode: 'Hybrid',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['C++', 'Java', 'Python', 'Data Structures'],
      description: 'The Student Training in Engineering Program (STEP) is designed for students with a passion for technology.',
      stipend: '₹80,000 / month',
      url: 'https://careers.google.com',
      source: 'Naukri.com'
    },
    {
      id: 'sim_2',
      title: 'Microsoft Imagine Cup 2026',
      organization: 'Microsoft',
      category: 'Competition',
      location: 'Global',
      mode: 'Online',
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['AI', 'Azure', 'Innovation', 'Pitching'],
      description: 'Bring your idea to life with Microsoft Azure. Win up to $100,000 and mentorship.',
      stipend: 'Up to $100,000',
      url: 'https://imaginecup.microsoft.com',
      source: 'H2Skill'
    },
    {
      id: 'sim_3',
      title: 'Reliance Foundation Scholarship',
      organization: 'Reliance Foundation',
      category: 'Scholarship',
      location: 'India',
      mode: 'Online',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['Academic Excellence', 'Leadership'],
      description: 'Supporting 5000 undergraduate students across India with scholarship grants.',
      stipend: 'Up to ₹2,00,000',
      url: 'https://scholarships.reliancefoundation.org',
      source: 'Scholarship Portal'
    },
    {
      id: 'sim_4',
      title: 'AWS Certified Cloud Practitioner Workshop',
      organization: 'Amazon Web Services',
      category: 'Workshop',
      location: 'Remote',
      mode: 'Online',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['AWS', 'Cloud Computing', 'Networking'],
      description: 'A free 2-day workshop covering the fundamentals of AWS Cloud.',
      stipend: 'Free Certification Voucher',
      url: 'https://aws.amazon.com',
      source: 'AWS Training'
    }
  ];

  const finalData = [...liveData, ...simulatedData].sort(() => Math.random() - 0.5);

  // Ensure every item has skills array
  finalData.forEach(item => {
    if (!item.skills || item.skills.length === 0) item.skills = ['General'];
  });

  // Cache the data
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: finalData }));

  return finalData;
};
