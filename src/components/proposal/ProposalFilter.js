import React, { useState, useEffect, useContext } from 'react';

import ProposalList from './ProposalList';
import { groupByStatus } from '../../utils/ProposalHelper';

import './ProposalFilter.scss';
import { DaoContext } from '../../contexts/Store';

const ProposalFilter = ({ proposals, filter, history }) => {
  const [groupedProposals, setGroupedProposals] = useState();
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [daoService] = useContext(DaoContext);

  const handleSelect = (list, listName) => {
    setFilteredProposals(list);
    history.push(`/dao/${daoService.contractAddr}/proposals/${listName}`);
  };

  useEffect(() => {
    if (proposals) {
      const groupedProps = groupByStatus(proposals);

      if (filter in groupedProps) {
        setGroupedProposals(groupByStatus(proposals));
        setFilteredProposals(groupedProps[filter]);
      } else {
        if (groupedProps.VotingPeriod.length > 0) {
          history.push(
            `/dao/${daoService.contractAddr}/proposals/VotingPeriod`,
          );
        } else {
          history.push(`/dao/${daoService.contractAddr}/proposals/Completed`);
        }
      }
    }
  }, [proposals, filter, history]);

  if (!groupedProposals) {
    return <></>;
  }

  return (
    <div className="ProposalFilter">
      <div className="ProposalFilter__Filters">
        <button
          onClick={() =>
            handleSelect(groupedProposals.VotingPeriod, 'VotingPeriod')
          }
          className={filter === 'VotingPeriod' ? 'Active' : null}
        >
          Voting Period ({groupedProposals.VotingPeriod.length})
        </button>
        <button
          onClick={() =>
            handleSelect(groupedProposals.GracePeriod, 'GracePeriod')
          }
          className={filter === 'GracePeriod' ? 'Active' : null}
        >
          Grace Period ({groupedProposals.GracePeriod.length})
        </button>
        <button
          onClick={() =>
            handleSelect(
              groupedProposals.ReadyForProcessing,
              'ReadyForProcessing',
            )
          }
          className={filter === 'ReadyForProcessing' ? 'Active' : null}
        >
          Ready For Processing ({groupedProposals.ReadyForProcessing.length})
        </button>
        <button
          onClick={() => handleSelect(groupedProposals.Completed, 'Completed')}
          className={filter === 'Completed' ? 'Active' : null}
        >
          Completed ({groupedProposals.Completed.length})
        </button>
        <button
          onClick={() => handleSelect(groupedProposals.InQueue, 'InQueue')}
          className={filter === 'InQueue' ? 'Active' : null}
        >
          In Queue ({groupedProposals.InQueue.length})
        </button>
        {}
      </div>
      <ProposalList proposals={filteredProposals} />
    </div>
  );
};

export default ProposalFilter;
