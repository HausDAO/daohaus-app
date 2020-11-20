import DaoAbi from '../contracts/mcdao.json';
import DaoAbiV2 from '../contracts/molochv2.json';

export class MolochService {
  web3;
  daoContract;
  accountAddr;
  contractAddr;
  version;

  constructor(web3, daoAddress, accountAddr, version) {
    this.web3 = web3;
    const abi = version === 2 ? DaoAbiV2 : DaoAbi;
    this.daoContract = new web3.eth.Contract(abi, daoAddress);
    this.accountAddr = accountAddr;
    this.contractAddr = daoAddress;
    this.version = version;
  }

  // internal
  sendTx(options, callback) {
    const { name, params } = options;
    const tx = this.daoContract.methods[name](...params);
    console.log('this.accountAddr', this.accountAddr);
    return tx
      .send({ from: this.accountAddr })
      .on('transactionHash', (txHash) => {
        console.log('txHash', txHash);
        callback(txHash, options);
      });
  }

  async getAllEvents() {
    const events = await this.daoContract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  }

  async getCurrentPeriod() {
    const currentPeriod = await this.daoContract.methods
      .getCurrentPeriod()
      .call();
    return currentPeriod;
  }

  async getTotalShares(atBlock = 'latest') {
    const totalShares = await this.daoContract.methods
      .totalShares()
      .call({}, atBlock);
    return totalShares;
  }

  async getGracePeriodLength() {
    const gracePeriod = await this.daoContract.methods
      .gracePeriodLength()
      .call();
    return gracePeriod;
  }

  async getVotingPeriodLength() {
    const votingPeriod = await this.daoContract.methods
      .votingPeriodLength()
      .call();
    return votingPeriod;
  }

  async getPeriodDuration() {
    const periodDuration = await this.daoContract.methods
      .periodDuration()
      .call();
    return periodDuration;
  }

  async getProcessingReward() {
    const processingReward = await this.daoContract.methods
      .processingReward()
      .call();
    return processingReward;
  }

  async getProposalDeposit() {
    const proposalDeposit = await this.daoContract.methods
      .proposalDeposit()
      .call();
    return proposalDeposit;
  }

  async getGuildBankAddr() {
    const guildBank = await this.daoContract.methods.guildBank().call();
    return guildBank;
  }

  async approvedToken() {
    const tokenAddress = await this.daoContract.methods.approvedToken().call();
    return tokenAddress;
  }

  async members(account) {
    const members = await this.daoContract.methods.members(account).call();
    return members;
  }

  async memberAddressByDelegateKey(account) {
    const addressByDelegateKey = await this.daoContract.methods
      .memberAddressByDelegateKey(account)
      .call();
    return addressByDelegateKey.toLowerCase();
  }

  async canRagequit(highestIndexYesVote) {
    const canRage = await this.daoContract.methods
      .canRagequit(highestIndexYesVote)
      .call();
    return canRage;
  }

  async guildBank() {
    const guildBank = await this.daoContract.methods.guildBank().call();
    return guildBank;
  }

  async proposalQueue(id) {
    const info = await this.daoContract.methods.proposalQueue(id).call();
    return info;
  }

  async getApprovedTokens() {
    const tokenAddresses = await this.daoContract.methods
      .approvedTokens()
      .call();
    return tokenAddresses;
  }

  async getDepositToken() {
    const token = await this.daoContract.methods.depositToken().call();
    return token;
  }

  async getMemberProposalVote(address, index) {
    const proposalVote = await this.daoContract.methods
      .getMemberProposalVote(address, index)
      .call();
    return proposalVote;
  }

  async getProposalFlags(id) {
    const flags = await this.daoContract.methods.getProposalFlags(id).call();
    return flags;
  }

  async getUserTokenBalance(userAddress, tokenAddress) {
    const balance = await this.daoContract.methods
      .getUserTokenBalance(userAddress, tokenAddress)
      .call();
    return balance;
  }

  async hasVotingPeriodExpired(period) {
    const expired = await this.daoContract.methods
      .hasVotingPeriodExpired(period)
      .call();
    return expired;
  }

  async proposals(id) {
    const info = await this.daoContract.methods.proposals(+id).call();
    return info;
  }

  async proposedToKick(address) {
    const kick = await this.daoContract.methods.proposedToKick(address).call();
    return kick;
  }

  async proposedToWhitelist(address) {
    const whitelist = await this.daoContract.methods
      .proposedToWhitelist(address)
      .call();
    return whitelist;
  }

  async getTokenWhitelist(address) {
    const whitelist = await this.daoContract.methods
      .tokenWhitelist(address)
      .call();
    return whitelist;
  }

  async getTotalLoot() {
    const loot = await this.daoContract.methods.totalLoot().call();
    return loot;
  }

  async getUserTokenBalances(userAddress) {}
}

export class ReadonlyMolochService extends MolochService {
  async deployAccount() {
    throw new Error(`This account type cannot call deployAccount`);
  }
}

export class Web3MolochService extends MolochService {
  async submitVote(proposalIndex, uintVote, callback) {
    const txReceipt = await this.sendTx(
      { name: 'submitVote', params: [proposalIndex, uintVote] },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async rageQuit(amount, callback) {
    const txReceipt = await this.sendTx(
      { name: 'ragequit', params: [amount] },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async processProposal(id, callback) {
    const txReceipt = await this.sendTx(
      { name: 'processProposal', params: [id] },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async updateDelegateKey(newDelegateKey, callback) {
    const txReceipt = await this.sendTx(
      { name: 'updateDelegateKey', params: [newDelegateKey] },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async submitProposal(
    applicant,
    tokenTribute,
    sharesRequested,
    details,
    callback,
  ) {
    const txReceipt = await this.sendTx(
      {
        name: 'submitProposal',
        params: [applicant, tokenTribute, sharesRequested, details],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async deployAccount() {
    throw new Error(`This account type cannot call deployAccount`);
  }
}

export class Web3MolochServiceV2 extends Web3MolochService {
  async rageQuit(amountShares = 0, amountLoot = 0, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'ragequit',
        params: [amountShares, amountLoot],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async cancelProposal(id, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'cancelProposal',
        params: [id],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async processGuildKickProposal(id, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'processGuildKickProposal',
        params: [id],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async processWhitelistProposal(id, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'processWhitelistProposal',
        params: [id],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async ragekick(address, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'ragekick',
        params: [address],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async sponsorProposal(id, callback = null) {
    const txReceipt = await this.sendTx(
      {
        name: 'sponsorProposal',
        params: [id],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async submitProposal(
    sharesRequested,
    lootRequested,
    tributeOffered,
    tributeToken,
    paymentRequested,
    PaymentToken,
    details,
    applicant,
    callback = null,
  ) {
    const txReceipt = await this.sendTx(
      {
        name: 'submitProposal',
        params: [
          applicant,
          sharesRequested,
          lootRequested,
          tributeOffered,
          tributeToken,
          paymentRequested,
          PaymentToken,
          details,
        ],
      },
      callback,
    );

    return txReceipt.transactionHash;
  }

  async submitGuildKickProposal(memberToKick, details, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'submitGuildKickProposal',
        params: [memberToKick, details],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async submitWhiteListProposal(address, details, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'submitWhitelistProposal',
        params: [address, details],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async withdrawBalance(token, amount, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'withdrawBalance',
        params: [token, amount],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async withdrawBalances(tokens, amounts, max, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'withdrawBalances',
        params: [tokens, amounts, max],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }

  async collectTokens(token, callback) {
    const txReceipt = await this.sendTx(
      {
        name: 'collectTokens',
        params: [token],
      },
      callback,
    );
    return txReceipt.transactionHash;
  }
}
