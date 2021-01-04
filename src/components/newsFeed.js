import React, { useState, useEffect } from "react";
import styled from "styled-components";

import NetworkDaoList from "./NetworkDaoList";
import { HeaderLg, Overline } from "../styles/typography";
import { ListItemCard } from "./staticElements";
import ProposalPreview from "./proposalPreview";

import { getColor } from "../styles/palette";
import { useLocalUserData } from "../contexts/UserContext";

const StyledNewsFeed = styled.div`
  border-left: 1px solid ${getColor("lightBorder")};
  padding: 1.6rem 4rem;
  grid-column: 3/5;
  grid-row: 2/3;
  .header {
    margin-bottom: 1.6rem;
  }
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
              chain: network.name,
              details:
                proposal.details[0] === "{"
                  ? JSON.parse(proposal.details)
                  : proposal.details,
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
      <HeaderLg className="header">Recent Activity:</HeaderLg>
      {newsFeed &&
        newsFeed.slice(viewing.from, viewing.to + 1).map((proposal) => {
          return <ProposalPreview proposal={proposal} key={proposal.id} />;
        })}
    </StyledNewsFeed>
  );
};

export default NewsFeed;
