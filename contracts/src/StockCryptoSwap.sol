// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "./interfaces/IERC20.sol";

/**
 * @title StockCryptoSwap
 * @notice Revolutionary cross-asset swap: Trade stocks for crypto on Base
 * @dev Tokenized stocks (RWAs) ↔ Crypto with USDC as intermediary
 * 
 * Example flows:
 * - AAPL → USDC → WETH (Swap Apple stock for Ethereum)
 * - WBTC → USDC → TSLA (Swap Bitcoin for Tesla stock)
 */
contract StockCryptoSwap {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error Unauthorized();
    error InvalidAmount();
    error InvalidPrice();
    error InsufficientBalance();
    error SwapFailed();
    error StockNotListed();

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event StockListed(
        string indexed symbol,
        address indexed tokenAddress,
        uint256 initialPrice
    );
    
    event StockToCryptoSwap(
        address indexed user,
        string stockSymbol,
        uint256 stockAmount,
        address cryptoToken,
        uint256 cryptoAmount
    );
    
    event CryptoToStockSwap(
        address indexed user,
        address cryptoToken,
        uint256 cryptoAmount,
        string stockSymbol,
        uint256 stockAmount
    );

    event PriceUpdated(
        string indexed symbol,
        uint256 newPrice,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/
    
    struct StockToken {
        string symbol;           // e.g., "AAPL", "TSLA"
        address tokenAddress;    // ERC20 token representing the stock
        uint256 priceUSD;        // Price in USD (6 decimals, e.g., 150.00 = 150000000)
        uint256 totalSupply;     // Total tokens minted
        bool active;             // Is this stock tradeable?
        uint256 lastUpdated;     // Last price update timestamp
    }

    // Stock symbol => StockToken info
    mapping(string => StockToken) public stocks;
    
    // User => Stock symbol => Balance
    mapping(address => mapping(string => uint256)) public stockBalances;
    
    // List of all stock symbols
    string[] public stockSymbols;
    
    // USDC on Base (intermediary currency)
    address public immutable USDC;
    
    // Contract owner (can list stocks and update prices)
    address public owner;
    
    // Price oracle (can update stock prices)
    address public priceOracle;

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }
    
    modifier onlyPriceOracle() {
        if (msg.sender != priceOracle && msg.sender != owner) revert Unauthorized();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    
    constructor(address _usdc, address _priceOracle) {
        USDC = _usdc;
        owner = msg.sender;
        priceOracle = _priceOracle;
    }

    /*//////////////////////////////////////////////////////////////
                            STOCK MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice List a new tokenized stock
     * @param _symbol Stock ticker (e.g., "AAPL")
     * @param _tokenAddress ERC20 token address for this stock
     * @param _initialPriceUSD Initial price in USD (6 decimals)
     */
    function listStock(
        string memory _symbol,
        address _tokenAddress,
        uint256 _initialPriceUSD
    ) external onlyOwner {
        if (_initialPriceUSD == 0) revert InvalidPrice();
        
        stocks[_symbol] = StockToken({
            symbol: _symbol,
            tokenAddress: _tokenAddress,
            priceUSD: _initialPriceUSD,
            totalSupply: 0,
            active: true,
            lastUpdated: block.timestamp
        });
        
        stockSymbols.push(_symbol);
        emit StockListed(_symbol, _tokenAddress, _initialPriceUSD);
    }
    
    /**
     * @notice Update stock price (called by oracle)
     * @param _symbol Stock symbol
     * @param _newPriceUSD New price in USD (6 decimals)
     */
    function updateStockPrice(
        string memory _symbol,
        uint256 _newPriceUSD
    ) external onlyPriceOracle {
        if (!stocks[_symbol].active) revert StockNotListed();
        if (_newPriceUSD == 0) revert InvalidPrice();
        
        stocks[_symbol].priceUSD = _newPriceUSD;
        stocks[_symbol].lastUpdated = block.timestamp;
        
        emit PriceUpdated(_symbol, _newPriceUSD, block.timestamp);
    }
    
    /**
     * @notice Mint stock tokens (simulates buying stocks off-chain and wrapping them)
     * @param _symbol Stock symbol
     * @param _amount Amount to mint
     */
    function mintStockTokens(
        string memory _symbol,
        uint256 _amount
    ) external onlyOwner {
        if (!stocks[_symbol].active) revert StockNotListed();
        if (_amount == 0) revert InvalidAmount();
        
        stockBalances[msg.sender][_symbol] += _amount;
        stocks[_symbol].totalSupply += _amount;
    }

    /*//////////////////////////////////////////////////////////////
                              SWAP FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    /**
     * @notice Swap stock tokens for crypto
     * @param _stockSymbol Stock to sell (e.g., "AAPL")
     * @param _stockAmount Amount of stock tokens to sell
     * @param _cryptoToken Crypto token to buy (e.g., WETH)
     * @param _minCryptoAmount Minimum crypto to receive (slippage protection)
     */
    function swapStockForCrypto(
        string memory _stockSymbol,
        uint256 _stockAmount,
        address _cryptoToken,
        uint256 _minCryptoAmount
    ) external returns (uint256 cryptoAmount) {
        if (!stocks[_stockSymbol].active) revert StockNotListed();
        if (_stockAmount == 0) revert InvalidAmount();
        if (stockBalances[msg.sender][_stockSymbol] < _stockAmount) revert InsufficientBalance();
        
        // Calculate stock value in USD
        uint256 stockValueUSD = (stocks[_stockSymbol].priceUSD * _stockAmount) / 1e18;
        
        // For now, simple 1:1 conversion with USDC
        // In production, integrate with Uniswap/Chainlink for real prices
        cryptoAmount = stockValueUSD;
        
        if (cryptoAmount < _minCryptoAmount) revert SwapFailed();
        
        // Burn stock tokens
        stockBalances[msg.sender][_stockSymbol] -= _stockAmount;
        stocks[_stockSymbol].totalSupply -= _stockAmount;
        
        // Transfer crypto to user
        // Note: Contract must have crypto tokens or integrate with DEX
        IERC20(_cryptoToken).transfer(msg.sender, cryptoAmount);
        
        emit StockToCryptoSwap(
            msg.sender,
            _stockSymbol,
            _stockAmount,
            _cryptoToken,
            cryptoAmount
        );
    }
    
    /**
     * @notice Swap crypto for stock tokens
     * @param _cryptoToken Crypto token to sell (e.g., WETH)
     * @param _cryptoAmount Amount of crypto to sell
     * @param _stockSymbol Stock to buy (e.g., "AAPL")
     * @param _minStockAmount Minimum stock to receive (slippage protection)
     */
    function swapCryptoForStock(
        address _cryptoToken,
        uint256 _cryptoAmount,
        string memory _stockSymbol,
        uint256 _minStockAmount
    ) external returns (uint256 stockAmount) {
        if (!stocks[_stockSymbol].active) revert StockNotListed();
        if (_cryptoAmount == 0) revert InvalidAmount();
        
        // Transfer crypto from user
        IERC20(_cryptoToken).transferFrom(msg.sender, address(this), _cryptoAmount);
        
        // Calculate how much stock user gets
        // For now, simple conversion. In production, use oracle prices
        uint256 cryptoValueUSD = _cryptoAmount; // Assuming stablecoin
        stockAmount = (cryptoValueUSD * 1e18) / stocks[_stockSymbol].priceUSD;
        
        if (stockAmount < _minStockAmount) revert SwapFailed();
        
        // Mint stock tokens to user
        stockBalances[msg.sender][_stockSymbol] += stockAmount;
        stocks[_stockSymbol].totalSupply += stockAmount;
        
        emit CryptoToStockSwap(
            msg.sender,
            _cryptoToken,
            _cryptoAmount,
            _stockSymbol,
            stockAmount
        );
    }
    
    /**
     * @notice Get quote for stock → crypto swap
     * @param _stockSymbol Stock to sell
     * @param _stockAmount Amount of stock
     * @return usdValue Value in USD
     */
    function getStockToCryptoQuote(
        string memory _stockSymbol,
        uint256 _stockAmount
    ) external view returns (uint256 usdValue) {
        if (!stocks[_stockSymbol].active) revert StockNotListed();
        usdValue = (stocks[_stockSymbol].priceUSD * _stockAmount) / 1e18;
    }
    
    /**
     * @notice Get quote for crypto → stock swap
     * @param _cryptoAmount Amount of crypto (in USDC)
     * @param _stockSymbol Stock to buy
     * @return stockAmount Amount of stock tokens received
     */
    function getCryptoToStockQuote(
        uint256 _cryptoAmount,
        string memory _stockSymbol
    ) external view returns (uint256 stockAmount) {
        if (!stocks[_stockSymbol].active) revert StockNotListed();
        stockAmount = (_cryptoAmount * 1e18) / stocks[_stockSymbol].priceUSD;
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function getStockInfo(string memory _symbol)
        external
        view
        returns (StockToken memory)
    {
        return stocks[_symbol];
    }
    
    function getUserStockBalance(address _user, string memory _symbol)
        external
        view
        returns (uint256)
    {
        return stockBalances[_user][_symbol];
    }
    
    function getAllStocks() external view returns (string[] memory) {
        return stockSymbols;
    }
}

