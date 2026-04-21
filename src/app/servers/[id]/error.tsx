"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ServerDetailError({ error }: { error: Error & { digest?: string } }) {
  return <ErrorState message={error.message} actionHref="/servers" actionLabel="Back to servers" />;
}
