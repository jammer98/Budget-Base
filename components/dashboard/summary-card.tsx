import { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
};

export function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>

        <div className="rounded-md bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tabular-nums">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}