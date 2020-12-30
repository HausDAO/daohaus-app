import v21FactoryAbi from '../contracts/molochV21.json';

import { post } from './requests';
import { supportedChains } from './chains';

export default class SummonService {
  constructor(web3, networkId) {
    this.web3 = web3;
    this.networkId = networkId;
    console.log('this.networkId', this.networkId);
    this.contract = new this.web3.eth.Contract(
      v21FactoryAbi,
      supportedChains[networkId].moloch_factory_addr,
    );
    this.summonTx = null;
  }

  // internal
  sendTx(options, callback) {
    const { from, name, params } = options;
    const tx = this.contract.methods[name](...params);
    return tx
      .send({ from: from })
      .on('transactionHash', (txHash) => {
        this.summonTx = txHash;
        this.setLocal({
          tx: this.summonTx,
        });
        callback(txHash, options);
      })
      .on('error', (error) => {
        this.setLocal({
          error: 'rejected tx.',
          tx: this.summonTx,
        });
        callback(null, error);
      });
  }

  async cacheNewMoloch(newMoloch) {
    const res = await post('dao', newMoloch);
    console.log('post response', res);
    if (!res) {
      console.log('moloch creation error');

      this.setLocal({
        tx: this.summonTx,
        error: 'cache error',
      });
    }
  }

  setLocal(newData) {
    let localMoloch = window.localStorage.getItem('pendingMoloch');
    if (localMoloch) {
      localMoloch = JSON.parse(localMoloch);
    }

    window.localStorage.setItem(
      'pendingMoloch',
      JSON.stringify({
        ...localMoloch,
        ...newData,
      }),
    );
  }

//   { "name": "_summoner", "type": "address[]" },
//   { "name": "_approvedTokens", "type": "address[]" },
//   { "name": "_periodDuration", "type": "uint256" },
//   { "name": "_votingPeriodLength", "type": "uint256" },
//   { "name": "_gracePeriodLength", "type": "uint256" },
//   { "name": "_proposalDeposit", "type": "uint256" },
//   { "name": "_dilutionBound", "type": "uint256" },
//   { "name": "_processingReward", "type": "uint256" },
//   { "name": "_summonerShares", "type": "uint256[]" }
  async summonMoloch(daoData, account, callback) {
    console.log('daoDAta', daoData);
    const cacheMoloch = {
      summonerAddress: account,
      name: daoData.name.trim(),
      minimumTribute: daoData.minimumTribute,
      description: daoData.description,
      version: daoData.version,
      purpose: daoData.presetName || 'Grants',
    };

    this.setLocal(cacheMoloch);
    const txReceipt = await this.sendTx(
      {
        from: account,
        name: 'summonMoloch',
        params: [
          [account],
          daoData.approvedToken.split(',').map((item) => item.trim()),
          daoData.periodDuration,
          daoData.votingPeriod,
          daoData.gracePeriod,
          daoData.proposalDeposit,
          daoData.dilutionBound,
          daoData.processingReward,
          daoData.summonerShares.split(',').map((item) => item.trim()),
        ],
      },
      callback,
    );
    await this.cacheNewMoloch(cacheMoloch);
    return txReceipt.transactionHash;
  }
}
