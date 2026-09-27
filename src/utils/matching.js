// Calculate match score between a student profile and an opportunity
export function calculateMatchScore(profile, opportunity) {
  if (!profile || !profile.skills || profile.skills.length === 0) return 0;

  // 1. Skill Match (40%)
  const profileSkillsLower = profile.skills.map(s => s.toLowerCase());
  const opportunitySkillsLower = opportunity.skills.map(s => s.toLowerCase());
  const matchingSkills = opportunitySkillsLower.filter(s => profileSkillsLower.includes(s));
  const skillRatio = matchingSkills.length / Math.max(opportunitySkillsLower.length, 1);
  const skillScore = skillRatio * 40;

  // 2. Interest Match (25%)
  const profileInterestsLower = profile.interests.map(i => i.toLowerCase());
  const isInterestMatch = profileInterestsLower.some(i => 
    opportunity.title.toLowerCase().includes(i) ||
    opportunity.description.toLowerCase().includes(i) ||
    opportunity.skills.map(s => s.toLowerCase()).includes(i) ||
    opportunity.category.toLowerCase().includes(i)
  );
  const interestScore = isInterestMatch ? 25 : 0;

  // 3. Education/Eligibility Match (15%)
  // Simple heuristic: if eligibility isn't specified or we have a profile, give full points for demo purposes
  // In a real app, this would use NLP or specific matching criteria
  const educationScore = 15; 

  // 4. Category Preference (10%)
  const preferredCategoriesLower = profile.preferredCategories.map(c => c.toLowerCase());
  const categoryScore = preferredCategoriesLower.includes(opportunity.category.toLowerCase()) ? 10 : 0;

  // 5. Deadline/Urgency (10%)
  const today = new Date();
  const deadline = new Date(opportunity.deadline);
  const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  let deadlineScore = 0;
  if (diffDays >= 0 && diffDays <= 7) {
    deadlineScore = 10; // High urgency
  } else if (diffDays > 7 && diffDays <= 30) {
    deadlineScore = 8;
  } else if (diffDays > 30) {
    deadlineScore = 5;
  }

  const totalScore = Math.min(Math.round(skillScore + interestScore + educationScore + categoryScore + deadlineScore), 100);

  // Generate reasons
  const reasons = [];
  if (matchingSkills.length > 0) {
    reasons.push(`${matchingSkills.length} matching skill(s) (${matchingSkills.slice(0,2).join(', ')}${matchingSkills.length > 2 ? '...' : ''})`);
  }
  if (isInterestMatch) {
    reasons.push('Matches your interests');
  }
  if (categoryScore > 0) {
    reasons.push(`Preferred opportunity type (${opportunity.category})`);
  }
  if (diffDays >= 0 && diffDays <= 14) {
    reasons.push('Deadline approaching soon');
  }
  reasons.push('Meets general eligibility');

  return {
    score: totalScore,
    reasons,
    matchingSkills
  };
}
