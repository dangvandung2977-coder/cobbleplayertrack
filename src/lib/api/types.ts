export type ApiServer = {
  id: string;
  name: string;
  ip: string | null;
  mcVersion: string;
  cobblemonVersion: string;
  modVersion: string;
  online: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
};

export type ServerSummary = ApiServer & {
  trackedPlayerCount?: number;
};

export type ServersListResponse = {
  servers: ApiServer[];
};

export type ApiPlayer = {
  uuid: string;
  name: string;
  serverId: string;
  skinUrl: string | null;
  firstSeen: string;
  lastSeen: string;
  isOnline: boolean;
};

export type ServerPlayersResponse = {
  serverId: string;
  players: ApiPlayer[];
};

export type StatSpread = {
  hp?: number | null;
  atk?: number | null;
  def?: number | null;
  spa?: number | null;
  spd?: number | null;
  spe?: number | null;
};

export type MoveValue =
  | string
  | {
      name?: string | null;
      move?: string | null;
      id?: string | null;
      type?: string | null;
      moveType?: string | null;
      category?: string | null;
      damageClass?: string | null;
      pp?: number | null;
      currentPp?: number | null;
      currentPP?: number | null;
      maxPp?: number | null;
      maxPP?: number | null;
      basePower?: number | string | null;
      power?: number | string | null;
      accuracy?: number | string | boolean | null;
      effect?: string | null;
      shortDesc?: string | null;
      desc?: string | null;
      description?: string | null;
      priority?: number | null;
      target?: string | null;
    };

export type PartyPokemon = {
  slot: number;
  species: string;
  dexNumber?: number | null;
  nickname?: string | null;
  level: number;
  gender?: string | null;
  nature?: string | null;
  ability?: string | null;
  heldItem?: string | null;
  form?: string | null;
  shiny: boolean;
  moves: MoveValue[];
  ivs?: StatSpread | null;
  evs?: StatSpread | null;
  stats?: StatSpread | null;
  hpCurrent?: number | null;
  hpMax?: number | null;
  type?: string | null;
  types?: string[] | string | null;
  primaryType?: string | null;
  secondaryType?: string | null;
  type1?: string | null;
  type2?: string | null;
  spriteUrl?: string | null;
  imageUrl?: string | null;
  portraitUrl?: string | null;
  iconUrl?: string | null;
  renderUrl?: string | null;
  speciesSpriteUrl?: string | null;
  [key: string]: unknown;
};

export type PartyResponse = {
  playerUuid: string;
  party: PartyPokemon[];
};

export type PokedexEntry = {
  species: string;
  dexNumber?: number | null;
  unlocked: boolean;
  caught: boolean;
  seen?: boolean | null;
};

export type PokedexResponse = {
  playerUuid: string;
  entries: PokedexEntry[];
};
