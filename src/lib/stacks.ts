/**
 * Stacks blockchain configuration and contract interaction utilities
 * for the FundRaiser dApp
 * Updated with improved performance
 */

import { StacksTestnet, StacksMainnet } from "@stacks/network";
import {
  callReadOnlyFunction,
  cvToValue,
  uintCV,
  principalCV,
  ClarityValue,
} from "@stacks/transactions";

// Contract configuration
export const CONTRACT_ADDRESS = "STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y";
export const CONTRACT_NAME = "fund-raiser";
export const CONTRACT_OWNER = "STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y";

// Network configuration - defaults to testnet
export const IS_MAINNET = false;
export const network = IS_MAINNET ? new StacksMainnet() : new StacksTestnet();

// Conversion helpers
export const microToSTX = (micro: bigint | number): number => {
  return Number(micro) / 1_000_000;
};

export const stxToMicro = (stx: number): bigint => {
  return BigInt(Math.floor(stx * 1_000_000));
};

// Read-only contract calls
export async function getBalance(): Promise<bigint> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-balance",
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    return BigInt(cvToValue(result));
  } catch (error) {
    console.error("Error fetching balance:", error);
    return BigInt(0);
  }
}

export async function getGoal(): Promise<bigint> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-goal",
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    return BigInt(cvToValue(result));
  } catch (error) {
    console.error("Error fetching goal:", error);
    return BigInt(0);
  }
}

export async function getOwner(): Promise<string> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-owner",
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    return cvToValue(result) as string;
  } catch (error) {
    console.error("Error fetching owner:", error);
    return "";
  }
}

export async function getDonorAmount(donorAddress: string): Promise<bigint> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-donor-amount",
      functionArgs: [principalCV(donorAddress)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    return BigInt(cvToValue(result));
  } catch (error) {
    console.error("Error fetching donor amount:", error);
    return BigInt(0);
  }
}

// Contract call helpers for transactions
export function createFundFunctionArgs(amountMicro: bigint): ClarityValue[] {
  return [uintCV(amountMicro)];
}

export function createWithdrawFunctionArgs(): ClarityValue[] {
  return [];
}

// Format address for display (truncate)
export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
