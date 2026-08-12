import { Trophy } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary glow-primary">
        <Trophy className="h-8 w-8 animate-pulse text-white" aria-hidden="true" />
      </div>
      <p className="mt-5 text-muted-foreground">Loading rankings…</p>
    </div>
  );
}
