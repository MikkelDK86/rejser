# Travel Pokédex v0.11.0 — trip pins

Personal travel archive, an installable, offline-capable PWA. Data lives in IndexedDB on the device.

## What's new in 0.11.0 — pins on the trip map
- The **Map tab of a trip** now drops a pin on every place of the trip. The **first place entered is the primary pin** (its own colour, slightly larger); the others share a second colour. Both colours follow the map palette; a legend and a list under the map name every place.
- Well-known cities (~135) are pinned automatically. For any other place (AREA15, Hoover Dam, a small town …) tap **Place on map**, then tap the spot; **Move** and **Remove pin** are available too. Hand-placed pins are stored with the trip, included in backups, survive editing the trip (matched by city name, while the country is unchanged) and also show on the world map.
- The trip's country is drawn as a light tint on this map so the pins stand out; the view frames all pins.

## What's new in 0.10.2
- **Fixed:** the trip's Memory checklist (n/5) quietly required a story of at least 20 characters, so a short summary left it at 4/5. Any text now counts as the story (spaces alone do not). The **Storyteller** badge keeps its 20-character rule, and its description now says so.

## What's new in 0.10.1
- **Fixed:** tapping the stamp of a country whose name contains a space (United States, United Kingdom, South Africa …) opened the Home screen (which lists every trip) instead of that country's page. The same bug affected cities with a space (Las Vegas, New York), city chips on a trip page, and the map's country sheet. Links now work for every name, including apostrophes, dots and accents — tested on all 46 such countries. A country or city page that does not exist now falls back to the Passport, not Home.

## What's new in 0.10.0 — protecting your data
Updating the app never touches your data (trips and photos live in the browser's own storage, not in the app files), but data can still *look* lost for other reasons. This release closes those gaps:
- **A unique storage name** (`travel-pokedex-archive`). Everything on one `github.io` address shares a single browser storage area, so another app or an older prototype using the same name could collide with (or delete) this app's data. Data from the previous name is copied across automatically on the first launch; the old copy is left untouched.
- **No more silent “examples”.** On a genuinely empty start the app asks: *Restore a backup / Start with examples / Start empty*. If this device had data before, it says *“Your data seems to be gone”* and puts **Restore a backup** first.
- **Failures are loud and safe.** If storage cannot be opened or read, a banner explains why, saving is switched off (so nothing can be overwritten), and **Export a backup** still works on the raw data. One unreadable record is skipped, reported, and kept in backups instead of hiding everything.
- **Backup nudges**: a reminder after 5 unbacked changes or 7 days, and the “new version” prompt tells you to export first when you have unbacked changes.
- **Data-protection note** under More when the browser has not made storage persistent and the app is not installed (Safari can clear a website's data after 7 days without a visit). The app also asks the browser for persistent storage at start-up once you have data.
- Service-worker caches use a unique prefix too, so other apps on the same address cannot delete them.

**Safe way to update:** upload all files (including `app.js`, `world-data.js`, `assets/`), keep using the *same web address* and the *same icon*. Do not remove and re-add the home-screen icon, and never use “Clear website data”. Export a backup from More before big changes.

## What's new in 0.9.2
- The three numbers under the map (countries, cities, journeys) and the same row on the More page are now centred in their columns.

## What's new in 0.9.1 — subtle map colours
- The map is no longer black and white. Default palette **Mist**: soft blue-grey sea, warm sand land, muted teal for visited countries and a soft amber for upcoming ones (with a darker outline so it reads on light land). Choose **Sage**, **Dusk** or the old **Black & white** under More → Map colours; the choice is remembered and the legend follows it.
- The app's code now lives in `app.js` (previously inline in `index.html`), which fixes an occasional harmless request for a non-existent image that some browsers made while scanning the page. **Upload `app.js` along with the other files.**
- All palettes keep visited/outline colours at ≥ 3:1 against the land and labels at ≥ 4.5:1 against their halo.

## What's new in 0.9.0 — the World tab is now a real map
- **Natural Earth 50m country borders** (`assets/world-50m.json`, public domain): every coastline, border, island and small state, drawn accurately.
- **Pan and zoom** like a normal map app: drag, pinch, mouse wheel or the + / − buttons, double-tap to zoom in, and “show my places” to re-fit. Zooms from the whole world down to city level.
- **Your countries on the map**: visited in black, upcoming in amber, wishlist countries with a dashed outline; names appear as you zoom (Danish or English), and small countries get a marker so they never disappear.
- **City pins and labels** for the ~135 well-known cities on your trips (Rome, Las Vegas, Lübeck …); other places are left off the map because I do not have their coordinates.
- **Tap any country** for a sheet: your status there, “Open country page”, or “Add to wishlist” / “Plan a trip” for countries you have not visited.
- **Map / Globe switch**: the globe now uses the same real coastlines (drag to rotate, pinch to zoom, tap a country).
- The **trip page Map tab** shows a zoomed map of that trip's country with its cities pinned.
- Works offline (the map file is pre-cached). If the file ever fails to load, the old dot globe is used instead.

## What's new in 0.8.1
- **City suggestions in the journey editor**: tap the city field to see the cities you have already used in that country; start typing and the list narrows. Cities from your other trips and the built-in list of ~140 major cities (matched by any spelling, e.g. “kob” → Copenhagen) are offered too. Picking one fills the current entry and keeps the others, so you reuse the same spelling and avoid accidental duplicates. Names show in the app language.

## What's new in 0.8.0 — repeat visits
- **Visit counter on stamps**: a small “×3” appears on a stamp once you have been to that country on more than one journey (upcoming trips don't count).
- **Tap a stamp → country page**: the stamp, visits / cities / first-visit year, every city you have been to (most visited first, with a counter on repeat cities; cities with only an upcoming trip are tagged “Upcoming”) and all journeys in that country, including ones without a city.
- **Tap a city → timeline** of every trip to that city, newest first, with photo, dates, length and a story snippet. Tap an entry to open the trip. City chips on a trip page open the city timeline too.
- **Merged city names**: København = Copenhagen = Kobenhavn, Rom = Roma = Rome, Zürich = Zurich … (about 140 major cities, with English and Danish display names; other cities keep the spelling you typed). City totals, badges and wishlist matching all use the merged names.
- Deep links work (`#/country/italy`, `#/city/italy/rome`) and the pages update instantly when you switch language.

## What's new in 0.7.0 — game elements (Passport now has four tabs)
- **Badges** (about 58): milestones for countries, cities, journeys, own photos and continents; explorer badges (Across the pond, Southern Hemisphere, Both sides of the equator, The high north, Island hopper, Small but mighty); trip badges (Every season, A week away, A month away, Regular); memory badges (Storyteller, Curator); wishlist badges (Dreamer, Wish come true, Dream chaser); and one for every completed collection. Locked badges are grey; tap any badge to see how to earn it and your progress. Earned badges are remembered even if you later delete a trip. The first launch after updating records what you already earned silently.
- **Collections**: 21 regional sets (Norden, Baltikum, Benelux, Alperne, Sydøstasien, Caribien …) with progress bars and country chips. Tap one to see which countries are missing and add them to your wishlist with one tap. Completing a collection earns its badge.
- **Wishlist** for countries *and* cities. Open country wishes appear as grey silhouettes in the Stamps tab and as hollow rings on the globe; wishes with an upcoming trip show as “Planned”; when you travel there the wish is ticked off with a celebration. “Plan a trip” pre-fills the journey editor.
- **Memory checklist** on every past trip (cover photo of your own, 3+ photos, a short story, a city, start and end dates). Incomplete items are tappable and open the editor. Nothing nags you outside the trip page.
- Celebrations are queued: new stamp → wishes come true → new badges. Backups now include the wishlist and earned badges.

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
