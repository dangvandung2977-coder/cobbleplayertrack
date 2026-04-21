import type { MoveValue, PartyPokemon, StatSpread } from "@/lib/api/types";
import moveData from "@/data/move-data.json";
import pokemonTypeMap from "@/data/pokemon-types.json";

export const STAT_KEYS = ["hp", "atk", "def", "spa", "spd", "spe"] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export const STAT_LABELS: Record<StatKey, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "Sp.Atk",
  spd: "Sp.Def",
  spe: "Speed",
};

export type MoveInfo = {
  name: string;
  type?: string;
  category?: string;
  damageStat?: string;
  pp?: number;
  maxPp?: number;
  power?: number | string;
  powerLabel?: string;
  accuracy?: number | string;
  accuracyLabel?: string;
  effect?: string;
  priority?: number;
  target?: string;
  multiHitLabel?: string;
  effectChanceLabel?: string;
};

type MoveDexEntry = {
  name: string;
  type?: string;
  category?: string;
  basePower?: number;
  accuracy?: number | boolean;
  pp?: number;
  priority?: number;
  target?: string;
  effect?: string;
  variablePower?: boolean;
  fixedDamage?: boolean;
  multiHit?: number | number[];
  effectChances?: number[];
  critRatio?: number;
};

const POKEMON_TYPE_MAP = pokemonTypeMap as Record<string, string[]>;
const MOVE_DEX = moveData as Record<string, MoveDexEntry>;

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readPower(value: unknown): number | string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return undefined;
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function normalizeLookupKey(value: string | null | undefined) {
  return (value ?? "")
    .split(":")
    .at(-1)
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "") ?? "";
}

function normalizeAssetSlug(value: string | null | undefined) {
  return (value ?? "")
    .split(":")
    .at(-1)
    ?.toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") ?? "";
}

function getMoveDexEntry(value: string | null | undefined) {
  const key = normalizeLookupKey(value);
  return key ? MOVE_DEX[key] : undefined;
}

function normalizeCategory(value: string | undefined) {
  const normalized = value?.toLowerCase();
  if (normalized === "physical") {
    return "Physical";
  }

  if (normalized === "special") {
    return "Special";
  }

  if (normalized === "status") {
    return "Status";
  }

  return value ? titleCaseIdentifier(value) : undefined;
}

function getDamageStat(category: string | undefined) {
  switch (category?.toLowerCase()) {
    case "physical":
      return "Atk";
    case "special":
      return "Sp.Atk";
    case "status":
      return "Status";
    default:
      return undefined;
  }
}

function formatAccuracyLabel(value: number | string | boolean | undefined) {
  if (value === true) {
    return "Always";
  }

  if (value === undefined || value === false) {
    return "--";
  }

  if (typeof value === "number") {
    return `${value}%`;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "--";
  }

  const numericValue = Number(trimmed);
  if (Number.isFinite(numericValue)) {
    return `${numericValue}%`;
  }

  return trimmed;
}

function formatPowerLabel(
  power: number | string | undefined,
  category: string | undefined,
  effect: string | undefined,
  dexEntry: MoveDexEntry | undefined,
) {
  if (category?.toLowerCase() === "status") {
    return "--";
  }

  if (typeof power === "number" && power > 0) {
    return power.toString();
  }

  if (typeof power === "string" && power.trim()) {
    return power.trim();
  }

  const effectText = effect?.toLowerCase() ?? "";
  if (dexEntry?.variablePower || effectText.includes("more power") || effectText.includes("varies")) {
    return "Variable";
  }

  if (dexEntry?.fixedDamage || effectText.includes("damage equal to") || effectText.includes("fixed damage")) {
    return "Fixed";
  }

  if (typeof power === "number" && power === 0) {
    return "Rule";
  }

  return "--";
}

function formatMultiHitLabel(value: MoveDexEntry["multiHit"]) {
  if (Array.isArray(value)) {
    return `${value[0]}-${value[1]} hits`;
  }

  return typeof value === "number" ? `${value} hits` : undefined;
}

function formatEffectChanceLabel(value: number[] | undefined) {
  if (!value?.length) {
    return undefined;
  }

  return value.map((chance) => `${chance}%`).join("/");
}

export function titleCaseIdentifier(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  const trimmed = value.split(":").at(-1)?.trim() ?? value.trim();
  if (!trimmed) {
    return "Unknown";
  }

  return trimmed
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPokemonDisplayName(pokemon: PartyPokemon | undefined) {
  if (!pokemon) {
    return "No Pokemon";
  }

  return pokemon.nickname?.trim() || titleCaseIdentifier(pokemon.species);
}

export function getPokemonSpeciesName(pokemon: PartyPokemon | undefined) {
  return pokemon ? titleCaseIdentifier(pokemon.species) : "Unknown";
}

export function getDexNumber(pokemon: PartyPokemon | undefined) {
  if (!pokemon?.dexNumber) {
    return "Unknown";
  }

  return `#${pokemon.dexNumber.toString().padStart(4, "0")}`;
}

function collectTypeValues(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTypeValues(item));
  }

  if (typeof value === "string") {
    return value
      .split(/[,\s/]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const record = readRecord(value);
  if (record) {
    return collectTypeValues(record.name ?? record.type ?? record.id);
  }

  return [];
}

export function getPokemonTypes(pokemon: PartyPokemon | undefined) {
  if (!pokemon) {
    return [];
  }

  const values = [
    pokemon.types,
    pokemon.type,
    pokemon.primaryType,
    pokemon.secondaryType,
    pokemon.type1,
    pokemon.type2,
    pokemon.pokemonTypes,
  ].flatMap((value) => collectTypeValues(value));

  const backendTypes = Array.from(new Set(values.map((value) => value.toLowerCase()))).slice(0, 2);
  if (backendTypes.length > 0) {
    return backendTypes;
  }

  return POKEMON_TYPE_MAP[normalizeLookupKey(pokemon.species)] ?? [];
}

export function getPokemonSpriteUrl(pokemon: PartyPokemon | undefined) {
  if (!pokemon) {
    return null;
  }

  const localIcon = getLocalPokemonIconUrl(pokemon);
  const candidates = [
    localIcon,
    pokemon.spriteUrl,
    pokemon.imageUrl,
    pokemon.portraitUrl,
    pokemon.iconUrl,
    pokemon.renderUrl,
    pokemon.speciesSpriteUrl,
    pokemon.sprite,
    pokemon.textureUrl,
  ];

  for (const candidate of candidates) {
    const url = readString(candidate);
    if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
      return url;
    }
  }

  return null;
}

export function getLocalPokemonIconUrl(pokemon: PartyPokemon | undefined) {
  if (!pokemon?.dexNumber) {
    return null;
  }

  const slug = normalizeAssetSlug(pokemon.species);
  if (!slug) {
    return null;
  }

  const dex = pokemon.dexNumber.toString().padStart(4, "0");
  const variant = pokemon.shiny ? "shiny" : "regular";
  const shinySuffix = pokemon.shiny ? "_shiny" : "";

  return `/assets/cobblemon/pokemon-icons/${variant}/${dex}_${slug}${shinySuffix}.png`;
}

export function getMoveInfo(move: MoveValue | undefined, index: number): MoveInfo {
  if (!move) {
    return { name: `Move ${index + 1}` };
  }

  if (typeof move === "string") {
    const dexEntry = getMoveDexEntry(move);
    const name = dexEntry?.name ?? titleCaseIdentifier(move);
    const category = normalizeCategory(dexEntry?.category);
    const power = dexEntry?.basePower;
    const accuracy = dexEntry?.accuracy;

    return {
      name,
      type: dexEntry?.type,
      category,
      damageStat: getDamageStat(category),
      maxPp: dexEntry?.pp,
      power,
      powerLabel: formatPowerLabel(power, category, dexEntry?.effect, dexEntry),
      accuracy: typeof accuracy === "boolean" ? undefined : accuracy,
      accuracyLabel: formatAccuracyLabel(accuracy),
      effect: dexEntry?.effect,
      priority: dexEntry?.priority,
      target: dexEntry?.target,
      multiHitLabel: formatMultiHitLabel(dexEntry?.multiHit),
      effectChanceLabel: formatEffectChanceLabel(dexEntry?.effectChances),
    };
  }

  const name = readString(move.name) ?? readString(move.move) ?? readString(move.id) ?? `Move ${index + 1}`;
  const dexEntry = getMoveDexEntry(name);
  const category = normalizeCategory(readString(move.category) ?? readString(move.damageClass) ?? dexEntry?.category);
  const power = readPower(move.power) ?? readPower(move.basePower) ?? dexEntry?.basePower;
  const accuracy = move.accuracy ?? dexEntry?.accuracy;
  const effect =
    readString(move.effect) ??
    readString(move.shortDesc) ??
    readString(move.description) ??
    readString(move.desc) ??
    dexEntry?.effect;

  return {
    name: dexEntry?.name ?? titleCaseIdentifier(name),
    type: readString(move.type) ?? readString(move.moveType) ?? dexEntry?.type,
    category,
    damageStat: getDamageStat(category),
    pp: readNumber(move.pp) ?? readNumber(move.currentPp) ?? readNumber(move.currentPP),
    maxPp: readNumber(move.maxPp) ?? readNumber(move.maxPP) ?? dexEntry?.pp,
    power,
    powerLabel: formatPowerLabel(power, category, effect, dexEntry),
    accuracy: typeof accuracy === "boolean" ? undefined : accuracy,
    accuracyLabel: formatAccuracyLabel(accuracy),
    effect,
    priority: readNumber(move.priority) ?? dexEntry?.priority,
    target: readString(move.target) ?? dexEntry?.target,
    multiHitLabel: formatMultiHitLabel(dexEntry?.multiHit),
    effectChanceLabel: formatEffectChanceLabel(dexEntry?.effectChances),
  };
}

export function getStatValue(spread: StatSpread | null | undefined, key: StatKey) {
  const value = spread?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function getStatTotal(spread: StatSpread | null | undefined) {
  return STAT_KEYS.reduce((total, key) => total + (getStatValue(spread, key) ?? 0), 0);
}

export function hasAnyStats(spread: StatSpread | null | undefined) {
  return STAT_KEYS.some((key) => getStatValue(spread, key) !== null);
}

export function getInitials(value: string) {
  return titleCaseIdentifier(value)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function formatPokemonValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  return titleCaseIdentifier(value);
}
