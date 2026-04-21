import { LoadingState } from "@/components/ui/LoadingState";

export default function ServersLoading() {
  return <LoadingState title="Loading tracked servers" rows={5} />;
}
