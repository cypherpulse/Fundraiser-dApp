/**
 * Displays the connected user's contribution to the fundraiser
 * Includes real-time updates
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Coins } from "lucide-react";
import { getDonorAmount, microToSTX, truncateAddress } from "@/lib/stacks";

interface UserContributionProps {
  userAddress: string | null;
}

export function UserContribution({ userAddress }: UserContributionProps) {
  const [contribution, setContribution] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchContribution() {
      if (!userAddress) {
        setContribution(BigInt(0));
        return;
      }

      setIsLoading(true);
      try {
        const amount = await getDonorAmount(userAddress);
        setContribution(amount);
      } catch (error) {
        console.error("Error fetching contribution:", error);
        setContribution(BigInt(0));
      } finally {
        setIsLoading(false);
      }
    }

    fetchContribution();
  }, [userAddress]);

  if (!userAddress) {
    return null;
  }

  const contributionSTX = microToSTX(contribution);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Your Contribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 w-32 rounded bg-muted" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {contributionSTX.toLocaleString()} STX
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              From wallet: {truncateAddress(userAddress)}
            </p>
            {contribution === BigInt(0) && (
              <p className="text-sm text-muted-foreground">
                You haven't donated yet. Make your first contribution above!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
