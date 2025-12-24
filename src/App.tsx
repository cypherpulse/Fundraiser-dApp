/**
 * FundRaiser dApp - A Stacks blockchain fundraising application
 * Built for Stacks Builder Challenge demonstration
 */

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { ConnectWallet } from "@/components/ConnectWallet";
import { FundingProgress } from "@/components/FundingProgress";
import { FundForm } from "@/components/FundForm";
import { UserContribution } from "@/components/UserContribution";
import { WithdrawButton } from "@/components/WithdrawButton";
import { isWalletConnected, getWalletAddress } from "@/lib/wallet";
import { getBalance, getGoal, IS_MAINNET } from "@/lib/stacks";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [goal, setGoal] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stacksConnected = isWalletConnected();
  const stacksAddress = getWalletAddress();
  const connected = stacksConnected || wagmiConnected;
  const userAddress = stacksAddress || wagmiAddress;

  const fetchContractData = useCallback(async () => {
    try {
      const [currentBalance, fundingGoal] = await Promise.all([
        getBalance(),
        getGoal(),
      ]);
      setBalance(currentBalance);
      setGoal(fundingGoal);
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  }, []);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await fetchContractData();
      setIsLoading(false);
    }
    init();
  }, [fetchContractData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchContractData();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">FundRaiser</h1>
            <Badge variant={IS_MAINNET ? "default" : "secondary"}>
              {IS_MAINNET ? "Mainnet" : "Testnet"}
            </Badge>
          </div>
          <ConnectWallet onConnectionChange={handleRefresh} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-sm space-y-6 sm:max-w-md md:max-w-lg lg:max-w-2xl">
          {/* Title Section */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Support Our Cause
            </h2>
            <p className="text-muted-foreground">
              Donate STX tokens to help us reach our funding goal. Every
              contribution makes a difference.
            </p>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>

          {/* Funding Progress */}
          <FundingProgress
            balance={balance}
            goal={goal}
            isLoading={isLoading}
          />

          {/* Donation Form */}
          <FundForm isConnected={connected} onSuccess={handleRefresh} />

          {/* User Contribution - only shows when connected */}
          <UserContribution userAddress={userAddress} />

          {/* Withdraw Button - only shows for owner */}
          <WithdrawButton
            userAddress={userAddress}
            balance={balance}
            onSuccess={handleRefresh}
          />

          {/* Footer Info */}
          <div className="rounded-lg border bg-muted/50 p-4 text-center text-xs text-muted-foreground sm:text-sm">
            <p>
              Contract:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y.fund-raiser
              </code>
            </p>
            <p className="mt-1">
              Network: Stacks {IS_MAINNET ? "Mainnet" : "Testnet"}
            </p>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}

export default App;
