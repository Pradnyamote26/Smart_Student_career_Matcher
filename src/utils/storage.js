import { demoProfile } from '../data/opportunities';
import { getAuthUser } from './auth';

const getBaseKey = (base) => {
  const user = getAuthUser();
  if (user && user.email) {
    return `${base}_${user.email}`;
  }
  return base; // Fallback for guest/demo
};

export function getProfile() {
  const data = localStorage.getItem(getBaseKey('opportunityos_profile'));
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile) {
  localStorage.setItem(getBaseKey('opportunityos_profile'), JSON.stringify(profile));
}

export function loadDemoProfile() {
  saveProfile(demoProfile);
  return demoProfile;
}

export function getBookmarks() {
  const data = localStorage.getItem(getBaseKey('opportunityos_bookmarks'));
  return data ? JSON.parse(data) : [];
}

export function toggleBookmark(opportunityId) {
  const bookmarks = getBookmarks();
  let newBookmarks;
  
  if (bookmarks.includes(opportunityId)) {
    newBookmarks = bookmarks.filter(id => id !== opportunityId);
  } else {
    newBookmarks = [...bookmarks, opportunityId];
  }
  
  localStorage.setItem(getBaseKey('opportunityos_bookmarks'), JSON.stringify(newBookmarks));
  return newBookmarks;
}

export function isBookmarked(opportunityId) {
  return getBookmarks().includes(opportunityId);
}

// Applications Logic
export function getApplications() {
  const data = localStorage.getItem(getBaseKey('opportunityos_applications'));
  return data ? JSON.parse(data) : [];
}

export function applyForOpportunity(opportunityId) {
  const applications = getApplications();
  if (!applications.some(app => app.id === opportunityId)) {
    const newApplications = [...applications, { 
      id: opportunityId, 
      dateApplied: new Date().toISOString(),
      status: 'Applied' // Mock statuses: Applied, In Review, Accepted, Rejected
    }];
    localStorage.setItem(getBaseKey('opportunityos_applications'), JSON.stringify(newApplications));
    return newApplications;
  }
  return applications;
}

export function hasApplied(opportunityId) {
  return getApplications().some(app => app.id === opportunityId);
}
