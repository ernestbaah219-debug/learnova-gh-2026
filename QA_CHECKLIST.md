# Learnova AI V23 — Beta QA Checklist

## Student
- Register/login
- Select class → subject → topic
- Open lesson and practice
- Submit quiz/exam answers
- Confirm mastery and mistakes update
- Open AI Tutor 7.0 with current lesson context
- Save lesson and check revision
- Test offline/PWA behavior

## Teacher
- Open teacher portal
- Create/select class
- Add student
- Create assignment
- Review performance and weak topics

## Parent
- Open parent portal
- Review child activity, results and weak areas

## Admin
- Review school/class/user overview

## Security
- Never place AI provider keys in frontend files
- Configure HTTPS in deployment
- Configure secure production session storage
- Configure a production database and backups
- Review privacy/consent and age-appropriate data handling

## Release gates
- No broken class/subject/topic navigation
- No console errors on core flows
- AI Tutor fallback works without an API
- Mobile layout works on small screens
- Curriculum content is reviewed before claiming complete Ghana curriculum coverage
