import type { PartyPokemon } from "@/lib/api/types";
import { PokemonMovesPanel } from "@/components/pokemon/PokemonMovesPanel";
import { SectionPanel } from "@/components/ui/SectionPanel";

type PartyMovesSectionProps = {
  pokemon?: PartyPokemon;
};

export function PartyMovesSection({ pokemon }: PartyMovesSectionProps) {
  return (
    <SectionPanel
      eyebrow="Move Deck"
      title="Moves Screen"
      description="Known moves stay boxed and readable, with deeper move detail on hover."
    >
      <PokemonMovesPanel pokemon={pokemon} />
    </SectionPanel>
  );
}
