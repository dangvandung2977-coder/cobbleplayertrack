const en = {
  layout: {
    brandTitle: "Cobblemon Tracker",
    brandSubtitle: "Server Field Console",
    mainNavigation: "Main navigation",
    servers: "Servers",
    languageLabel: "Language",
    languageEnglish: "EN",
    languageVietnamese: "VI",
  },
  common: {
    syncing: "Syncing",
    error: "Error",
    noRecords: "No records",
    yes: "Yes",
    no: "No",
    none: "None",
    unknown: "Unknown",
    slot: "Slot {slot}",
    partySlots: "{count}/6 party slots",
    syncedSlots: "{count}/6 synced",
    noteSingle: "{count} note",
    notePlural: "{count} notes",
    replaceCandidate: "Replace candidate",
    why: "Why",
    recommendation: "Recommended replacement",
    expectedImprovement: "Expected improvement",
    examples: "Examples",
    severity: {
      info: "Info",
      warn: "Warn",
      danger: "Danger",
      good: "Good",
      minor: "Minor",
      manageable: "Manageable",
      major: "Major",
      critical: "Critical",
      none: "None",
    },
  },
  states: {
    loadingFieldData: "Loading field data",
    loadingTrainerFile: "Loading trainer file",
    loadingPartyScreen: "Loading party screen",
    loadingPokedexScreen: "Loading Pokedex screen",
    loadingTeamAnalyze: "Loading team analysis",
    loadingTrackedServers: "Loading tracked servers",
    loadingServerRoster: "Loading server roster",
    fieldConsoleInterrupted: "Field console interrupted",
    backToServers: "Back to servers",
    reloadServers: "Reload servers",
    noTrainerSelectedTitle: "No trainer selected",
    noTrainerSelectedMessage:
      "Open a player from the server roster to inspect their party, Pokedex, and team analysis.",
    backendProfilePartyReachable:
      "{error} Check that the backend profile and party endpoints are reachable.",
    pokedexSyncUnavailable: "Pokedex sync unavailable",
    trainerProfileStillAvailable:
      "{error} The rest of the trainer profile is still available.",
  },
  empty: {
    noBadgesTitle: "No badges",
    noBadgesMessage: "The analyzer needs at least one typed party member.",
    noEntriesTitle: "No Pokedex entries found",
    noEntriesMessage: "Try a different search term or switch the filter back to All.",
    noTeamAnalyzeTitle: "No team to analyze",
    noTeamAnalyzeMessage:
      "The analyzer needs at least one synced party member with known species typing.",
  },
  player: {
    trainerFile: "Trainer File",
    online: "Online",
    offline: "Offline",
    staleOnlineTooltip:
      "Backend marked this player online, but the last seen timestamp is stale.",
    server: "Server",
    lastSeen: "Last seen",
    firstSeen: "First seen",
  },
  nav: {
    party: "Party",
    partyDescription: "Roster, stats, and move detail",
    pokedex: "Pokedex",
    pokedexDescription: "Unlocked species and dex progress",
    teamAnalyze: "Team Analyze",
    teamAnalyzeDescription: "Coverage, weaknesses, and rebuild notes",
  },
  party: {
    headerEyebrow: "Trainer Party",
    headerTitle: "Current Party Overview",
    headerDescription:
      "Select a synced slot to inspect summary, stats, and move data without leaving the party view.",
    activeMember: "Active member",
    noPokemonSelected: "No Pokemon selected",
    noPartySnapshot: "No party snapshot",
    noPartyDescription:
      "The trainer profile is available, but no current party data has been synced yet.",
    noPartyMembers: "No synced party members",
    noPartyMembersMessage:
      "Wait for the backend to push a party snapshot, then this page will populate automatically.",
    rosterSelect: "Roster Select",
    partySlots: "Party Slots",
    partySlotsDescription:
      "Choose a slot to update the portrait, summary, stats, and move readout.",
    partySlotsEmptyDescription:
      "Empty slots stay visible so the layout still reads like an in-game party screen.",
    detailScreen: "Detail Screen",
    detailScreenDescription:
      "Keep the original companion-screen flow: summary, moves, and stats on one focused panel.",
    detailTabs: {
      summary: "Summary",
      moves: "Moves",
      stats: "Stats",
    },
    detailHeading: "{tab} Screen",
    detailEyebrow: "Party Detail",
    currentTeam: "Current Team",
    emptySlot: "Empty Slot",
    noSyncedPokemon: "No synced Pokemon",
    originalLayoutEyebrow: "Party Console",
    originalLayoutTitle: "Companion Summary Screen",
    originalLayoutDescription:
      "Portrait, detail panel, and party slots stay together like the earlier in-game style view.",
  },
  pokemon: {
    selected: "Selected",
    dexNo: "Dex No.",
    species: "Species",
    level: "Level",
    type: "Type",
    hp: "HP",
    nickname: "Nickname",
    gender: "Gender",
    ot: "OT",
    nature: "Nature",
    ability: "Ability",
    heldItem: "Held Item",
    form: "Form",
    shiny: "Shiny",
    displayName: "Display Name",
    noPokemonSelectedTitle: "No Pokemon selected",
    noPokemonSelectedMessage: "Select a party slot to inspect details.",
    statLens: "Stat Lens",
    statLensDescription: "Inspect current stats, IVs, EVs, and HP state.",
    statTabs: {
      stats: "Stats",
      ivs: "IVs",
      evs: "EVs",
      other: "Other",
    },
    trackedStatTotal: "Tracked stat total",
    ivAverage: "IV average",
    evTotal: "EV total",
    currentHp: "Current HP",
    partySlot: "Party Slot",
    knownMoves: "Known Moves",
    statsTotal: "Stats Total",
    moveType: "Move type {type}",
    emptyMoveSlot: "Empty move slot",
    moveMetadataUnavailable: "Move metadata is not available yet.",
    noMoveLearned: "No move learned in this slot.",
    moveDetail: "Move detail",
    power: "Power",
    acc: "Acc",
    pp: "PP",
    category: "Category",
    damageStat: "Damage Stat",
    accuracy: "Accuracy",
    target: "Target",
    priority: "Priority",
    extra: "Extra",
  },
  pokedex: {
    fieldEncyclopedia: "Field Encyclopedia",
    trainerPokedex: "Trainer Pokedex",
    trainerPokedexDescription:
      "Locked entries stay obscured until the backend or the trainer's current party reveals them.",
    displayMode: "Display mode",
    displayModeValue: "Static full dex + synced unlock state",
    selection: "Selection",
    selectionValue: "Searchable list with detail panel",
    fallback: "Fallback",
    fallbackValue: "Current party marks seen species as caught",
    sync: "Pokedex Sync",
    syncCounts: "{caught} caught · {unlocked} unlocked · {indexed} indexed",
    filterAria: "Pokedex filters",
    filters: {
      all: "All",
      unlocked: "Unlocked",
      caught: "Caught",
      locked: "Locked",
    },
    search: "Search Pokedex",
    searchPlaceholder: "Search species or dex no.",
    syncUnavailable: "Pokedex sync unavailable",
    syncUnavailableMessageSuffix:
      "{error} The rest of the trainer profile is still available.",
    entryDetail: "Entry Detail",
    selectEntry: "Select an entry.",
    unknownSpecies: "Unknown Species",
    lockedEntry: "Locked entry",
    lockedEntryDescription:
      "This species has not been unlocked for this player yet. Detailed type and species data stays hidden.",
    status: "Status",
    caughtLabel: "Caught",
    speciesLabel: "Species",
    unlocked: "Unlocked",
    completion: "Completion",
    locked: "Locked",
    seen: "Seen",
  },
  analyze: {
    battlePlanner: "Battle Planner",
    title: "Team Analyze",
    description:
      "Deterministic coverage and weakness reads for the current party, plus rebuild guidance that stays tied to the actual team data.",
    coverageSource: "Coverage source",
    coverageSourceValue: "Damaging moves first, STAB fallback",
    defenseModel: "Defense model",
    defenseModelValue: "Full 18-type weakness matrix",
    rebuildNotes: "Rebuild notes",
    rebuildNotesValue: "Separate Singles and Doubles rules",
    analyzerMode: "Analyzer Mode",
    modeTypes: "Types only · STAB coverage fallback",
    modeTypesMoves: "Types + known damaging moves",
    modeTypesMovesStats: "Types + moves + rough stat heuristics",
    metricTeam: "Team",
    metricTypes: "Types",
    metricGaps: "Gaps",
    teamTypeSummary: "Team Type Summary",
    uniqueTypes: "{count} unique types",
    duplicateTypeGroups: "{count} duplicate type groups",
    offensiveCoverage: "Offensive Coverage",
    stabFallback: "STAB-only fallback",
    knownDamagingMoves: "Known damaging moves",
    attackTypes: "Attack types",
    strongCoverage: "Strong coverage",
    missingCoverage: "Missing coverage",
    noCoverageYet: "None yet",
    noMajorGaps: "No major gaps",
    defensiveOverview: "Defensive Overview",
    weaknessStacksSafePivots: "Weakness stacks and safe pivots",
    weaknessRow: "{severity} · weak {weak} · resist {resist} · immune {immune}",
    noSharedWeaknessStacks: "No shared weakness stacks detected from known typing.",
    immunities: "Immunities",
    resistanceHighlights: "Resistance highlights",
    noImmunities: "No immunities detected",
    noStackedResistances: "No stacked resistances yet",
    evaluationBadges: "Evaluation Badges",
    extraHeuristics: "Extra Heuristics",
    extraHeuristicsEmpty:
      "Add move damage data and Speed stats to unlock physical/special and speed profile reads.",
    offenseSplit: "Offense split",
    speedProfile: "Speed profile",
    replaceSection: "Replacement Suggestions",
    replaceSectionSubtitle: "Weakest current fits and what to replace them with",
    singlesReplacement: "Singles replacement suggestions",
    doublesReplacement: "Doubles replacement suggestions",
    noSinglesReplacement:
      "No clear Singles replace-candidate was triggered from the current team read.",
    noDoublesReplacement:
      "No clear Doubles replace-candidate was triggered from the current team read.",
    rebuildSection: "Team Rebuild Suggestions",
    rebuildSectionSubtitle: "Deterministic Singles and Doubles fixes",
    singlesRebuild: "Singles Rebuild Suggestions",
    doublesRebuild: "Doubles Rebuild Suggestions",
    noSinglesRebuild:
      "No major Singles rebuild flags were triggered from the current team read.",
    noDoublesRebuild:
      "No major Doubles rebuild flags were triggered from the current team read.",
    replacementModeBoth: "Both",
    replacementModeSingles: "Singles",
    replacementModeDoubles: "Doubles",
  },
  analyzeBadges: {
    goodTypeVariety: {
      label: "Good type variety",
      reason: "{count} unique team types are represented.",
    },
    lowTypeVariety: {
      label: "Low type variety",
      reason: "Only {count} unique team types are represented.",
    },
    heavyTypeOverlap: {
      label: "Heavy {type} overlap",
      reason: "{count} party type slots are {type}.",
    },
    goodFireCoverage: {
      label: "Good Fire coverage",
      reason: "At least two attack sources hit Fire super effectively.",
    },
    goodIceCoverage: {
      label: "Good Ice coverage",
      reason: "At least two attack sources hit Ice super effectively.",
    },
    strongGroundPressure: {
      label: "Strong Ground pressure",
      reason: "At least two attack sources hit Ground super effectively.",
    },
    missingGroundCoverage: {
      label: "Missing Ground coverage",
      reason: "No current attack source hits Ground super effectively.",
    },
    missingIceCoverage: {
      label: "Missing Ice coverage",
      reason: "No current attack source hits Ice super effectively.",
    },
    strongGeneralCoverageCore: {
      label: "Strong general coverage core",
      reason:
        "Water, Flying, and Steel all have at least one super-effective answer.",
    },
    shallowOffensiveCoverage: {
      label: "Shallow offensive coverage",
      reason: "{count} defending types currently lack a super-effective answer.",
    },
    broadOffensiveCoverage: {
      label: "Broad offensive coverage",
      reason: "{count} defending types are missing super-effective coverage.",
    },
    weakToType: {
      label: "Weak to {type}",
      reason: "{count} members are weak to {type}.",
    },
    tooManyTypeWeaknesses: {
      label: "Too many shared {type} weaknesses",
      reason: "{count} members are weak to {type}.",
    },
    goodWaterResistanceSpread: {
      label: "Good Water resistance spread",
      reason: "At least two team members resist or ignore Water.",
    },
    hasGroundImmunity: {
      label: "Has Ground immunity",
      reason: "At least one member is immune to Ground.",
    },
    noGroundImmunity: {
      label: "No Ground immunity",
      reason: "No team member is immune to Ground attacks.",
    },
    hasElectricImmunity: {
      label: "Has Electric immunity",
      reason: "At least one member is immune to Electric.",
    },
    offenseHeavilyPhysical: {
      label: "Offense heavily physical",
      reason: "At least 70% of damaging known moves are Physical.",
    },
    offenseHeavilySpecial: {
      label: "Offense heavily special",
      reason: "At least 70% of damaging known moves are Special.",
    },
    balancedOffensiveSpread: {
      label: "Balanced offensive spread",
      reason: "Known damaging moves include both Physical and Special pressure.",
    },
    fastTeamCore: {
      label: "Fast team core",
      reason: "At least two known Speed stats are 100 or higher.",
    },
    slowTeamOverall: {
      label: "Slow team overall",
      reason: "No known Speed stat is 100 or higher.",
    },
    unevenSpeedProfile: {
      label: "Uneven speed profile",
      reason: "The team has one very fast member and multiple slow members.",
    },
  },
  rebuild: {
    categories: {
      defense: "Defense",
      immunity: "Immunity",
      hazardControl: "Hazard Control",
      speedControl: "Speed Control",
      winCondition: "Win Condition",
      defensiveCore: "Defensive Core",
      offenseBalance: "Offense Balance",
      typeOverlap: "Type Overlap",
      roleCompression: "Role Compression",
      spreadMatchup: "Spread Matchup",
      protect: "Protect",
      support: "Support",
      reposition: "Reposition",
      pressure: "Pressure",
      partnerSynergy: "Partner Synergy",
      modeFlexibility: "Mode Flexibility",
    },
    singlesPatchWeakness: {
      title: "Patch {type} weakness stack",
      reason:
        "{weakCount} members are weak to {type}, while only {safeCount} slots currently resist or ignore it.",
      recommendation:
        "Replace one overlapping slot with a resist, immunity, or bulky pivot that can enter {type} attacks more safely.",
    },
    singlesGroundImmunity: {
      title: "Add a Ground immunity",
      reason:
        "No current team member is immune to Ground, so Earthquake-style pressure has no free pivot.",
      recommendation:
        "Fit a Flying-type, Levitate slot, or another Ground-immune glue piece.",
    },
    singlesHazardControl: {
      title: "Add hazard control",
      reason:
        "No Defog, Rapid Spin, Mortal Spin, Court Change, or Tidy Up user was detected across the known move sets.",
      recommendation:
        "Fit one removal slot so rocks, webs, and spikes do not wear the whole party down.",
    },
    singlesRevengeKiller: {
      title: "Add speed control or a revenge killer",
      reason: "{context}",
      recommendation:
        "Add one faster closer, a priority attacker, or a support slot that slows the opposing team.",
    },
    singlesSetupPressure: {
      title: "Add setup pressure",
      reason:
        "No setup move such as Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, or Quiver Dance was detected.",
      recommendation:
        "Give one win condition a setup tool so the team can punish passive turns instead of only trading hits.",
    },
    singlesDefensiveGlue: {
      title: "Add a defensive glue slot",
      reason:
        "The team lacks safe switch-ins into {types} and does not show a clear bulky backbone from the known stats.",
      recommendation:
        "Replace one redundant attacker with a bulky pivot that covers those common pressure points.",
    },
    singlesSpecialBreaker: {
      title: "Add a reliable special breaker",
      reason:
        "Known damaging moves skew heavily physical ({physical} physical vs {special} special).",
      recommendation:
        "Swap one repeated physical attacker for a special or mixed breaker so walls cannot answer the same damage class every turn.",
    },
    singlesPhysicalBreaker: {
      title: "Add a reliable physical breaker",
      reason:
        "Known damaging moves skew heavily special ({special} special vs {physical} physical).",
      recommendation:
        "Swap one repeated special attacker for a physical or mixed breaker so your pressure is harder to wall.",
    },
    singlesReduceOverlap: {
      title: "Reduce type overlap",
      reason:
        "Repeated {types} slots compress both switch-in options and coverage variety.",
      recommendation:
        "Trim one repeated type and replace it with a complementary resist or coverage slot.",
    },
    singlesRoleCompression: {
      title: "Use one slot as glue, not another attacker",
      reason:
        "The team shows overlap but no clear removal or pivot utility in the known move sets.",
      recommendation:
        "Turn one redundant attacker into a glue slot that brings removal, pivoting, or a safer defensive entry point.",
    },
    doublesSpreadWeakness: {
      title: "Patch spread-damage weakness",
      reason:
        "{weakCount} members are weak to {type}, which is especially punishing when spread attacks pressure both slots at once.",
      recommendation:
        "Reduce {type} overlap and add at least one resist or immunity on a slot that can keep board position stable.",
    },
    doublesSpeedControl: {
      title: "Add speed control",
      reason:
        "No Tailwind, Trick Room, Icy Wind, Electroweb, Thunder Wave, or similar speed tool was detected, and the team does not show a strong natural speed edge.",
      recommendation:
        "Add one dedicated speed-control slot so the main damage dealer gets the first useful turn more often.",
    },
    doublesProtect: {
      title: "Use Protect on key attackers",
      reason:
        "Only {count} Protect-style move(s) were detected across {knownMoveMembers} known move sets.",
      recommendation:
        "Give Protect to fragile attackers and board-position pieces so they can survive double targets and scout turns cleanly.",
    },
    doublesSupportSlot: {
      title: "Add a support enabler",
      reason:
        "No redirection, Helping Hand, Wide Guard, or similar board-control support was detected across the known move sets.",
      recommendation:
        "Add one support slot that buys free turns for the team's main attacker instead of asking every slot to self-enable.",
    },
    doublesReposition: {
      title: "Add reposition tools",
      reason:
        "The known move sets show little evidence of pivoting or board reset tools.",
      recommendation:
        "Fit a move or support slot that repositions partners and preserves momentum when the opener is awkward.",
    },
    doublesImmediatePressure: {
      title: "Increase immediate pressure",
      reason:
        "Few members show fast or high-power pressure, so the team may give up too much tempo on turn one.",
      recommendation:
        "Anchor the mode around one primary attacker and partner support that guarantees it cleaner turns.",
    },
    doublesPartnerSynergy: {
      title: "Tighten partner offensive synergy",
      reason:
        "The current attack spread is narrow, so partner pairs are not covering enough opposing types together.",
      recommendation:
        "Pair the main attacker with a second slot that patches its missed targets instead of duplicating the same pressure.",
    },
    doublesSecondMode: {
      title: "Add a second battle mode",
      reason:
        "The current build reads as one-dimensional: overlapping typing with little speed or support variation.",
      recommendation:
        "Add an alternate pace plan such as Tailwind offense, Trick Room mode, or a second offensive core so the team is harder to pin down.",
    },
  },
  replacement: {
    categories: {
      overlap: "Overlap",
      weakness: "Weakness",
      utility: "Utility",
      speed: "Speed",
      pressure: "Pressure",
      support: "Support",
    },
    singlesReplace: {
      title: "Replace {name}",
      why: "{name} is a weak Singles fit because {reason}.",
      recommendation: "Add {replacement} instead.",
      expectedImprovement: "This should {improvement}.",
    },
    doublesReplace: {
      title: "Replace {name}",
      why: "{name} is a weak Doubles fit because {reason}.",
      recommendation: "Add {replacement} instead.",
      expectedImprovement: "This should {improvement}.",
    },
  },
} as const;

export default en;
