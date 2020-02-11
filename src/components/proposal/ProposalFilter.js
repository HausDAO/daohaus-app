import React, { useState, useEffect, useContext } from 'react';

import ProposalList from './ProposalList';
import { groupByStatus } from '../../utils/ProposalHelper';

import './ProposalFilter.scss';
import { DaoServiceContext, ThemeContext } from '../../contexts/Store';

const ProposalFilter = ({ proposals, filter, history }) => {
  const [groupedProposals, setGroupedProposals] = useState();
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [daoService] = useContext(DaoServiceContext);
  const [themeVariables] = useContext(ThemeContext);
  const StyledButton = themeVariables.StyledButton;

  const handleSelect = (list, listName) => {
    setFilteredProposals(list);
    history.push(`/dao/${daoService.daoAddress}/proposals/${listName}`);
  };

  useEffect(() => {
    if (proposals) {
      const groupedProps = groupByStatus(proposals);

      if (filter in groupedProps) {
        setGroupedProposals(groupByStatus(proposals));
        setFilteredProposals(groupedProps[filter]);
      } else {
        if (groupedProps.VotingPeriod.length > 0) {
          history.push(`/dao/${daoService.daoAddress}/proposals/VotingPeriod`);
        } else {
          history.push(`/dao/${daoService.daoAddress}/proposals/Completed`);
        }
      }
    }
  }, [daoService.daoAddress, proposals, filter, history]);

  if (!groupedProposals) {
    return <></>;
  }

  return (
    <div className="ProposalFilter">
      <div className="ProposalFilter__Filters">
        <StyledButton
          onClick={() =>
            handleSelect(groupedProposals.VotingPeriod, 'VotingPeriod')
          }
          className={filter === 'VotingPeriod' ? 'Active' : null}
        >
          Voting Period ({groupedProposals.VotingPeriod.length})
        </StyledButton>
        <StyledButton
          onClick={() =>
            handleSelect(groupedProposals.GracePeriod, 'GracePeriod')
          }
          className={filter === 'GracePeriod' ? 'Active' : null}
        >
          Grace Period ({groupedProposals.GracePeriod.length})
        </StyledButton>
        <StyledButton
          onClick={() =>
            handleSelect(
              groupedProposals.ReadyForProcessing,
              'ReadyForProcessing',
            )
          }
          className={filter === 'ReadyForProcessing' ? 'Active' : null}
        >
          Ready For Processing ({groupedProposals.ReadyForProcessing.length})
        </StyledButton>
        <StyledButton
          onClick={() => handleSelect(groupedProposals.Completed, 'Completed')}
          className={filter === 'Completed' ? 'Active' : null}
        >
          Completed ({groupedProposals.Completed.length})
        </StyledButton>
        <StyledButton
          onClick={() => handleSelect(groupedProposals.InQueue, 'InQueue')}
          className={filter === 'InQueue' ? 'Active' : null}
        >
          In Queue ({groupedProposals.InQueue.length})
        </StyledButton>
        {}
      </div>
      <ProposalList proposals={filteredProposals} />
    </div>
  );
};

export default ProposalFilter;
