import { ethers } from 'ethers';
import { ErrorCodes } from '../../common/errors/error-codes';
import { UniswapError } from '../../common/errors/uniswap-error';
import { isAddress } from '../../common/utils/is-address';
import { ChainId } from '../../enums/chain-id';
import { EthersProvider } from '../../ethers-provider';
import { TokensFactory } from '../token/tokens.factory';
import {
  UniswapPairContextForChainId,
  UniswapPairContextForEthereumProvider,
  UniswapPairContextForProviderUrl,
} from './models/uniswap-pair-contexts';
import { UniswapPairFactoryContext } from './models/uniswap-pair-factory-context';
import { UniswapPairSettings } from './models/uniswap-pair-settings';
import { UniswapPairFactory } from './uniswap-pair.factory';

export class UniswapPair {
  private _ethersProvider: EthersProvider;

  constructor(
    private _uniswapPairContext:
      | UniswapPairContextForChainId
      | UniswapPairContextForProviderUrl
      | UniswapPairContextForEthereumProvider
  ) {
    if (!this._uniswapPairContext.fromTokenContractAddress) {
      throw new UniswapError(
        'Must have a `fromTokenContractAddress` on the context',
        ErrorCodes.fromTokenContractAddressRequired
      );
    }

    if (!isAddress(this._uniswapPairContext.fromTokenContractAddress)) {
      throw new UniswapError(
        '`fromTokenContractAddress` is not a valid contract address',
        ErrorCodes.fromTokenContractAddressNotValid
      );
    }

    this._uniswapPairContext.fromTokenContractAddress = ethers.utils.getAddress(
      this._uniswapPairContext.fromTokenContractAddress
    );

    if (!this._uniswapPairContext.toTokenContractAddress) {
      throw new UniswapError(
        'Must have a `toTokenContractAddress` on the context',
        ErrorCodes.toTokenContractAddressRequired
      );
    }

    if (!isAddress(this._uniswapPairContext.toTokenContractAddress)) {
      throw new UniswapError(
        '`toTokenContractAddress` is not a valid contract address',
        ErrorCodes.toTokenContractAddressNotValid
      );
    }

    this._uniswapPairContext.toTokenContractAddress = ethers.utils.getAddress(
      this._uniswapPairContext.toTokenContractAddress
    );

    if (!this._uniswapPairContext.ethereumAddress) {
      throw new UniswapError(
        'Must have a `ethereumAddress` on the context',
        ErrorCodes.ethereumAddressRequired
      );
    }

    if (!isAddress(this._uniswapPairContext.ethereumAddress)) {
      throw new UniswapError(
        '`ethereumAddress` is not a valid address',
        ErrorCodes.ethereumAddressNotValid
      );
    }

    this._uniswapPairContext.ethereumAddress = ethers.utils.getAddress(
      this._uniswapPairContext.ethereumAddress
    );

    const chainId = (<UniswapPairContextForChainId>this._uniswapPairContext)
      .chainId;

    const providerUrl = (<UniswapPairContextForProviderUrl>(
      this._uniswapPairContext
    )).providerUrl;

    if (providerUrl && chainId) {
      this._ethersProvider = new EthersProvider({ chainId, providerUrl });
      return;
    }

    if (chainId) {
      this._ethersProvider = new EthersProvider({ chainId });
      return;
    }

    const ethereumProvider = (<UniswapPairContextForEthereumProvider>(
      this._uniswapPairContext
    )).ethereumProvider;

    if (ethereumProvider) {
      this._ethersProvider = new EthersProvider({ ethereumProvider });
      return;
    }

    throw new UniswapError(
      'Your must supply a chainId or a ethereum provider please look at types `UniswapPairContextForEthereumProvider`, `UniswapPairContextForChainId` and `UniswapPairContextForProviderUrl` to make sure your object is correct in what your passing in',
      ErrorCodes.invalidPairContext
    );
  }

  /**
   * Create factory to be able to call methods on the 2 tokens
   */
  public async createFactory(): Promise<UniswapPairFactory> {
    const chainId = this._ethersProvider.network().chainId;
    if (
      chainId !== ChainId.MAINNET &&
      chainId !== ChainId.ROPSTEN &&
      chainId !== ChainId.RINKEBY &&
      chainId !== ChainId.GÖRLI &&
      chainId !== ChainId.KOVAN
    ) {
      throw new UniswapError(
        `ChainId - ${chainId} is not supported. This lib only supports mainnet(1), ropsten(4), kovan(42), rinkeby(4), görli(5) and ropsten(3)`,
        ErrorCodes.chainIdNotSupported
      );
    }

    const tokensFactory = new TokensFactory(this._ethersProvider);
    const tokens = await tokensFactory.getTokens([
      this._uniswapPairContext.fromTokenContractAddress,
      this._uniswapPairContext.toTokenContractAddress,
    ]);

    const uniswapFactoryContext: UniswapPairFactoryContext = {
      fromToken: tokens.find(
        (t) =>
          t.contractAddress ===
          this._uniswapPairContext.fromTokenContractAddress
      )!,
      toToken: tokens.find(
        (t) =>
          t.contractAddress === this._uniswapPairContext.toTokenContractAddress
      )!,
      ethereumAddress: this._uniswapPairContext.ethereumAddress,
      settings: this._uniswapPairContext.settings || new UniswapPairSettings(),
      ethersProvider: this._ethersProvider,
    };

    return new UniswapPairFactory(uniswapFactoryContext);
  }
}
