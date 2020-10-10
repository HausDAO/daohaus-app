import DaoAbi from '../contracts/mcdao.json';
import DaoAbiV2 from '../contracts/molochv2.json';

export class McDaoService {
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
  sendTx(name, tx, currentUserContext) {
    return tx
      .send({ from: this.accountAddr })
      .on('transactionHash', (txHash) => {
        console.log('txHash', txHash);
        if (currentUserContext?.txProcessor) {
          currentUserContext.txProcessor.setTx(
            txHash,
            currentUserContext.username,
            name,
            true,
            false,
          );
        }
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

export class ReadonlyMcDaoService extends McDaoService {
  async deployAccount() {
    throw new Error(`This account type cannot call deployAccount`);
  }
}

export class Web3McDaoService extends McDaoService {
  async submitVote(proposalIndex, uintVote) {
    const txReceipt = await this.daoContract.methods
      .submitVote(proposalIndex, uintVote)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async rageQuit(amount) {
    const txReceipt = await this.daoContract.methods
      .ragequit(amount)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async processProposal(id) {
    const txReceipt = await this.daoContract.methods
      .processProposal(id)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async updateDelegateKey(newDelegateKey) {
    const txReceipt = await this.daoContract.methods
      .updateDelegateKey(newDelegateKey)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async submitProposal(applicant, tokenTribute, sharesRequested, details) {
    const txReceipt = await this.daoContract.methods
      .submitProposal(applicant, tokenTribute, sharesRequested, details)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async deployAccount() {
    throw new Error(`This account type cannot call deployAccount`);
  }
}

export class Web3McDaoServiceV2 extends Web3McDaoService {
  async rageQuit(amountShares = 0, amountLoot = 0) {
    const txReceipt = await this.daoContract.methods
      .ragequit(amountShares, amountLoot)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async cancelProposal(id) {
    const txReceipt = await this.daoContract.methods
      .cancelProposal(id)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async processGuildKickProposal(id) {
    const txReceipt = await this.daoContract.methods
      .processGuildKickProposal(id)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async processWhitelistProposal(id) {
    const txReceipt = await this.daoContract.methods
      .processWhitelistProposal(id)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async ragekick(address) {
    const txReceipt = await this.daoContract.methods
      .ragekick(address)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async sponsorProposal(id) {
    const txReceipt = await this.daoContract.methods
      .sponsorProposal(id)
      .send({ from: this.accountAddr });

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
    currentUserContext = null,
  ) {
    const newTx = this.daoContract.methods.submitProposal(
      currentUserContext.username,
      sharesRequested,
      lootRequested,
      tributeOffered,
      tributeToken,
      paymentRequested,
      PaymentToken,
      details,
    );

    const txReceipt = await this.sendTx('newMember', newTx, currentUserContext);

    return txReceipt.transactionHash;
  }

  async submitGuildKickProposal(memberToKick, details) {
    const txReceipt = await this.daoContract.methods
      .submitGuildKickProposal(memberToKick, details)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async submitWhiteListProposal(address, details) {
    let txReceipt = '';

    try {
      txReceipt = await this.daoContract.methods
        .submitWhitelistProposal(address, details)
        .send({ from: this.accountAddr });
    } catch (err) {
      console.log(err);
    }

    return txReceipt.transactionHash;
  }

  async withdrawBalance(token, amount) {
    const txReceipt = await this.daoContract.methods
      .withdrawBalance(token, amount)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async withdrawBalances(tokens, amounts, max) {
    const txReceipt = await this.daoContract.methods
      .withdrawBalances(tokens, amounts, max)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }

  async collectTokens(token) {
    const txReceipt = await this.daoContract.methods
      .collectTokens(token)
      .send({ from: this.accountAddr });

    return txReceipt.transactionHash;
  }
}
