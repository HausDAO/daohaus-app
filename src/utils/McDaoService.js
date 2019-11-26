import DaoAbi from '../contracts/mcdao.json';
import Web3Service from '../utils/Web3Service';

export default class McDaoService {
  contractAddr;
  web3Service;
  contract;
  daoAbi;

  constructor(contractAddr) {
    console.log(contractAddr);
    
    this.contractAddr = contractAddr;
    this.web3Service = new Web3Service();
    this.daoAbi = DaoAbi;
  }

  async initContract() {
    console.log('what is this addr', this.contractAddr);
    
    this.contract = await this.web3Service.initContract(
      this.daoAbi,
      this.contractAddr,
    );
    return this.contract;
  }

  async getAllEvents() {

    let events = await this.contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  }

  async getCurrentPeriod() {
    if (!this.contract) {
      console.log("create contract here????");
      
      await this.initContract();
    }
    
    let currentPeriod = await this.contract.methods.getCurrentPeriod().call();
    return currentPeriod;
  }

  async getTotalShares(atBlock = 'latest') {

    let totalShares = await this.contract.methods
      .totalShares()
      .call({}, atBlock);
    return totalShares;
  }

  async getGracePeriodLength() {

    let gracePeriod = await this.contract.methods.gracePeriodLength().call();
    return gracePeriod;
  }

  async getVotingPeriodLength() {

    let votingPeriod = await this.contract.methods.votingPeriodLength().call();
    return votingPeriod;
  }

  async getPeriodDuration() {

    let periodDuration = await this.contract.methods.periodDuration().call();
    return periodDuration;
  }

  async getProcessingReward() {

    let processingReward = await this.contract.methods
      .processingReward()
      .call();
    return processingReward;
  }

  async getProposalDeposit() {

    let proposalDeposit = await this.contract.methods.proposalDeposit().call();
    return proposalDeposit;
  }

  async getGuildBankAddr() {

    let guildBank = await this.contract.methods.guildBank().call();
    return guildBank;
  }

  async approvedToken() {


    let tokenAddress = await this.contract.methods.approvedToken().call();
    return tokenAddress;
  }

  async members(account) {

    let members = await this.contract.methods.members(account).call();
    return members;
  }

  async memberAddressByDelegateKey(account) {

    let addressByDelegateKey = await this.contract.methods
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

    let vote = this.contract.methods
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

    let rage = this.contract.methods
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

    let canRage = await this.contract.methods.canRagequit().call();
    return canRage;
  }

  async guildBank() {

    let guildBank = await this.contract.methods.guildBank().call();
    return guildBank;
  }

  async proposalQueue(id) {

    let info = await this.contract.methods.proposalQueue(id).call();
    return info;
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

    let proposal = this.contract.methods
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
