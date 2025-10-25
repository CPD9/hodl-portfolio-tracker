// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProofOfReserves
 * @notice Tracks USDC backing for tokenized stock holdings
 * @dev Provides transparent on-chain verification of reserves
 */
contract ProofOfReserves is Ownable {
    // USDC on Base Sepolia
    IERC20 public immutable USDC;
    
    // Stock token addresses
    mapping(address => bool) public isStockToken;
    mapping(address => uint256) public requiredPricePerToken; // Price in USDC (6 decimals)
    
    // Stock token details
    struct StockToken {
        address tokenAddress;
        string symbol;
        uint256 totalSupply;
        uint256 requiredReserves;
        uint256 actualReserves;
        uint256 lastUpdate;
    }
    
    mapping(address => StockToken) public stockTokens;
    address[] public stockTokenList;
    
    // Events
    event StockTokenRegistered(address indexed token, string symbol, uint256 pricePerToken);
    event ReservesUpdated(address indexed token, uint256 totalSupply, uint256 actualReserves);
    event PriceUpdated(address indexed token, uint256 newPrice);
    
    constructor(address _usdc) Ownable(msg.sender) {
        USDC = IERC20(_usdc);
    }
    
    /**
     * @notice Register a stock token with its price
     * @param _token Stock token address
     * @param _symbol Stock symbol (e.g., "AAPL")
     * @param _pricePerToken Price in USDC (6 decimals, e.g., 180000000 for $180)
     */
    function registerStockToken(
        address _token,
        string memory _symbol,
        uint256 _pricePerToken
    ) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        require(_pricePerToken > 0, "Price must be > 0");
        
        if (!isStockToken[_token]) {
            isStockToken[_token] = true;
            stockTokenList.push(_token);
        }
        
        stockTokens[_token] = StockToken({
            tokenAddress: _token,
            symbol: _symbol,
            totalSupply: 0,
            requiredReserves: 0,
            actualReserves: 0,
            lastUpdate: block.timestamp
        });
        
        requiredPricePerToken[_token] = _pricePerToken;
        
        emit StockTokenRegistered(_token, _symbol, _pricePerToken);
    }
    
    /**
     * @notice Update reserves for a stock token
     * @dev Called periodically to update on-chain attestation
     */
    function updateReserves(address _token) public {
        require(isStockToken[_token], "Not a registered stock token");
        
        uint256 totalSupply = IERC20(_token).totalSupply();
        uint256 requiredReserves = (totalSupply * requiredPricePerToken[_token]) / 1e18; // Adjust for token decimals
        uint256 actualReserves = USDC.balanceOf(address(this));
        
        stockTokens[_token].totalSupply = totalSupply;
        stockTokens[_token].requiredReserves = requiredReserves;
        stockTokens[_token].actualReserves = actualReserves;
        stockTokens[_token].lastUpdate = block.timestamp;
        
        emit ReservesUpdated(_token, totalSupply, actualReserves);
    }
    
    /**
     * @notice Batch update all registered stock tokens
     */
    function updateAllReserves() external {
        for (uint256 i = 0; i < stockTokenList.length; i++) {
            updateReserves(stockTokenList[i]);
        }
    }
    
    /**
     * @notice Update price for a stock token
     * @param _token Stock token address
     * @param _newPrice New price in USDC (6 decimals)
     */
    function updatePrice(address _token, uint256 _newPrice) external onlyOwner {
        require(isStockToken[_token], "Not a registered stock token");
        require(_newPrice > 0, "Price must be > 0");
        
        requiredPricePerToken[_token] = _newPrice;
        updateReserves(_token);
        
        emit PriceUpdated(_token, _newPrice);
    }
    
    /**
     * @notice Get reserve ratio for a stock token (100 = 100% backed)
     * @return ratio Reserve ratio as percentage
     */
    function getReserveRatio(address _token) external view returns (uint256 ratio) {
        require(isStockToken[_token], "Not a registered stock token");
        
        StockToken memory stock = stockTokens[_token];
        
        if (stock.requiredReserves == 0) {
            return 10000; // 100% if no supply
        }
        
        ratio = (stock.actualReserves * 10000) / stock.requiredReserves;
    }
    
    /**
     * @notice Get all stock token details
     */
    function getAllStockTokens() external view returns (StockToken[] memory) {
        StockToken[] memory tokens = new StockToken[](stockTokenList.length);
        
        for (uint256 i = 0; i < stockTokenList.length; i++) {
            tokens[i] = stockTokens[stockTokenList[i]];
        }
        
        return tokens;
    }
    
    /**
     * @notice Get number of registered stock tokens
     */
    function getStockTokenCount() external view returns (uint256) {
        return stockTokenList.length;
    }
    
    /**
     * @notice Verify if reserves are sufficient (>= 100% backed)
     */
    function isFullyBacked(address _token) external view returns (bool) {
        require(isStockToken[_token], "Not a registered stock token");
        
        StockToken memory stock = stockTokens[_token];
        
        if (stock.requiredReserves == 0) {
            return true;
        }
        
        return stock.actualReserves >= stock.requiredReserves;
    }
    
    /**
     * @notice Emergency withdraw USDC (only owner)
     */
    function withdrawUSDC(uint256 _amount) external onlyOwner {
        require(USDC.transfer(msg.sender, _amount), "Transfer failed");
    }
    
    /**
     * @notice Deposit USDC to increase reserves
     */
    function depositUSDC(uint256 _amount) external {
        require(USDC.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        // Update all reserves after deposit
        for (uint256 i = 0; i < stockTokenList.length; i++) {
            updateReserves(stockTokenList[i]);
        }
    }
}
