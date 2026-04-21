import type { PartyPokemon } from "@/lib/api/types";
import { PokemonStatsPanel } from "@/components/pokemon/PokemonStatsPanel";
import { SectionPanel } from "@/components/ui/SectionPanel";

type PartyStatsSectionProps = {
  pokemon?: PartyPokemon;
};

export function PartyStatsSection({ pokemon }: PartyStatsSectionProps) {
  return (
    <SectionPanel
      eyebrow="Party Stats"
      title="Stats Screen"
      description="Switch between tracked stats, IVs, EVs, and extra slot context."
    >
      <PokemonStatsPanel pokemon={pokemon} />
    </SectionPanel>
  );
}
