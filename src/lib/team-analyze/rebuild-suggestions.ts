import type { PartyPokemon } from "@/lib/api/types";
import type { TranslationValues } from "@/lib/i18n";
import { getMoveInfo, getStatValue } from "@/lib/pokemon";
import type { TypeName } from "@/lib/type-chart";

export type RebuildSuggestion = {
  id: string;
  mode: "singles" | "doubles";
  severity: "info" | "warn" | "danger";
  category: string;
  title: string;
  why: string;
  recommendation: string;
  examples?: string[];
  translationKey?: string;
  translationValues?: TranslationValues;
};

export type TeamRebuildSuggestions = {
  singles: RebuildSuggestion[];
  doubles: RebuildSuggestion[];
};

type TeamDefenseSnapshot = {
  type: TypeName;
  immuneCount: number;
  doubleResistCount: number;
  resistCount: number;
  weakCount: number;
  quadWeakCount: number;
  severity: "none" | "minor" | "manageable" | "major" | "critical";
};

type TeamAnalysisSnapshot = {
  teamSize: number;
  uniqueTypes: TypeName[];
  duplicateTypes: Array<{ type: TypeName; count: number }>;
  attackTypes: TypeName[];
  missingCoverageTypes: TypeName[];
  defensiveMatrix: TeamDefenseSnapshot[];
  immunities: TypeName[];
  optional?: {
    physicalSpecialSplit?: {
      physical: number;
      special: number;
      status: number;
      leaning: "physical" | "special" | "mixed";
    };
    speedProfile?: {
      slow: number;
      mid: number;
      fast: number;
      veryFast: number;
      label: string;
    };
  };
};

const HAZARD_CONTROL_MOVES = new Set([
  "courtchange",
  "defog",
  "mortalspin",
  "rapidspin",
  "tidyup",
]);

const SPEED_CONTROL_MOVES = new Set([
  "bulldoze",
  "electroweb",
  "glare",
  "icywind",
  "stringshot",
  "stunspore",
  "tailwind",
  "thunderwave",
  "trickroom",
]);

const SETUP_MOVES = new Set([
  "agility",
  "amnesia",
  "bellydrum",
  "bulkup",
  "calmmind",
  "coil",
  "curse",
  "dragondance",
  "growth",
  "honeclaws",
  "irondefense",
  "nastyplot",
  "quiverdance",
  "rockpolish",
  "shellsmash",
  "swordsdance",
  "workup",
]);

const PIVOT_MOVES = new Set([
  "allyswitch",
  "batonpass",
  "chillyreception",
  "flipturn",
  "partingshot",
  "teleport",
  "uturn",
  "voltswitch",
]);

const PROTECT_MOVES = new Set([
  "banefulbunker",
  "burningbulwark",
  "detect",
  "kingsshield",
  "obstruct",
  "protect",
  "silktrap",
  "spikyshield",
]);

const SUPPORT_MOVES = new Set([
  "allyswitch",
  "coaching",
  "decorate",
  "followme",
  "helpinghand",
  "quickguard",
  "ragepowder",
  "wideguard",
]);

const COMMON_SWITCH_TYPES: TypeName[] = ["water", "ground", "fairy", "ice", "fire"];
const SPREAD_RISK_TYPES: TypeName[] = ["ground", "rock", "ice", "water", "fire"];

const SEVERITY_RANK: Record<RebuildSuggestion["severity"], number> = {
  danger: 0,
  warn: 1,
  info: 2,
};

type Signals = {
  broadMoveRead: boolean;
  anyMoveRead: boolean;
  knownMoveMembers: number;
  hazardControlUsers: Set<string>;
  speedControlUsers: Set<string>;
  setupUsers: Set<string>;
  pivotUsers: Set<string>;
  protectUsers: Set<string>;
  supportUsers: Set<string>;
  priorityUsers: Set<string>;
  immediatePressureUsers: Set<string>;
  bulkyCount: number;
  commonUnsafeTypes: TypeName[];
  naturalSpeedEdge: boolean;
  hasRevengeKiller: boolean;
  topWeakness?: TeamDefenseSnapshot;
  topSpreadWeakness?: TeamDefenseSnapshot;
};

export function buildTeamRebuildSuggestions(
  party: PartyPokemon[],
  analysis: TeamAnalysisSnapshot,
): TeamRebuildSuggestions {
  const signals = buildSignals(party, analysis);
  const singles: RebuildSuggestion[] = [];
  const doubles: RebuildSuggestion[] = [];

  const addSuggestion = (
    target: RebuildSuggestion[],
    suggestion: RebuildSuggestion,
  ) => {
    if (!target.some((entry) => entry.id === suggestion.id)) {
      target.push(suggestion);
    }
  };

  if (signals.topWeakness) {
    const totalWeak = signals.topWeakness.weakCount + signals.topWeakness.quadWeakCount;
    addSuggestion(singles, {
      id: `singles-patch-${signals.topWeakness.type}`,
      mode: "singles",
      severity: signals.topWeakness.severity === "critical" ? "danger" : "warn",
      category: "defense",
      title: `Patch ${formatType(signals.topWeakness.type)} weakness stack`,
      why: `${totalWeak} members are weak to ${formatType(signals.topWeakness.type)}, while only ${getSafeCount(signals.topWeakness)} slots currently resist or ignore it.`,
      recommendation: `Replace one overlapping slot with a resist, immunity, or bulky pivot that can enter ${formatType(signals.topWeakness.type)} attacks more safely.`,
      examples: weaknessExamples(signals.topWeakness.type),
      translationKey: "rebuild.singlesPatchWeakness",
      translationValues: {
        type: formatType(signals.topWeakness.type),
        weakCount: totalWeak,
        safeCount: getSafeCount(signals.topWeakness),
      },
    });
  }

  if (!analysis.immunities.includes("ground")) {
    addSuggestion(singles, {
      id: "singles-ground-immunity",
      mode: "singles",
      severity: "warn",
      category: "immunity",
      title: "Add a Ground immunity",
      why: "No current team member is immune to Ground, so Earthquake-style pressure has no free pivot.",
      recommendation: "Fit a Flying-type, Levitate slot, or another Ground-immune glue piece.",
      examples: ["Flying-type pivot", "Levitate user", "Airborne support slot"],
      translationKey: "rebuild.singlesGroundImmunity",
    });
  }

  if (signals.broadMoveRead && signals.hazardControlUsers.size === 0) {
    addSuggestion(singles, {
      id: "singles-hazard-control",
      mode: "singles",
      severity: "warn",
      category: "hazardControl",
      title: "Add hazard control",
      why: "No Defog, Rapid Spin, Mortal Spin, Court Change, or Tidy Up user was detected across the known move sets.",
      recommendation: "Fit one removal slot so rocks, webs, and spikes do not wear the whole party down.",
      examples: ["Defog", "Rapid Spin", "Mortal Spin", "Tidy Up"],
      translationKey: "rebuild.singlesHazardControl",
    });
  }

  if (!signals.hasRevengeKiller && (!signals.naturalSpeedEdge || !signals.anyMoveRead)) {
    addSuggestion(singles, {
      id: "singles-revenge-killer",
      mode: "singles",
      severity: signals.naturalSpeedEdge ? "info" : "warn",
      category: "speedControl",
      title: "Add speed control or a revenge killer",
      why: analysis.optional?.speedProfile
        ? `${analysis.optional.speedProfile.label}; no clear fast cleaner or priority user was detected.`
        : "Known data does not show a clear fast cleanup slot or priority backup plan.",
      recommendation: "Add one faster closer, a priority attacker, or a support slot that slows the opposing team.",
      examples: ["Priority attacker", "Thunder Wave support", "Fast cleaner"],
      translationKey: "rebuild.singlesRevengeKiller",
      translationValues: {
        context: analysis.optional?.speedProfile
          ? `${analysis.optional.speedProfile.label}; no clear fast cleaner or priority user was detected.`
          : "Known data does not show a clear fast cleanup slot or priority backup plan.",
      },
    });
  }

  if (signals.broadMoveRead && signals.setupUsers.size === 0) {
    addSuggestion(singles, {
      id: "singles-setup-pressure",
      mode: "singles",
      severity: "info",
      category: "winCondition",
      title: "Add setup pressure",
      why: "No setup move such as Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, or Quiver Dance was detected.",
      recommendation: "Give one win condition a setup tool so the team can punish passive turns instead of only trading hits.",
      examples: ["Swords Dance", "Dragon Dance", "Calm Mind", "Nasty Plot"],
      translationKey: "rebuild.singlesSetupPressure",
    });
  }

  if (signals.commonUnsafeTypes.length >= 2 && signals.bulkyCount < 2) {
    addSuggestion(singles, {
      id: "singles-defensive-glue",
      mode: "singles",
      severity: "warn",
      category: "defensiveCore",
      title: "Add a defensive glue slot",
      why: `The team lacks safe switch-ins into ${formatTypeList(signals.commonUnsafeTypes.slice(0, 3))} and does not show a clear bulky backbone from the known stats.`,
      recommendation: "Replace one redundant attacker with a bulky pivot that covers those common pressure points.",
      examples: ["Bulky Water", "Steel anchor", "Ground-immune pivot"],
      translationKey: "rebuild.singlesDefensiveGlue",
      translationValues: {
        types: formatTypeList(signals.commonUnsafeTypes.slice(0, 3)),
      },
    });
  }

  const split = analysis.optional?.physicalSpecialSplit;
  if (split?.leaning === "physical") {
    addSuggestion(singles, {
      id: "singles-special-breaker",
      mode: "singles",
      severity: "warn",
      category: "offenseBalance",
      title: "Add a reliable special breaker",
      why: `Known damaging moves skew heavily physical (${split.physical} physical vs ${split.special} special).`,
      recommendation: "Swap one repeated physical attacker for a special or mixed breaker so walls cannot answer the same damage class every turn.",
      translationKey: "rebuild.singlesSpecialBreaker",
      translationValues: {
        physical: split.physical,
        special: split.special,
      },
    });
  } else if (split?.leaning === "special") {
    addSuggestion(singles, {
      id: "singles-physical-breaker",
      mode: "singles",
      severity: "warn",
      category: "offenseBalance",
      title: "Add a reliable physical breaker",
      why: `Known damaging moves skew heavily special (${split.special} special vs ${split.physical} physical).`,
      recommendation: "Swap one repeated special attacker for a physical or mixed breaker so your pressure is harder to wall.",
      translationKey: "rebuild.singlesPhysicalBreaker",
      translationValues: {
        physical: split.physical,
        special: split.special,
      },
    });
  }

  if (
    analysis.duplicateTypes.length > 0 &&
    (analysis.uniqueTypes.length <= 6 || analysis.missingCoverageTypes.length >= 5)
  ) {
    addSuggestion(singles, {
      id: "singles-reduce-overlap",
      mode: "singles",
      severity: "warn",
      category: "typeOverlap",
      title: "Reduce type overlap",
      why: `Repeated ${analysis.duplicateTypes.map(({ type }) => formatType(type)).join(", ")} slots compress both switch-in options and coverage variety.`,
      recommendation: "Trim one repeated type and replace it with a complementary resist or coverage slot.",
      examples: ["Ground-immune pivot", "Special breaker", "Bulky support slot"],
      translationKey: "rebuild.singlesReduceOverlap",
      translationValues: {
        types: analysis.duplicateTypes.map(({ type }) => formatType(type)).join(", "),
      },
    });
  }

  if (
    signals.broadMoveRead &&
    signals.hazardControlUsers.size === 0 &&
    signals.pivotUsers.size === 0 &&
    analysis.duplicateTypes.length > 0
  ) {
    addSuggestion(singles, {
      id: "singles-role-compression",
      mode: "singles",
      severity: "info",
      category: "roleCompression",
      title: "Use one slot as glue, not another attacker",
      why: "The team shows overlap but no clear removal or pivot utility in the known move sets.",
      recommendation: "Turn one redundant attacker into a glue slot that brings removal, pivoting, or a safer defensive entry point.",
      examples: ["Defog user", "Rapid Spin user", "U-turn / Volt Switch pivot"],
      translationKey: "rebuild.singlesRoleCompression",
    });
  }

  if (signals.topSpreadWeakness) {
    const totalWeak = signals.topSpreadWeakness.weakCount + signals.topSpreadWeakness.quadWeakCount;
    addSuggestion(doubles, {
      id: `doubles-spread-${signals.topSpreadWeakness.type}`,
      mode: "doubles",
      severity: signals.topSpreadWeakness.severity === "critical" ? "danger" : "warn",
      category: "spreadMatchup",
      title: "Patch spread-damage weakness",
      why: `${totalWeak} members are weak to ${formatType(signals.topSpreadWeakness.type)}, which is especially punishing when spread attacks pressure both slots at once.`,
      recommendation: `Reduce ${formatType(signals.topSpreadWeakness.type)} overlap and add at least one resist or immunity on a slot that can keep board position stable.`,
      examples: weaknessExamples(signals.topSpreadWeakness.type),
      translationKey: "rebuild.doublesSpreadWeakness",
      translationValues: {
        type: formatType(signals.topSpreadWeakness.type),
        weakCount: totalWeak,
      },
    });
  }

  if (!signals.naturalSpeedEdge && signals.speedControlUsers.size === 0) {
    addSuggestion(doubles, {
      id: "doubles-speed-control",
      mode: "doubles",
      severity: analysis.optional?.speedProfile?.label === "Slow team overall" ? "danger" : "warn",
      category: "speedControl",
      title: "Add speed control",
      why: "No Tailwind, Trick Room, Icy Wind, Electroweb, Thunder Wave, or similar speed tool was detected, and the team does not show a strong natural speed edge.",
      recommendation: "Add one dedicated speed-control slot so the main damage dealer gets the first useful turn more often.",
      examples: ["Tailwind", "Trick Room", "Icy Wind", "Electroweb", "Thunder Wave"],
      translationKey: "rebuild.doublesSpeedControl",
    });
  }

  if (signals.broadMoveRead && signals.protectUsers.size <= 1 && signals.knownMoveMembers >= 4) {
    addSuggestion(doubles, {
      id: "doubles-protect",
      mode: "doubles",
      severity: "warn",
      category: "protect",
      title: "Use Protect on key attackers",
      why: `Only ${signals.protectUsers.size} Protect-style move(s) were detected across ${signals.knownMoveMembers} known move sets.`,
      recommendation: "Give Protect to fragile attackers and board-position pieces so they can survive double targets and scout turns cleanly.",
      examples: ["Protect", "Detect", "King's Shield", "Spiky Shield"],
      translationKey: "rebuild.doublesProtect",
      translationValues: {
        count: signals.protectUsers.size,
        knownMoveMembers: signals.knownMoveMembers,
      },
    });
  }

  if (signals.broadMoveRead && signals.supportUsers.size === 0) {
    addSuggestion(doubles, {
      id: "doubles-support-slot",
      mode: "doubles",
      severity: "warn",
      category: "support",
      title: "Add a support enabler",
      why: "No redirection, Helping Hand, Wide Guard, or similar board-control support was detected across the known move sets.",
      recommendation: "Add one support slot that buys free turns for the team's main attacker instead of asking every slot to self-enable.",
      examples: ["Follow Me", "Rage Powder", "Helping Hand", "Wide Guard"],
      translationKey: "rebuild.doublesSupportSlot",
    });
  }

  if (signals.broadMoveRead && signals.supportUsers.size === 0 && signals.pivotUsers.size === 0) {
    addSuggestion(doubles, {
      id: "doubles-reposition",
      mode: "doubles",
      severity: "info",
      category: "reposition",
      title: "Add reposition tools",
      why: "The known move sets show little evidence of pivoting or board reset tools.",
      recommendation: "Fit a move or support slot that repositions partners and preserves momentum when the opener is awkward.",
      examples: ["U-turn", "Volt Switch", "Flip Turn", "Parting Shot", "Ally Switch"],
      translationKey: "rebuild.doublesReposition",
    });
  }

  if (
    signals.broadMoveRead &&
    signals.immediatePressureUsers.size < 2 &&
    !signals.naturalSpeedEdge &&
    signals.setupUsers.size === 0
  ) {
    addSuggestion(doubles, {
      id: "doubles-immediate-pressure",
      mode: "doubles",
      severity: "warn",
      category: "pressure",
      title: "Increase immediate pressure",
      why: "Few members show fast or high-power pressure, so the team may give up too much tempo on turn one.",
      recommendation: "Anchor the mode around one primary attacker and partner support that guarantees it cleaner turns.",
      examples: ["Fast lead attacker", "Helping Hand partner", "Speed-control support"],
      translationKey: "rebuild.doublesImmediatePressure",
    });
  }

  if (analysis.attackTypes.length <= 4 && analysis.missingCoverageTypes.length >= 6) {
    addSuggestion(doubles, {
      id: "doubles-partner-synergy",
      mode: "doubles",
      severity: "info",
      category: "partnerSynergy",
      title: "Tighten partner offensive synergy",
      why: "The current attack spread is narrow, so partner pairs are not covering enough opposing types together.",
      recommendation: "Pair the main attacker with a second slot that patches its missed targets instead of duplicating the same pressure.",
      translationKey: "rebuild.doublesPartnerSynergy",
    });
  }

  if (
    analysis.duplicateTypes.length > 0 &&
    signals.speedControlUsers.size === 0 &&
    signals.supportUsers.size === 0
  ) {
    addSuggestion(doubles, {
      id: "doubles-second-mode",
      mode: "doubles",
      severity: "warn",
      category: "modeFlexibility",
      title: "Add a second battle mode",
      why: "The current build reads as one-dimensional: overlapping typing with little speed or support variation.",
      recommendation: "Add an alternate pace plan such as Tailwind offense, Trick Room mode, or a second offensive core so the team is harder to pin down.",
      examples: ["Tailwind mode", "Trick Room mode", "Second offensive core"],
      translationKey: "rebuild.doublesSecondMode",
    });
  }

  return {
    singles: sortSuggestions(singles).slice(0, 6),
    doubles: sortSuggestions(doubles).slice(0, 6),
  };
}

function buildSignals(party: PartyPokemon[], analysis: TeamAnalysisSnapshot): Signals {
  const sortedParty = [...party]
    .filter(Boolean)
    .sort((first, second) => first.slot - second.slot)
    .slice(0, 6);
  const knownMoveMembers = sortedParty.filter((pokemon) => (pokemon.moves ?? []).length > 0).length;
  const broadMoveRead = knownMoveMembers >= Math.max(3, Math.ceil(Math.max(analysis.teamSize, 1) / 2));

  const hazardControlUsers = new Set<string>();
  const speedControlUsers = new Set<string>();
  const setupUsers = new Set<string>();
  const pivotUsers = new Set<string>();
  const protectUsers = new Set<string>();
  const supportUsers = new Set<string>();
  const priorityUsers = new Set<string>();
  const immediatePressureUsers = new Set<string>();
  let knownMoveCount = 0;
  let bulkyCount = 0;

  sortedParty.forEach((pokemon, pokemonIndex) => {
    const memberKey = `${pokemon.slot}-${pokemon.species}-${pokemonIndex}`;
    const moves = pokemon.moves ?? [];
    let memberDamagingMoves = 0;
    let memberHasHighPower = false;

    for (const [moveIndex, move] of moves.entries()) {
      knownMoveCount += 1;
      const moveInfo = getMoveInfo(move, moveIndex);
      const normalizedName = normalizeMoveName(moveInfo.name);
      const damaging = isDamagingPower(moveInfo.power);

      if (damaging) {
        memberDamagingMoves += 1;
        if (typeof moveInfo.power === "number" && moveInfo.power >= 90) {
          memberHasHighPower = true;
        }

        if (typeof moveInfo.priority === "number" && moveInfo.priority > 0) {
          priorityUsers.add(memberKey);
          immediatePressureUsers.add(memberKey);
        }
      }

      if (HAZARD_CONTROL_MOVES.has(normalizedName)) {
        hazardControlUsers.add(memberKey);
      }

      if (SPEED_CONTROL_MOVES.has(normalizedName)) {
        speedControlUsers.add(memberKey);
      }

      if (SETUP_MOVES.has(normalizedName)) {
        setupUsers.add(memberKey);
      }

      if (PIVOT_MOVES.has(normalizedName)) {
        pivotUsers.add(memberKey);
      }

      if (PROTECT_MOVES.has(normalizedName)) {
        protectUsers.add(memberKey);
      }

      if (SUPPORT_MOVES.has(normalizedName)) {
        supportUsers.add(memberKey);
      }
    }

    if (memberDamagingMoves >= 2 && memberHasHighPower) {
      immediatePressureUsers.add(memberKey);
    }

    if (isBulkyPokemon(pokemon)) {
      bulkyCount += 1;
    }
  });

  const speedProfile = analysis.optional?.speedProfile;
  const naturalSpeedEdge = Boolean(speedProfile && speedProfile.fast + speedProfile.veryFast >= 2);
  const hasRevengeKiller = Boolean(
    priorityUsers.size > 0 ||
      (speedProfile && (speedProfile.veryFast >= 1 || speedProfile.fast + speedProfile.veryFast >= 2)),
  );

  const commonUnsafeTypes = COMMON_SWITCH_TYPES.filter((type) => {
    const defense = analysis.defensiveMatrix.find((entry) => entry.type === type);
    return !defense || getSafeCount(defense) === 0;
  });

  const topWeakness = [...analysis.defensiveMatrix]
    .filter((entry) => entry.severity === "critical" || entry.severity === "major")
    .sort(sortDefenseEntries)
    .at(0);

  const topSpreadWeakness = [...analysis.defensiveMatrix]
    .filter(
      (entry) =>
        SPREAD_RISK_TYPES.includes(entry.type) &&
        (entry.severity === "critical" || entry.severity === "major"),
    )
    .sort(sortDefenseEntries)
    .at(0);

  return {
    broadMoveRead,
    anyMoveRead: knownMoveCount > 0,
    knownMoveMembers,
    hazardControlUsers,
    speedControlUsers,
    setupUsers,
    pivotUsers,
    protectUsers,
    supportUsers,
    priorityUsers,
    immediatePressureUsers,
    bulkyCount,
    commonUnsafeTypes,
    naturalSpeedEdge,
    hasRevengeKiller,
    topWeakness,
    topSpreadWeakness,
  };
}

function normalizeMoveName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isDamagingPower(power: number | string | undefined) {
  return typeof power === "number" && power > 0;
}

function isBulkyPokemon(pokemon: PartyPokemon) {
  const hp = getStatValue(pokemon.stats, "hp");
  const def = getStatValue(pokemon.stats, "def");
  const spd = getStatValue(pokemon.stats, "spd");

  if (hp === null || (def === null && spd === null)) {
    return false;
  }

  const pairedDefense = Math.max(def ?? 0, spd ?? 0);
  return hp >= 85 && pairedDefense >= 80;
}

function sortSuggestions(suggestions: RebuildSuggestion[]) {
  return [...suggestions].sort((first, second) => {
    const severityDelta = SEVERITY_RANK[first.severity] - SEVERITY_RANK[second.severity];
    return severityDelta !== 0 ? severityDelta : first.title.localeCompare(second.title);
  });
}

function sortDefenseEntries(first: TeamDefenseSnapshot, second: TeamDefenseSnapshot) {
  const severityDelta = defenseSeverityRank(first.severity) - defenseSeverityRank(second.severity);
  if (severityDelta !== 0) {
    return severityDelta;
  }

  return second.weakCount + second.quadWeakCount - (first.weakCount + first.quadWeakCount);
}

function defenseSeverityRank(severity: TeamDefenseSnapshot["severity"]) {
  switch (severity) {
    case "critical":
      return 0;
    case "major":
      return 1;
    case "manageable":
      return 2;
    case "minor":
      return 3;
    default:
      return 4;
  }
}

function getSafeCount(entry: TeamDefenseSnapshot) {
  return entry.immuneCount + entry.resistCount + entry.doubleResistCount;
}

function formatType(type: TypeName) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatTypeList(types: TypeName[]) {
  return types.map(formatType).join(", ");
}

function weaknessExamples(type: TypeName) {
  if (type === "ground") {
    return ["Flying-type immunity", "Levitate pivot", "Grass or Water check"];
  }

  if (type === "rock") {
    return ["Steel resist", "Ground or Fighting resist", "Wide Guard support"];
  }

  if (type === "ice") {
    return ["Steel resist", "Fire resist", "Bulky Water support"];
  }

  return ["Bulky resist", "Immunity slot", "Defensive pivot"];
}
