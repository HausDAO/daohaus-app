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
  sendTx(name, tx, callback) {
    return tx
      .send({ from: this.accountAddr })
      .on('transactionHash', (txHash) => {
        console.log('txHash', txHash);
        callback(txHash, name);
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
    const newTx = this.daoContract.methods.submitVote(proposalIndex, uintVote);
    const txReceipt = await this.sendTx('submitVote', newTx, callback);
    return txReceipt.transactionHash;
  }

  async rageQuit(amount, callback) {
    const newTx = this.daoContract.methods.ragequit(amount);
    const txReceipt = await this.sendTx('ragequit', newTx, callback);
    return txReceipt.transactionHash;
  }

  async processProposal(id, callback) {
    const newTx = this.daoContract.methods.processProposal(id);
    const txReceipt = await this.sendTx('processProposal', newTx, callback);
    return txReceipt.transactionHash;
  }

  async updateDelegateKey(newDelegateKey, callback) {
    const newTx = this.daoContract.methods.updateDelegateKey(newDelegateKey);
    const txReceipt = await this.sendTx('newDelegateKey', newTx, callback);
    return txReceipt.transactionHash;
  }

  async submitProposal(
    applicant,
    tokenTribute,
    sharesRequested,
    details,
    callback,
  ) {
    const newTx = this.daoContract.methods.submitProposal(
      applicant,
      tokenTribute,
      sharesRequested,
      details,
    );
    const txReceipt = await this.sendTx('submitProposalV1', newTx, callback);
    return txReceipt.transactionHash;
  }

  async deployAccount() {
    throw new Error(`This account type cannot call deployAccount`);
  }
}

export class Web3MolochServiceV2 extends Web3MolochService {
  async rageQuit(amountShares = 0, amountLoot = 0, callback) {
    const newTx = this.daoContract.methods.ragequit(amountShares, amountLoot);
    const txReceipt = await this.sendTx('rageQuit', newTx, callback);
    return txReceipt.transactionHash;
  }

  async cancelProposal(id, callback) {
    const newTx = this.daoContract.methods.cancelProposal(id);
    const txReceipt = await this.sendTx('cancelProposal', newTx, callback);
    return txReceipt.transactionHash;
  }

  async processGuildKickProposal(id, callback) {
    const newTx = this.daoContract.methods.processGuildKickProposal(id);
    const txReceipt = await this.sendTx(
      'processGuildKickProposal',
      newTx,
      callback,
    );
    return txReceipt.transactionHash;
  }

  async processWhitelistProposal(id, callback) {
    const newTx = this.daoContract.methods.processWhitelistProposal(id);
    const txReceipt = await this.sendTx(
      'processWhitelistProposal',
      newTx,
      callback,
    );
    return txReceipt.transactionHash;
  }

  async ragekick(address, callback) {
    const newTx = this.daoContract.methods.ragekick(address);
    const txReceipt = await this.sendTx('ragekick', newTx, callback);
    return txReceipt.transactionHash;
  }

  async sponsorProposal(id, callback = null) {
    const newTx = this.daoContract.methods.sponsorProposal(id);
    const txReceipt = await this.sendTx('sponsorProposal', newTx, callback);
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
    const newTx = this.daoContract.methods.submitProposal(
      applicant,
      sharesRequested,
      lootRequested,
      tributeOffered,
      tributeToken,
      paymentRequested,
      PaymentToken,
      details,
    );

    const txReceipt = await this.sendTx('newMember', newTx, callback);

    return txReceipt.transactionHash;
  }

  async submitGuildKickProposal(memberToKick, details, callback) {
    const newTx = this.daoContract.methods.submitGuildKickProposal(
      memberToKick,
      details,
    );
    const txReceipt = await this.sendTx(
      'submitGuildKickProposal',
      newTx,
      callback,
    );
    return txReceipt.transactionHash;
  }

  async submitWhiteListProposal(address, details, callback) {
    const newTx = this.daoContract.methods.submitWhitelistProposal(
      address,
      details,
    );
    const txReceipt = await this.sendTx(
      'submitWhitelistProposal',
      newTx,
      callback,
    );
    return txReceipt.transactionHash;
  }

  async withdrawBalance(token, amount, callback) {
    const newTx = this.daoContract.methods.withdrawBalance(token, amount);
    const txReceipt = await this.sendTx('withdrawBalance', newTx, callback);
    return txReceipt.transactionHash;
  }

  async withdrawBalances(tokens, amounts, max, callback) {
    const newTx = this.daoContract.methods.withdrawBalances(
      tokens,
      amounts,
      max,
    );
    const txReceipt = await this.sendTx('withdrawBalances', newTx, callback);
    return txReceipt.transactionHash;
  }

  async collectTokens(token, callback) {
    const newTx = this.daoContract.methods.collectTokens(token);
    const txReceipt = await this.sendTx('collectTokens', newTx, callback);
    return txReceipt.transactionHash;
  }
}
