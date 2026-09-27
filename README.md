# OpportunityOS

## Problem
Students frequently miss valuable internships, hackathons, scholarships, certifications, and competitions because information is scattered across websites, social media platforms, college groups, and other sources.

## Solution
OpportunityOS is an intelligent platform where students create a single profile and discover opportunities perfectly matched to their education, skills, interests, and career goals.

## Features
- **Smart Matching Engine:** Calculates a personalized match score (0-100%) for every opportunity.
- **Why This Matches You:** Explains exactly why an opportunity is recommended.
- **Deadline Radar:** Visually tracks approaching deadlines.
- **Student Dashboard:** Centralized hub for saved items, matches, and profile completion.
- **Discover Page:** Filter and search through tailored opportunities.
- **Local Storage:** Fully functional MVP using browser storage.

## Smart Matching
The recommendation engine calculates scores based on:
- Skill Match (40%)
- Interest Match (25%)
- Education/Eligibility Match (15%)
- Category Preference (10%)
- Deadline/Urgency (10%)

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data:** LocalStorage for Profile & Bookmarks
- **Deployment:** Docker & Google Cloud Run

## Project Structure
```
src/
  components/    # Reusable UI elements (Navbar, OpportunityCard)
  pages/         # Route components (Discover, Dashboard, etc.)
  data/          # Mock data (opportunities.js)
  utils/         # Matching logic & storage helpers
  App.jsx        # Routing configuration
  main.jsx       # App entry point
```

## Local Setup
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173`

## Deployment
This project is containerized for deployment on Google Cloud Run.
1. Build the image: `docker build -t opportunityos .`
2. Run locally: `docker run -p 8080:80 opportunityos`
3. Deploy to Cloud Run using `gcloud run deploy`.

## Future Scope
- Backend integration (Firebase / Supabase)
- Real-time web scraping for opportunities
- Email & WhatsApp notifications
- AI-based resume parsing

## Hackathon
Built for GDG FIT Pune Hackathon / FIT FEST 2026.
