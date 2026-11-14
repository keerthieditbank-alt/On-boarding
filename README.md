## Latest v8 changes (14 Nov 2026)
- **Short Format Raw Files:** https://drive.google.com/drive/folders/1egBN0TJipvxXzDK7aiCJ3d6Hx7l7pkxL?usp=sharing
- **Long Format Raw Files:** https://drive.google.com/drive/folders/168yjZdHgiXRlrUcnsguGLLtfbEAxaGMG?usp=sharing
- The dashboard/Final Edit top banner and Module 1 resources open the relevant format's folder based on the selected Short/Long format.
- Final Edit layout: **Raw Files link → Final Quality Checklist → Audio Track Mixer reference & steps → Assignment Submission → Report**. The audio mixer remains a required pre-export transfer and verification step, even though it is displayed after the checklist as requested.
- Registration, progressive module unlocking, screenshots, email backend template, report and reset are unchanged.
- Replace the live GitHub Pages root `index.html` and deploy again. Check `BUILD_VERSION.txt` for v8.

## Previous v7 changes
- The first page on every full load is the **Name / Mobile / Email registration form**. A different editor gets clean 0/8 course progress.
- **Open raw files & download** appears above the dashboard hero and at the top of Final Edit, linking to the user's Google Drive assignment folder with multiple reels to choose from. Google Drive controls download and sharing permissions.
- **Final Edit order:** raw footage link → audio mixer gate → full quality checklist → assignment submission at the very bottom → downloadable report. Assignment form is no longer beside the checklist.
- **Settings → Reset Everything:** confirm to clear name, email, phone, progress and form data and return to registration (same browser tab). The header also has a New editor button.
- V7 uses fresh storage keys, ensuring no previous build's progress is automatically inherited. Existing site uses root `index.html` only, with screenshots embedded.
- Reviewer emails require the Cloudflare email worker and secure email-service secrets configured; static GitHub Pages alone cannot send emails.

# FRAMEWORK MONO STUDIO — v7 (14 Nov 2026)

## What is fixed?
**The entire website UI, stylesheet, module data and original PNG screenshots are embedded in ONE root-level `index.html`.** This prevents stale `app.js` or `styles.css` or missing PNG paths from keeping the old theme alive.

A **fresh Name + Phone + Email registration form** appears at the beginning of **every newly loaded page**, even on a device with an older SOP version stored. There is no default editor or inherited completed progress. You cannot see modules until the form is submitted. On the same tab, entering exactly the same details again can resume unfinished progress; entering different details starts a new 0/8 workflow. "New editor" in the header lets a shared computer reset immediately. Downloading a completed report resets the session and opens registration again.

This is a browser-only session separation, **not verified user authentication**. Each tab maintains progress in `sessionStorage` and cannot synchronize to other devices. Sensitive data should not be entered on untrusted shared machines.

## IMPORTANT: Replace the LIVE site correctly
1. Open the ZIP and upload **the `index.html` at ZIP ROOT** to the **ROOT of the GitHub repository**. Make sure GitHub asks to **replace or overwrite the older `index.html`**; do not place the ZIP or its folder inside another directory.
2. Upload `.nojekyll`, `BUILD_VERSION.txt` and `.github/workflows/deploy.yml` as supplied. Include `reference/` for the original full SOP. `assets/` contains original screenshot references but the UI does NOT depend on them.
3. Go to **GitHub → Actions → Deploy GitHub Pages**, run on branch `main`. Wait for a **successful green deployment**, then open the official GitHub Pages URL.
4. Test the NEW URL in a private/incognito tab. First screen must say `FRAMEWORK / MONO EDITION · BUILD 07` and show **Name / Mobile number / Email address**. If not, the live domain is still serving the old deployment or has an index in a different publishing folder.
5. In **Settings → Pages**, confirm the current publishing source is **GitHub Actions** (for this workflow), not a separate `docs/` folder or another branch. A page served from `docs/` while root index is updated will not show the new version.
6. `BUILD_VERSION.txt` can be viewed at `https://USERNAME.github.io/REPO/BUILD_VERSION.txt`; if unavailable, the new root has not yet been deployed to that URL.

## Self-contained fallback
If uploading folders has been error-prone, upload **only this new `index.html` to the site's active publishing root** first. The registration, course, styles and screenshots will work without loading external JavaScript/CSS/image files (Google Fonts is only cosmetic).

## Current functionality
- Cream / ink Japanese-editorial design, distinctive `THE EDITOR'S PLAYBOOK` dashboard.
- Required new editor registration (full name, mobile number, email and consent).
- Eight sequentially locked modules and increasing quiz questions (1, 1, 2, 3, 4, 5, 6, 7) for Short and Long separately.
- Original export and Audio Track Mixer screenshots displayed at natural full height (embedded as original PNG data).
- Assignment source Drive URL and audio preset Drive URL, SF / LF filenames, 5–10-second visual change rule, required folder tree, footer credit.
- Final assignment link, checklists, download report, reset after report.
- Email sending only after securely configuring the **optional** serverless backend (see next section). The site does not pretend email was sent when no provider is configured.

## Automatic reviewer email — SETUP REQUIRED
GitHub Pages cannot securely send email with an API key placed in HTML. This ZIP includes the optional `email-worker/` Cloudflare Worker template and a Resend integration. Configure a **verified sender**, `RESEND_API_KEY`, `REVIEWER_EMAIL`, `SENDER_EMAIL`, and `ALLOWED_ORIGIN` as secrets on Cloudflare, then edit the **public** `window.SOP_CONFIG.submissionEndpoint` at the beginning of `index.html` to point to your Worker. Do not put Resend secrets or a private API token into GitHub Pages. Until configured, website report export works, but emailing is unavailable.

> Do not upload `email-worker/` as part of the public site if you do not want the example source visible. It contains no credentials, but is included for separate Cloudflare deployment.

## Quick verification
- Site header registration build marker: **MONO EDITION · BUILD 07**.
- No old `v01_rough`, `v02_locked`, `v03_final` filename requirements.
- Open `index.html` locally in a normal browser to verify the standalone app before deploying.
