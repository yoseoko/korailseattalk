import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { filterStations } from "@/lib/stations";
import { cn } from "@/lib/utils";

export function StationField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => filterStations(value).slice(0, 8), [value]);

  return (
    <div className="relative min-w-0 flex-1">
      <Label>{label}</Label>
      <Input
        value={value}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 font-display text-lg font-medium"
      />
      {open && options.length > 0 ? (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-[var(--radius-md)] bg-elevated py-1 shadow-[var(--shadow-border)]">
          {options.map((name) => (
            <li key={name}>
              <button
                type="button"
                className={cn(
                  "flex h-10 w-full items-center px-3 text-left text-sm hover:bg-surface",
                  name === value && "text-accent",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
