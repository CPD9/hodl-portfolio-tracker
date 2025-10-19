// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "./interfaces/IERC20.sol";
import {ISwapRouter} from "./interfaces/ISwapRouter.sol";

/**
 * @title PortfolioRebalancer
 * @notice Automated portfolio rebalancing contract for HODL app
 * @dev Allows users to set target allocations and automatically rebalance via Uniswap V3
 */
contract PortfolioRebalancer {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error InvalidAllocation();
    error Unauthorized();
    error InsufficientBalance();
    error SwapFailed();
    error InvalidToken();

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event PortfolioCreated(address indexed user, uint256 portfolioId);
    event AllocationUpdated(
        address indexed user,
        uint256 portfolioId,
        address token,
        uint256 targetPercentage
    );
    event Rebalanced(
        address indexed user,
        uint256 portfolioId,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/
    struct TokenAllocation {
        address token;
        uint256 targetPercentage; // in basis points (10000 = 100%)
        uint256 currentAmount;
    }

    struct Portfolio {
        string name;
        address owner;
        TokenAllocation[] allocations;
        uint256 lastRebalanced;
        bool active;
    }

    mapping(uint256 => Portfolio) public portfolios;
    mapping(address => uint256[]) public userPortfolios;
    uint256 public portfolioCounter;

    ISwapRouter public immutable swapRouter;
    uint24 public constant DEFAULT_POOL_FEE = 3000; // 0.3%

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
    }

    /*//////////////////////////////////////////////////////////////
                            PORTFOLIO MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice Create a new portfolio with target allocations
     * @param _name Portfolio name
     * @param _tokens Array of token addresses
     * @param _targetPercentages Array of target percentages (in basis points)
     */
    function createPortfolio(
        string memory _name,
        address[] memory _tokens,
        uint256[] memory _targetPercentages
    ) external returns (uint256) {
        if (_tokens.length != _targetPercentages.length) revert InvalidAllocation();
        
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _targetPercentages.length; i++) {
            totalPercentage += _targetPercentages[i];
        }
        if (totalPercentage != 10000) revert InvalidAllocation(); // Must equal 100%

        uint256 portfolioId = portfolioCounter++;
        Portfolio storage portfolio = portfolios[portfolioId];
        portfolio.name = _name;
        portfolio.owner = msg.sender;
        portfolio.active = true;
        portfolio.lastRebalanced = block.timestamp;

        for (uint256 i = 0; i < _tokens.length; i++) {
            portfolio.allocations.push(
                TokenAllocation({
                    token: _tokens[i],
                    targetPercentage: _targetPercentages[i],
                    currentAmount: 0
                })
            );
        }

        userPortfolios[msg.sender].push(portfolioId);
        emit PortfolioCreated(msg.sender, portfolioId);
        
        return portfolioId;
    }

    /**
     * @notice Update target allocation for a token
     * @param _portfolioId Portfolio ID
     * @param _tokenIndex Index of token in allocations array
     * @param _newPercentage New target percentage
     */
    function updateAllocation(
        uint256 _portfolioId,
        uint256 _tokenIndex,
        uint256 _newPercentage
    ) external {
        Portfolio storage portfolio = portfolios[_portfolioId];
        if (portfolio.owner != msg.sender) revert Unauthorized();

        portfolio.allocations[_tokenIndex].targetPercentage = _newPercentage;
        
        // Verify total still equals 100%
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < portfolio.allocations.length; i++) {
            totalPercentage += portfolio.allocations[i].targetPercentage;
        }
        if (totalPercentage != 10000) revert InvalidAllocation();

        emit AllocationUpdated(
            msg.sender,
            _portfolioId,
            portfolio.allocations[_tokenIndex].token,
            _newPercentage
        );
    }

    /**
     * @notice Rebalance portfolio to target allocations
     * @param _portfolioId Portfolio ID
     * @param _totalValue Total portfolio value in wei
     */
    function rebalance(uint256 _portfolioId, uint256 _totalValue) external {
        Portfolio storage portfolio = portfolios[_portfolioId];
        if (portfolio.owner != msg.sender) revert Unauthorized();
        if (!portfolio.active) revert Unauthorized();

        // Calculate target amounts for each token
        for (uint256 i = 0; i < portfolio.allocations.length; i++) {
            TokenAllocation storage allocation = portfolio.allocations[i];
            uint256 targetAmount = (_totalValue * allocation.targetPercentage) / 10000;
            
            // Get current balance
            uint256 currentBalance = IERC20(allocation.token).balanceOf(msg.sender);
            allocation.currentAmount = currentBalance;

            // If we need to buy more
            if (currentBalance < targetAmount) {
                uint256 amountNeeded = targetAmount - currentBalance;
                _executeSwap(msg.sender, allocation.token, amountNeeded);
            }
            // If we need to sell some
            else if (currentBalance > targetAmount) {
                uint256 amountToSell = currentBalance - targetAmount;
                _executeSwap(allocation.token, msg.sender, amountToSell);
            }
        }

        portfolio.lastRebalanced = block.timestamp;
        emit Rebalanced(msg.sender, _portfolioId, block.timestamp);
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _executeSwap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) internal {
        // This is a simplified swap function
        // In production, you'd implement proper Uniswap V3 swap logic
        // with slippage protection, deadline, etc.
        
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: DEFAULT_POOL_FEE,
                recipient: msg.sender,
                deadline: block.timestamp + 15 minutes,
                amountIn: _amountIn,
                amountOutMinimum: 0, // Should be calculated based on slippage tolerance
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle(params);
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getPortfolio(uint256 _portfolioId)
        external
        view
        returns (
            string memory name,
            address owner,
            TokenAllocation[] memory allocations,
            uint256 lastRebalanced,
            bool active
        )
    {
        Portfolio storage portfolio = portfolios[_portfolioId];
        return (
            portfolio.name,
            portfolio.owner,
            portfolio.allocations,
            portfolio.lastRebalanced,
            portfolio.active
        );
    }

    function getUserPortfolios(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userPortfolios[_user];
    }
}

