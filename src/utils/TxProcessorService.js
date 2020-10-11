export class TxProcessorService {
  web3;
  debounce = false;
  pendingCount = 0;
  constructor(web3) {
    this.web3 = web3;
  }

  async update(account) {
    const _txList = this.getTxPendingList(account);
    const _pending = [];
    this.pendingCount = _txList.length;

    if (_txList.length) {
      _txList.forEach((tx) => {
        _pending.push(this.checkTransaction(tx.tx, account));
      });
      await Promise.all(_pending);
    }
  }

  async checkTransaction(transactionHash, account) {
    const status = await this.web3.eth.getTransaction(transactionHash);
    if (status && status.blockNumber) {
      this.setTx(transactionHash, account, 'completed', false, true);
    }
  }

  seeTransaction(transactionHash, account) {
    const tx = this.getTx(transactionHash);
    this.setTx(transactionHash, account, tx.description, tx.open, true);
  }

  setTx(tx, account, description = '', open = true, seen = false) {
    if (!tx) {
      // can not save to history if no tx hash
      console.log('tx hash is null, something went wrong');
      return;
    }
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = {};
    const exists = _txList.findIndex((item) => item.tx === tx);

    if (exists === -1) {
      txItem.tx = tx;
      txItem.account = account;
      txItem.open = open;
      txItem.description = description;
      txItem.seen = seen;
      _txList.push(txItem);
      localStorage.setItem('txList', JSON.stringify(_txList));
    } else if (_txList[exists].open !== open) {
      _txList[exists].open = open;
      localStorage.setItem('txList', JSON.stringify(_txList));
    } else if (_txList[exists].seen !== seen) {
      _txList[exists].seen = seen;
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

  getTxUnseenList(account) {
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];

    return _txList.filter((item) => item.account === account && !item.seen);
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

export class ReadOnlyTxProcessorService extends TxProcessorService {
  getTxList() {
    return [];
  }
}
