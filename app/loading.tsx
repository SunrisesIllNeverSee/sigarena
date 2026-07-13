import { Trophy } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Trophy className="h-12 w-12 animate-pulse text-muted-foreground" />
      <h2 className="mt-4 text-xl font-semibold">Loading rankings…</h2>
      <p className="mt-2 text-muted-foreground">
        Pulling the latest AI user leaderboard data.
      </p>
    </div>
  );
}
