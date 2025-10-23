import { ethers } from 'ethers';
import {
  STOCK_CRYPTO_SWAP_ADDRESS,
  STOCK_CRYPTO_SWAP_ABI,
  STOCK_TOKENS,
  USDC_ADDRESS,
  WETH_ADDRESS,
  ERC20_ABI,
  type StockSymbol,
  type StockInfo
} from '@/lib/contracts/stockCryptoSwap';
import {
  UNISWAP_ROUTER_ADDRESS,
  UNISWAP_ROUTER_ABI
} from '@/lib/contracts/uniswapRouter';

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: bigint;
  minOutput: bigint;
  deadline: number;
  userAddress: string;
}

export interface QuoteResult {
  outputAmount: bigint;
  route: string[];
  priceImpact: number;
  exchangeRate: string;
}

export type SwapType = 'stock-to-crypto' | 'crypto-to-stock' | 'crypto-to-crypto' | 'stock-to-stock';

export class SwapService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(provider?: ethers.providers.Web3Provider) {
    if (provider) {
      this.provider = provider;
      this.signer = provider.getSigner();
    }
  }

  /**
   * Connect to Web3 provider (MetaMask)
   */
  async connect(): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = this.provider.getSigner();
  }

  /**
   * Determine swap type based on from and to tokens
   */
  private getSwapType(fromToken: string, toToken: string): SwapType {
    const isFromStock = Object.values(STOCK_TOKENS).includes(fromToken);
    const isToStock = Object.values(STOCK_TOKENS).includes(toToken);

    if (isFromStock && !isToStock) return 'stock-to-crypto';
    if (!isFromStock && isToStock) return 'crypto-to-stock';
    if (isFromStock && isToStock) return 'stock-to-stock';
    return 'crypto-to-crypto';
  }

  /**
   * Get stock symbol from token address
   */
  private getStockSymbol(tokenAddress: string): StockSymbol | null {
    const entry = Object.entries(STOCK_TOKENS).find(([_, addr]) => 
      addr.toLowerCase() === tokenAddress.toLowerCase()
    );
    return entry ? (entry[0] as StockSymbol) : null;
  }

  /**
   * Get quote for swap
   */
  async getQuote(
    fromToken: string,
    toToken: string,
    amount: bigint
  ): Promise<QuoteResult> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const swapType = this.getSwapType(fromToken, toToken);

    switch (swapType) {
      case 'stock-to-crypto':
        return this.getStockToCryptoQuote(fromToken, toToken, amount);
      
      case 'crypto-to-stock':
        return this.getCryptoToStockQuote(fromToken, toToken, amount);
      
      case 'crypto-to-crypto':
        return this.getCryptoToCryptoQuote(fromToken, toToken, amount);
      
      case 'stock-to-stock':
        // Stock-to-stock goes through USDC intermediary
        return this.getStockToStockQuote(fromToken, toToken, amount);
      
      default:
        throw new Error('Invalid swap type');
    }
  }

  /**
   * Get quote for stock → crypto swap
   */
  private async getStockToCryptoQuote(
    stockToken: string,
    cryptoToken: string,
    amount: bigint
  ): Promise<QuoteResult> {
    const stockSymbol = this.getStockSymbol(stockToken);
    if (!stockSymbol) throw new Error('Invalid stock token');

    const contract = new ethers.Contract(
      STOCK_CRYPTO_SWAP_ADDRESS,
      STOCK_CRYPTO_SWAP_ABI,
      this.provider!
    );

    // Get USD value of stock
    const usdValue = await contract.getStockToCryptoQuote(stockSymbol, amount);

    // Route: Stock → USDC → Crypto
    const route = [stockToken, USDC_ADDRESS, cryptoToken];

    // If target is USDC, no need for additional conversion
    if (cryptoToken.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
      return {
        outputAmount: usdValue,
        route: [stockToken, USDC_ADDRESS],
        priceImpact: 0.1, // Minimal price impact
        exchangeRate: (Number(usdValue) / Number(amount)).toString()
      };
    }

    // Otherwise, get USDC → Crypto quote from Uniswap
    const routerContract = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      UNISWAP_ROUTER_ABI,
      this.provider!
    );

    try {
      const amounts = await routerContract.getAmountsOut(usdValue, [USDC_ADDRESS, cryptoToken]);
      const outputAmount = amounts[amounts.length - 1];

      return {
        outputAmount,
        route,
        priceImpact: 0.3, // Estimated
        exchangeRate: (Number(outputAmount) / Number(amount)).toString()
      };
    } catch (error) {
      // Fallback if no liquidity pool exists
      return {
        outputAmount: usdValue, // 1:1 with USDC
        route: [stockToken, USDC_ADDRESS],
        priceImpact: 0,
        exchangeRate: (Number(usdValue) / Number(amount)).toString()
      };
    }
  }

  /**
   * Get quote for crypto → stock swap
   */
  private async getCryptoToStockQuote(
    cryptoToken: string,
    stockToken: string,
    amount: bigint
  ): Promise<QuoteResult> {
    const stockSymbol = this.getStockSymbol(stockToken);
    if (!stockSymbol) throw new Error('Invalid stock token');

    const contract = new ethers.Contract(
      STOCK_CRYPTO_SWAP_ADDRESS,
      STOCK_CRYPTO_SWAP_ABI,
      this.provider!
    );

    // If source is USDC, direct conversion
    if (cryptoToken.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
      const stockAmount = await contract.getCryptoToStockQuote(amount, stockSymbol);
      
      return {
        outputAmount: stockAmount,
        route: [USDC_ADDRESS, stockToken],
        priceImpact: 0.1,
        exchangeRate: (Number(stockAmount) / Number(amount)).toString()
      };
    }

    // Otherwise, convert Crypto → USDC first via Uniswap
    const routerContract = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      UNISWAP_ROUTER_ABI,
      this.provider!
    );

    const amounts = await routerContract.getAmountsOut(amount, [cryptoToken, USDC_ADDRESS]);
    const usdcAmount = amounts[amounts.length - 1];

    const stockAmount = await contract.getCryptoToStockQuote(usdcAmount, stockSymbol);

    return {
      outputAmount: stockAmount,
      route: [cryptoToken, USDC_ADDRESS, stockToken],
      priceImpact: 0.3,
      exchangeRate: (Number(stockAmount) / Number(amount)).toString()
    };
  }

  /**
   * Get quote for crypto → crypto swap (via Uniswap)
   */
  private async getCryptoToCryptoQuote(
    fromToken: string,
    toToken: string,
    amount: bigint
  ): Promise<QuoteResult> {
    const routerContract = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      UNISWAP_ROUTER_ABI,
      this.provider!
    );

    // Try direct path first
    try {
      const amounts = await routerContract.getAmountsOut(amount, [fromToken, toToken]);
      const outputAmount = amounts[amounts.length - 1];

      return {
        outputAmount,
        route: [fromToken, toToken],
        priceImpact: 0.3,
        exchangeRate: (Number(outputAmount) / Number(amount)).toString()
      };
    } catch {
      // Try routing through USDC
      const amounts = await routerContract.getAmountsOut(amount, [fromToken, USDC_ADDRESS, toToken]);
      const outputAmount = amounts[amounts.length - 1];

      return {
        outputAmount,
        route: [fromToken, USDC_ADDRESS, toToken],
        priceImpact: 0.5,
        exchangeRate: (Number(outputAmount) / Number(amount)).toString()
      };
    }
  }

  /**
   * Get quote for stock → stock swap (via USDC intermediary)
   */
  private async getStockToStockQuote(
    fromStock: string,
    toStock: string,
    amount: bigint
  ): Promise<QuoteResult> {
    // Convert from stock → USDC
    const usdQuote = await this.getStockToCryptoQuote(fromStock, USDC_ADDRESS, amount);
    
    // Convert USDC → to stock
    const finalQuote = await this.getCryptoToStockQuote(USDC_ADDRESS, toStock, usdQuote.outputAmount);

    return {
      outputAmount: finalQuote.outputAmount,
      route: [fromStock, USDC_ADDRESS, toStock],
      priceImpact: 0.5,
      exchangeRate: (Number(finalQuote.outputAmount) / Number(amount)).toString()
    };
  }

  /**
   * Approve token spending
   */
  async approveToken(tokenAddress: string, spenderAddress: string, amount: bigint): Promise<ethers.ContractTransaction> {
    if (!this.signer) throw new Error('Signer not initialized');

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    return tokenContract.approve(spenderAddress, amount);
  }

  /**
   * Check token allowance
   */
  async checkAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<bigint> {
    if (!this.provider) throw new Error('Provider not initialized');

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    return tokenContract.allowance(ownerAddress, spenderAddress);
  }

  /**
   * Execute swap
   */
  async executeSwap(params: SwapParams): Promise<ethers.ContractTransaction> {
    if (!this.signer) throw new Error('Signer not initialized');

    const swapType = this.getSwapType(params.fromToken, params.toToken);

    switch (swapType) {
      case 'stock-to-crypto':
        return this.executeStockToCryptoSwap(params);
      
      case 'crypto-to-stock':
        return this.executeCryptoToStockSwap(params);
      
      case 'crypto-to-crypto':
        return this.executeCryptoToCryptoSwap(params);
      
      case 'stock-to-stock':
        throw new Error('Stock-to-stock swaps must be done in two steps');
      
      default:
        throw new Error('Invalid swap type');
    }
  }

  /**
   * Execute stock → crypto swap
   */
  private async executeStockToCryptoSwap(params: SwapParams): Promise<ethers.ContractTransaction> {
    const stockSymbol = this.getStockSymbol(params.fromToken);
    if (!stockSymbol) throw new Error('Invalid stock token');

    const contract = new ethers.Contract(
      STOCK_CRYPTO_SWAP_ADDRESS,
      STOCK_CRYPTO_SWAP_ABI,
      this.signer!
    );

    return contract.swapStockForCrypto(
      stockSymbol,
      params.amount,
      params.toToken,
      params.minOutput
    );
  }

  /**
   * Execute crypto → stock swap
   */
  private async executeCryptoToStockSwap(params: SwapParams): Promise<ethers.ContractTransaction> {
    const stockSymbol = this.getStockSymbol(params.toToken);
    if (!stockSymbol) throw new Error('Invalid stock token');

    const contract = new ethers.Contract(
      STOCK_CRYPTO_SWAP_ADDRESS,
      STOCK_CRYPTO_SWAP_ABI,
      this.signer!
    );

    return contract.swapCryptoForStock(
      params.fromToken,
      params.amount,
      stockSymbol,
      params.minOutput
    );
  }

  /**
   * Execute crypto → crypto swap (via Uniswap)
   */
  private async executeCryptoToCryptoSwap(params: SwapParams): Promise<ethers.ContractTransaction> {
    const routerContract = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      UNISWAP_ROUTER_ABI,
      this.signer!
    );

    // Try direct path
    const path = [params.fromToken, params.toToken];

    return routerContract.swapExactTokensForTokens(
      params.amount,
      params.minOutput,
      path,
      params.userAddress,
      params.deadline
    );
  }

  /**
   * Get stock info from contract
   */
  async getStockInfo(symbol: StockSymbol): Promise<StockInfo> {
    if (!this.provider) throw new Error('Provider not initialized');

    const contract = new ethers.Contract(
      STOCK_CRYPTO_SWAP_ADDRESS,
      STOCK_CRYPTO_SWAP_ABI,
      this.provider
    );

    return contract.getStockInfo(symbol);
  }

  /**
   * Get token balance
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<bigint> {
    if (!this.provider) throw new Error('Provider not initialized');

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    return tokenContract.balanceOf(userAddress);
  }
}

// Singleton instance
export const swapService = new SwapService();

