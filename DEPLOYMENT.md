# Learnova GH Public Deployment

## Hosting target
Render Web Service (Node.js).

## Required
- Node.js 18+
- `npm install`
- `npm start`
- HTTPS supplied by the host

## Environment variables
- `NODE_ENV=production`
- `AI_BASE_URL` optional
- `AI_API_KEY` optional and server-only
- `AI_MODEL` optional

## Health check
`GET /api/health`

Expected response includes `ok: true`.

## Before public launch
1. Run the QA checklist.
2. Create a test account.
3. Verify level → subject → topic → lesson → quiz.
4. Verify exact search navigation.
5. Verify mobile layout and scrolling.
6. Verify privacy and terms pages.
7. If enabling real AI, set the AI variables only in the host's server environment.
8. Do not use real sensitive student data until persistent storage, authentication/session hardening, backups, monitoring, and privacy/child-safety review are complete.
