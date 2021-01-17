import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { utils } from "web3";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";
import { useTX } from "../contexts/TXContext";
import { MolochService } from "../services/molochService";
import {
  createHash,
  detailsToJSON,
  numberWithCommas,
  timeToNow,
} from "../utils/general";
import { createPoll } from "../utils/polls";

import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
} from "../utils/proposalUtils";

const Proposals = React.memo(function Proposals({ overview, proposals }) {
  const { injectedProvider, address } = useInjectedProvider();
  const { daoid, daochain } = useParams();
  const { theme } = useCustomTheme();
  const { refreshDao } = useTX();

  const testAddUser = () => {
    const hash = createHash();
    const details = detailsToJSON({
      title: "Test!",
      description: "Jordan is using this Contract to test the DaoHaus app",
      hash,
    });
    const from = address;
    const sampleData = [
      /*applicant*/ from,
      /*sharesRequested:*/ "0",
      /*lootRequested:*/ "0",
      /*tributeOffered:*/ "0",
      /*tributeToken:*/ overview?.depositToken?.tokenAddress,
      /*paymentRequested:*/ "10000000000000000000",
      /*paymentToken:*/ overview?.depositToken?.tokenAddress,
      /*detailsObj*/ details,
    ];
    const poll = createPoll({ action: "submitProposal" })({
      daoID: daoid,
      chainID: daochain,
      hash,
      actions: {
        onError: (error) => {
          console.log(`Could not find a matching proposal: ${error}`);
        },
        onSuccess: () => {
          refreshDao();
          console.log(
            `Success: New proposal mined and cached on The Graph. We can now update the UI`
          );
        },
      },
    });
    MolochService({
      web3: injectedProvider,
      daoAddress: daoid,
      chainID: daochain,
      version: overview?.version,
    })("submitProposal")(sampleData, from, poll);
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
              <p>{timeToNow(proposal.createdAt)}</p>
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
