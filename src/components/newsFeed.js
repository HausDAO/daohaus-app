import React, { useState, useEffect } from "react";
import styled from "styled-components";

import NetworkDaoList from "./NetworkDaoList";
import { Overline } from "../styles/typography";
import { ListItemCard } from "./staticElements";

import { getColor } from "../styles/palette";
import { useLocalUserData } from "../contexts/UserContext";

const StyledNewsFeed = styled.div`
  border-left: 1px solid ${getColor("lightBorder")};
  padding: 1.6rem 2.4rem;
  grid-column: 3/5;
  grid-row: 2/3;
`;

const combineAndSortProposals = (daosByNetwork) => {
  return daosByNetwork
    .reduce((arr, network) => {
      return [
        ...arr,
        ...network.data.membersHub.reduce((arr, dao) => {
          return [
            ...arr,
            ...dao.moloch.proposals.map((proposal) => ({
              ...proposal,
              createdAt: parseInt(proposal.createdAt),
              name: dao.moloch.title,
            })),
          ];
        }, []),
      ];
    }, [])
    .sort((a, b) => b.createdAt - a.createdAt);
};

const NewsFeed = ({ provider }) => {
  const { userHubDaos, hasLoadedHubData } = useLocalUserData();

  const [newsFeed, setNewsFeed] = useState(null);
  const [viewing, setViewing] = useState({ from: 0, to: 9 });

  useEffect(() => {
    if (hasLoadedHubData) {
      setNewsFeed(combineAndSortProposals(userHubDaos));
    }
  }, [userHubDaos, hasLoadedHubData]);

  return (
    <StyledNewsFeed>
      {newsFeed &&
        newsFeed.slice(viewing.from, viewing.to + 1).map((proposal) => {
          // return <ProposalPreview proposal={proposal} key={proposal.id} />;
        })}
    </StyledNewsFeed>
  );
};

export default NewsFeed;
