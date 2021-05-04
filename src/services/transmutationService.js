import Web3 from 'web3';

import TransmutationAbi from '../contracts/newTransmutation.json';

import { chainByID } from '../utils/chain';

export const TransmutationService = ({
  web3,
  transmutation,
  setupValues,
  chainID,
}) => {
  // console.log('web3', web3);
  // console.log('daoAddress', daoAddress);
  // console.log('version', version);
  // console.log('chainID', chainID);
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = TransmutationAbi;
  const contract = new web3.eth.Contract(abi, transmutation);

  return function getService(service) {
    if (service === 'giveToken') {
      return async () => {
        const action = await contract.methods.giveToken().call();
        return action;
      };
    }
    if (service === 'getToken') {
      return async () => {
        const action = await contract.methods.getToken().call();
        return action;
      };
    }
    if (service === 'calcTribute') {
      return async ({ paymentRequested }) => {
        if (!paymentRequested || isNaN(paymentRequested)) {
          return '0';
        }
        const bnExchange = web3.utils.toBN(
          setupValues.exchangeRate * setupValues.paddingNumber,
        );
        const bnTributeOffered = web3.utils.toBN(
          web3.utils.toWei(`${paymentRequested}`),
        );
        const tributeOffered = bnTributeOffered
          .mul(bnExchange)
          .div(web3.utils.toBN(setupValues.paddingNumber));

        return tributeOffered;
      };
    }

    if (service === 'propose') {
      return async ({ args, address, poll, onTxHash }) => {
        console.log('args', args);
        console.log('address', address);
        console.log('poll', poll);
        console.log('onTxHash', onTxHash);
        const tx = await contract.methods[service](...args);
        return tx
          .send('eth_requestAccounts', { from: address })
          .on('transactionHash', txHash => {
            if (poll) {
              poll(txHash);
              onTxHash();
            }
          })
          .on('error', error => {
            console.error(error);
          });
      };
    }
  };
};
