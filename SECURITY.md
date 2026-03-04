# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Campus Share seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:
- Open a public GitHub issue
- Disclose the vulnerability publicly before it has been addressed

### Please DO:
1. Email us at security@campusshare.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

2. Allow us reasonable time to respond and fix the issue before public disclosure

### What to expect:
- Acknowledgment of your report within 48 hours
- Regular updates on our progress
- Credit in our security advisories (if desired)

## Security Measures

Campus Share implements several security measures:

- **Row Level Security (RLS)** - Database-level access control
- **Authentication** - Supabase Auth with email and OAuth
- **Input Validation** - Zod schema validation
- **XSS Protection** - React's built-in XSS protection
- **HTTPS Only** - All connections encrypted
- **Environment Variables** - Sensitive data not in code
- **Content Security Policy** - Configured headers
- **Rate Limiting** - API rate limits via Supabase

## Best Practices for Users

- Use strong, unique passwords
- Enable two-factor authentication (when available)
- Keep your browser and OS updated
- Don't share your credentials
- Log out from shared devices
- Report suspicious activity

## Dependencies

We regularly update dependencies to patch security vulnerabilities. You can check for updates:

```bash
pnpm audit
pnpm update
```

## Contact

For security concerns: security@campusshare.com
For general inquiries: support@campusshare.com
