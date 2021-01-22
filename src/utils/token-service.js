import Erc20Abi from '../contracts/erc20a.json';
import Erc20Bytes32Abi from '../contracts/erc20Bytes32.json';

export class TokenService {
  web3;
  contract;
  daoAddress;
  accountAddress;

  constructor(web3, daoToken, daoAddress, accountAddress) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(Erc20Abi, daoToken);
    this.contract32 = new web3.eth.Contract(Erc20Bytes32Abi, daoToken);
    this.daoAddress = daoAddress;
    this.accountAddress = accountAddress;
  }

  async getSymbol(override) {
    let symbol;

    if (override) {
      return override;
    }

    try {
      symbol = await this.contract.methods.symbol().call();
    } catch {
      try {
        symbol = await this.contract32.methods.symbol().call();
      } catch {
        symbol = 'unknown';
      }
    }

    if (symbol.indexOf('0x') > -1) {
      symbol = this.web3.utils.hexToUtf8(symbol);
    }

    return symbol;
  }

  async getDecimals() {
    let decimals;

    try {
      decimals = await this.contract.methods.decimals().call();
      return decimals;
    } catch {
      return 18;
    }
  }

  async totalSupply(token) {
    const contract = token
      ? new this.web3.eth.Contract(Erc20Abi, token)
      : this.contract;
    const totalSupply = await contract.methods.totalSupply().call();
    return totalSupply;
  }

  async balanceOf(
    account = this.accountAddress,
    atBlock = 'latest',
    token = null,
  ) {
    const contract = token
      ? new this.web3.eth.Contract(Erc20Abi, token)
      : this.contract;

    const balanceOf = await contract.methods
      .balanceOf(account)
      .call({}, atBlock);

    return balanceOf;
  }

  async balanceOfToken(token) {
    if (!token) {
      return;
    }
    const contract = new this.web3.eth.Contract(Erc20Abi, token);

    const balanceOf = await contract.methods
      .balanceOf(this.accountAddress)
      .call({});
    const decimals = await contract.methods.decimals().call();

    return balanceOf / 10 ** decimals;
  }

  async allowance(
    accountAddr = this.accountAddress,
    contractAddr = this.daoAddress,
  ) {
    const allowance = await this.contract.methods
      .allowance(accountAddr, contractAddr)
      .call();
    return allowance;
  }
}

export class Web3TokenService extends TokenService {
  async approve(wad) {
    const txReceipt = await this.contract.methods
      .approve(this.daoAddress, wad)
      .send({ from: this.accountAddress });

    return txReceipt.transactionHash;
  }

  async deposit(amount) {
    const txReceipt = await this.contract.methods
      .deposit()
      .send({ from: this.accountAddress, value: amount });

    return txReceipt.transactionHash;
  }

  async transfer(dest, wad) {
    const txReceipt = await this.contract.methods
      .transfer(dest, wad)
      .send({ from: this.accountAddress });

    return txReceipt.transactionHash;
  }

  async unlock(token) {
    if (token === '0x000000000000000') {
      return;
    }
    const contract = new this.web3.eth.Contract(Erc20Abi, token);
    // should be (2^256)-1
    let max = this.web3.utils.toBN(2).pow(this.web3.utils.toBN(255));
    if (
      token.toLowerCase() ===
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'.toLowerCase()
    ) {
      console.log('uni approve all');
      max = '10000000000000000000000000';
    }

    const txReceipt = await contract.methods
      .approve(this.daoAddress, max.toString())
      .send({ from: this.accountAddress });

    return txReceipt.transactionHash;
  }

  async unlocked(
    token,
    accountAddr = this.accountAddress,
    contractAddr = this.daoAddress,
  ) {
    if (token === '0x000000000000000') {
      return 0;
    }
    console.log('token', token);
    const contract = new this.web3.eth.Contract(Erc20Abi, token);
    console.log('contract', contract);
    const allowance = await contract.methods
      .allowance(accountAddr, contractAddr)
      .call();
    return allowance;
  }
}
