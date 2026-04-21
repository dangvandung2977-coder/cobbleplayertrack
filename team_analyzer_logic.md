# Team Analyzer Logic Spec

## Purpose
This file is the source of truth for implementing the **Team Analyze** tab in the existing Next.js + TypeScript + Tailwind web app.

The analyzer must be:
- deterministic
- rule-based
- explainable
- useful for a Cobblemon / Pokémon companion UI
- not an AI advice generator

It should feel like an in-game analysis tool, not a SaaS analytics page.

---

## Integration constraints
- Continue from the current codebase.
- Do not rebuild from scratch.
- Do not rewrite already-working backend endpoints.
- Prefer adapting existing page structure, tabs, loading flow, and styling primitives.
- Use existing backend endpoints only.
- If the backend does not expose some optional data, degrade gracefully and still render a valid analysis.

---

## Primary data assumptions
The Team Analyze tab should work with the current player party.

Minimum useful per-party-member data:

```ts
export type PartyMember = {
  slot: number
  species: string
  form?: string
  nickname?: string
  image?: string
  dexNumber?: number
  types: [string] | [string, string]
  moves?: Array<{
    name: string
    type?: string
    category?: 'physical' | 'special' | 'status'
    power?: number
  }>
  stats?: {
    hp?: number
    atk?: number
    def?: number
    spa?: number
    spd?: number
    spe?: number
  }
}
```

The analyzer must support these fallback levels:

### Level 1 — Types only
If only species + typing are available:
- render team type summary
- render duplicate types
- render defensive overview
- render type-based badges
- render a limited offensive report using STAB-only assumptions

### Level 2 — Types + moves
If move data exists:
- derive offensive coverage from damaging move types
- infer rough physical/special leaning
- improve badges

### Level 3 — Types + moves + stats
If stats exist:
- infer very simple speed balance
- infer very simple offense leaning
- do not overclaim deep competitive accuracy

---

## Required outputs
The Team Analyze tab must render these sections:

1. **Team type summary**
2. **Offensive coverage**
3. **Defensive overview**
4. **Evaluation badges**
5. Optional compact extras if data supports them:
   - physical / special split
   - rough speed balance

---

## Type system
Use the standard 18-type chart:

- Normal
- Fire
- Water
- Electric
- Grass
- Ice
- Fighting
- Poison
- Ground
- Flying
- Psychic
- Bug
- Rock
- Ghost
- Dragon
- Dark
- Steel
- Fairy

Create a single shared `typeChart` utility that exposes:
- effectiveness(attackingType, defendingType)
- combinedEffectiveness(attackingType, defendingTypes)
- superEffectiveTargets(attackingType)
- resistantTargets(attackingType) if needed

The chart must be hardcoded and deterministic.
Do not fetch it from the backend.

---

## Core analysis rules

# 1) Team type summary

For each team member:
- show species / nickname
- show type combination
- show both type icons if dual-type
- mark duplicate team types clearly

Also compute:
- `uniqueTypes`: set of all types represented in the party
- `typeCounts`: how many times each type appears across all members
- `duplicateTypes`: every type with count >= 2

### Display intent
This section should immediately answer:
- what types are on the team
- which types are repeated heavily
- whether the team is diverse or overlapping

### Simple team diversity rules
- If `uniqueTypes >= 8`: badge candidate: `Good type variety`
- If `uniqueTypes <= 5` and team size >= 4: badge candidate: `Low type variety`
- If any single type appears 3+ times: badge candidate: `Heavy [Type] overlap`

---

# 2) Offensive coverage rules

## 2.1 Coverage source priority
Use this source priority:

### Preferred
If moves exist:
- only count moves with `power > 0`
- use their move type as actual offensive coverage
- ignore pure status moves for offensive coverage

### Fallback
If moves do not exist:
- assume each Pokémon contributes its own STAB typing only

This means the panel can always render something useful.

## 2.2 Team attacking types
Compute:
- `teamAttackTypes`: set of attack types the team can reasonably produce

If move data exists:
- union all damaging move types

If move data does not exist:
- union all member types (STAB-only fallback)

## 2.3 Coverage against defending types
For each of the 18 defending types:
- determine whether any team attacking type hits it super effectively
- optionally count how many sources hit it super effectively

Compute:
- `coveredDefendingTypes`
- `missingCoverageTypes`
- `strongCoverageCounts[type]`

### Suggested thresholds
- if a defending type has 2+ separate super-effective sources: treat as strong coverage
- if it has 1 source: basic coverage
- if it has 0 sources: missing coverage

## 2.4 Coverage wording
Examples:
- `Good Fire coverage`
- `Reliable Ground pressure`
- `Missing Electric coverage`
- `Only one answer to Water`

## 2.5 Offensive summary rules
Possible deterministic badges:
- if Fire is covered by 2+ sources: `Good Fire coverage`
- if Ice is covered by 2+ sources: `Good Ice coverage`
- if Ground is missing: `Missing Ground coverage`
- if Water + Flying + Steel are all covered: `Strong general coverage core`
- if missing coverage types >= 6: `Shallow offensive coverage`
- if missing coverage types <= 2: `Broad offensive coverage`

Do not invent strategic claims that the raw data cannot support.

---

# 3) Defensive overview rules

This is the most important section.

For each attacking type in the 18-type chart, evaluate the whole team.

For each team member against each attacking type:
- multiplier = combinedEffectiveness(attackingType, member.types)

Then classify each member as one of:
- `immune` if multiplier === 0
- `doubleResist` if multiplier < 0.5
- `resist` if multiplier === 0.5
- `neutral` if multiplier === 1
- `weak` if multiplier === 2
- `quadWeak` if multiplier >= 4

Aggregate per attacking type:
- `immuneCount`
- `resistCount`
- `doubleResistCount`
- `weakCount`
- `quadWeakCount`

## 3.1 Shared weakness severity
Determine severity using these rules:

### Critical
- 3+ weak members, OR
- 2 weak + 1 quad weak, OR
- 1 quad weak and no resist/immunity at all

### Major
- 2 weak members and no immunity

### Manageable
- 2 weak members but there is at least 1 resist or immunity

### Minor
- 1 weak member only

## 3.2 Shared resistance highlights
Highlight a type positively if:
- there are 2+ resistances, OR
- there is 1 immunity + 1 resist, OR
- there is 1 double resist and no major weakness stack

Examples:
- `Solid resistance into Fire`
- `Useful Ground immunity`
- `Good Water defensive coverage`

## 3.3 Immunity reporting
Immunities should be shown separately when derivable.
Common examples:
- Ground immunity from Flying
- Ghost immunity from Normal
- Electric immunity from Ground
- Dragon immunity from Fairy
- Poison immunity from Steel
- Psychic immunity from Dark

Use a small dedicated immunity row or chip group.

## 3.4 Dangerous stacks
Always highlight dangerous stacks visually.
Examples:
- `Weak to Ice`
- `Too many shared Electric weaknesses`
- `No Ground immunity`
- `Rock pressure risk`

Use severity styling:
- critical = strongest alert styling
- major = warning styling
- manageable = muted warning

---

# 4) Evaluation badge rules

Badges must be deterministic. Each badge must map to a real rule.

Use a structured format internally:

```ts
export type AnalysisBadge = {
  id: string
  label: string
  severity: 'good' | 'info' | 'warn' | 'danger'
  reason: string
}
```

## Recommended badge catalog

### Positive badges
- Good type variety
- Broad offensive coverage
- Good Fire coverage
- Good Ice coverage
- Strong Ground pressure
- Good Water resistance spread
- Has Ground immunity
- Has Electric immunity
- Balanced offensive spread
- Fast team core

### Warning / danger badges
- Low type variety
- Heavy Fire overlap
- Heavy Water overlap
- Missing Ground coverage
- Missing Ice coverage
- Weak to Ice
- Weak to Rock
- Too many shared Electric weaknesses
- Too many shared Ground weaknesses
- No Ground immunity
- No hazard-safe core
- Offense heavily physical
- Offense heavily special
- Slow team overall

## Badge generation principles
- A badge must only appear if a threshold is met.
- The UI may show top 4–8 badges, sorted by severity then importance.
- Prefer concise labels, with hover/tooltip or subtext for the reason.

---

# 5) Optional move/stat inference

These are optional enhancements and must only run if data exists.

## 5.1 Physical / special distribution
If moves exist:
- count damaging physical moves by member
- count damaging special moves by member

Team-level heuristics:
- if 70%+ of damaging moves are physical: `Offense heavily physical`
- if 70%+ are special: `Offense heavily special`
- otherwise: `Mixed offensive spread`

Do not pretend this is a perfect competitive read.
It is just a lightweight team profile.

## 5.2 Speed balance
If enough `stats.spe` values exist:
- classify each member speed roughly:
  - slow: < 70
  - mid: 70–99
  - fast: 100–119
  - very fast: >= 120

Possible badges:
- 2+ members at 100+: `Fast team core`
- no member at 100+: `Slow team overall`
- 1 very fast + several slow: `Uneven speed profile`

Again: keep this modest and clearly heuristic.

---

# 6) UI implementation requirements

Create these components:

- `TeamAnalyzePanel`
- `TeamTypeSummary`
- `CoverageSummary`
- `WeaknessSummary`
- `AnalysisBadgeList`
- `TypeMatrix` or `CoverageBoard`

## Recommended layout
A clean desktop-first panel with:

### Top row
- panel title
- compact description
- loading / empty / error state area

### Main content
Left / center dominant content:
1. Team type summary
2. Coverage board
3. Weakness / resistance summary

Right or lower supporting content:
4. Badge list
5. optional mini insights (physical/special split, speed profile)

## Visual style
- inspired by Pokémon / Cobblemon companion UI
- not a SaaS admin dashboard
- readable first
- mild framing, subtle borders, good spacing
- restrained decoration
- use the provided type icons where possible
- use provided extracted assets if they fit naturally
- avoid overly glossy or noisy effects

## Asset use
Use uploaded assets where appropriate:
- type icons from `cobblemon_type_icons_extract.zip`
- team analyzer / panel extras from `cobblemon_party_extras_team_analyzer_extract.zip`

If an extracted asset does not fit the web layout cleanly:
- prefer a polished native UI rather than forcing the asset
- keep the visual identity cohesive

---

# 7) Pokédex tab implementation notes

Create:
- `PokedexPanel`
- `PokedexGrid`
- `PokedexEntryCard`
- `PokedexDetailPanel`
- `PokedexSearchBar`

## Behavior
- left side: searchable grid/list of species
- right side: selected entry detail panel
- unlocked species show sprite and name
- locked species show `?` and hide sensitive detail

## Data strategy
- assume backend returns unlocked / caught entries
- use a static full Pokédex list on the frontend to render locked vs unlocked entries
- if easy, include a generation / dex group / region filter

## UI style
- true Pokédex-like feel
- strong selected state
- clean index numbers
- readable scroll areas
- smooth tab switching
- polished loading / empty / error states

---

# 8) Final polish pass requirements

Apply a final polish pass across the player info web:
- smooth tab switching
- smooth party selection
- stronger selected state visuals
- cleaner empty state design
- consistent card / panel language across tabs
- better desktop-first spacing
- use type icons consistently
- preserve a cohesive game-companion identity

Do not overdecorate.
Do not turn the app into a generic SaaS dashboard.
Do not rewrite already-working Phase 4 pages unless necessary.

---

# 9) Suggested utility shapes

```ts
export type TypeName =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy'

export type TeamDefenseEntry = {
  type: TypeName
  immuneCount: number
  doubleResistCount: number
  resistCount: number
  neutralCount: number
  weakCount: number
  quadWeakCount: number
  severity: 'none' | 'minor' | 'manageable' | 'major' | 'critical'
}

export type TeamOffenseEntry = {
  defendingType: TypeName
  sourceCount: number
  status: 'missing' | 'basic' | 'strong'
}

export type TeamAnalysisResult = {
  teamSize: number
  uniqueTypes: TypeName[]
  duplicateTypes: Array<{ type: TypeName; count: number }>
  attackTypes: TypeName[]
  missingCoverageTypes: TypeName[]
  strongCoverageTypes: TypeName[]
  defensiveMatrix: TeamDefenseEntry[]
  resistHighlights: TypeName[]
  immunities: TypeName[]
  badges: AnalysisBadge[]
  optional?: {
    physicalSpecialSplit?: {
      physical: number
      special: number
      status: number
      leaning: 'physical' | 'special' | 'mixed'
    }
    speedProfile?: {
      slow: number
      mid: number
      fast: number
      veryFast: number
      label: string
    }
  }
}
```

---

# 10) Handoff requirement

When implementation is complete, provide a compact final handoff summary that includes:
- files added / updated
- new components created
- shared utilities added
- asset integration summary
- exact analysis rules implemented
- any graceful fallbacks used because of backend limitations
