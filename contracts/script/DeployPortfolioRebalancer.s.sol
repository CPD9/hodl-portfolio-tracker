// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PortfolioRebalancer} from "../src/PortfolioRebalancer.sol";

/**
 * @title DeployPortfolioRebalancer
 * @notice Deployment script for PortfolioRebalancer contract on Base
 * @dev Run with: forge script script/DeployPortfolioRebalancer.s.sol --rpc-url base --broadcast --verify
 */
contract DeployPortfolioRebalancer is Script {
    // Uniswap V3 SwapRouter on Base Mainnet
    address constant SWAP_ROUTER_BASE = 0x2626664c2603336E57B271c5C0b26F421741e481;
    
    // Uniswap V3 SwapRouter on Base Sepolia
    address constant SWAP_ROUTER_BASE_SEPOLIA = 0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Determine which network we're on
        address swapRouter = block.chainid == 8453 
            ? SWAP_ROUTER_BASE 
            : SWAP_ROUTER_BASE_SEPOLIA;
        
        console.log("Deploying to chain ID:", block.chainid);
        console.log("Using SwapRouter:", swapRouter);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PortfolioRebalancer
        PortfolioRebalancer rebalancer = new PortfolioRebalancer(swapRouter);

        vm.stopBroadcast();

        console.log("PortfolioRebalancer deployed at:", address(rebalancer));
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Contract: PortfolioRebalancer");
        console.log("Address:", address(rebalancer));
        console.log("Chain ID:", block.chainid);
        console.log("SwapRouter:", swapRouter);
        console.log("==========================\n");
        
        // Save deployment info to .env format
        console.log("Add to your .env file:");
        console.log("PORTFOLIO_REBALANCER_ADDRESS=", address(rebalancer));
    }
}

