import v21FactoryAbi from '../contracts/molochV21.json';

import { post, put } from './requests';
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
  sendTx(options, callback, cacheMoloch) {
    const { from, name, params } = options;
    const tx = this.contract.methods[name](...params);
    return tx
      .send({ from: from })
      .on('transactionHash', (txHash) => {
        this.summonTx = txHash;
        cacheMoloch.tx = this.summonTx;
        this.cacheNewMoloch(cacheMoloch);
        options.details = cacheMoloch;
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
      console.log('moloch api creation error');
      this.setLocal({
        error: 'cache error',
      });
    } else {
      this.setLocal(newMoloch);
    }
  }

  async updateMolochCache(newMoloch) {
    const res = await put('dao/update', newMoloch);
    console.log('post response', res);
    if (!res) {
      console.log('moloch api creation error');
      this.setLocal({
        error: 'cache error',
      });
    } else {
      this.setLocal(newMoloch);
    }
  }

  setLocal(newData) {
    let localMoloch = window.localStorage.getItem('pendingMoloch');
    if (localMoloch) {
      localMoloch = JSON.parse(localMoloch);
    }

    window.localStorage.setItem(
      'pendingMolochy',
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
    const _cacheMoloch = {
      summonerAddress: daoData.summoner[0],
      network: supportedChains[this.networkId].network,
      name: daoData.name.trim(),
      minimumTribute: daoData.minimumTribute,
      description: daoData.description,
      version: daoData.version,
      purpose: daoData.presetName || 'Grants',
    };

    const txReceipt = await this.sendTx(
      {
        from: account,
        name: 'summonMoloch',
        params: [
          daoData.summoner,
          daoData.approvedToken.split(',').map((item) => item.trim()),
          daoData.periodDuration,
          daoData.votingPeriod,
          daoData.gracePeriod,
          daoData.proposalDeposit,
          daoData.dilutionBound,
          daoData.processingReward,
          daoData.summonerShares,
        ],
      },
      callback,
      _cacheMoloch,
    );
    console.log('txReceipt', txReceipt);
    _cacheMoloch.tx = txReceipt.transactionHash;
    _cacheMoloch.contractAddress =
      txReceipt.events.SummonComplete.returnValues.moloch;
    await this.cacheNewMoloch(_cacheMoloch);

    return txReceipt.transactionHash;
  }
}
