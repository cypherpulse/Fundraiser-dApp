/**
 * Reown AppKit configuration for WalletConnect
 */

import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from '@reown/appkit/networks'

// Get project ID from environment or use placeholder
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder-project-id'

// Lazy create wagmi adapter
let wagmiAdapter: WagmiAdapter | null = null;
let appKitModal: any = null;

export function getWagmiConfig() {
  if (!wagmiAdapter) {
    wagmiAdapter = new WagmiAdapter({
      networks: [mainnet, sepolia],
      projectId,
    });
  }
  return wagmiAdapter.wagmiConfig;
}

export function initializeAppKit() {
  if (!appKitModal) {
    if (!wagmiAdapter) {
      wagmiAdapter = new WagmiAdapter({
        networks: [mainnet, sepolia],
        projectId,
      });
    }
    appKitModal = createAppKit({
      adapters: [wagmiAdapter],
      networks: [mainnet, sepolia],
      projectId,
      features: {
        analytics: false, // Disable analytics to avoid issues
      },
    });
  }
  return appKitModal;
}

// Export modal getter
export function getModal() {
  if (!appKitModal) {
    initializeAppKit();
  }
  return appKitModal;
}

// Export wagmi config
export const wagmiConfig = getWagmiConfig();