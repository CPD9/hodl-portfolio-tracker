# Deploy StockCryptoSwap Contract via Remix

## 🎉 Great Job So Far!

You've successfully:
- ✅ Deployed 6 stock tokens on Ethereum Sepolia
- ✅ Set up MetaMask with test ETH
- ✅ Configured `.env.local` file

## 📋 Next Step: Deploy StockCryptoSwap Contract

### Step 1: Open Remix IDE

Go to: https://remix.ethereum.org

### Step 2: Create the Contract File

1. In the File Explorer (left panel), click the **"+" icon** to create a new file
2. Name it: `StockCryptoSwap.sol`
3. Copy and paste this contract code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, address value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
}

contract StockCryptoSwap {
    address public owner;
    address public usdcToken;
    address public priceOracle;
    
    struct StockToken {
        address tokenAddress;
        uint256 priceInUSDC; // Price in USDC (6 decimals)
        bool isListed;
    }
    
    mapping(string => StockToken) public stocks;
    string[] public stockSymbols;
    
    event StockListed(string symbol, address tokenAddress, uint256 price);
    event StockPriceUpdated(string symbol, uint256 newPrice);
    event Swap(address indexed user, string stockSymbol, uint256 stockAmount, uint256 usdcAmount, bool isBuy);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyOracle() {
        require(msg.sender == priceOracle, "Only oracle");
        _;
    }
    
    constructor(address _usdcToken, address _priceOracle) {
        owner = msg.sender;
        usdcToken = _usdcToken;
        priceOracle = _priceOracle;
    }
    
    function listStock(string memory symbol, address tokenAddress, uint256 priceInUSDC) external onlyOwner {
        require(!stocks[symbol].isListed, "Stock already listed");
        
        stocks[symbol] = StockToken({
            tokenAddress: tokenAddress,
            priceInUSDC: priceInUSDC,
            isListed: true
        });
        
        stockSymbols.push(symbol);
        emit StockListed(symbol, tokenAddress, priceInUSDC);
    }
    
    function updatePrice(string memory symbol, uint256 newPrice) external onlyOracle {
        require(stocks[symbol].isListed, "Stock not listed");
        stocks[symbol].priceInUSDC = newPrice;
        emit StockPriceUpdated(symbol, newPrice);
    }
    
    function swapUSDCForStock(string memory symbol, uint256 usdcAmount) external {
        StockToken memory stock = stocks[symbol];
        require(stock.isListed, "Stock not listed");
        
        uint256 stockAmount = (usdcAmount * 1e18) / stock.priceInUSDC;
        
        IERC20(usdcToken).transferFrom(msg.sender, address(this), usdcAmount);
        IERC20(stock.tokenAddress).transfer(msg.sender, stockAmount);
        
        emit Swap(msg.sender, symbol, stockAmount, usdcAmount, true);
    }
    
    function swapStockForUSDC(string memory symbol, uint256 stockAmount) external {
        StockToken memory stock = stocks[symbol];
        require(stock.isListed, "Stock not listed");
        
        uint256 usdcAmount = (stockAmount * stock.priceInUSDC) / 1e18;
        
        IERC20(stock.tokenAddress).transferFrom(msg.sender, address(this), stockAmount);
        IERC20(usdcToken).transfer(msg.sender, usdcAmount);
        
        emit Swap(msg.sender, symbol, stockAmount, usdcAmount, false);
    }
    
    function getStockPrice(string memory symbol) external view returns (uint256) {
        require(stocks[symbol].isListed, "Stock not listed");
        return stocks[symbol].priceInUSDC;
    }
    
    function getAllStocks() external view returns (string[] memory) {
        return stockSymbols;
    }
}
```

### Step 3: Compile the Contract

1. Click the **"Solidity Compiler"** icon (left panel, 2nd icon)
2. Select compiler version: **0.8.0** or higher
3. Click **"Compile StockCryptoSwap.sol"**
4. Wait for green checkmark ✅

### Step 4: Deploy the Contract

1. Click the **"Deploy & Run Transactions"** icon (left panel, 3rd icon)
2. Set:
   - **ENVIRONMENT:** Injected Provider - MetaMask
   - **ACCOUNT:** Your wallet (0xbE2E...2CB9b)
   - **CONTRACT:** StockCryptoSwap
3. **Constructor Parameters:**
   ```
   _usdcToken: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
   _priceOracle: 0xbE26e3a1f50E39E828Ab089FA6f7E4a372b2CB9b
   ```
   *(Note: Using your wallet as price oracle)*

4. Click **"Deploy"**
5. Confirm transaction in MetaMask
6. Wait for deployment (~30 seconds)
7. **SAVE THE CONTRACT ADDRESS** (shown in Deployed Contracts section)

### Step 5: List Your Stock Tokens

After deployment, you need to list each stock token. In the Deployed Contracts section:

#### List AAPL:
```
listStock(
  symbol: "AAPL",
  tokenAddress: "0x334dFeb48aEC27fCb75249e77F546B687cC6aB94",
  priceInUSDC: "180000000"
)
```
*Note: 180000000 = $180.00 (USDC has 6 decimals)*

#### List TSLA:
```
listStock(
  symbol: "TSLA",
  tokenAddress: "0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487",
  priceInUSDC: "242000000"
)
```

#### List NVDA:
```
listStock(
  symbol: "NVDA",
  tokenAddress: "0x532995D5C698a725B590550F67F9f90A00b352d8",
  priceInUSDC: "495000000"
)
```

#### List MSFT:
```
listStock(
  symbol: "MSFT",
  tokenAddress: "0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4",
  priceInUSDC: "378000000"
)
```

#### List AMZN:
```
listStock(
  symbol: "AMZN",
  tokenAddress: "0x75687E5c95e15Ba306b49869e49F017b3103AbF2",
  priceInUSDC: "185000000"
)
```

#### List GOOGL:
```
listStock(
  symbol: "GOOGL",
  tokenAddress: "0x4833D6D51b64f93B6708088c90aB6E138b6A1547",
  priceInUSDC: "140000000"
)
```

Click **"transact"** for each one and confirm in MetaMask.

### Step 6: Update .env.local

Add your deployed contract address to `.env.local`:

```bash
# Open terminal in your project directory
nano .env.local

# Find this line:
NEXT_PUBLIC_STOCK_CRYPTO_SWAP_ADDRESS=

# Replace with your actual contract address:
NEXT_PUBLIC_STOCK_CRYPTO_SWAP_ADDRESS=0xYourDeployedContractAddress

# Save: Ctrl+O, Enter, Ctrl+X
```

### Step 7: Add Private Key to .env.local

If you haven't already, add your MetaMask private key:

```bash
nano .env.local

# Find this line:
PRIVATE_KEY=REPLACE_WITH_YOUR_PRIVATE_KEY

# Replace with your actual private key from MetaMask:
# (Three dots → Account details → Show private key)
PRIVATE_KEY=0xYourActualPrivateKey

# Save: Ctrl+O, Enter, Ctrl+X
```

### Step 8: Test the Deployment

Restart your dev server and test:

```bash
npm run dev
```

Open http://localhost:3000 and try:
1. Connect your MetaMask wallet
2. Navigate to `/dashboard/trade`
3. Try swapping AAPL → USDC (or vice versa)

## 📝 Checklist

- [ ] Deployed StockCryptoSwap contract via Remix
- [ ] Listed all 6 stock tokens (AAPL, TSLA, NVDA, MSFT, AMZN, GOOGL)
- [ ] Saved contract address to `.env.local`
- [ ] Added private key to `.env.local`
- [ ] Restarted dev server
- [ ] Tested swap functionality

## 🎯 After Deployment

Once you've deployed and have the contract address, send me the address and I'll:
1. Update the contract ABI with the actual compiled ABI
2. Build the final swap UI components
3. Test the complete swap flow
4. Prepare for merge to main branch

## 🆘 Troubleshooting

### "Insufficient funds for gas"
- Make sure you have test ETH from the faucet
- Check your balance in MetaMask

### "Contract not deploying"
- Make sure MetaMask is on Ethereum Sepolia network
- Check that constructor parameters are correct
- Try increasing gas limit in MetaMask

### "listStock transaction fails"
- Make sure you're using the owner account (0xbE2E...2CB9b)
- Check that token addresses are correct
- Verify price format (USDC has 6 decimals)

---

**Good luck! Let me know when you have the deployed contract address!** 🚀

