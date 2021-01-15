import { Button } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { utils } from "web3";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";
import { MolochService } from "../services/molochService";
import { createHash, detailsToJSON, numberWithCommas } from "../utils/general";

import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
} from "../utils/proposalUtils";

const Proposals = React.memo(function Proposals({
  overview,
  proposals,
  activity,
}) {
  const { injectedProvider } = useInjectedProvider();
  const { daoid, daochain } = useParams();
  const { theme } = useCustomTheme();

  console.log(injectedProvider);
  const testAddUser = () => {
    const hash = createHash();
    const details = detailsToJSON({
      title: "Test!",
      description: "Jordan is using this Contract to test the DaoHaus app",
      hash,
    });
    const sampleData = [
      /*sharesRequested:*/ "0",
      /*lootRequested:*/ "0",
      /*tributeOffered:*/ "0",
      /*tributeToken:*/ overview?.depositToken?.tokenAddress,
      /*paymentRequested:*/ "10000000000000000000",
      /*paymentToken:*/ overview?.depositToken?.tokenAddress,
      /*details*/ details,
      /*userAddress*/ injectedProvider?.provider?.selectedAddress,
    ];
    MolochService({
      daoID: daoid,
      chainID: daochain,
      version: overview?.daoVersion,
    })("submitUserProposal")(sampleData);

    // ({(txHash, details) =>
    //   console.log(txHash, details)}
    // );
  };
  return (
    <>
      <Button bg={theme.colors.primary[500]} onClick={testAddUser}>
        Test Tx: Member Proposal
      </Button>
      <ul>
        {proposals &&
          proposals.slice(0, 5).map((proposal) => (
            <li key={proposal.id} className="large-box">
              <p>{determineProposalType(proposal)}</p>
              <h3>{titleMaker(proposal)}</h3>
              <p>{descriptionMaker(proposal)}</p>
              <p>{determineProposalStatus(proposal)}</p>
              <p>Yes: {proposal.yesShares}</p>
              <p>No: {proposal.noShares}</p>
              {proposal.paymentRequested > 0 && (
                <p>
                  Payment Requested{" "}
                  {numberWithCommas(utils.fromWei(proposal.paymentRequested))}
                </p>
              )}
            </li>
          ))}
      </ul>
    </>
  );
});

export default Proposals;
