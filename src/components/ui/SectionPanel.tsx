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
    <section className={cn("game-panel p-4 sm:p-5", className)}>
      {(title || eyebrow || description || actions) && (
        <div className="mb-5 flex flex-col gap-4 border-b border-[#3f503f]/70 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {eyebrow ? (
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-[#67d8cf]">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="text-2xl font-black text-[#fff5de]">{title}</h2> : null}
            {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#c1b59a]">{description}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
