import Web3 from 'web3';

import SuperfluidMinionFactory from '../contracts/superfluidMinionFactory.json';
import { chainByID } from '../utils/chain';

export const SuperfluidMinionFactoryService = ({ web3, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  const chainParams = chainByID(chainID);

  return service => {
    if (service === 'summonSuperfluidMinion') {
      return async ({ args, from, poll, onTxHash }) => {
        try {
          // const agreementType = args[2]; // TODO: cfa or ida
          const version = args[3];
          const superfluidConfig = chainParams.superfluid;
          if (!superfluidConfig) {
            throw Error(
              `Superfluid minion not available in ${chainID} network`,
            );
          }
          const superAppAddress =
            superfluidConfig?.superapp_addr &&
            superfluidConfig?.superapp_addr[version];
          const minionFactoryAddress = superfluidConfig?.minion_factory_addr;
          const factory = new web3.eth.Contract(
            SuperfluidMinionFactory,
            minionFactoryAddress,
          );
          const params = [args[0], superAppAddress, args[1]];

          const tx = await factory.methods.summonMinion(...params);
          return tx
            .send({ from })
            .on('transactionHash', txHash => {
              if (poll) {
                onTxHash(txHash);
                poll(txHash);
              }
            })
            .on('error', error => {
              console.error(error);
            });
        } catch (error) {
          return error;
        }
      };
    }
  };
};
