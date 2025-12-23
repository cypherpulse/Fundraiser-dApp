/**
 * Displays the current funding progress with balance, goal, and progress bar
 */

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { microToSTX } from "@/lib/stacks";

interface FundingProgressProps {
  balance: bigint;
  goal: bigint;
  isLoading?: boolean;
}

export function FundingProgress({
  balance,
  goal,
  isLoading = false,
}: FundingProgressProps) {
  const balanceSTX = microToSTX(balance);
  const goalSTX = microToSTX(goal);
  const percentage = goal > 0 ? Math.min((Number(balance) / Number(goal)) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Funding Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-full rounded-full bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {balanceSTX.toLocaleString()} STX
                </p>
                <p className="text-sm text-muted-foreground">
                  raised of {goalSTX.toLocaleString()} STX goal
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 self-start">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <Progress value={percentage} className="h-3" />

            <p className="text-xs text-muted-foreground">
              {percentage >= 100
                ? "🎉 Goal reached! Thank you to all donors."
                : `${(goalSTX - balanceSTX).toLocaleString()} STX remaining to reach goal`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
