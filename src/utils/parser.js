import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const KNOWN_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'SQL', 'MongoDB', 'PostgreSQL',
  'Machine Learning', 'Artificial Intelligence', 'Data Science', 'TensorFlow', 'PyTorch',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git', 'Linux', 'HTML', 'CSS',
  'Tailwind CSS', 'Figma', 'UI/UX', 'Product Management', 'Data Analysis', 'Tableau',
  'Power BI', 'Excel', 'C#', '.NET', 'Ruby', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin'
];

export async function parseResume(file) {
  let text = '';
  
  if (file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + ' ';
      }
    } catch (error) {
      console.error('Error parsing PDF:', error);
      text = file.name; // Fallback to filename
    }
  } else {
    // Fallback for non-PDF files: just use filename to guess
    text = file.name;
  }

  // 1. Extract Name from Text (usually at the very beginning)
  let cleanName = "";
  // Find the first sequence of 2-3 capitalized words
  const nameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+){1,2}/;
  const nameMatch = text.trim().match(nameRegex);
  
  if (nameMatch) {
    cleanName = nameMatch[0];
  } else {
    // Try to grab the first 2 words that aren't empty
    const firstWords = text.trim().split(/\s+/).slice(0, 2).join(' ');
    if (firstWords.length > 4 && !/\d/.test(firstWords)) {
      cleanName = firstWords.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    } else {
      // Fallback to filename
      cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/resume|cv/gi, "").trim();
      cleanName = cleanName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
  }
  
  if (!cleanName || cleanName.length < 2) cleanName = "Student User";

  // 2. Extract Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : `${cleanName.replace(/\s+/g, '.').toLowerCase()}@example.com`;

  // 3. Extract Skills
  const textUpper = text.toUpperCase();
  const extractedSkills = KNOWN_SKILLS.filter(skill => 
    textUpper.includes(skill.toUpperCase())
  );
  
  if (extractedSkills.length === 0) {
    extractedSkills.push('Communication', 'Problem Solving');
  }

  // 4. Guess Degree/Year
  let degree = 'B.Tech';
  if (textUpper.includes('M.TECH') || textUpper.includes('MASTER')) degree = 'M.Tech';
  if (textUpper.includes('BSC') || textUpper.includes('B.SC')) degree = 'B.Sc';
  if (textUpper.includes('BCA')) degree = 'BCA';

  let year = '3rd Year';
  if (textUpper.includes('2024')) year = '4th Year';
  if (textUpper.includes('2025')) year = '3rd Year';
  if (textUpper.includes('2026')) year = '2nd Year';
  if (textUpper.includes('2027')) year = '1st Year';

  // 5. Calculate ATS Score
  const atsScore = Math.min(100, Math.floor(45 + (extractedSkills.length * 4) + (text.length > 800 ? 15 : 5)));

  return {
    name: cleanName,
    email: email,
    skills: extractedSkills,
    degree: degree,
    year: year,
    atsScore: atsScore,
    college: textUpper.includes('INSTITUTE') || textUpper.includes('UNIVERSITY') || textUpper.includes('COLLEGE') 
      ? 'Flora Institute of Technology'
      : 'University'
  };
}
