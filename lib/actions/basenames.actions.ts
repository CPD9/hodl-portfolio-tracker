'use server';

import { normalize } from 'viem/ens';

// Basenames are ENS names on Base
// They use the format: username.base.eth

/**
 * Get Basename for an address
 * Uses ENS resolution on Base chain
 */
export async function getBasename(address: string): Promise<string | null> {
  try {
    // In production, this would use ENS resolution on Base
    // For now, we'll return null to indicate no Basename
    // You would integrate with @coinbase/onchainkit for real resolution
    
    // Example with OnchainKit:
    // import { getName } from '@coinbase/onchainkit/identity';
    // const name = await getName({ address, chain: base });
    
    return null;
  } catch (error) {
    console.error('Error fetching Basename:', error);
    return null;
  }
}

/**
 * Resolve a Basename to an address
 */
export async function resolveBasename(basename: string): Promise<string | null> {
  try {
    // Normalize the name
    const normalizedName = normalize(basename);
    
    // In production, resolve using ENS on Base
    // Example with OnchainKit:
    // import { getAddress } from '@coinbase/onchainkit/identity';
    // const address = await getAddress({ name: normalizedName, chain: base });
    
    return null;
  } catch (error) {
    console.error('Error resolving Basename:', error);
    return null;
  }
}

/**
 * Check if a Basename is available
 */
export async function isBasenameAvailable(basename: string): Promise<boolean> {
  try {
    const address = await resolveBasename(basename);
    return address === null;
  } catch (error) {
    console.error('Error checking Basename availability:', error);
    return false;
  }
}

/**
 * Get Basename registration URL
 */
export function getBasenameRegistrationUrl(basename?: string): string {
  const baseUrl = 'https://www.base.org/names';
  return basename ? `${baseUrl}?name=${encodeURIComponent(basename)}` : baseUrl;
}

/**
 * Format address with Basename if available
 */
export async function formatAddressWithBasename(address: string): Promise<string> {
  const basename = await getBasename(address);
  if (basename) {
    return basename;
  }
  // Return truncated address
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate Basename format
 */
export function isValidBasenameFormat(name: string): boolean {
  // Basenames must be:
  // - 3+ characters
  // - Lowercase alphanumeric and hyphens
  // - Cannot start or end with hyphen
  const basenameRegex = /^[a-z0-9]([a-z0-9-]{1,}[a-z0-9])?$/;
  return basenameRegex.test(name) && name.length >= 3;
}

/**
 * Get Basename discount eligibility
 * Based on: Coinbase Verification, Summer Pass, etc.
 */
export async function getBasenameDiscountEligibility(address: string): Promise<{
  eligible: boolean;
  discountType?: string;
  discountValue?: string;
}> {
  try {
    // Check various eligibility criteria
    // This would integrate with Coinbase APIs and NFT checks
    
    // For buildathon demo, return eligible
    return {
      eligible: true,
      discountType: 'START HACK 2025 Builder',
      discountValue: '0.001 ETH',
    };
  } catch (error) {
    console.error('Error checking discount eligibility:', error);
    return { eligible: false };
  }
}

