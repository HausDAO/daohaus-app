import supportedChains from './chains';

export class TxProcessorService {
  web3;
  forceUpdate;
  constructor(web3) {
    this.web3 = web3;
  }

  async update(account) {
    const _txList = this.getTxPendingList(account);
    const _pending = [];

    if (_txList.length) {
      _txList.forEach((tx) => {
        _pending.push(this.checkTransaction(tx.tx, account));
      });
    }

    return await Promise.all(_pending);
  }

  async updateGraph(account) {
    const _txList = this.getTxPendingGraphList(account);
    const _pending = [];

    if (_txList.length) {
      _txList.forEach((tx) => {
        // struct with name and id
        // tx.query
        // {
        //   query: {proposals(where: {proposalId: 28}) {id}}
        //   }
        //   {
        //   query: {${txList.query.name}(where: {${txList.query.field}: ${txList.query.value}}) {id}}
        //   }
        const query = `{${tx.query.name}(where: {${tx.query.field}: ${tx.query.value}}) {id}}`;
        const url =
          supportedChains[process.env.REACT_APP_NETWORK_ID].subgraph_url;
        const res = fetch(url, {
          method: 'POST',
          body: JSON.stringify({ query }),
        });
        _pending.push(res); // *** check the subgraph
      });
    }

    return await Promise.all(_pending);
  }

  async checkTransaction(transactionHash, account) {
    const status = await this.web3.eth.getTransaction(transactionHash);
    if (status && status.blockNumber) {
      console.log('tx status', status);
      this.setTx(transactionHash, account, 'completed', false, true);
    }
  }

  seeTransaction(transactionHash, account) {
    const tx = this.getTx(transactionHash);
    this.setTx(transactionHash, account, tx.details, tx.open, true);
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
    const _txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = {};
    const exists = _txList.findIndex((item) => item.tx === tx);

    if (exists === -1) {
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
