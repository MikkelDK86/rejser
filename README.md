# Travel Pokédex v0.5.1

Personal travel archive, built as an installable, offline-capable PWA.

## What changed since v0.4
**Installable & offline**
- Real app icons (any + maskable), `apple-touch-icon`, consistent theme colour, `id`/`scope`/`description`, and an "Add journey" home-screen shortcut.
- `sw.js`: app shell is pre-cached and served cache-first, so the app opens instantly and works with no network.
- Update flow: when a new version is deployed the app shows "A new version is available – Reload". Nothing is swapped mid-edit.

**Data safety**
- Journeys and photos now live in **IndexedDB** instead of `localStorage`. Photos are resized (max 1600 px, plus a 480 px thumbnail) and stored as binary blobs, so a whole trip of phone photos no longer hits the ~5 MB localStorage limit.
- Existing v0.3/v0.4 data is migrated automatically on first launch.
- Save errors are reported instead of silently dropping the trip.
- More → **Export backup / Import** (JSON incl. photos). Uses the share sheet where available.
- The Backup card shows when you last exported, and the app nudges you to export if there are changes and it has been 14+ days since your last backup (`BACKUP_REMINDER_DAYS` in the script).
- Storage is requested as "persistent" after the first save, to protect it from automatic clean-up.

**Behaviour fixes**
- Editing a journey no longer *replaces* its photos: you can add, remove and pick the cover.
- Android/browser back button works (hash routing); Back closes the editor instead of leaving the app.
- Upcoming trips are shown as "Upcoming" and no longer count towards visited countries/cities/trips.
- Country/city de-duplication is case-insensitive; validation for title, country, and end-before-start.
- Corrupt stored data can no longer blank the app.

**Accessibility & polish**
- Dialog semantics, focus handling, Escape to close, background made inert while it is open.
- Cards are keyboard-operable; icon buttons have labels; images have `alt`; `aria-current` on the nav.
- Muted text contrast raised from 3.6:1 to 5.2:1; very small text sizes nudged up.
- Content-Security-Policy meta tag, `100dvh`, safe-area-aware FAB, singular/plural labels.

## Deploying
Needs HTTPS (or `localhost`). Paths are relative, so it works from a sub-folder (e.g. GitHub Pages `/repo/`).

**Every release: bump `VERSION` in `sw.js`.** That is what makes installed copies pick up the new files.

## Known gaps / next ideas
- Explore and per-trip Map are still static mock-ups; Moments and Videos are placeholders; the name on Home is hard-coded.
- One country per journey in the editor (the data model already supports several).
- No full-screen photo viewer yet.
- No sync: data is per device/browser. Use Export/Import to move it.
