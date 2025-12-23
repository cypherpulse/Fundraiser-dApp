/**
 * Wallet connection and session management for Stacks
 */

import { AppConfig, UserSession, showConnect } from "@stacks/connect";

// App configuration for wallet connection
// Replace YOUR_WALLETCONNECT_PROJECT_ID with your actual WalletConnect Project ID
// Get one at: https://cloud.walletconnect.com/
const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

// Connect wallet options
export interface ConnectOptions {
  onFinish?: () => void;
  onCancel?: () => void;
}

export function connectWallet(options?: ConnectOptions) {
  showConnect({
    appDetails: {
      name: "FundRaiser dApp",
      icon: window.location.origin + "/favicon.ico",
    },
    redirectTo: "/",
    onFinish: () => {
      options?.onFinish?.();
      window.location.reload();
    },
    onCancel: () => {
      options?.onCancel?.();
    },
    userSession,
  });
}

export function disconnectWallet() {
  userSession.signUserOut();
  window.location.reload();
}

export function isWalletConnected(): boolean {
  return userSession.isUserSignedIn();
}

export function getWalletAddress(): string | null {
  if (!isWalletConnected()) return null;
  const userData = userSession.loadUserData();
  // Use testnet address by default
  return userData.profile?.stxAddress?.testnet || null;
}

export function getMainnetAddress(): string | null {
  if (!isWalletConnected()) return null;
  const userData = userSession.loadUserData();
  return userData.profile?.stxAddress?.mainnet || null;
}
