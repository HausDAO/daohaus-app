import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { HeaderLg } from "../styles/typography";
import ProposalPreview from "./proposalPreview";

import { getColor } from "../styles/palette";
import { useLocalUserData } from "../contexts/UserContext";
import { parseIfJSON } from "../utils/general";

const combineAndSortProposals = (daosByNetwork) => {
  return daosByNetwork
    .reduce((arr, network) => {
      return [
        ...arr,
        ...network.data.reduce((arr, dao) => {
          return [
            ...arr,
            ...dao.moloch.proposals.map((proposal) => ({
              ...proposal,
              createdAt: parseInt(proposal.createdAt),
              chain: network.name,
              details: parseIfJSON(proposal.details),
              name: dao.moloch.title,
            })),
          ];
        }, []),
      ];
    }, [])
    .sort((a, b) => b.createdAt - a.createdAt);
};

const NewsFeed = () => {
  const { userHubDaos, hasLoadedHubData } = useLocalUserData();

  const [newsFeed, setNewsFeed] = useState(null);
  const [viewing, setViewing] = useState({ from: 0, to: 9 });

  useEffect(() => {
    if (hasLoadedHubData) {
      setNewsFeed(combineAndSortProposals(userHubDaos));
    }
  }, [userHubDaos, hasLoadedHubData]);

  return (
    <div>
      <h3 className="header">Recent Activity:</h3>
      {newsFeed &&
        newsFeed.slice(viewing.from, viewing.to + 1).map((proposal) => {
          return <ProposalPreview proposal={proposal} key={proposal.id} />;
        })}
    </div>
  );
};

export default NewsFeed;
