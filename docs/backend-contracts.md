# Backend Contract Requirements

The web application normalizes upstream responses defensively, but the upstream API remains authoritative for security and competition integrity.

## Authentication

| Web operation | Upstream operation | Required backend behavior |
|---|---|---|
| Login | `POST /v1/user/login` | Return a cryptographically signed bearer token; never expose password material. |
| Signup | `POST /v1/user/signup` | Validate email, username, international phone, password policy, legal acceptance evidence, uniqueness, and rate limits. |
| Forgot password | `POST /v1/user/sendpasswordresetmail` | Return a non-enumerating response and rate-limit by account, IP, and device signals. |
| Reset password | `POST /v1/user/reset/password` | Accept a short-lived, one-time reset token; revoke relevant sessions after success. |
| Verify email | `GET /v1/user/verify/email` | Accept a short-lived, one-time verification token and return a deterministic status. |

The login response may be direct or wrapped, but it must contain a valid token. The web layer strips the token from its JSON response and stores it in an `HttpOnly` cookie.

## Profile

| Web operation | Upstream operation |
|---|---|
| Read profile | `GET /v1/user/getuserinfo` |
| Update profile | `POST /v1/user/update/profile` |
| Upload image | `POST /v1/user/update/image?platform=XESPORTS&type=profile|cover` |

Profile authorization must come from the validated token. The backend must ignore a body-level user ID. The web BFF forwards only an explicit profile-field allowlist and excludes email; email changes require a dedicated re-verification workflow rather than a generic profile update.

Recommended normalized profile fields:

```json
{
  "firstName": "",
  "lastName": "",
  "username": "",
  "dob": "YYYY-MM-DD",
  "phone": "+971...",
  "email": "",
  "country": "",
  "countryCode": "+971",
  "city": "",
  "aboutMe": "",
  "discordLink": "",
  "twitchLink": "",
  "youtubeLink": "",
  "instagramLink": "",
  "xLink": "",
  "profileImage": "https://...",
  "coverImage": "https://...",
  "emailVerified": true
}
```

Uploaded images must be decoded and re-encoded server-side; MIME type and file extension alone are not sufficient validation.

## Tournament catalog and details

| Operation | Upstream endpoint |
|---|---|
| List tournaments | `POST /v1/tournament/find-all` |
| Tournament detail | `POST /v1/tournament/find/:id` |
| Join | `POST /v1/tournament/join` |
| Leave | `POST /v1/tournament/leave` |
| Bracket | `GET /v1/bracket/:tournamentId` |

Join and leave requests send only the tournament identifier. The backend must derive the participant from the token and enforce:

- Registration opening and closing time
- Tournament capacity
- Eligibility and age restrictions
- Duplicate registration prevention
- Team membership rules
- Region and platform restrictions
- Idempotency for repeated requests
- Audit records for successful and rejected mutations

The backend should return an explicit machine-readable tournament phase. Until that contract exists, the web application derives a phase from authoritative schedule timestamps rather than display copy.

## Brackets

A missing or failed bracket response must remain missing or failed. The production API must never request that the client display mock winners or scores.

Supported normalized types:

- `single-elimination`
- `double-elimination`
- `round-robin`

Each match requires stable IDs, round information, state, participant IDs/names, result text, and winner status. Unknown match states should be versioned into the contract rather than coerced silently.

## Catalogs

- `POST /v1/game/find-all`
- `POST /v1/brand/find-all`

Malformed records are dropped by the web parser. A malformed top-level response is treated as a service error, not an empty catalog.

## Operational requirements

The upstream service should provide:

- Structured error codes and correlation IDs
- Request timeouts and bounded payload sizes
- Rate limiting and abuse detection
- Audit logs for authentication and competition mutations
- UTC timestamps with documented display timezone rules
- Health and readiness endpoints
- Monitoring for elevated 401, 403, 409, 429, and 5xx rates
