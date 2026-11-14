# Keerthi’s Team — Video Editing SOP V9 (GitHub Pages)

A warm, minimalist, video-first onboarding website updated from FRAMEWORK SOP V8.

## Added in V9

- Registration using name, phone and email, shown on each new visit.
- **Welcome to Keerthi’s Team** 16:9 video on the dashboard after registration.
- Eight locally hosted training videos, one per module.
- All lesson notes under optional collapsible reference; checklists and increasing quizzes remain visible.
- A module completes only after its video has reached the end, every checklist item is checked, and every quiz answer is correct.
- Sequential module locking, separately for Short and Long formats.
- The **Short Format** and **Long Format** Google Drive raw-file links are hidden in the interface until **all eight modules of that format** are complete.
- Final Edit is locked until the selected format’s eight modules are complete.
- Original export and Audio Track Mixer screenshots remain embedded unchanged, plus the checklist → mixer → submission sequence, reporting, and Reset Everything button.

## Publish on GitHub Pages

1. Extract this ZIP. Put **all files and folders** at repository root (including `media/`, `reference/`, and `.github/`). Do not upload only `index.html`.
2. GitHub **Settings → Pages → Build and deployment: GitHub Actions**.
3. Push with Git, GitHub Desktop, or upload files in the web UI in batches. Each optimized MP4 is designed to stay below GitHub’s 25 MB per-file browser upload limit. Keep the `media/` directory structure intact.
4. After deployment, refresh with Ctrl+Shift+R or open a private/incognito tab.
5. Open site → register → watch welcome → complete modules 1 to 8 → the selected format's raw footage unlocks → edit → final checklist → Audio Track Mixer → submission → report.

## Important access and privacy limitations

This is a **static GitHub Pages website**, not a secured training backend. Module and raw-footage restrictions are **interface locks**, not cryptographic access control. Someone who knows the Google Drive URL or reads the public JS source can still discover the link; the externally shared Google Drive folders must be restricted separately if you need actual access control. A real private file gate needs server-side authentication and authorization, and Drive sharing configured appropriately.

Editor progress is in this browser tab’s session storage; it is not centrally synchronized across devices. Another visitor using a new session will start fresh. The Reset Everything button clears the current editor locally.

The automatic assignment email service is still **optional and requires configuration** of the included `email-worker/` backend and credentials. GitHub Pages alone cannot send email secretly. Unconfigured mail does not claim successful sending. Follow the worker instructions from the prior version or configure a secure backend.

The 16:9 videos here are web-optimized copies of the user-provided originals (720p H.264 / AAC) so they play smoothly and can be deployed; the original uploads were not overwritten.

**Credit:** Made by Senior Editor Md Irfan Raza.
