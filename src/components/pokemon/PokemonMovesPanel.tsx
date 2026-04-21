import type { PartyPokemon } from "@/lib/api/types";
import { MoveRow } from "@/components/pokemon/MoveRow";

type PokemonMovesPanelProps = {
  pokemon?: PartyPokemon;
};

export function PokemonMovesPanel({ pokemon }: PokemonMovesPanelProps) {
  const moves = pokemon?.moves ?? [];
  const moveSlots = Array.from({ length: 4 }, (_, index) => moves[index]);

  return (
    <div className="space-y-3">
      {moveSlots.map((move, index) => (
        <MoveRow key={index} move={move} index={index} />
      ))}
    </div>
  );
}
