LEARNOVA GH — AI LEARNING PUBLIC RELEASE

This package is prepared for deploying Learnova GH as a public beta.

FEATURES
- Student dashboard
- Primary, JHS and SHS learning levels
- Subjects and topic navigation
- Exact topic search and direct lesson opening
- Lessons, examples, practice and quizzes
- AI Tutor 6.0 interface with optional server-side AI provider
- Progress, revision, saved lessons, study plan and achievements
- Teacher, parent and school portal demos
- Installable web app support
- Privacy, Terms, robots.txt, sitemap and 404 page

DEPLOY ON RENDER
1. Create a new Web Service on Render.
2. Connect this project/repository.
3. Build command: npm install
4. Start command: npm start
5. Set NODE_ENV=production.
6. Optional AI variables:
   AI_BASE_URL = your OpenAI-compatible provider base URL
   AI_API_KEY = your server-side API key
   AI_MODEL = your model name
7. Deploy and open the generated HTTPS URL.

IMPORTANT
- Never put an AI API key in app.js, index.html, or any browser-visible file.
- The included JSON database and in-memory sessions are suitable for a beta/demo deployment, not a production student-data system.
- For real student accounts at scale, use a managed database, persistent secure sessions, HTTPS, backups, monitoring, stronger authorization controls, account recovery/email verification, and a completed child-safety/privacy review.
- Verify curriculum content against the current Ghana curriculum before presenting it as an official complete curriculum.

LOCAL TEST
npm install
npm start
Then open http://localhost:3000

PUBLIC BETA CHECK
- Create account
- Log in
- Open Primary, JHS and SHS
- Open a subject
- Open an exact topic
- Start lesson
- Complete lesson
- Take quiz
- Check progress/revision/saved pages
- Test search and confirm it opens the exact result
- Test AI Tutor in local mode; configure AI variables only on the server for real AI
- Test on desktop and mobile

VERSION
Learnova GH Public Deployment


AI EXAM
- Added AI Exam Coach page with class/subject/topic scope, 5/10/20 questions, adaptive/foundation/standard/challenge difficulty, automatic marking, review, mistakes capture, exam history, and AI Tutor follow-up.
- If a secure AI endpoint is connected, Learnova can request AI-generated exam JSON; otherwise the built-in curriculum question bank provides a working local exam.
- New backend route: POST /api/ai/exam.

CURRENT LEARNING ENGINE
- The visible version/beta label has been removed from the student interface.
- The old top offline wording has been removed from the interface.
- Curriculum content is expanded by level with class-aware explanations, practical examples, translations and assessment generation.
- AI Tutor 6.0 uses /api/tutor. For full cloud conversational AI, configure AI_BASE_URL, AI_API_KEY and AI_MODEL on the server. The browser must never contain a private API key.
- AI Exam creates fresh class-aware questions and records exam mistakes for revision.

Latest reliability/visual update
- AI Tutor now auto-detects common school topics even when the topic box is empty.
- Direct, detailed Cells answer added with definition, organelles, plant/animal comparison, examples and class-level depth.
- Similar direct knowledge handling added for Photosynthesis and Constitution.
- Tutor quick-action buttons now insert real questions.
- Dashboard styling refreshed to match the supplied reference: deep navy sidebar, clean white workspace, blue/purple AI hero, polished cards and educational visual accents.
- The supplied screenshot is used as a visual reference only; it is not used as the site's literal background.
