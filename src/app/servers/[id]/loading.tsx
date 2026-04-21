import { LoadingState } from "@/components/ui/LoadingState";

export default function ServerDetailLoading() {
  return <LoadingState title="Loading server roster" rows={6} />;
}
