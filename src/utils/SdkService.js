import Web3 from 'web3';
import { sdkConstants } from '@archanova/sdk';

const bnZed = Web3.utils.toBN(0);

const gasPriceStrategy = sdkConstants.GasPriceStrategies.Fast;
export default class SdkService {
  sdk;
  constructor(sdk) {
    this.sdk = sdk;
  }

  getWeiBalance() {
    return Web3.utils.toBN(this.sdk.state.account.balance.real.toString() || 0);
  }

  getAccountState() {
    return this.sdk.state.account.state;
  }

  async deployAccount() {
    const estimated = await this.sdk.estimateAccountDeployment(gasPriceStrategy);
    if (this.getWeiBalance().lt(estimated.totalCost)) {
      throw new Error(
        `you need more ETH for gas, at least: ${this.web3.utils.fromWei(
          estimated.totalCost.toString(),
        )}`,
      );
    }
    const data = await this.sdk.deployAccount(estimated);
    return data;
  }

  async submit(
    encodedData,
    destinationAddress = this.daoAddress,
    value = bnZed,
  ) {
    
    const estimated = await this.sdk.estimateAccountTransaction(
      destinationAddress,
      value,
      encodedData,
    );
    if (this.getWeiBalance().lt(estimated.totalCost)) {
      throw new Error(
        `you need more ETH for gas, at least: ${this.web3.utils.fromWei(
          estimated.totalCost.toString(),
        )}`,
      );
    }
    const hash = await this.sdk.submitAccountTransaction(estimated);
    return hash;
  }
}
