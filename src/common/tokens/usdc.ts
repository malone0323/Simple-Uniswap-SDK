import { ChainId } from '../../enums/chain-id';

/**
 * USDC token context CHANGE CONTRACT ADDRESS INFO ETC
 */
export class USDC {
  public static MAINNET() {
    return {
      chainId: ChainId.MAINNET,
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 18,
      symbol: 'USDC',
      name: 'Wrapped Ether',
    };
  }

  public static ROPSTEN() {
    return {
      chainId: ChainId.ROPSTEN,
      contractAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      decimals: 18,
      symbol: 'USDC',
      name: 'Wrapped Ether',
    };
  }

  public static RINKEBY() {
    return {
      chainId: ChainId.RINKEBY,
      contractAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      decimals: 18,
      symbol: 'USDC',
      name: 'Wrapped Ether',
    };
  }

  public static GORLI() {
    return {
      chainId: ChainId.GÖRLI,
      contractAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      decimals: 18,
      symbol: 'USDC',
      name: 'Wrapped Ether',
    };
  }

  public static KOVAN() {
    return {
      chainId: ChainId.KOVAN,
      contractAddress: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
      decimals: 18,
      symbol: 'USDC',
      name: 'Wrapped Ether',
    };
  }

  /**
   * Get WETH token info by chain id
   * @param chainId The chain id
   */
  public static token(chainId: ChainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        return this.MAINNET();
      case ChainId.ROPSTEN:
        return this.ROPSTEN();
      case ChainId.RINKEBY:
        return this.RINKEBY();
      case ChainId.GÖRLI:
        return this.GORLI();
      case ChainId.KOVAN:
        return this.KOVAN();
      default:
        throw new Error(`${chainId} is not allowed`);
    }
  }
}
