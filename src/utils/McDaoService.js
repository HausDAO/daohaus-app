import DaoAbi from '../contracts/mcdao.json';
import Web3Service from '../utils/Web3Service';
import config from '../config';

export default class McDaoService {
  contractAddr;
  web3Service;
  contract;
  daoAbi;

  constructor() {
    this.contractAddr = config.CONTRACT_ADDRESS;
    this.web3Service = new Web3Service();
    this.daoAbi = DaoAbi;

    this.initContract();
  }

  async initContract() {
    this.contract = await this.web3Service.initContract(
      this.daoAbi,
      this.contractAddr,
    );
  }

  async getAllEvents() {
    if (!this.contract) {
      await this.initContract();
    }
    let events = await this.contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  }

  async getCurrentPeriod() {
    if (!this.contract) {
      await this.initContract();
    }
    let currentPeriod = await this.contract.methods.getCurrentPeriod().call();
    return currentPeriod;
  }

  async getTotalShares(atBlock = 'latest') {
    if (!this.contract) {
      await this.initContract();
    }
    let totalShares = await this.contract.methods
      .totalShares()
      .call({}, atBlock);
    return totalShares;
  }

  async getGracePeriodLength() {
    if (!this.contract) {
      await this.initContract();
    }
    let gracePeriod = await this.contract.methods.gracePeriodLength().call();
    return gracePeriod;
  }

  async getVotingPeriodLength() {
    if (!this.contract) {
      await this.initContract();
    }
    let votingPeriod = await this.contract.methods.votingPeriodLength().call();
    return votingPeriod;
  }

  async getPeriodDuration() {
    if (!this.contract) {
      await this.initContract();
    }
    let periodDuration = await this.contract.methods.periodDuration().call();
    return periodDuration;
  }

  async getProcessingReward() {
    if (!this.contract) {
      await this.initContract();
    }
    let processingReward = await this.contract.methods
      .processingReward()
      .call();
    return processingReward;
  }

  async getProposalDeposit() {
    if (!this.contract) {
      await this.initContract();
    }
    let proposalDeposit = await this.contract.methods.proposalDeposit().call();
    return proposalDeposit;
  }

  async getGuildBankAddr() {
    if (!this.contract) {
      await this.initContract();
    }
    let guildBank = await this.contract.methods.guildBank().call();
    return guildBank;
  }

  async approvedToken() {
    if (!this.contract) {
      await this.initContract();
    }

    let tokenAddress = await this.contract.methods.approvedToken().call();
    return tokenAddress;
  }

  async members(account) {
    if (!this.contract) {
      await this.initContract();
    }
    let members = await this.contract.methods.members(account).call();
    return members;
  }

  async memberAddressByDelegateKey(account) {
    if (!this.contract) {
      await this.initContract();
    }
    let addressByDelegateKey = await this.contract.methods
      .memberAddressByDelegateKey(account)
      .call();
    return addressByDelegateKey;
  }

  async submitVote(from, proposalIndex, uintVote, encodedPayload) {
    if (!this.contract) {
      await this.initContract();
    }

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
    if (!this.contract) {
      await this.initContract();
    }
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
    if (!this.contract) {
      await this.initContract();
    }
    let canRage = await this.contract.methods.canRagequit().call();
    return canRage;
  }

  async guildBank() {
    if (!this.contract) {
      await this.initContract();
    }
    let guildBank = await this.contract.methods.guildBank().call();
    return guildBank;
  }

  async proposalQueue(id) {
    if (!this.contract) {
      await this.initContract();
    }
    let info = await this.contract.methods.proposalQueue(id).call();
    return info;
  }

  async processProposal(from, id, encodedPayload) {
    if (!this.contract) {
      await this.initContract();
    }

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
    if (!this.contract) {
      await this.initContract();
    }

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
