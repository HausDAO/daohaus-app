import DaoAbi from '../contracts/mcdao.json';
import Web3Service from '../utils/Web3Service';

export default class McDaoService {
  contractAddr;
  web3Service;
  contract;
  daoAbi;

  constructor(contractAddr) {
    this.contractAddr = contractAddr;
    this.web3Service = new Web3Service();
    this.daoAbi = DaoAbi;
  }

  async initContract() {
    this.contract = await this.web3Service.initContract(
      this.daoAbi,
      this.contractAddr,
    );
    return this.contract;
  }

  async getAllEvents() {
    const events = await this.contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  }

  async getCurrentPeriod() {
    const currentPeriod = await this.contract.methods.getCurrentPeriod().call();
    return currentPeriod;
  }

  async getTotalShares(atBlock = 'latest') {
    const totalShares = await this.contract.methods
      .totalShares()
      .call({}, atBlock);
    return totalShares;
  }

  async getGracePeriodLength() {
    const gracePeriod = await this.contract.methods.gracePeriodLength().call();
    return gracePeriod;
  }

  async getVotingPeriodLength() {
    const votingPeriod = await this.contract.methods
      .votingPeriodLength()
      .call();
    return votingPeriod;
  }

  async getPeriodDuration() {
    const periodDuration = await this.contract.methods.periodDuration().call();
    return periodDuration;
  }

  async getProcessingReward() {
    const processingReward = await this.contract.methods
      .processingReward()
      .call();
    return processingReward;
  }

  async getProposalDeposit() {
    const proposalDeposit = await this.contract.methods
      .proposalDeposit()
      .call();
    return proposalDeposit;
  }

  async getGuildBankAddr() {
    const guildBank = await this.contract.methods.guildBank().call();
    return guildBank;
  }

  async approvedToken() {
    const tokenAddress = await this.contract.methods.approvedToken().call();
    return tokenAddress;
  }

  async members(account) {
    const members = await this.contract.methods.members(account).call();
    return members;
  }

  async memberAddressByDelegateKey(account) {
    const addressByDelegateKey = await this.contract.methods
      .memberAddressByDelegateKey(account)
      .call();
    return addressByDelegateKey;
  }

  async submitVote(from, proposalIndex, uintVote, encodedPayload) {
    if (encodedPayload) {
      const data = this.contract.methods
        .submitVote(proposalIndex, uintVote)
        .encodeABI();
      return data;
    }

    const vote = this.contract.methods
      .submitVote(proposalIndex, uintVote)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });
    return vote;
  }

  async rageQuit(from, amount, encodedPayload) {
    if (encodedPayload) {
      const data = this.contract.methods.ragequit(amount).encodeABI();
      return data;
    }

    const rage = this.contract.methods
      .ragequit(amount)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });
    return rage;
  }

  async canRagequit() {
    const canRage = await this.contract.methods.canRagequit().call();
    return canRage;
  }

  async guildBank() {
    const guildBank = await this.contract.methods.guildBank().call();
    return guildBank;
  }

  async proposalQueue(id) {
    const info = await this.contract.methods.proposalQueue(id).call();
    return info;
  }

  async getProposalQueueLength() {
    const len = await this.contract.methods.getProposalQueueLength().call();
    return len;
  }

  async processProposal(from, id, encodedPayload) {
    if (encodedPayload) {
      const data = this.contract.methods.processProposal(id).encodeABI();
      return data;
    }
  }

  async submitProposal(
    from,
    applicant,
    tokenTribute,
    sharesRequested,
    details,
    encodedPayload = false,
  ) {
    if (encodedPayload) {
      const data = this.contract.methods
        .submitProposal(applicant, tokenTribute, sharesRequested, details)
        .encodeABI();
      return data;
    }

    const proposal = this.contract.methods
      .submitProposal(applicant, tokenTribute, sharesRequested, details)
      .send({ from })
      .once('transactionHash', (txHash) => {})
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        console.log(err);
        return { error: 'rejected transaction' };
      });

    return proposal;
  }
}
