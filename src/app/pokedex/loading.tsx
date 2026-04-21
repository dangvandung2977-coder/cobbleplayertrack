import { LoadingState } from "@/components/ui/LoadingState";

export default function PokedexLoading() {
  return <LoadingState titleKey="states.loadingPokedexScreen" rows={5} />;
}
