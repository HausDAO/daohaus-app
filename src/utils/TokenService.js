import Erc20Abi from '../contracts/erc20a.json';
import Erc20Bytes32Abi from '../contracts/erc20Bytes32.json';

export class TokenService {
  web3;
  contract;
  daoAddress;
  accountAddress;

  constructor(web3, daoToken, daoAddress, accountAddress, bcProcessor) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(Erc20Abi, daoToken);
    this.daoAddress = daoAddress;
    this.accountAddress = accountAddress;
    this.bcProcessor = bcProcessor;
  }

  async getSymbol() {
    let symbol;

    try {
      symbol = await this.contract.methods.symbol().call();
    } catch {
      if (!this.contract32) {
        this.contract32 = await this.initContract(Erc20Bytes32Abi);
      }
      symbol = await this.contract32.methods.symbol().call();
    }

    if (symbol.indexOf('0x') > -1) {
      symbol = this.web3.utils.hexToUtf8(symbol);
    }

    return symbol;
  }

  async totalSupply() {
    const totalSupply = await this.contract.methods.totalSupply().call();
    return totalSupply;
  }

  async balanceOf(account = this.accountAddress, atBlock = 'latest') {
    const balanceOf = await this.contract.methods
      .balanceOf(account)
      .call({}, atBlock);

    return balanceOf;
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

export class SdkTokenService extends TokenService {
  sdkService;
  constructor(
    web3,
    daoToken,
    daoAddress,
    accountAddress,
    bcProcessor,
    sdkService,
  ) {
    super(web3, daoToken, daoAddress, accountAddress, bcProcessor);
    this.sdkService = sdkService;
  }

  async approve(wad) {
    const encodedData = this.contract.methods
      .approve(this.daoAddress, wad)
      .encodeABI();
    const hash = await this.sdkService.submit(
      encodedData,
      this.contract.options.address,
    );
    this.bcProcessor.setTx(
      hash,
      this.accountAddress,
      `Update Token Allowance to ${wad}`,
      true,
    );
    return hash;
  }

  // weth wrap
  async deposit(amount) {
    const encodedData = this.contract.methods.deposit().encodeABI();
    const hash = await this.sdkService.submit(
      encodedData,
      this.contract.options.address,
    );
    this.bcProcessor.setTx(
      hash,
      this.accountAddress,
      `Deposit ${amount} Tokens`,
      true,
    );
    return hash;
  }

  async transfer(dest, wad) {
    const encodedData = this.contract.methods.transfer(dest, wad).encodeABI();
    const hash = await this.sdkService.submit(
      encodedData,
      this.contract.options.address,
    );
    this.bcProcessor.setTx(
      hash,
      this.accountAddress,
      `Transfer ${wad} Tokens to ${dest}`,
      true,
    );
    return hash;
  }
}

export class Web3TokenService extends TokenService {
  async approve(wad) {
    const txReceipt = await this.contract.methods
      .approve(this.daoAddress, wad)
      .send({ from: this.accountAddress });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Update Token Allowance to ${wad}`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async deposit(amount) {
    const txReceipt = await this.contract.methods
      .deposit()
      .send({ from: this.accountAddress, value: amount });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Deposit ${amount} Tokens`,
      true,
    );
    return txReceipt.transactionHash;
  }

  async transfer(dest, wad) {
    const txReceipt = await this.contract.methods
      .transfer(dest, wad)
      .send({ from: this.accountAddress });
    this.bcProcessor.setTx(
      txReceipt.transactionHash,
      this.accountAddress,
      `Transfer ${wad} Tokens to ${dest}`,
      true,
    );
    return txReceipt.transactionHash;
  }
}
