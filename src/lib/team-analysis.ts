import type { PartyPokemon } from "@/lib/api/types";
import type { TranslationValues } from "@/lib/i18n";
import {
  buildTeamReplacementSuggestions,
  buildTeamRebuildSuggestions,
  type ReplacementSuggestion,
  type TeamReplacementSuggestions,
  type RebuildSuggestion,
  type TeamRebuildSuggestions,
} from "@/lib/team-analyze";
import { getMoveInfo, getPokemonDisplayName, getPokemonSpriteUrl, getPokemonTypes, getStatValue } from "@/lib/pokemon";
import {
  combinedEffectiveness,
  effectiveness,
  normalizeTypeName,
  TYPE_NAMES,
  type TypeName,
} from "@/lib/type-chart";

export type AnalysisBadge = {
  id: string;
  label: string;
  severity: "good" | "info" | "warn" | "danger";
  reason: string;
  translationKey?: string;
  translationValues?: TranslationValues;
};

export type TeamDefenseEntry = {
  type: TypeName;
  immuneCount: number;
  doubleResistCount: number;
  resistCount: number;
  neutralCount: number;
  weakCount: number;
  quadWeakCount: number;
  severity: "none" | "minor" | "manageable" | "major" | "critical";
};

export type TeamOffenseEntry = {
  defendingType: TypeName;
  sourceCount: number;
  status: "missing" | "basic" | "strong";
};

export type TeamAnalysisMember = {
  key: string;
  name: string;
  species: string;
  slot: number;
  dexNumber?: number | null;
  spriteUrl: string | null;
  types: TypeName[];
  duplicateTypes: TypeName[];
};

export type TeamAnalysisResult = {
  teamSize: number;
  dataLevel: "types" | "types+moves" | "types+moves+stats";
  members: TeamAnalysisMember[];
  uniqueTypes: TypeName[];
  typeCounts: Array<{ type: TypeName; count: number }>;
  duplicateTypes: Array<{ type: TypeName; count: number }>;
  attackTypes: TypeName[];
  offenseMatrix: TeamOffenseEntry[];
  missingCoverageTypes: TypeName[];
  strongCoverageTypes: TypeName[];
  defensiveMatrix: TeamDefenseEntry[];
  resistHighlights: TypeName[];
  immunities: TypeName[];
  badges: AnalysisBadge[];
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
  rebuildSuggestions: TeamRebuildSuggestions;
  replacementSuggestions: TeamReplacementSuggestions;
};

export type {
  RebuildSuggestion,
  TeamRebuildSuggestions,
  ReplacementSuggestion,
  TeamReplacementSuggestions,
};

type PhysicalSpecialSplit = NonNullable<TeamAnalysisResult["optional"]>["physicalSpecialSplit"];
type SpeedProfile = NonNullable<TeamAnalysisResult["optional"]>["speedProfile"];

type AttackSource = {
  memberKey: string;
  type: TypeName;
};

const BADGE_SEVERITY_RANK: Record<AnalysisBadge["severity"], number> = {
  danger: 0,
  warn: 1,
  good: 2,
  info: 3,
};

export function analyzeTeam(party: PartyPokemon[]): TeamAnalysisResult {
  const sortedParty = party
    .filter(Boolean)
    .sort((first, second) => first.slot - second.slot)
    .slice(0, 6);
  const members = sortedParty.map((pokemon, index): TeamAnalysisMember => {
      const types = getPokemonTypes(pokemon).flatMap((type) => {
        const normalized = normalizeTypeName(type);
        return normalized ? [normalized] : [];
      });

      return {
        key: `${pokemon.slot}-${pokemon.species}-${index}`,
        name: getPokemonDisplayName(pokemon),
        species: pokemon.species,
        slot: pokemon.slot,
        dexNumber: pokemon.dexNumber,
        spriteUrl: getPokemonSpriteUrl(pokemon),
        types: types.slice(0, 2),
        duplicateTypes: [],
      };
    });

  const typeCounts = countTypes(members);
  const duplicateTypes = typeCounts.filter(({ count }) => count >= 2);
  const duplicateTypeSet = new Set(duplicateTypes.map(({ type }) => type));
  const uniqueTypes = typeCounts.map(({ type }) => type);
  const membersWithDuplicates = members.map((member) => ({
    ...member,
    duplicateTypes: member.types.filter((type) => duplicateTypeSet.has(type)),
  }));

  const moveSources = collectMoveAttackSources(sortedParty, membersWithDuplicates);
  const attackSources = moveSources.length > 0 ? moveSources : collectStabAttackSources(membersWithDuplicates);
  const attackTypes = uniqueByType(attackSources.map((source) => source.type));
  const offenseMatrix = buildOffenseMatrix(attackSources);
  const missingCoverageTypes = offenseMatrix
    .filter((entry) => entry.status === "missing")
    .map((entry) => entry.defendingType);
  const strongCoverageTypes = offenseMatrix
    .filter((entry) => entry.status === "strong")
    .map((entry) => entry.defendingType);

  const defensiveMatrix = buildDefenseMatrix(membersWithDuplicates);
  const resistHighlights = defensiveMatrix
    .filter((entry) => {
      const hasResistSpread = entry.resistCount + entry.doubleResistCount >= 2;
      const hasImmunityAndResist = entry.immuneCount >= 1 && entry.resistCount + entry.doubleResistCount >= 1;
      const hasSafeDoubleResist =
        entry.doubleResistCount >= 1 && entry.severity !== "major" && entry.severity !== "critical";
      return hasResistSpread || hasImmunityAndResist || hasSafeDoubleResist;
    })
    .map((entry) => entry.type);
  const immunities = defensiveMatrix.filter((entry) => entry.immuneCount > 0).map((entry) => entry.type);
  const physicalSpecialSplit = buildPhysicalSpecialSplit(sortedParty);
  const speedProfile = buildSpeedProfile(sortedParty);

  const badges = buildBadges({
    teamSize: membersWithDuplicates.length,
    uniqueTypes,
    duplicateTypes,
    offenseMatrix,
    missingCoverageTypes,
    strongCoverageTypes,
    defensiveMatrix,
    resistHighlights,
    immunities,
    physicalSpecialSplit,
    speedProfile,
  });

  const core: Omit<TeamAnalysisResult, "rebuildSuggestions" | "replacementSuggestions"> = {
    teamSize: membersWithDuplicates.length,
    dataLevel: speedProfile ? "types+moves+stats" : moveSources.length > 0 ? "types+moves" : "types",
    members: membersWithDuplicates,
    uniqueTypes,
    typeCounts,
    duplicateTypes,
    attackTypes,
    offenseMatrix,
    missingCoverageTypes,
    strongCoverageTypes,
    defensiveMatrix,
    resistHighlights,
    immunities,
    badges,
    optional: {
      ...(physicalSpecialSplit ? { physicalSpecialSplit } : {}),
      ...(speedProfile ? { speedProfile } : {}),
    },
  };

  return {
    ...core,
    rebuildSuggestions: buildTeamRebuildSuggestions(sortedParty, core),
    replacementSuggestions: buildTeamReplacementSuggestions(sortedParty, core),
  };
}

function countTypes(members: TeamAnalysisMember[]) {
  const counts = new Map<TypeName, number>();

  for (const member of members) {
    for (const type of member.types) {
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }

  return TYPE_NAMES.map((type) => ({ type, count: counts.get(type) ?? 0 })).filter(({ count }) => count > 0);
}

function collectMoveAttackSources(party: PartyPokemon[], members: TeamAnalysisMember[]): AttackSource[] {
  const sources: AttackSource[] = [];

  party
    .slice(0, 6)
    .forEach((pokemon, pokemonIndex) => {
      const member = members[pokemonIndex];
      if (!member) {
        return;
      }

      for (const move of pokemon.moves ?? []) {
        const moveInfo = getMoveInfo(move, 0);
        const moveType = normalizeTypeName(moveInfo.type);
        if (!moveType || !isDamagingPower(moveInfo.power)) {
          continue;
        }

        sources.push({ memberKey: member.key, type: moveType });
      }
    });

  return uniqueAttackSources(sources);
}

function collectStabAttackSources(members: TeamAnalysisMember[]): AttackSource[] {
  return members.flatMap((member) => member.types.map((type) => ({ memberKey: member.key, type })));
}

function uniqueAttackSources(sources: AttackSource[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.memberKey}-${source.type}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function uniqueByType(types: TypeName[]) {
  return TYPE_NAMES.filter((type) => types.includes(type));
}

function isDamagingPower(power: number | string | undefined) {
  return typeof power === "number" && power > 0;
}

function buildOffenseMatrix(attackSources: AttackSource[]): TeamOffenseEntry[] {
  return TYPE_NAMES.map((defendingType) => {
    const sourceCount = attackSources.filter((source) => effectiveness(source.type, defendingType) > 1).length;

    return {
      defendingType,
      sourceCount,
      status: sourceCount >= 2 ? "strong" : sourceCount === 1 ? "basic" : "missing",
    };
  });
}

function buildDefenseMatrix(members: TeamAnalysisMember[]): TeamDefenseEntry[] {
  return TYPE_NAMES.map((attackingType) => {
    const entry: TeamDefenseEntry = {
      type: attackingType,
      immuneCount: 0,
      doubleResistCount: 0,
      resistCount: 0,
      neutralCount: 0,
      weakCount: 0,
      quadWeakCount: 0,
      severity: "none",
    };

    for (const member of members) {
      const multiplier = combinedEffectiveness(attackingType, member.types);
      if (multiplier === 0) {
        entry.immuneCount += 1;
      } else if (multiplier < 0.5) {
        entry.doubleResistCount += 1;
      } else if (multiplier === 0.5) {
        entry.resistCount += 1;
      } else if (multiplier === 1) {
        entry.neutralCount += 1;
      } else if (multiplier >= 4) {
        entry.quadWeakCount += 1;
      } else if (multiplier === 2) {
        entry.weakCount += 1;
      }
    }

    entry.severity = classifyWeaknessSeverity(entry);
    return entry;
  });
}

function classifyWeaknessSeverity(entry: Pick<TeamDefenseEntry, "immuneCount" | "resistCount" | "doubleResistCount" | "weakCount" | "quadWeakCount">): TeamDefenseEntry["severity"] {
  const totalWeak = entry.weakCount + entry.quadWeakCount;
  const resistOrImmuneCount = entry.immuneCount + entry.resistCount + entry.doubleResistCount;

  if (
    totalWeak >= 3 ||
    (entry.weakCount >= 2 && entry.quadWeakCount >= 1) ||
    (entry.quadWeakCount >= 1 && resistOrImmuneCount === 0)
  ) {
    return "critical";
  }

  if (totalWeak >= 2 && entry.immuneCount === 0) {
    return "major";
  }

  if (totalWeak >= 2 && resistOrImmuneCount >= 1) {
    return "manageable";
  }

  if (totalWeak === 1) {
    return "minor";
  }

  return "none";
}

function buildPhysicalSpecialSplit(party: PartyPokemon[]): PhysicalSpecialSplit | null {
  let physical = 0;
  let special = 0;
  let status = 0;

  for (const pokemon of party.slice(0, 6)) {
    for (const move of pokemon.moves ?? []) {
      const moveInfo = getMoveInfo(move, 0);
      if (moveInfo.category?.toLowerCase() === "physical" && isDamagingPower(moveInfo.power)) {
        physical += 1;
      } else if (moveInfo.category?.toLowerCase() === "special" && isDamagingPower(moveInfo.power)) {
        special += 1;
      } else if (moveInfo.category?.toLowerCase() === "status") {
        status += 1;
      }
    }
  }

  const damagingTotal = physical + special;
  if (damagingTotal === 0) {
    return null;
  }

  const physicalRatio = physical / damagingTotal;
  const specialRatio = special / damagingTotal;

  return {
    physical,
    special,
    status,
    leaning: physicalRatio >= 0.7 ? "physical" : specialRatio >= 0.7 ? "special" : "mixed",
  };
}

function buildSpeedProfile(party: PartyPokemon[]): SpeedProfile | null {
  const speedValues = party
    .slice(0, 6)
    .map((pokemon) => getStatValue(pokemon.stats, "spe"))
    .filter((value): value is number => value !== null);
  const requiredKnownSpeeds = Math.max(2, Math.ceil(Math.min(party.length, 6) / 2));

  if (speedValues.length < requiredKnownSpeeds) {
    return null;
  }

  const profile = {
    slow: speedValues.filter((speed) => speed < 70).length,
    mid: speedValues.filter((speed) => speed >= 70 && speed <= 99).length,
    fast: speedValues.filter((speed) => speed >= 100 && speed <= 119).length,
    veryFast: speedValues.filter((speed) => speed >= 120).length,
  };

  const fastCount = profile.fast + profile.veryFast;
  const label =
    fastCount >= 2
      ? "Fast team core"
      : fastCount === 0
        ? "Slow team overall"
        : profile.veryFast >= 1 && profile.slow >= 2
          ? "Uneven speed profile"
          : "Mixed speed profile";

  return {
    ...profile,
    label,
  };
}

function buildBadges(input: {
  teamSize: number;
  uniqueTypes: TypeName[];
  duplicateTypes: Array<{ type: TypeName; count: number }>;
  offenseMatrix: TeamOffenseEntry[];
  missingCoverageTypes: TypeName[];
  strongCoverageTypes: TypeName[];
  defensiveMatrix: TeamDefenseEntry[];
  resistHighlights: TypeName[];
  immunities: TypeName[];
  physicalSpecialSplit: PhysicalSpecialSplit | null;
  speedProfile: SpeedProfile | null;
}) {
  const badges: AnalysisBadge[] = [];
  const addBadge = (badge: AnalysisBadge) => badges.push(badge);
  const hasStrongCoverage = (type: TypeName) => input.strongCoverageTypes.includes(type);
  const isMissingCoverage = (type: TypeName) => input.missingCoverageTypes.includes(type);
  const defenseFor = (type: TypeName) => input.defensiveMatrix.find((entry) => entry.type === type);

  if (input.uniqueTypes.length >= 8) {
    addBadge({
      id: "good-type-variety",
      label: "Good type variety",
      severity: "good",
      reason: `${input.uniqueTypes.length} unique team types are represented.`,
      translationKey: "analyzeBadges.goodTypeVariety",
      translationValues: { count: input.uniqueTypes.length },
    });
  }

  if (input.uniqueTypes.length <= 5 && input.teamSize >= 4) {
    addBadge({
      id: "low-type-variety",
      label: "Low type variety",
      severity: "warn",
      reason: `Only ${input.uniqueTypes.length} unique team types are represented.`,
      translationKey: "analyzeBadges.lowTypeVariety",
      translationValues: { count: input.uniqueTypes.length },
    });
  }

  for (const duplicate of input.duplicateTypes.filter(({ count }) => count >= 3)) {
    addBadge({
      id: `heavy-${duplicate.type}-overlap`,
      label: `Heavy ${formatType(duplicate.type)} overlap`,
      severity: "warn",
      reason: `${duplicate.count} party type slots are ${formatType(duplicate.type)}.`,
      translationKey: "analyzeBadges.heavyTypeOverlap",
      translationValues: { type: formatType(duplicate.type), count: duplicate.count },
    });
  }

  if (hasStrongCoverage("fire")) {
    addBadge({
      id: "good-fire-coverage",
      label: "Good Fire coverage",
      severity: "good",
      reason: "At least two attack sources hit Fire super effectively.",
      translationKey: "analyzeBadges.goodFireCoverage",
    });
  }

  if (hasStrongCoverage("ice")) {
    addBadge({
      id: "good-ice-coverage",
      label: "Good Ice coverage",
      severity: "good",
      reason: "At least two attack sources hit Ice super effectively.",
      translationKey: "analyzeBadges.goodIceCoverage",
    });
  }

  if (input.offenseMatrix.find((entry) => entry.defendingType === "ground")?.status === "strong") {
    addBadge({
      id: "strong-ground-pressure",
      label: "Strong Ground pressure",
      severity: "good",
      reason: "At least two attack sources hit Ground super effectively.",
      translationKey: "analyzeBadges.strongGroundPressure",
    });
  }

  if (isMissingCoverage("ground")) {
    addBadge({
      id: "missing-ground-coverage",
      label: "Missing Ground coverage",
      severity: "warn",
      reason: "No current attack source hits Ground super effectively.",
      translationKey: "analyzeBadges.missingGroundCoverage",
    });
  }

  if (isMissingCoverage("ice")) {
    addBadge({
      id: "missing-ice-coverage",
      label: "Missing Ice coverage",
      severity: "warn",
      reason: "No current attack source hits Ice super effectively.",
      translationKey: "analyzeBadges.missingIceCoverage",
    });
  }

  if (["water", "flying", "steel"].every((type) => !isMissingCoverage(type as TypeName))) {
    addBadge({
      id: "strong-general-coverage-core",
      label: "Strong general coverage core",
      severity: "good",
      reason: "Water, Flying, and Steel all have at least one super-effective answer.",
      translationKey: "analyzeBadges.strongGeneralCoverageCore",
    });
  }

  if (input.missingCoverageTypes.length >= 6) {
    addBadge({
      id: "shallow-offensive-coverage",
      label: "Shallow offensive coverage",
      severity: "warn",
      reason: `${input.missingCoverageTypes.length} defending types currently lack a super-effective answer.`,
      translationKey: "analyzeBadges.shallowOffensiveCoverage",
      translationValues: { count: input.missingCoverageTypes.length },
    });
  } else if (input.missingCoverageTypes.length <= 2) {
    addBadge({
      id: "broad-offensive-coverage",
      label: "Broad offensive coverage",
      severity: "good",
      reason: `${input.missingCoverageTypes.length} defending types are missing super-effective coverage.`,
      translationKey: "analyzeBadges.broadOffensiveCoverage",
      translationValues: { count: input.missingCoverageTypes.length },
    });
  }

  for (const type of ["ice", "rock"] as TypeName[]) {
    const defense = defenseFor(type);
    if (defense?.severity === "critical" || defense?.severity === "major") {
      addBadge({
        id: `weak-to-${type}`,
        label: `Weak to ${formatType(type)}`,
        severity: defense.severity === "critical" ? "danger" : "warn",
        reason: `${defense.weakCount + defense.quadWeakCount} members are weak to ${formatType(type)}.`,
        translationKey: "analyzeBadges.weakToType",
        translationValues: {
          type: formatType(type),
          count: defense.weakCount + defense.quadWeakCount,
        },
      });
    }
  }

  for (const type of ["electric", "ground"] as TypeName[]) {
    const defense = defenseFor(type);
    if (defense && defense.weakCount + defense.quadWeakCount >= 3) {
      addBadge({
        id: `too-many-${type}-weaknesses`,
        label: `Too many shared ${formatType(type)} weaknesses`,
        severity: "danger",
        reason: `${defense.weakCount + defense.quadWeakCount} members are weak to ${formatType(type)}.`,
        translationKey: "analyzeBadges.tooManyTypeWeaknesses",
        translationValues: {
          type: formatType(type),
          count: defense.weakCount + defense.quadWeakCount,
        },
      });
    }
  }

  const waterDefense = defenseFor("water");
  if (waterDefense && waterDefense.resistCount + waterDefense.doubleResistCount + waterDefense.immuneCount >= 2) {
    addBadge({
      id: "good-water-resistance-spread",
      label: "Good Water resistance spread",
      severity: "good",
      reason: "At least two team members resist or ignore Water.",
      translationKey: "analyzeBadges.goodWaterResistanceSpread",
    });
  }

  if (input.immunities.includes("ground")) {
    addBadge({
      id: "has-ground-immunity",
      label: "Has Ground immunity",
      severity: "good",
      reason: "At least one member is immune to Ground.",
      translationKey: "analyzeBadges.hasGroundImmunity",
    });
  } else {
    addBadge({
      id: "no-ground-immunity",
      label: "No Ground immunity",
      severity: "warn",
      reason: "No team member is immune to Ground attacks.",
      translationKey: "analyzeBadges.noGroundImmunity",
    });
  }

  if (input.immunities.includes("electric")) {
    addBadge({
      id: "has-electric-immunity",
      label: "Has Electric immunity",
      severity: "good",
      reason: "At least one member is immune to Electric.",
      translationKey: "analyzeBadges.hasElectricImmunity",
    });
  }

  if (input.physicalSpecialSplit) {
    if (input.physicalSpecialSplit.leaning === "physical") {
      addBadge({
        id: "offense-heavily-physical",
        label: "Offense heavily physical",
        severity: "warn",
        reason: "At least 70% of damaging known moves are Physical.",
        translationKey: "analyzeBadges.offenseHeavilyPhysical",
      });
    } else if (input.physicalSpecialSplit.leaning === "special") {
      addBadge({
        id: "offense-heavily-special",
        label: "Offense heavily special",
        severity: "warn",
        reason: "At least 70% of damaging known moves are Special.",
        translationKey: "analyzeBadges.offenseHeavilySpecial",
      });
    } else {
      addBadge({
        id: "balanced-offensive-spread",
        label: "Balanced offensive spread",
        severity: "good",
        reason: "Known damaging moves include both Physical and Special pressure.",
        translationKey: "analyzeBadges.balancedOffensiveSpread",
      });
    }
  }

  if (input.speedProfile) {
    if (input.speedProfile.label === "Fast team core") {
      addBadge({
        id: "fast-team-core",
        label: "Fast team core",
        severity: "good",
        reason: "At least two known Speed stats are 100 or higher.",
        translationKey: "analyzeBadges.fastTeamCore",
      });
    } else if (input.speedProfile.label === "Slow team overall") {
      addBadge({
        id: "slow-team-overall",
        label: "Slow team overall",
        severity: "warn",
        reason: "No known Speed stat is 100 or higher.",
        translationKey: "analyzeBadges.slowTeamOverall",
      });
    } else if (input.speedProfile.label === "Uneven speed profile") {
      addBadge({
        id: "uneven-speed-profile",
        label: "Uneven speed profile",
        severity: "info",
        reason: "The team has one very fast member and multiple slow members.",
        translationKey: "analyzeBadges.unevenSpeedProfile",
      });
    }
  }

  return badges
    .sort((first, second) => {
      const severityDelta = BADGE_SEVERITY_RANK[first.severity] - BADGE_SEVERITY_RANK[second.severity];
      return severityDelta !== 0 ? severityDelta : first.label.localeCompare(second.label);
    })
    .slice(0, 8);
}

function formatType(type: TypeName) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
