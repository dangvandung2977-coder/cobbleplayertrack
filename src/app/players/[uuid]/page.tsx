import { redirect } from "next/navigation";
import { buildPlayerCompanionHref } from "@/lib/api/player-companion";

export const dynamic = "force-dynamic";

type PlayerPageProps = {
  params: Promise<{
    uuid: string;
  }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { uuid } = await params;
  redirect(buildPlayerCompanionHref("party", uuid));
}
