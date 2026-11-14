# FRAMEWORK — Video Editing SOP Academy

A ready-to-deploy, **static GitHub Pages website** for onboarding video editors. Inspired by the *7:15–14:00* onboarding section of the supplied video and adapted from the provided `Video_Editing_SOP.html`.

## Features

- **Two independent modes:** Short Format (9:16) and Long Format (16:9).
- **Editable format settings:** aspect ratio, resolution, FPS, duration, hook, pacing, subtitles, platform, safe-area notes; dedicated Premiere Pro **export settings** with bitrate encoding, target/max bitrate, color space, field order, AAC audio and quality controls.
- **Long-format export presets:** one click applies YouTube 1080p or 4K H.264 delivery defaults (always verify source frame rate). Download a plain-text export settings handoff sheet for either format.
- **Eight guided modules** per format with detailed lessons, format-specific tips, practical checklists and quick-check quizzes.
- **Separate progress tracking:** each format has its own module statuses and completion percentage.
- **SOP library:** includes the supplied complete original SOP with searchable section shortcuts and an embedded reading view.
- **Mandatory pre-export Audio Track Mixer handoff:** copy approved effect racks from the previous reference project into the new delivery sequence, verify routing/levels, log the source and complete an auditable checklist before delivery. The transfer is done manually in Premiere Pro, not by the website.
- **Final Edit:** real-export checklist, video review link, notes, reviewer and Markdown report download.
- **JSON backup/import:** move your progress and settings between browsers manually.
- Responsive, accessible, no APIs, no secrets, no database and no `npm install` needed.

## Upload to GitHub (fastest)

1. Create a **new public GitHub repository** (for example, `editing-sop`).
2. Upload **the CONTENTS of this folder** into the repository root — `index.html`, `styles.css`, `app.js`, `data.js`, `.nojekyll`, `.github/`, and `reference/`.
3. Commit the changes to the `main` branch.
4. In **Settings → Pages**, set the Build and deployment source to **GitHub Actions**.
5. The included `.github/workflows/deploy.yml` automatically publishes the site after a push to `main`.
6. Visit `https://YOUR-USERNAME.github.io/editing-sop/` after deployment succeeds. For a custom repo name, replace `editing-sop` in the URL.

The app is also testable directly by opening `index.html` in a desktop browser. Some browsers restrict local iframe access; run `python -m http.server 8000` and visit `http://localhost:8000` for best local testing.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main HTML entry point |
| `styles.css` | Responsive visual design |
| `data.js` | All module, quiz, checklist and format-default content |
| `app.js` | Navigation, progress, settings, reports and data persistence |
| `reference/Video_Editing_SOP.html` | Your original SOP, preserved |
| `.github/workflows/deploy.yml` | Automatic GitHub Pages deployment |
| `.nojekyll` | Serve root files as static files |

## Important limitations

This is a **static GitHub Pages app**, not a server application. By design:

- Progress, format presets and review notes are stored in the **current browser's local storage**. They are not shared automatically across your editing team.
- A review URL is stored locally; the app does **not upload videos to Drive/Frame.io or notify a reviewer**.
- **Mark ready for review** confirms local completion only. Download the Markdown delivery report and send it with your link to your reviewer.
- Import/export JSON provides manual backup and portability. Avoid importing backups from people you do not trust.

For shared logins, reviewer dashboards, actual video uploads or sync across editors, the website would need an authorized backend and storage provider (e.g. Supabase or Firebase).

## Editing content or defaults

All SOP lessons and quiz answers live in `data.js`. Format defaults can be changed in `formats.short.defaults` and `formats.long.defaults`. Each user can also customize their personal format settings inside the website.

Content is adapted to your uploaded SOP. The YouTube 1080p and 4K presets are **example team targets** rather than an exact extraction of a screenshot or universal technical requirements; always follow the project brief and your delivery platform's latest requirements.

## Mandatory Adobe Premiere Pro Audio Track Mixer transfer

Perform this **after editing but before exporting**, on **each deliverable** (both Short Format and Long Format):

1. Save a backup/version of the current editing project. Import the **approved previous project** and its reference sequence into the new project (File → Import → select sequences), if you cannot already access it in Premiere.
2. Open the old/reference sequence. In **Window → Audio Track Mixer**, reveal **Effects and Sends**.
3. On each relevant approved dialogue, music, SFX, submix or Mix/Master rack, right-click the top of the effect rack and select **Copy Track Effects**.
4. Open the **new delivery sequence**. Right-click the corresponding destination track's effect rack → **Paste Track Effects**.
5. Check order, plugin availability and all values; repeat for other tracks. **Pasting a rack may replace its existing effects**, so do not overwrite an unsaved setup. **Faders, pan, routing and sends must be verified independently** against the old reference.
6. Play back the new sequence, inspect meters for distortion/clipping, then export with the format-specific settings. Check the rendered file.
7. In the site's **Final Edit** page, name the source project and tick the 4 **pre-export Audio Track Mixer** confirmations. These are required to mark a delivery ready for review.

Adobe official reference: https://helpx.adobe.com/premiere/desktop/add-audio-effects/apply-audio-effects/copy-and-move-effects-in-audio-track-mixer.html

The site **cannot** access Premiere Pro, transfer effects itself or verify audio. Checkboxes are user attestations. No exact audio-effect parameter values were supplied for this step; this workflow preserves the values in your approved previous project rather than inventing new ones.
