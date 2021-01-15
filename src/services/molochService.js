import Web3 from "web3";

import DaoAbi from "../contracts/mcdao.json";
import DaoAbiV2 from "../contracts/molochV2.json";
import { chainByID } from "../utils/chain";

export const MolochService = ({ web3, daoAddress, version, chainID }) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = version >= 2 ? DaoAbiV2 : DaoAbi;
  const contract = new web3.eth.Contract(abi, daoAddress);

  return function getService(service) {
    if (service === "getUserTokenBalance") {
      return async function getUserTokenBalance({ userAddress, tokenAddress }) {
        const balance = await contract.methods
          .getUserTokenBalance(userAddress, tokenAddress)
          .call();
        return balance;
      };
    }
    if (service === "submitUserProposal") {
      const submitUserProposal = async (args) => {
        console.log(args);
      };
      return async (args, poll) => {
        await submitUserProposal(args);
        // onExecute("Tx Sent");
        // if (poll) {
        //   const pollRef = setInterval(async () => {
        //     //poll the graph
        //     try {
        //       const pollData = await poll.query;
        //       if (pollData === pollTest) {
        //         onSuccess("Tx Complete!", pollData);
        //       }
        //     } catch (error) {
        //       onFail("Tx Failed", error);
        //     }
        //   }, 3000);
        //   //listener reference defined here.
        //   return function cleanUp() {
        //     clearInterval(pollRef);
        //     //delete
        //   };
        // }
      };
    }
  };
};
