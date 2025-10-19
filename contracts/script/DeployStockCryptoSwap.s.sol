// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {StockCryptoSwap} from "../src/StockCryptoSwap.sol";

/**
 * @title DeployStockCryptoSwap
 * @notice Deploy the revolutionary Stock ↔ Crypto swap contract on Base
 */
contract DeployStockCryptoSwap is Script {
    // USDC on Base Mainnet
    address constant USDC_BASE = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    // USDC on Base Sepolia (testnet)
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Determine which network we're on
        address usdc = block.chainid == 8453 ? USDC_BASE : USDC_BASE_SEPOLIA;
        
        console.log("==========================================");
        console.log("Deploying Stock-Crypto Swap Contract");
        console.log("==========================================");
        console.log("Chain ID:", block.chainid);
        console.log("Deployer:", deployer);
        console.log("USDC Address:", usdc);
        console.log("Price Oracle:", deployer); // Deployer is also oracle initially
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy StockCryptoSwap
        StockCryptoSwap swapContract = new StockCryptoSwap(
            usdc,
            deployer // Deployer is the price oracle initially
        );

        vm.stopBroadcast();

        console.log("");
        console.log("==========================================");
        console.log("DEPLOYMENT SUCCESSFUL!");
        console.log("==========================================");
        console.log("Contract Address:", address(swapContract));
        console.log("");
        console.log("Next steps:");
        console.log("1. Add to .env:");
        if (block.chainid == 8453) {
            console.log("   NEXT_PUBLIC_STOCK_CRYPTO_SWAP_BASE=%s", address(swapContract));
        } else {
            console.log("   NEXT_PUBLIC_STOCK_CRYPTO_SWAP_BASE_SEPOLIA=%s", address(swapContract));
        }
        console.log("");
        console.log("2. List stocks (example):");
        console.log("   cast send %s \"listStock(string,address,uint256)\" \"AAPL\" 0x... 150000000 --private-key $PRIVATE_KEY --rpc-url %s",
            address(swapContract),
            block.chainid == 8453 ? "base" : "base-sepolia"
        );
        console.log("");
        console.log("3. Restart Next.js server");
        console.log("4. Visit /base page to swap stocks for crypto!");
        console.log("==========================================");
    }
}

