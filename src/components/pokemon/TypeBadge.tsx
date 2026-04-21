import { cn } from "@/lib/cn";
import { titleCaseIdentifier } from "@/lib/pokemon";

const TYPE_STYLES: Record<string, string> = {
  normal: "border-[#b8ad8f] bg-[#4d4735] text-[#fff5cf]",
  fire: "border-[#e67a44] bg-[#4d241b] text-[#ffd2a8]",
  water: "border-[#4aa7df] bg-[#15324d] text-[#c8edff]",
  grass: "border-[#79b86a] bg-[#193d25] text-[#cef5bf]",
  electric: "border-[#e4c948] bg-[#4a3c12] text-[#fff1a3]",
  ice: "border-[#85d8e7] bg-[#173f49] text-[#d9fbff]",
  fighting: "border-[#cf5e48] bg-[#4b211b] text-[#ffd0c7]",
  poison: "border-[#b070ce] bg-[#3a214a] text-[#f0caff]",
  ground: "border-[#d6ae63] bg-[#47361a] text-[#ffe0a3]",
  flying: "border-[#93b2ec] bg-[#273350] text-[#dbe8ff]",
  psychic: "border-[#e776a9] bg-[#4d2039] text-[#ffd0e4]",
  bug: "border-[#a4c85f] bg-[#344217] text-[#e8ffb9]",
  rock: "border-[#c6ae69] bg-[#40351c] text-[#f7e7ae]",
  ghost: "border-[#8e80d5] bg-[#292044] text-[#ded8ff]",
  dragon: "border-[#776fe4] bg-[#211d50] text-[#d8d5ff]",
  dark: "border-[#746d7b] bg-[#24212b] text-[#ddd7e8]",
  steel: "border-[#a8b3c2] bg-[#28313a] text-[#e5edf5]",
  fairy: "border-[#eca3c7] bg-[#4b253c] text-[#ffe0ef]",
  unknown: "border-[#83785f] bg-[#252a1d] text-[#d8cba7]",
};

type TypeBadgeProps = {
  type?: string | null;
  compact?: boolean;
  className?: string;
};

type TypeIconProps = {
  type?: string | null;
  bare?: boolean;
  className?: string;
  iconClassName?: string;
};

export function TypeIcon({ type, bare = false, className, iconClassName }: TypeIconProps) {
  const normalized = type?.toLowerCase() || "unknown";
  const icon =
    normalized === "unknown" ? (
      "?"
    ) : (
      <img
        src={`/assets/cobblemon/types/${normalized}.png`}
        alt=""
        className={cn("h-[18px] w-[18px] [image-rendering:pixelated]", iconClassName)}
      />
    );

  if (bare) {
    return (
      <span className={cn("grid place-items-center font-mono text-[10px] font-black", className)} aria-hidden="true">
        {icon}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid h-5 w-5 place-items-center border font-mono text-[10px] font-black",
        TYPE_STYLES[normalized] ?? TYPE_STYLES.unknown,
        className,
      )}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

export function TypeBadge({ type, compact = false, className }: TypeBadgeProps) {
  const normalized = type?.toLowerCase() || "unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-black uppercase tracking-[0.08em]",
        compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
        TYPE_STYLES[normalized] ?? TYPE_STYLES.unknown,
        className,
      )}
    >
      <TypeIcon type={normalized} />
      {titleCaseIdentifier(normalized)}
    </span>
  );
}
