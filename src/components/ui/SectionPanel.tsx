import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionPanelProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionPanel({
  title,
  eyebrow,
  description,
  actions,
  children,
  className,
}: SectionPanelProps) {
  return (
    <section className={cn("game-panel rounded-sm p-5", className)}>
      {(title || eyebrow || description || actions) && (
        <div className="mb-5 flex flex-col gap-4 border-b border-[#4d5736]/70 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {eyebrow ? (
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-[#d7ae45]">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="text-2xl font-black text-[#f4ead2]">{title}</h2> : null}
            {description ? <p className="mt-2 max-w-2xl text-sm text-[#b7a98b]">{description}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
