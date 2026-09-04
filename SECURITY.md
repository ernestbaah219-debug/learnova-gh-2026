# Learnova AI — Security Notes

This package is a launch candidate, not a claim of production security certification.

- AI provider credentials must remain server-side.
- Use HTTPS in production.
- Set `ALLOW_ORIGIN` to the exact frontend origin.
- Use a managed database and secure session storage in production.
- Do not store production passwords or secrets in source control.
- Add account recovery, session expiry/revocation and audit logging before a real school deployment.
- Review privacy, retention, consent and access-control requirements before onboarding minors.
- Limit teacher/admin access to school-authorized accounts.
