# Cobblemon Player Info Web — Design Skill

## Goal
Design and implement a polished **player information website for a Cobblemon server**. The site should feel like a mix of **modern SaaS clarity** and **Pokémon/Cobblemon identity**, while staying practical, readable, and production-friendly.

This skill is for AI coding/design agents that need to create or improve the UI/UX of a Cobblemon player info web app.

---

## Use this skill when
Use this skill whenever the task involves one or more of these:
- designing a **Cobblemon player profile** page
- creating a **player stats dashboard**
- building a **Pokédex progress** view
- showing **party/team information**
- showing **battle history / rank / elo / ladder**
- designing **search, filters, leaderboard, badges, achievements, collection cards**
- making the UI feel more **game-like but still clean and usable**

Do not use this skill for unrelated generic admin dashboards unless the Cobblemon identity is intentionally needed.

---

## Product vision
Build a site where a player, admin, or viewer can quickly understand:
- who the player is
- how strong they are
- what their progression looks like
- what Pokémon they use
- what their rank / elo / battle performance is
- how far they are in dex completion and collection goals

The site should not look like a boring spreadsheet. It should feel like a **high-quality game companion site**.

---

## Core design principles
1. **Information first**  
   The most important data must be visible in the first screen without scrolling too much.

2. **Game identity without chaos**  
   Use Cobblemon/Pokémon-inspired visual cues, but keep layout disciplined.

3. **Strong hierarchy**  
   Hero summary first, then key stats, then deeper sections like party, battle history, dex, achievements.

4. **Modular UI**  
   Every block should be a reusable card/component.

5. **Fast scanability**  
   Ranks, types, winrate, dex %, and recent results should be readable in seconds.

6. **Mobile support is required**  
   The design must still work cleanly on phone screens.

---

## Target pages
The web app should support these pages or views.

### 1. Player Search / Lookup
Purpose: quickly find a player.

Include:
- search bar with username search
- recent searched players
- featured / top players preview
- quick jump chips: Top ELO, New Players, Dex Leaders, Win Streak

### 2. Player Profile Overview
This is the main page.

Top section should include:
- player avatar/head/icon
- username
- server title / rank / division
- elo
- battle record (wins / losses / winrate)
- dex completion percent
- playtime
- favorite type or favorite Pokémon
- current season summary

Below that include:
- key stat cards
- current active party/team preview
- recent battles
- achievements / badges
- progression summary

### 3. Team / Party Analyzer Page
Include:
- current party of 6 Pokémon
- type chips for each Pokémon
- role labels if available (sweeper, tank, support, pivot, hazard, anti-lead)
- weakness / resistance matrix
- offensive type coverage summary
- duplicate weakness warnings
- speed / balance / utility summary
- held item display if server tracks it

This screen should feel analytical but still clean and attractive.

### 4. Battle History
Include:
- match list / timeline
- result badges: Win / Loss / Forfeit
- elo change
- opponent
- match mode (ranked, casual, tournament, npc, doubles, singles)
- team snapshot if available
- expandable details for deeper analysis

### 5. Pokédex Progress
Include:
- seen / caught / shiny / alpha / special forms counts if available
- progress bars
- filters by type, generation, rarity, status
- missing targets
- recently registered Pokémon
- highlight rare milestones

### 6. Leaderboard
Include:
- player rankings
- filters by season / mode
- winrate / elo / streak / dex score columns
- quick row expansion or click to open profile

---

## Visual direction
Use a **Modern SaaS x Cobblemon** visual language.

### The feel
- clean
- premium
- playful, but not childish
- sharp card-based structure
- subtle fantasy/game energy
- readable enough for data-heavy screens

### Avoid
- messy pixel-only layouts
- overusing neon everywhere
- giant empty spaces with tiny data
- generic corporate dashboard styling with no game identity
- overdesigned gradients that hurt readability

---

## Color system
Use a dark-first design unless the project already has a light mode.

### Base colors
- Background: deep slate / charcoal / dark blue-gray
- Surface: layered dark cards with slightly lighter borders
- Accent: cyan, electric blue, soft gold, or teal
- Success: green
- Danger: red
- Warning: amber
- Info: blue

### Game accents
Use type colors and rank colors deliberately:
- Fire: warm orange-red
- Water: blue
- Grass: green
- Electric: yellow
- Psychic: pink-magenta
- Ghost: violet
- Dragon: indigo
- Dark: near-black with purple-gray
- Fairy: pastel pink

Do not flood the interface with all type colors at once. Reserve strong colors for chips, icons, highlights, and charts.

---

## Typography
Prefer a readable modern UI font. If the app uses a second decorative font, use it only for headings or compact labels.

Rules:
- headings must feel strong and game-adjacent
- body text must stay clean and highly legible
- numbers (elo, winrate, counts) should be bold and prominent
- avoid tiny gray text for critical data

Recommended hierarchy:
- H1: profile name / page identity
- H2: section headings
- H3: card titles
- XL numeric stats for key KPIs
- compact labels for chips, pills, table metadata

---

## Layout system
Use a responsive card/grid layout.

### Desktop
Suggested structure:
- top hero section
- 4 to 6 KPI cards under hero
- main content grid:
  - left/main: battle history, party, dex progress
  - right/sidebar: badges, quick stats, current season, milestones

### Tablet
Collapse to 2-column layout.

### Mobile
Collapse to 1-column layout with sticky profile summary or segmented tabs.

Spacing should feel premium and breathable, but not oversized.

---

## Key components
Design these as reusable components.

### Player Hero Card
Contains:
- avatar/icon
- username
- server rank
- subtitle/meta row
- key stats inline
- action buttons: view full dex, view matches, compare

### Stat Card
For:
- elo
- winrate
- total battles
- dex completion
- playtime
- streak

Should include:
- label
- large value
- optional trend or mini delta
- subtle icon

### Pokémon Party Card
For each Pokémon show:
- sprite/icon/art
- name
- level if available
- type chips
- role tag
- small stat or battle utility note
- held item if available

### Type Chip
Must be compact, high contrast, and instantly readable.
Use icon + text when space allows.

### Rank Badge
Should look prestigious and game-native.
Examples: Bronze, Silver, Gold, Diamond, Master, Legend.

### Battle Row
Include:
- result badge
- opponent
- mode
- elo change
- date/time
- quick expand caret

### Progress Module
Use bars, segmented bars, or radial summaries carefully.
Progress must be easy to compare.

---

## Team Analyzer UX rules
This is a critical section.

### Required outputs
The Team Analyzer should communicate:
- team identity
- major strengths
- major weaknesses
- type overlap
- missing coverage
- notable risk points

### Must include
- 6-slot team display
- type distribution overview
- weakness/resistance chart
- coverage summary
- risk callouts such as:
  - “Weak to Electric pressure”
  - “Low speed control”
  - “3 members share Ice weakness”
  - “Limited switch-in options”

### Good presentation pattern
- top: team cards
- middle: coverage and weakness widgets
- bottom: insight cards and recommendations

### Keep it understandable
Do not make the analyzer feel like a raw debug tool.
It should be readable even for non-competitive players.

---

## Data presentation rules
1. Important data gets larger visual weight.
2. Related stats should be grouped.
3. Charts should be minimal and readable.
4. Every dense table should have filters, sorting, or tabs.
5. Empty states must still look good.
6. Long lists need pagination or infinite loading.
7. Loading state must use skeletons, not broken blank space.

---

## Interaction design
Use subtle motion only.

Recommended:
- hover lift on cards
- soft glow on active tabs
- smooth transitions for filter changes
- expandable sections for battle details
- animated progress bars
- lightweight tooltip for type icons, held items, badges

Avoid:
- noisy floating animations everywhere
- laggy particle effects
- excessive parallax

---

## Accessibility requirements
Required:
- high text contrast
- keyboard navigation for tabs and search
- visible focus states
- tooltips not required for critical information
- color should not be the only way to show status
- support narrow mobile screens

---

## Content tone
The UI copy should be:
- concise
- slightly game-flavored
- never cringey
- useful for both casual players and admins

Examples:
- “Current Season”
- “Dex Progress”
- “Battle Snapshot”
- “Team Pressure”
- “Shared Weaknesses”
- “Recent Results”
- “Milestone Unlocked”

---

## Engineering/UI implementation rules
When implementing this site, follow these rules:

1. Do not redesign unrelated working features.
2. Preserve existing data contracts unless explicitly changing them.
3. Build reusable components before styling edge cases.
4. Use semantic, scalable layout structure.
5. Design for real data, loading states, and empty states.
6. Avoid fake placeholders that cannot map to real backend fields.
7. Keep page sections modular so future features can be added easily.
8. Use responsive design from the start, not as an afterthought.
9. If sprites or icons are used, keep visual consistency across all modules.
10. If context gets long, compact progress into a short implementation handoff before continuing.

---

## Suggested data modules
The UI should be prepared to display data like:
- player_id
- username
- avatar_url
- rank_name
- elo
- wins
- losses
- winrate
- current_streak
- peak_elo
- favorite_pokemon
- favorite_type
- dex_seen
- dex_caught
- dex_shiny
- dex_alpha
- playtime_hours
- achievements
- recent_battles
- active_party
- seasonal_stats

Do not assume every field is always available. Design graceful fallbacks.

---

## Recommended page structure for the main profile
A strong structure is:

1. Hero header
2. KPI stats row
3. Party / Team Analyzer preview
4. Recent Battles
5. Dex Progress
6. Achievements / Badges
7. Extra deep stats / collections / admin-only panels

This structure is usually more useful than putting large charts first.

---

## Design references to emulate
Aim for a blend of:
- modern game companion websites
- polished SaaS dashboards
- collectible game profile pages
- ranked ladder analytics tools

Do not directly clone any specific brand. Build an original interface inspired by those qualities.

---

## Output standard for AI agents
When asked to apply this skill, the agent should return:
1. a short UX strategy
2. a page-by-page component breakdown
3. a component hierarchy
4. a visual style direction
5. implementation-ready UI changes
6. responsive behavior notes
7. a compact progress summary before moving to the next phase

---

## Ready-to-use master instruction
Use this instruction when prompting an AI coder/designer:

```text
Apply the “Cobblemon Player Info Web — Design Skill”.

Build or redesign the web UI as a polished Cobblemon player information site.
The result must feel like Modern SaaS x Cobblemon: clean, premium, readable, data-rich, and game-adjacent.

Main priorities:
- strong player overview hero
- rank / elo / winrate / dex progress visibility
- high-quality party/team analyzer section
- recent battle history
- reusable card-based system
- responsive design for desktop, tablet, and mobile
- production-ready component hierarchy

Do not make it look like a generic admin dashboard.
Do not make it overly childish.
Do not redesign unrelated working features.
Preserve existing logic unless changes are required by the new UI.

Include:
- page structure
- component structure
- visual hierarchy
- empty/loading states
- type chips, rank badges, Pokémon cards
- team analyzer insights and weakness/coverage presentation

When coding, keep progress compacted as you go so the work can continue in a new chat if context runs long.
```

---

## Optional extension ideas
If the project grows later, extend with:
- compare two players
- season archive pages
- tournament performance panels
- shiny collection showcase
- favorite team builder preview
- admin lookup tools
- public shareable profile links
- match replay metadata page

---

# Phase 4 Web Dashboard Handoff

## Scope completed
- Added a minimal Next.js + TypeScript + Tailwind frontend foundation in `web/`.
- Added shared app layout through `src/app/layout.tsx` and `src/components/layout/AppShell.tsx`.
- Added `/servers` route for tracked server registry.
- Added `/servers/[id]` route for server header and searchable player roster.
- Added reusable base UI states: `LoadingState`, `EmptyState`, and `ErrorState`.

## Backend contract used
No backend or bridge logic was changed. The web API layer only wraps existing read endpoints:
- `GET /api/servers`
- `GET /api/servers/{server_id}/players`
- `GET /api/players/{player_uuid}`
- `GET /api/players/{player_uuid}/party`
- `GET /api/players/{player_uuid}/pokedex`

## Frontend API layer
Files:
- `src/lib/api/cobblemon.ts`
- `src/lib/api/types.ts`

Notes:
- API base URL comes from `COBBLEMON_API_BASE_URL`, then `NEXT_PUBLIC_COBBLEMON_API_BASE_URL`, then `http://localhost:8000`.
- API requests use a short timeout so a missing local database shows the error state instead of hanging the page.
- Server detail is resolved from the existing server list endpoint because there is no single-server read endpoint yet.
- Server player counts on `/servers` are computed best-effort from existing roster endpoints.

## Reusable components
- `AppShell`
- `SectionPanel`
- `ServerCard`
- `ServerHeader`
- `PlayerRow`
- `ServerPlayersList`
- `SearchBar`
- `LoadingState`
- `EmptyState`
- `ErrorState`

## Design direction
- Dark, boxed, game-like field-console UI.
- Desktop-first but responsive down to single-column layouts.
- Avoided SaaS-style charts, marketing hero copy, and over-polished decoration.
- Player skin rendering uses the current backend `skinUrl` field and Next image remote config for Crafatar.

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.
- Dev server started at `http://127.0.0.1:3000`; browser check confirmed `/servers` renders content and no framework error overlay was present. Backend was not running, so the designed error state was displayed.

## Next recommended Phase 4 steps
- Add Pokédex sections to `/players/[uuid]` using the existing player pokedex API function.
- Decide whether backend should expose `GET /api/servers/{id}` and server-level player counts later to avoid list lookup and N+1 roster count fetches.
- Add lightweight pagination or virtualized roster display if server player lists grow large.

## Phase 4 Player Page Handoff

Scope completed:
- Added `/players/[uuid]` route using existing `GET /api/players/{uuid}` and `GET /api/players/{uuid}/party`.
- Added selected-party interaction so choosing a party slot updates the portrait and detail panel.
- Added Summary, Moves, and Stats tabs with DS-like boxed game UI.
- Added stat sub-tabs for Stats, IVs, EVs, and Other.
- Added a radar/hex SVG chart for stat spreads.
- Added graceful fallback behavior for missing sprite, type, move PP, move category, IV, EV, and stat data.

Reusable components added:
- `PlayerHeader`
- `PlayerPokemonScreen`
- `PartyPanel`
- `PartySlot`
- `PokemonPortraitPanel`
- `PokemonDetailTabs`
- `PokemonSummaryPanel`
- `PokemonMovesPanel`
- `MoveRow`
- `PokemonStatsPanel`
- `StatRadarChart`
- `StatSubTabs`
- `TypeBadge`
- `TypeIcon`

Implementation notes:
- `src/lib/pokemon.ts` contains display helpers for species names, dex numbers, optional sprite URLs, type extraction, move normalization, and stat totals.
- The party endpoint currently does not provide Pokemon types or rich move metadata, so the UI shows `Unknown` instead of inventing values.
- The TypeScript party model accepts optional richer fields so future backend payloads can populate sprites, types, PP, move category, and related metadata without rewriting the page.

Verification:
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser check passed through `/servers` -> `/servers/[id]` -> `/players/[uuid]`.
- Verified party selection changes the selected Pokemon panel.
- Verified Moves and Stats tabs switch without a framework error overlay.

## Phase 4 Asset Display Handoff

Scope completed:
- Extracted Pokemon minimap icons from `E19 Cobblemon Minimap Icons.zip` into `public/assets/cobblemon/pokemon-icons`.
- Extracted and cropped Cobblemon type icons from `D:\download\cobblemon_type_icons_extract.zip` into `public/assets/cobblemon/types`.
- Generated `src/data/pokemon-types.json` from the local Cobblemon jar species data so the UI can infer types by species without backend changes.
- Updated Pokemon portrait and party slots to use local minimap icons by `dexNumber + species`.
- Updated `TypeBadge` / `TypeIcon` to render the real Cobblemon type icons for each Pokemon type.

Implementation notes:
- Regular icon path pattern: `/assets/cobblemon/pokemon-icons/regular/0259_marshtomp.png`.
- Shiny icon path pattern: `/assets/cobblemon/pokemon-icons/shiny/0259_marshtomp_shiny.png`.
- Type icon path pattern: `/assets/cobblemon/types/water.png`.
- Backend-provided type fields still take priority; local species type map is the fallback.
- Browser verification confirmed Marshtomp, Mankey, Gyarados, Breloom, Grimmsnarl, and Excadrill display matching Pokemon and type icons.

## Phase 4 Move Data Handoff

Scope completed:
- Generated `src/data/move-data.json` from Pokemon Showdown move data for frontend-only lookup.
- Updated `getMoveInfo` to enrich backend move strings/objects with type, category, PP, base power, accuracy, target, priority, multihit, effect chance, and short effect text.
- Updated `MoveRow` so the left move slot is now type-only: no slot number, type-colored background, and only the Cobblemon type icon.
- Added cursor/focus-positioned move detail panels for effect text, damage stat, target, priority, multihit, and effect chance.
- Confirmed examples like Swagger, Seismic Toss, Low Kick, and Fury Swipes now render useful battle metadata instead of `Unknown`.

Implementation notes:
- No backend endpoint or bridge logic was changed.
- Backend move data still wins when present; static move data fills gaps when the backend only sends a move name.
- `basePower: 0` is displayed as `Fixed`, `Variable`, or `Rule` when move text indicates special damage behavior.
- Player online display is now freshness-aware: `isOnline` only shows as Online when `lastSeen` is within the frontend freshness window.
- IV summaries now display average IV value out of 31 instead of IV total.

Verification:
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser check on `/players/7c5639d8-285a-3386-8125-45c2d225e8a7` confirmed Moves tab content renders and no framework error overlay is present.

## Phase 4 Final Tabs Handoff

Scope completed:
- Added Pokédex tab to `/players/[uuid]`.
- Added Team Analyze tab to `/players/[uuid]`.
- Generated `src/data/pokedex.json` from local Cobblemon Pokemon icons plus `pokemon-types.json`.
- Added deterministic `src/lib/type-chart.ts` with the standard 18-type chart.
- Added deterministic `src/lib/team-analysis.ts` implementing `team_analyzer_logic.md`.
- Player page now fetches `GET /api/players/{uuid}/pokedex` without blocking the profile if that optional endpoint fails.

Pokédex behavior:
- Uses the static full Pokédex list to render locked entries.
- Backend Pokédex entries unlock/show species details when available.
- Current party species are treated as caught/unlocked fallback entries when backend Pokédex sync is empty or incomplete.
- Locked entries show `?`, dex number, and hidden detail.
- Search plus All / Unlocked / Caught / Locked filters are included.

Team Analyze rules implemented:
- Team type summary with unique types, duplicate type groups, and member type combinations.
- Offensive coverage uses known damaging moves when available, otherwise STAB-only type fallback.
- Coverage board classifies defending types as missing, basic, or strong.
- Defensive matrix computes immune, double resist, resist, neutral, weak, and quad weak counts per attacking type.
- Weakness severity follows the spec thresholds: minor, manageable, major, critical.
- Resistance highlights and immunities are derived from the type chart.
- Evaluation badges are deterministic and threshold-based, capped to the top results.
- Optional move/stat heuristics derive physical/special leaning and rough speed profile when data exists.

Components added:
- `PokedexPanel`, `PokedexGrid`, `PokedexEntryCard`, `PokedexDetailPanel`, `PokedexSearchBar`
- `TeamAnalyzePanel`, `TeamTypeSummary`, `CoverageSummary`, `CoverageBoard`, `WeaknessSummary`, `AnalysisBadgeList`

Asset integration notes:
- Pokédex uses local Pokemon minimap icons from `public/assets/cobblemon/pokemon-icons`.
- Pokédex and Team Analyze use local Cobblemon type icons from `public/assets/cobblemon/types`.
- `cobblemon_party_extras_team_analyzer_extract.zip` was inspected; it only included `mega_icon.png` plus class/bytecode dumps, while the referenced type sheet lives in Cobblemon assets. The raw mega icon was not forced into the UI because no backend mega state exists yet.

Verification:
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser check confirmed Summary, Pokédex, and Analyze tabs render without a framework error overlay.

---

## Final quality bar
A successful result should make someone say:
- “I understand this player instantly.”
- “This feels like a real game companion site.”
- “The team analyzer is actually useful.”
- “The design looks premium, not generic.”
