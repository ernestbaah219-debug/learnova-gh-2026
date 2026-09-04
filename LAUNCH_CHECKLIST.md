# Learnova AI V21 — Launch Checklist

## Before public launch
- [ ] Deploy the Node backend behind HTTPS.
- [ ] Set a strong production `AI_API_KEY` on the server only; never put it in frontend code.
- [ ] Set `AI_BASE_URL` and `AI_MODEL` for the chosen AI provider.
- [ ] Set `ALLOW_ORIGIN` to the exact production web origin instead of `*`.
- [ ] Replace the placeholder canonical/sitemap domain with the real Learnova domain.
- [ ] Replace demo school data and demo portal actions with real authenticated school workflows.
- [ ] Use a managed production database instead of the development `data.json` store.
- [ ] Add durable, secure sessions/cookies and session expiration.
- [ ] Add backups, monitoring, logging and an incident-recovery plan.
- [ ] Review the Privacy and Terms pages with an appropriate adult/legal reviewer before launch.
- [ ] Verify child/student privacy, school/parent consent flows and data-retention rules for the countries where Learnova will operate.
- [ ] Verify all Ghana curriculum content against the current official curriculum before claiming comprehensive coverage.
- [ ] Test every class → subject → topic → lesson → practice → quiz → result → tutor path on desktop and mobile.
- [ ] Test offline mode, reconnect/sync, login/logout and account recovery.
- [ ] Run accessibility checks: keyboard navigation, readable contrast, labels, focus states and screen-reader basics.
- [ ] Run performance checks on a low-end phone and a slow connection.

## Beta recommendation
Start with a small private group of students, teachers and parents. Record bugs and confusing flows, fix them, then publish publicly.
