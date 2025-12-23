/**
 * Wallet connection component with connect/disconnect functionality
 */

import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import {
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  getWalletAddress,
} from "@/lib/wallet";
import { truncateAddress } from "@/lib/stacks";

interface ConnectWalletProps {
  onConnectionChange?: () => void;
}

export function ConnectWallet({ onConnectionChange }: ConnectWalletProps) {
  const connected = isWalletConnected();
  const address = getWalletAddress();

  const handleConnect = () => {
    connectWallet({
      onFinish: () => {
        onConnectionChange?.();
      },
    });
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onConnectionChange?.();
  };

  if (connected && address) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{truncateAddress(address)}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
