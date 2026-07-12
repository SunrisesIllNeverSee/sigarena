import { Trophy } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Trophy className="h-12 w-12 animate-pulse text-muted-foreground" />
      <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
    </div>
  );
}
