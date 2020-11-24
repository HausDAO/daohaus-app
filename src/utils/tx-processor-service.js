export class TxProcessorService {
  web3;
  forceUpdate;
  forceUpdateGraphResolved;
  constructor(web3) {
    this.web3 = web3;
  }

  async update(account) {
    const _txList = this.getTxPendingList(account);
    const _pending = [];

    if (_txList.length) {
      _txList.forEach((tx) => {
        _pending.push(this.checkTransaction(tx, account));
      });
    }

    return await Promise.all(_pending);
  }

  async updateGraph(account, data) {
    const _txList = this.getTxPendingGraphList(account);

    if (_txList.length) {
      _txList.forEach((tx) => {
        console.log('banananananannananan', tx);
        this.checkData(tx, account, data);
      });
    }
  }

  async checkTransaction(tx, account) {
    const status = await this.web3.eth.getTransaction(tx.tx);
    if (status && status.blockNumber) {
      console.log('tx status', status);
      //open false
      this.setTx(tx.tx, account, tx.description, false, true, tx.pendingGraph);
    }
  }

  checkData(tx, account, entities) {
    let status = '';
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$ tx', tx);
    switch (tx.details.name) {
      case 'sponsorProposal': {
        const entity = entities.find(
          (item) => +item.proposalId === +tx.details.params[0],
        );
        status = entity?.sponsored;
      }
    }

    if (status) {
      console.log('tx status blablbablalbalb', status);
      //pendingGraph false
      console.log(
        'tx status',
        tx.tx,
        account,
        'completed',
        tx.open,
        tx.seen,
        false,
      );

      this.setTx(tx.tx, account, 'completed', tx.open, tx.seen, false);
      this.forceUpdateGraphResolved = false;
    }
  }

  seeTransaction(transactionHash, account) {
    const tx = this.getTx(transactionHash);
    this.setTx(
      transactionHash,
      account,
      tx.details,
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

    console.log('setTx', tx, account, details);
    console.log('setTx pendingGraph', pendingGraph);
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = {};
    const exists = _txList.findIndex((item) => item.tx === tx);

    if (exists === -1) {
      console.log('exists', exists);
      txItem.tx = tx;
      txItem.account = account;
      txItem.open = open;
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
