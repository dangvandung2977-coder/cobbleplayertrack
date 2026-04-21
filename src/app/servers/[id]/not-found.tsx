import { ErrorState } from "@/components/ui/ErrorState";

export default function ServerNotFound() {
  return (
    <ErrorState
      title="Server not found"
      message="This server id was not present in the current backend registry."
      actionHref="/servers"
      actionLabel="Back to servers"
    />
  );
}
