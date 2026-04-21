"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function PlayerError({ error }: { error: Error & { digest?: string } }) {
  return <ErrorState message={error.message} actionHref="/servers" actionLabel="Back to servers" />;
}
