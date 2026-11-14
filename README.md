# FRAMEWORK — Video Editing SOP Academy

A ready-to-deploy, **static GitHub Pages website** for onboarding video editors. Inspired by the *7:15–14:00* onboarding section of the supplied video and adapted from the provided `Video_Editing_SOP.html`.

## Features

- **Two independent modes:** Short Format (9:16) and Long Format (16:9).
- **Preserved source screenshots:** the exact original uploaded **Short Form Export**, **Long Form Export**, and **Audio Track Mixer** PNG files are included in `assets/original-screenshots/` with no edits, cropping, regeneration, or compression. View on Settings, Module 01, Module 08, or Final Edit; click **Open full original** to view at native resolution.
- **Sequence settings:** values from the user-provided sequence screenshots are written into the modules and Settings; the original sequence image files themselves were not present in the files available for packaging, so images are **not** imitated or regenerated.
- **Editable format settings:** aspect ratio, resolution, FPS, duration, hook, pacing, subtitles, platform, safe-area notes; dedicated Premiere Pro **export settings** with bitrate encoding, target/max bitrate, color space, field order, AAC audio and quality controls.
- **Long-format export presets:** one click applies an alternative YouTube 1080p preset or restores the uploaded 4K screenshot values (always verify source frame rate). Download a plain-text export settings handoff sheet for either format.
- **Eight guided modules** per format with detailed lessons, format-specific tips, practical checklists and quick-check quizzes. **Sequential locking**: only Module 01 is open initially; Module 02 unlocks after Module 01 has every task checked AND the quiz correct, and so forth. Deep links also respect the lock. Progress/unlocking is independent for Short and Long.
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
| `assets/original-screenshots/` | Your untouched Short and Long export PNGs, plus original Audio Track Mixer PNG |
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

Content is adapted to your uploaded SOP. The default screenshot-matching values are **Short:** 1080 × 1920 / 25 fps / VBR 2-pass / 20 and 20 Mbps / AAC 384 kbps; **Long:** 3840 × 2160 / 23.976 fps / VBR 2-pass / 30 and 30 Mbps / AAC 384 kbps. The optional YouTube 1080p preset is different from the supplied screenshots; always follow the project brief and your delivery platform's latest requirements.

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

## Strict module access rules

- Only Module 01 starts unlocked in **each** format.
- Unlock next module only when **all** practical checklist items are checked **and** quiz is answered correctly in the current module.
- A locked sidebar entry/card is disabled and marked with a lock. Typing a locked module's URL directly shows a lock screen instead of the lesson. The Next button cannot bypass the requirement.
- Rechecking an earlier completed module can re-lock later lessons; completed later lessons retain their saved data but are not counted as active until prior modules are complete again.
- Progress stored in localStorage is a learning convenience, not tamper-resistant server authentication. Editors with browser storage access can change their own records.

## Original screenshots and sequence settings

| Source screenshot | File in website | Exact visible settings |
| --- | --- | --- |
| Short format export | `assets/original-screenshots/short-format-export-original.png` | 1080 × 1920, 25 fps, VBR 2 pass, 20/20 Mbps, max depth on, max render quality on, AAC 384 kbps |
| Long format export | `assets/original-screenshots/long-format-export-original.png` | 3840 × 2160, 23.976 fps, VBR 2 pass, 30/30 Mbps, max depth on, max render quality on, AAC 384 kbps |
| Audio Track Mixer | `assets/original-screenshots/audio-track-mixer-original.png` | Copy Track Effects from old project, Paste Track Effects into delivery sequence |

The original *sequence settings* screenshots appeared earlier in the conversation but the underlying files were not accessible in this active folder; text reproduces their visible values in the site. If the two raw image files are provided again, they can be added without altering the site architecture.
