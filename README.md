# FRAMEWORK SOP — Editorial Minimal Onboarding

## GitHub Pages deployment
Upload everything **except `email-worker/`** from this folder to your repository root and deploy with the included GitHub Pages workflow. Leave `config.js` present.

## Current UI / editor flow
- Warm-cream and charcoal design inspired by the supplied Japanese minimal game concept board (not a game clone).
- Every new editor first enters full name, mobile and email, including consent to send details to the reviewer.
- Module progression remains sequential, per-format and with increasing quizzes.
- Original Premiere export and audio screenshots are embedded into `app.js` byte-for-byte, avoiding broken asset paths.
- Original assignments and preset links, SF/LF output naming, audio mixer checks and creator credit remain.
- Progress uses **sessionStorage** (per browser tab), not shared localStorage. Editor name/contact information is cleared once the completion report is downloaded. Reloading during the same browser session retains progress.
- Final report can be downloaded **only after all eight modules, mixer checks, final checks, project and valid assignment URL**. Download automatically clears the editor session; a fresh editor onboarding page appears.
- Email button sends the assignment link, project name, notes and registered editor name/phone/email if the backend is configured and responds successfully. There is no false 'sent' status when mail fails.

## How to make automatic emails work
GitHub Pages is static and **cannot securely email by itself**. This ZIP includes a separate optional Cloudflare Worker (`email-worker/src/index.js`) using Resend. No API keys are embedded in GitHub.

1. Create a Cloudflare Workers app; use `email-worker/src/index.js` as the Worker code (or deploy with Wrangler using the provided `wrangler.toml.example` renamed to `wrangler.toml`).
2. Register a sender domain with Resend and obtain a Resend API key.
3. Set **Worker secrets**, never GitHub/public JS: `RESEND_API_KEY`, `REVIEWER_EMAIL` (the inbox that receives assignments), `SENDER_EMAIL` (verified from email), `ALLOWED_ORIGIN` (exact GitHub Pages origin, e.g. `https://username.github.io`).
4. In `config.js` enter the public deployed worker URL, e.g. `https://sop-assignment-email.YOUR-SUBDOMAIN.workers.dev`.
5. Deploy GitHub Pages, test a **real assignment**; confirm the reviewer receives the mail and the site marks it sent only on API success.

The Worker validates inputs, keeps mail credentials private, and limits caller origins. **For a larger public rollout add CAPTCHA/Turnstile, abuse protection and ideally authenticated editor accounts**; browser-side completion checkboxes are not tamper-proof. Origin validation alone is not authentication.

### Reviewer email address
No recipient email was supplied, so it is deliberately **not hardcoded**. Automatic emailing will remain disabled until secrets and the `config.js` URL are configured.

### Privacy and reset
PII is only placed in the current browser session and submission payload, not in a public GitHub repository. The mail provider stores delivery metadata under its own retention policies. Downloaded reports include the editor's details, so keep them secure. Reloading a tab retains state; closing tab or exporting the report resets it. On a shared device, close tab after usage.

### Existing source
Adapted from the uploaded Video Editing SOP and the previous FRAMEWORK GitHub site. The original source SOP remains at `reference/Video_Editing_SOP.html`. The screenshot PNGs in `assets/original-screenshots/` are untouched.
