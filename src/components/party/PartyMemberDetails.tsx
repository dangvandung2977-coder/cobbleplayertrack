import type { ApiPlayer, PartyPokemon } from "@/lib/api/types";
import { PokemonSummaryPanel } from "@/components/pokemon/PokemonSummaryPanel";
import { SectionPanel } from "@/components/ui/SectionPanel";

type PartyMemberDetailsProps = {
  player: ApiPlayer;
  pokemon?: PartyPokemon;
};

export function PartyMemberDetails({
  player,
  pokemon,
}: PartyMemberDetailsProps) {
  return (
    <SectionPanel
      eyebrow="Party Detail"
      title="Member Detail"
      description="Core summary data for the selected party slot."
    >
      <PokemonSummaryPanel pokemon={pokemon} player={player} />
    </SectionPanel>
  );
}
