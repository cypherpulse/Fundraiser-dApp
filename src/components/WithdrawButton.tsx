/**
 * Withdraw button component - only visible to contract owner
 * Enhanced with security checks
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Loader2, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openContractCall } from "@stacks/connect";
import { userSession } from "@/lib/wallet";
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  CONTRACT_OWNER,
  createWithdrawFunctionArgs,
  network,
  microToSTX,
} from "@/lib/stacks";
import { PostConditionMode } from "@stacks/transactions";

interface WithdrawButtonProps {
  userAddress: string | null;
  balance: bigint;
  onSuccess?: () => void;
}

export function WithdrawButton({
  userAddress,
  balance,
  onSuccess,
}: WithdrawButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if connected user is the contract owner
  const isOwner = userAddress === CONTRACT_OWNER;

  if (!isOwner) {
    return null;
  }

  const handleWithdraw = async () => {
    if (balance === BigInt(0)) {
      toast({
        title: "No funds to withdraw",
        description: "The contract balance is currently 0 STX.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "withdraw",
        functionArgs: createWithdrawFunctionArgs(),
        network,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log("Withdraw transaction submitted:", data);
          toast({
            title: "Withdrawal submitted!",
            description: `Withdrawal of ${microToSTX(balance)} STX has been submitted. Transaction ID: ${data.txId.slice(0, 10)}...`,
          });
          onSuccess?.();
        },
        onCancel: () => {
          toast({
            title: "Transaction cancelled",
            description: "You cancelled the withdrawal.",
          });
        },
        userSession,
      });
    } catch (error) {
      console.error("Withdraw error:", error);
      toast({
        title: "Withdrawal failed",
        description: "There was an error processing the withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Owner Controls
        </CardTitle>
        <CardDescription>
          You are the contract owner. You can withdraw all funds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleWithdraw}
          disabled={isLoading || balance === BigInt(0)}
          variant="default"
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Withdraw {microToSTX(balance).toLocaleString()} STX
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
