// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ProofOfReserves.sol";

contract DeployProofOfReserves is Script {
    // Base Sepolia USDC (mock for testnet)
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    // Stock token addresses on Base Sepolia
    address constant AAPL = 0x334dFeb48aEC27fCb75249e77F546B687cC6aB94;
    address constant TSLA = 0x3FF7a28970832F0B31ba496545a000971becFCC2;
    address constant NVDA = 0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487;
    address constant MSFT = 0x532995D5C698a725B590550F67F9f90A00b352d8;
    address constant AMZN = 0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4;
    address constant GOOGL = 0x75687E5c95e15Ba306b49869e49F017b3103AbF2;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ProofOfReserves contract
        ProofOfReserves por = new ProofOfReserves(USDC);
        
        console.log("ProofOfReserves deployed to:", address(por));
        
        // Register stock tokens with current prices (in USDC with 6 decimals)
        // Prices are approximate - would be updated via Chainlink oracles in production
        por.registerStockToken(AAPL, "AAPL", 180_000000);  // $180
        por.registerStockToken(TSLA, "TSLA", 250_000000);  // $250
        por.registerStockToken(NVDA, "NVDA", 450_000000);  // $450
        por.registerStockToken(MSFT, "MSFT", 380_000000);  // $380
        por.registerStockToken(AMZN, "AMZN", 175_000000);  // $175
        por.registerStockToken(GOOGL, "GOOGL", 140_000000); // $140
        
        console.log("Stock tokens registered:");
        console.log("- AAPL at $180");
        console.log("- TSLA at $250");
        console.log("- NVDA at $450");
        console.log("- MSFT at $380");
        console.log("- AMZN at $175");
        console.log("- GOOGL at $140");
        
        // Update all reserves
        por.updateAllReserves();
        
        console.log("Initial reserves updated");
        
        vm.stopBroadcast();
    }
}
