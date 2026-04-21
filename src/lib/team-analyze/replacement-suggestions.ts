import type { PartyPokemon } from "@/lib/api/types";
import type { TranslationValues } from "@/lib/i18n";
import { getMoveInfo, getStatValue } from "@/lib/pokemon";
import { combinedEffectiveness, effectiveness, type TypeName } from "@/lib/type-chart";

export type ReplacementSuggestion = {
  id: string;
  severity: "info" | "warn" | "danger";
  mode: "singles" | "doubles" | "both";
  category: string;
  replaceCandidate: string;
  title: string;
  whyReplace: string;
  recommendation: string;
  expectedImprovement: string;
  examples?: string[];
  translationKey?: string;
  translationValues?: TranslationValues;
};

export type TeamReplacementSuggestions = {
  singles: ReplacementSuggestion[];
  doubles: ReplacementSuggestion[];
};

type TeamAnalysisSnapshot = {
  teamSize: number;
  members: Array<{
    key: string;
    name: string;
    species: string;
    slot: number;
    types: TypeName[];
  }>;
  duplicateTypes: Array<{ type: TypeName; count: number }>;
  attackTypes: TypeName[];
  missingCoverageTypes: TypeName[];
  defensiveMatrix: Array<{
    type: TypeName;
    immuneCount: number;
    doubleResistCount: number;
    resistCount: number;
    weakCount: number;
    quadWeakCount: number;
    severity: "none" | "minor" | "manageable" | "major" | "critical";
  }>;
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

type PhysicalSpecialSplit = NonNullable<TeamAnalysisSnapshot["optional"]>["physicalSpecialSplit"];

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

type MemberSignals = {
  key: string;
  name: string;
  slot: number;
  species: string;
  types: TypeName[];
  attackTypes: TypeName[];
  uniqueCoverageCount: number;
  weakTypes: TypeName[];
  immuneTypes: TypeName[];
  hazardControl: boolean;
  speedControl: boolean;
  protect: boolean;
  support: boolean;
  priority: boolean;
  physicalMoves: number;
  specialMoves: number;
  damagingMoves: number;
  highPowerMoves: number;
  speed: number | null;
  bulky: boolean;
};

type CandidateReason = {
  weight: number;
  key:
    | "sharedWeakness"
    | "spreadWeakness"
    | "groundStack"
    | "typeOverlap"
    | "lowCoverage"
    | "slowFit"
    | "noProtect"
    | "noSupport"
    | "offenseSkew";
  text: string;
};

export function buildTeamReplacementSuggestions(
  party: PartyPokemon[],
  analysis: TeamAnalysisSnapshot,
): TeamReplacementSuggestions {
  const sortedParty = [...party]
    .filter(Boolean)
    .sort((first, second) => first.slot - second.slot)
    .slice(0, 6);
  const memberSignals = buildMemberSignals(sortedParty, analysis);

  if (memberSignals.length === 0) {
    return { singles: [], doubles: [] };
  }

  const topWeakness = [...analysis.defensiveMatrix]
    .filter((entry) => entry.severity === "critical" || entry.severity === "major")
    .sort(sortDefenseEntries)
    .at(0);
  const topSpreadWeakness = [...analysis.defensiveMatrix]
    .filter(
      (entry) =>
        ["ground", "rock", "ice", "water", "fire"].includes(entry.type) &&
        (entry.severity === "critical" || entry.severity === "major"),
    )
    .sort(sortDefenseEntries)
    .at(0);

  const knownMoveMembers = memberSignals.filter((member) => member.damagingMoves > 0).length;
  const hasHazardControl = memberSignals.some((member) => member.hazardControl);
  const hasSpeedControl = memberSignals.some((member) => member.speedControl);
  const hasProtect = memberSignals.some((member) => member.protect);
  const hasSupport = memberSignals.some((member) => member.support);
  const hasPriority = memberSignals.some((member) => member.priority);
  const fastCount = memberSignals.filter((member) => (member.speed ?? 0) >= 100).length;
  const naturalSpeedEdge = fastCount >= 2;
  const split = analysis.optional?.physicalSpecialSplit;
  const duplicateTypeSet = new Set(analysis.duplicateTypes.map(({ type }) => type));

  const singles = scoreSinglesCandidates({
    memberSignals,
    analysis,
    duplicateTypeSet,
    topWeakness,
    hasHazardControl,
    hasSpeedControl,
    hasPriority,
    naturalSpeedEdge,
    split,
  });

  const doubles = scoreDoublesCandidates({
    memberSignals,
    analysis,
    duplicateTypeSet,
    topSpreadWeakness,
    hasSpeedControl,
    hasProtect,
    hasSupport,
    naturalSpeedEdge,
    knownMoveMembers,
  });

  return {
    singles: singles ? [singles] : [],
    doubles: doubles ? [doubles] : [],
  };
}

function scoreSinglesCandidates(input: {
  memberSignals: MemberSignals[];
  analysis: TeamAnalysisSnapshot;
  duplicateTypeSet: Set<TypeName>;
  topWeakness?: TeamAnalysisSnapshot["defensiveMatrix"][number];
  hasHazardControl: boolean;
  hasSpeedControl: boolean;
  hasPriority: boolean;
  naturalSpeedEdge: boolean;
  split?: PhysicalSpecialSplit;
}) {
  const scored = input.memberSignals
    .map((member) => {
      const reasons: CandidateReason[] = [];

      if (input.topWeakness && member.weakTypes.includes(input.topWeakness.type)) {
        reasons.push({
          key: "sharedWeakness",
          weight: input.topWeakness.severity === "critical" ? 4 : 3,
          text: `it is part of the ${formatType(input.topWeakness.type)} weakness stack`,
        });
      }

      if (!input.analysis.immunities.includes("ground") && member.weakTypes.includes("ground")) {
        reasons.push({
          key: "groundStack",
          weight: 3,
          text: "it worsens the Ground matchup without giving the team a Ground immunity",
        });
      }

      const duplicateOverlap = member.types.filter((type) => input.duplicateTypeSet.has(type)).length;
      if (duplicateOverlap > 0) {
        reasons.push({
          key: "typeOverlap",
          weight: duplicateOverlap * 2,
          text: `it overlaps heavily on ${member.types.filter((type) => input.duplicateTypeSet.has(type)).map(formatType).join(", ")}`,
        });
      }

      if (member.uniqueCoverageCount === 0) {
        reasons.push({
          key: "lowCoverage",
          weight: 2,
          text: "it adds very little unique offensive coverage",
        });
      }

      if (!input.hasSpeedControl && !input.hasPriority && !input.naturalSpeedEdge && (member.speed ?? 0) < 95) {
        reasons.push({
          key: "slowFit",
          weight: 2,
          text: "it is too slow for the current pace and does not help the speed problem",
        });
      }

      if (input.split?.leaning === "physical" && member.physicalMoves > member.specialMoves && member.damagingMoves >= 2) {
        reasons.push({
          key: "offenseSkew",
          weight: 1,
          text: "it pushes the team even further toward a physical-only attack profile",
        });
      }

      if (input.split?.leaning === "special" && member.specialMoves > member.physicalMoves && member.damagingMoves >= 2) {
        reasons.push({
          key: "offenseSkew",
          weight: 1,
          text: "it pushes the team even further toward a special-only attack profile",
        });
      }

      if (!input.hasHazardControl && !member.hazardControl && member.uniqueCoverageCount === 0) {
        reasons.push({
          key: "lowCoverage",
          weight: 1,
          text: "it does not help the team's missing utility or hazard control",
        });
      }

      const score = reasons.reduce((total, reason) => total + reason.weight, 0);
      return { member, reasons, score };
    })
    .sort((first, second) => second.score - first.score);

  const top = scored[0];
  if (!top || top.score < 3) {
    return null;
  }

  const dominantReason = top.reasons[0];
  const secondaryReason = top.reasons[1];
  const reasonText = secondaryReason
    ? `${dominantReason.text}, and ${secondaryReason.text}`
    : dominantReason.text;

  const replacement = getSinglesReplacement(top, input);

  return buildReplacementSuggestion({
    id: `singles-${top.member.key}`,
    mode: "singles",
    severity: top.score >= 6 ? "danger" : "warn",
    category: replacement.category,
    replaceCandidate: top.member.name,
    title: `Replace ${top.member.name}`,
    whyReplace: `Replace ${top.member.name} because ${reasonText}.`,
    recommendation: replacement.recommendation,
    expectedImprovement: replacement.expectedImprovement,
    examples: replacement.examples,
    translationKey: "replacement.singlesReplace",
    translationValues: {
      name: top.member.name,
      reason: reasonText,
      replacement: replacement.recommendation,
      improvement: replacement.expectedImprovement,
    },
  });
}

function scoreDoublesCandidates(input: {
  memberSignals: MemberSignals[];
  analysis: TeamAnalysisSnapshot;
  duplicateTypeSet: Set<TypeName>;
  topSpreadWeakness?: TeamAnalysisSnapshot["defensiveMatrix"][number];
  hasSpeedControl: boolean;
  hasProtect: boolean;
  hasSupport: boolean;
  naturalSpeedEdge: boolean;
  knownMoveMembers: number;
}) {
  const scored = input.memberSignals
    .map((member) => {
      const reasons: CandidateReason[] = [];

      if (input.topSpreadWeakness && member.weakTypes.includes(input.topSpreadWeakness.type)) {
        reasons.push({
          key: "spreadWeakness",
          weight: input.topSpreadWeakness.severity === "critical" ? 4 : 3,
          text: `it amplifies the ${formatType(input.topSpreadWeakness.type)} spread-damage weakness`,
        });
      }

      if (!input.hasSpeedControl && !input.naturalSpeedEdge && (member.speed ?? 0) < 95) {
        reasons.push({
          key: "slowFit",
          weight: 2,
          text: "it is slow for a doubles structure that already lacks speed control",
        });
      }

      if (input.knownMoveMembers >= 4 && !input.hasProtect && !member.protect) {
        reasons.push({
          key: "noProtect",
          weight: 1,
          text: "it adds no Protect coverage to a board that already struggles to stall turns cleanly",
        });
      }

      if (!input.hasSupport && !member.support) {
        reasons.push({
          key: "noSupport",
          weight: 2,
          text: "it adds little support value while the team lacks a real enabling slot",
        });
      }

      const duplicateOverlap = member.types.filter((type) => input.duplicateTypeSet.has(type)).length;
      if (duplicateOverlap > 0) {
        reasons.push({
          key: "typeOverlap",
          weight: duplicateOverlap * 2,
          text: `it overlaps heavily on ${member.types.filter((type) => input.duplicateTypeSet.has(type)).map(formatType).join(", ")}`,
        });
      }

      if (member.uniqueCoverageCount === 0 && member.highPowerMoves < 2 && !member.support) {
        reasons.push({
          key: "lowCoverage",
          weight: 2,
          text: "it does not add enough unique pressure or coverage to justify the slot",
        });
      }

      const score = reasons.reduce((total, reason) => total + reason.weight, 0);
      return { member, reasons, score };
    })
    .sort((first, second) => second.score - first.score);

  const top = scored[0];
  if (!top || top.score < 3) {
    return null;
  }

  const dominantReason = top.reasons[0];
  const secondaryReason = top.reasons[1];
  const reasonText = secondaryReason
    ? `${dominantReason.text}, and ${secondaryReason.text}`
    : dominantReason.text;

  const replacement = getDoublesReplacement(top, input);

  return buildReplacementSuggestion({
    id: `doubles-${top.member.key}`,
    mode: "doubles",
    severity: top.score >= 6 ? "danger" : "warn",
    category: replacement.category,
    replaceCandidate: top.member.name,
    title: `Replace ${top.member.name}`,
    whyReplace: `Replace ${top.member.name} because ${reasonText}.`,
    recommendation: replacement.recommendation,
    expectedImprovement: replacement.expectedImprovement,
    examples: replacement.examples,
    translationKey: "replacement.doublesReplace",
    translationValues: {
      name: top.member.name,
      reason: reasonText,
      replacement: replacement.recommendation,
      improvement: replacement.expectedImprovement,
    },
  });
}

function buildMemberSignals(
  party: PartyPokemon[],
  analysis: TeamAnalysisSnapshot,
): MemberSignals[] {
  const perMember = analysis.members.map((member, index) => {
    const pokemon = party[index];
    const moves = pokemon?.moves ?? [];
    const attackTypes = new Set<TypeName>();
    const weakTypes: TypeName[] = [];
    const immuneTypes: TypeName[] = [];
    let hazardControl = false;
    let speedControl = false;
    let protect = false;
    let support = false;
    let priority = false;
    let physicalMoves = 0;
    let specialMoves = 0;
    let damagingMoves = 0;
    let highPowerMoves = 0;

    for (let moveIndex = 0; moveIndex < moves.length; moveIndex += 1) {
      const info = getMoveInfo(moves[moveIndex], moveIndex);
      const moveType = normalizeType(info.type);
      const normalizedName = normalizeMoveName(info.name);
      const damaging = typeof info.power === "number" && info.power > 0;

      if (damaging && moveType) {
        attackTypes.add(moveType);
        damagingMoves += 1;
        if (typeof info.power === "number" && info.power >= 90) {
          highPowerMoves += 1;
        }
      }

      if (info.category?.toLowerCase() === "physical" && damaging) {
        physicalMoves += 1;
      }

      if (info.category?.toLowerCase() === "special" && damaging) {
        specialMoves += 1;
      }

      if (typeof info.priority === "number" && info.priority > 0) {
        priority = true;
      }

      if (HAZARD_CONTROL_MOVES.has(normalizedName)) {
        hazardControl = true;
      }

      if (SPEED_CONTROL_MOVES.has(normalizedName)) {
        speedControl = true;
      }

      if (PROTECT_MOVES.has(normalizedName)) {
        protect = true;
      }

      if (SUPPORT_MOVES.has(normalizedName)) {
        support = true;
      }
    }

    if (attackTypes.size === 0) {
      member.types.forEach((type) => attackTypes.add(type));
    }

    for (const attackingType of [
      "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
      "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
    ] as TypeName[]) {
      const multiplier = combinedEffectiveness(attackingType, member.types);
      if (multiplier > 1) {
        weakTypes.push(attackingType);
      }
      if (multiplier === 0) {
        immuneTypes.push(attackingType);
      }
    }

    return {
      key: member.key,
      name: member.name,
      slot: member.slot,
      species: member.species,
      types: member.types,
      attackTypes: Array.from(attackTypes),
      uniqueCoverageCount: 0,
      weakTypes,
      immuneTypes,
      hazardControl,
      speedControl,
      protect,
      support,
      priority,
      physicalMoves,
      specialMoves,
      damagingMoves,
      highPowerMoves,
      speed: getStatValue(pokemon?.stats, "spe"),
      bulky: isBulkyPokemon(pokemon),
    };
  });

  const coverageByType = new Map<TypeName, string[]>();
  for (const member of perMember) {
    const defended = getCoveredTypes(member.attackTypes);
    for (const type of defended) {
      coverageByType.set(type, [...(coverageByType.get(type) ?? []), member.key]);
    }
  }

  return perMember.map((member) => ({
    ...member,
    uniqueCoverageCount: getCoveredTypes(member.attackTypes).filter(
      (type) => (coverageByType.get(type) ?? []).length === 1,
    ).length,
  }));
}

function getSinglesReplacement(
  top: { member: MemberSignals; reasons: CandidateReason[]; score: number },
  input: {
    analysis: TeamAnalysisSnapshot;
    topWeakness?: TeamAnalysisSnapshot["defensiveMatrix"][number];
    hasHazardControl: boolean;
    hasSpeedControl: boolean;
    hasPriority: boolean;
    naturalSpeedEdge: boolean;
    split?: PhysicalSpecialSplit;
  },
) {
  if (!input.analysis.immunities.includes("ground") && top.member.weakTypes.includes("ground")) {
    return {
      category: "weakness",
      recommendation: "a Ground-immune support or Flying pivot",
      expectedImprovement: "stabilize the Ground matchup and add a safe switch-in",
      examples: ["Flying pivot", "Levitate support", "Ground-immune glue slot"],
    };
  }

  if (input.topWeakness) {
    return {
      category: "weakness",
      recommendation: getWeaknessReplacement(input.topWeakness.type),
      expectedImprovement: `patch the ${formatType(input.topWeakness.type)} matchup and reduce the team's overlap`,
      examples: weaknessExamples(input.topWeakness.type),
    };
  }

  if (!input.hasSpeedControl && !input.hasPriority && !input.naturalSpeedEdge) {
    return {
      category: "speed",
      recommendation: "a fast revenge killer or priority attacker",
      expectedImprovement: "give the team a cleaner late-game speed plan",
      examples: ["Fast cleaner", "Priority user", "Speed-control support"],
    };
  }

  if (input.split?.leaning === "physical") {
    return {
      category: "pressure",
      recommendation: "a reliable special breaker",
      expectedImprovement: "balance the attacking profile and improve wallbreaking",
      examples: ["Special breaker", "Mixed attacker", "Fast special cleaner"],
    };
  }

  if (input.split?.leaning === "special") {
    return {
      category: "pressure",
      recommendation: "a reliable physical breaker",
      expectedImprovement: "balance the attacking profile and improve pressure into special walls",
      examples: ["Physical breaker", "Mixed attacker", "Priority cleaner"],
    };
  }

  if (!input.hasHazardControl) {
    return {
      category: "utility",
      recommendation: "a hazard remover with pivot utility",
      expectedImprovement: "cover hazards while improving team glue",
      examples: ["Defog pivot", "Rapid Spin user", "Utility remover"],
    };
  }

  return {
    category: "overlap",
    recommendation: "a bulky glue slot with a new type profile",
    expectedImprovement: "reduce redundancy and add safer defensive cycling",
    examples: ["Bulky Water pivot", "Steel wall", "Ground-immune support"],
  };
}

function getDoublesReplacement(
  top: { member: MemberSignals; reasons: CandidateReason[]; score: number },
  input: {
    topSpreadWeakness?: TeamAnalysisSnapshot["defensiveMatrix"][number];
    hasSpeedControl: boolean;
    hasProtect: boolean;
    hasSupport: boolean;
    naturalSpeedEdge: boolean;
  },
) {
  if (!input.hasSpeedControl && !input.naturalSpeedEdge) {
    return {
      category: "speed",
      recommendation: "a Tailwind, Icy Wind, Electroweb, or Trick Room support slot",
      expectedImprovement: "give the team a real speed-control mode in doubles",
      examples: ["Tailwind setter", "Icy Wind support", "Trick Room setter"],
    };
  }

  if (input.topSpreadWeakness) {
    return {
      category: "weakness",
      recommendation: "a resist or immunity that stabilizes spread-damage turns",
      expectedImprovement: `reduce the ${formatType(input.topSpreadWeakness.type)} spread weakness and preserve board position`,
      examples: weaknessExamples(input.topSpreadWeakness.type),
    };
  }

  if (!input.hasSupport) {
    return {
      category: "support",
      recommendation: "a board-control support slot with redirection or Helping Hand",
      expectedImprovement: "create cleaner turns for the team's main attacker",
      examples: ["Follow Me", "Rage Powder", "Helping Hand", "Wide Guard"],
    };
  }

  if (!input.hasProtect) {
    return {
      category: "utility",
      recommendation: "a slot that can run Protect cleanly while still enabling partners",
      expectedImprovement: "improve double-target management and tempo control",
      examples: ["Protect attacker", "Support with Protect", "Bulky board-control slot"],
    };
  }

  return {
    category: "pressure",
    recommendation: "a spread-pressure attacker or stronger partner enabler",
    expectedImprovement: "raise immediate pressure and improve pair synergy",
    examples: ["Spread attacker", "Fast support attacker", "Mode-enabling partner"],
  };
}

function buildReplacementSuggestion(input: ReplacementSuggestion): ReplacementSuggestion {
  return input;
}

function getCoveredTypes(attackTypes: TypeName[]) {
  const covered = new Set<TypeName>();
  for (const attackType of attackTypes) {
    for (const defendingType of [
      "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
      "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
    ] as TypeName[]) {
      if (effectiveness(attackType, defendingType) > 1) {
        covered.add(defendingType);
      }
    }
  }
  return Array.from(covered);
}

function normalizeMoveName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeType(value: string | undefined): TypeName | null {
  const normalized = value?.toLowerCase().trim();
  return normalized ? (normalized as TypeName) : null;
}

function isBulkyPokemon(pokemon: PartyPokemon | undefined) {
  const hp = getStatValue(pokemon?.stats, "hp");
  const def = getStatValue(pokemon?.stats, "def");
  const spd = getStatValue(pokemon?.stats, "spd");

  if (hp === null || (def === null && spd === null)) {
    return false;
  }

  return hp >= 85 && Math.max(def ?? 0, spd ?? 0) >= 80;
}

function sortDefenseEntries(
  first: TeamAnalysisSnapshot["defensiveMatrix"][number],
  second: TeamAnalysisSnapshot["defensiveMatrix"][number],
) {
  const severityDelta = defenseSeverityRank(first.severity) - defenseSeverityRank(second.severity);
  if (severityDelta !== 0) {
    return severityDelta;
  }

  return second.weakCount + second.quadWeakCount - (first.weakCount + first.quadWeakCount);
}

function defenseSeverityRank(
  severity: TeamAnalysisSnapshot["defensiveMatrix"][number]["severity"],
) {
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

function formatType(type: TypeName) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function weaknessExamples(type: TypeName) {
  if (type === "ground") {
    return ["Flying pivot", "Levitate support", "Ground-immune glue slot"];
  }

  if (type === "ice" || type === "fairy") {
    return ["Bulky Steel pivot", "Resist support", "Defensive glue slot"];
  }

  if (type === "electric") {
    return ["Ground-type immunity slot", "Volt absorber", "Ground support"];
  }

  return ["Bulky resist", "Defensive pivot", "Support slot"];
}

function getWeaknessReplacement(type: TypeName) {
  if (type === "ice" || type === "fairy") {
    return "a bulky Steel pivot";
  }

  if (type === "fire") {
    return "a bulky Water pivot";
  }

  if (type === "electric") {
    return "a Ground-type immunity slot or Volt blocker";
  }

  if (type === "ground") {
    return "a Ground-immune support or Flying pivot";
  }

  return `a bulky ${formatType(type)}-resistant pivot`;
}
