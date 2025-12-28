/**
 * Wallet connection component with connect/disconnect functionality
 * Enhanced with multiple wallet options
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, LogOut } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import {
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  getWalletAddress,
} from "@/lib/wallet";
import { truncateAddress } from "@/lib/stacks";
import { getModal } from "@/lib/appkit";

interface ConnectWalletProps {
  onConnectionChange?: () => void;
}

export function ConnectWallet({ onConnectionChange }: ConnectWalletProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const stacksConnected = isWalletConnected();
  const stacksAddress = getWalletAddress();

  const handleStacksConnect = () => {
    setIsDialogOpen(false);
    connectWallet({
      onFinish: () => {
        onConnectionChange?.();
      },
    });
  };

  const handleWalletConnect = () => {
    setIsDialogOpen(false);
    const modal = getModal();
    if (modal) {
      modal.open();
    }
  };

  const handleDisconnect = () => {
    if (stacksConnected) {
      disconnectWallet();
    } else if (wagmiConnected) {
      wagmiDisconnect();
    }
    onConnectionChange?.();
  };

  const connected = stacksConnected || wagmiConnected;
  const address = stacksAddress || wagmiAddress;

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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Wallet Type</DialogTitle>
          <DialogDescription>
            Select how you want to connect your wallet to the application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button onClick={handleStacksConnect} className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect Stacks Wallet
          </Button>
          <Button onClick={handleWalletConnect} variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect WalletConnect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
