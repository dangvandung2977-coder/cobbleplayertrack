"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ServersError({ error }: { error: Error & { digest?: string } }) {
  return <ErrorState message={error.message} actionHref="/servers" actionLabel="Reload servers" />;
}
