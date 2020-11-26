import { txIsUpdated } from './tx-processor-helper';

export class TxProcessorService {
  web3;
  forceUpdate;
  constructor(web3) {
    this.web3 = web3;
    this.updateGraphStatus = this.updateGraphStatus; // eslint-disable-line
    this.checkData = this.checkData; // eslint-disable-line
    this.seeTransaction = this.seeTransaction; // eslint-disable-line
    this.setTx = this.setTx; // eslint-disable-line
    this.getTxList = this.getTxList; // eslint-disable-line
    this.getTxPendingList = this.getTxPendingList; // eslint-disable-line
    this.getTxPendingGraphList = this.getTxPendingGraphList; // eslint-disable-line
    this.getTxUnseenList = this.getTxUnseenList; // eslint-disable-line
    this.getTx = this.getTx; // eslint-disable-line
    this.clearHistory = this.clearHistory; // eslint-disable-line
  }

  // async update(account) {
  //   const _txList = this.getTxPendingList(account);
  //   const _pending = [];

  //   if (_txList.length) {
  //     _txList.forEach((tx) => {
  //       _pending.push(this.checkTransaction(tx, account));
  //     });
  //   }

  //   return await Promise.all(_pending);
  // }

  async updateGraphStatus(account, data) {
    const _txList = this.getTxPendingGraphList(account);

    if (_txList.length) {
      _txList.forEach((tx) => {
        this.checkData(tx, account, data);
      });
    }
  }

  // use to check onchain transactions
  // async checkTransaction(tx, account) {
  //   const status = await this.web3.eth.getTransaction(tx.tx);
  //   if (status && status.blockNumber) {
  //     console.log('tx status', status);
  //     //open false
  //     this.setTx(
  //       tx.tx,
  //       account,
  //       tx.description,
  //       tx.open,
  //       true,
  //       tx.pendingGraph,
  //     );
  //   }
  // }

  checkData(tx, account, entities) {
    const status = txIsUpdated(tx, entities);

    if (status) {
      console.log('tx status', status);
      this.setTx(tx.tx, account, 'completed', tx.open, tx.seen, false);
    }
  }

  seeTransaction(transactionHash, account) {
    const tx = this.getTx(transactionHash);
    this.setTx(
      transactionHash,
      account,
      'Started',
      tx.open,
      true,
      tx.pendingGraph,
    );
  }

  setTx(
    tx,
    account,
    details = '',
    open = true,
    seen = false,
    pendingGraph = true,
  ) {
    if (!tx) {
      // can not save to history if no tx hash
      console.log('tx hash is null, something went wrong');
      return;
    }
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = {};
    const exists = _txList.findIndex((item) => item.tx === tx);

    if (exists === -1) {
      console.log('exists', exists);
      txItem.tx = tx;
      txItem.account = account;
      txItem.open = open; // not being used
      txItem.details = details;
      txItem.seen = seen;
      txItem.pendingGraph = pendingGraph;
      txItem.dateAdded = Date.now();
      _txList.push(txItem);
      localStorage.setItem('txList', JSON.stringify(_txList));
    } else if (_txList[exists].open !== open) {
      _txList[exists].open = open;
      localStorage.setItem('txList', JSON.stringify(_txList));
    } else if (_txList[exists].seen !== seen) {
      _txList[exists].seen = seen;
      localStorage.setItem('txList', JSON.stringify(_txList));
    } else if (_txList[exists].pendingGraph !== pendingGraph) {
      _txList[exists].pendingGraph = pendingGraph;
      localStorage.setItem('txList', JSON.stringify(_txList));
    }
    // setTxList(_txList);
    return _txList;
  }

  getTxList(account) {
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];

    return _txList.filter((item) => item.account === account);
  }

  getTxPendingList(account) {
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];
    return _txList.filter((item) => item.account === account && item.open);
  }

  getTxPendingGraphList(account) {
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];
    return _txList.filter(
      (item) => item.account === account && item.pendingGraph,
    );
  }

  getTxUnseenList(account) {
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];

    return _txList.filter(
      (item) => item.account === account && !item.seen && item.open,
    );
  }

  getTx(tx) {
    return JSON.parse(localStorage.getItem('txList')).find(
      (item) => item.tx === tx,
    );
  }

  clearHistory() {
    localStorage.removeItem('txList');
    // needs to clear for account
    // setTxList({ txList: [] });
    return { txList: [] };
  }
}
