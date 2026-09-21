# Travel Pokédex v0.6.2 — photo-first redesign, now in Danish

Personal travel archive, an installable, offline-capable PWA. Data lives in IndexedDB on the device.

## What's new in 0.6.2
- **Danish translation of the whole app** (Danish is the default; switch to English under More → Sprog / Language). The choice is remembered on the device. Country names, months on the stamps, plurals and all messages follow the language.
- **Every country**: 214 entries (all 193 UN members plus Vatican City, Palestine, Kosovo, Taiwan, Hong Kong, Greenland, Faroe Islands and popular territories) with correct ISO codes, Danish names and alternative spellings ("USA", "Tyskland", "Côte d'Ivoire" …). Each gets a numbered stamp and a marker on the globe.
- The photo picker is now a translatable button instead of the browser's own "Choose files".

## What's new in 0.6
**New look (monochrome + one amber accent, photo-first)**
- **Home:** a swipeable deck of your journeys (Las Vegas in front, older ones behind, upcoming trips peeking to the right) and a progress ring to your next country milestone (5, 10, 15, 20, 30, 40, 50 …).
- **World:** an interactive dot-globe. Drag or use arrow keys to rotate. Collected countries are black, your next trip is amber, with a dotted route to it.
- **Journeys:** big date numerals; the black row is the trip in progress (or your latest). Filter by year.
- **Passport:** replaces Collection. One stamp per country, numbered by first visit, in a shape derived from the country and its own ink colour (blue, crimson, green, violet, burnt orange, teal, magenta, brown; grey when reserved), with a faint worn-ink texture. Upcoming trips reserve a dashed stamp that becomes real on the day you travel.
- **New stamp:** collecting a new country (saving a past trip, or a reserved trip's start date arriving) plays a one-time celebration. Milestone countries get their own tag.
- **Trip page:** photo hero, tabs (Story / Photos / Map / Stamp), and a full-screen photo viewer.
- Rounded pill navigation with four tabs; backup and settings moved behind the “···” button.

**Under the hood**
- Country names are normalised ("USA", "United States", "Tyskland" all count as one country). The editor suggests country names as you type, in the app language.
- A trip without cities now still counts its country.
- Everything from 0.5 is unchanged: IndexedDB storage, photo downscaling, backup/import + reminder, offline service worker with update prompt.
- New sample artwork (no baked-in text).

## Deploying
Needs HTTPS (or `localhost`); paths are relative so it works from a GitHub Pages sub-folder.
**Every release: bump `VERSION` in `sw.js`.**

## Optional: the font
See `fonts/README.txt`. Without it the app uses the system font.

## Known gaps
- The globe is built from a hand-drawn low-resolution land mask, so coastlines are approximate. Countries without a drawn outline are highlighted by a small area around their centre, and every collected country gets a marker.
- One country per journey in the editor (the data model already supports several).
- Data is per device/browser. Use Export/Import to move it.
