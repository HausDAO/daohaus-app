import Web3Service from './Web3Service';
const web3Service = new Web3Service();
const minDevices = 1; // first device and extention
const minDeployEth = 0.05; // first device and extention

export const WalletStatuses = {
  Unknown: 'Unknown',
  Connected: 'Connected',
  Created: 'Created',
  NotConnected: 'Not Connected',
  Connecting: 'Connecting',
  UnDeployedNeedsDevices: 'Not Deployed Needs Devices',
  UnDeployed: 'Not Deployed',
  LowGas: 'Low Gas',
  LowGasForDeploy: 'Low Gas For Deploy',
  DeployedNeedsDevices: 'Deployed Needs Devices',
  DeployedNewDevice: 'Deployed New Device',
  Deployed: 'Deployed',
};

export const currentStatus = (currentWallet, currentUser, state = null) => {
  const _accountDevices = currentWallet.accountDevices;
  const _state = state || currentWallet.state || '';
  // NotConnected user should see signup flow
  if (_state === WalletStatuses.NotConnected) {
    return WalletStatuses.NotConnected;
  }

  // Connecting
  if (_state === WalletStatuses.Connecting) {
    return WalletStatuses.Connecting;
  }

  // UnDeployed user needs to deploy wallet

  if (
    _accountDevices &&
    _accountDevices.items.length >= minDevices &&
    _state === 'Created' &&
    web3Service.fromWei(
      currentUser.sdk.state.account.balance.real.toString(),
    ) >= minDeployEth
  ) {
    return WalletStatuses.UnDeployed;
  }

  // LowGas user needs to add gas
  if (
    _state === 'Created' &&
    web3Service.fromWei(currentUser.sdk.state.account.balance.real.toString()) <
      minDeployEth
  ) {
    return WalletStatuses.LowGasForDeploy;
  }

  // LowGas user needs to add gas
  if (
    _state === 'Deployed' &&
    web3Service.fromWei(currentUser.sdk.state.account.balance.real.toString()) <
      0.01
  ) {
    return WalletStatuses.LowGas;
  }

  // UnDeployedNeedsDevices user needs to add at least one recovery
  // Not using for now
  // if (_state === 'Created' && !_accountDevices) {
  //   return WalletStatuses.UnDeployedNeedsDevices;
  // }

  // DeployedNeedsDevices user has deployed but needs another device option
  if (
    _state === 'Deployed' &&
    _accountDevices &&
    _accountDevices.items.length < minDevices
  ) {
    return WalletStatuses.DeployedNeedsDevices;
  }

  // DeployedNewDevice user should see option to recover or add
  if (
    _state === 'Deployed' &&
    _accountDevices &&
    !_accountDevices.items.some(
      (item) => item.device.address === currentUser.sdk.state.deviceAddress,
    )
  ) {
    return WalletStatuses.DeployedNewDevice;
  }
};
