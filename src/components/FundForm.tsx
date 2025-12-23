/**
 * Donation form component for contributing STX to the fundraiser
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openContractCall } from "@stacks/connect";
import { userSession } from "@/lib/wallet";
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  stxToMicro,
  createFundFunctionArgs,
  network,
} from "@/lib/stacks";
import { PostConditionMode } from "@stacks/transactions";

interface FundFormProps {
  isConnected: boolean;
  onSuccess?: () => void;
}

export function FundForm({ isConnected, onSuccess }: FundFormProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDonate = async () => {
    const stxAmount = parseFloat(amount);

    if (isNaN(stxAmount) || stxAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid STX amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const microAmount = stxToMicro(stxAmount);

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "fund",
        functionArgs: createFundFunctionArgs(microAmount),
        network,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          console.log("Transaction submitted:", data);
          toast({
            title: "Donation submitted!",
            description: `Your donation of ${stxAmount} STX has been submitted. Transaction ID: ${data.txId.slice(0, 10)}...`,
          });
          setAmount("");
          onSuccess?.();
        },
        onCancel: () => {
          toast({
            title: "Transaction cancelled",
            description: "You cancelled the transaction.",
          });
        },
        userSession,
      });
    } catch (error) {
      console.error("Donation error:", error);
      toast({
        title: "Donation failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-destructive" />
          Make a Donation
        </CardTitle>
        <CardDescription>
          Support this fundraiser by donating STX tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (STX)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount in STX"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.000001"
            disabled={!isConnected || isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Enter the amount in STX. Minimum donation: 0.000001 STX
          </p>
        </div>

        <Button
          onClick={handleDonate}
          disabled={!isConnected || isLoading || !amount}
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              Donate STX
            </>
          )}
        </Button>

        {!isConnected && (
          <p className="text-center text-sm text-muted-foreground">
            Connect your wallet to make a donation
          </p>
        )}
      </CardContent>
    </Card>
  );
}
