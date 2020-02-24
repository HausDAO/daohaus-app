import React, { useState, useEffect, useContext } from 'react';

import ProposalList from './ProposalList';
import { groupByStatus } from '../../utils/ProposalHelper';
import { DaoServiceContext } from '../../contexts/Store';

import './ProposalFilter.scss';

const ProposalFilter = ({ proposals, filter, history, unsponsoredView }) => {
  const [groupedProposals, setGroupedProposals] = useState();
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [daoService] = useContext(DaoServiceContext);

  const handleSelect = (list, listName) => {
    setFilteredProposals(list);
    history.push(`/dao/${daoService.daoAddress}/proposals/${listName}`);
  };

  useEffect(() => {
    if (proposals) {
      const groupedProps = groupByStatus(proposals, unsponsoredView);
      const groupedKey = unsponsoredView ? 'Unsponsored' : 'Base';

      if (Object.keys(groupedProps[groupedKey]).includes(filter)) {
        setGroupedProposals(groupedProps[groupedKey]);
        setFilteredProposals(groupedProps[groupedKey][filter]);
      } else {
        if (unsponsoredView) {
          history.push(`/dao/${daoService.daoAddress}/proposals/Unsponsored`);
        } else if (groupedProps[groupedKey].VotingPeriod.length > 0) {
          history.push(`/dao/${daoService.daoAddress}/proposals/VotingPeriod`);
        } else {
          history.push(`/dao/${daoService.daoAddress}/proposals/Completed`);
        }
      }
    }
  }, [daoService.daoAddress, proposals, filter, history, unsponsoredView]);

  if (!groupedProposals) {
    return <></>;
  }

  return (
    <div className="ProposalFilter">
      <div className="ProposalFilter__Filters">
        {!unsponsoredView ? (
          <>
            <button
              onClick={() =>
                handleSelect(groupedProposals.VotingPeriod, 'VotingPeriod')
              }
              className={filter === 'VotingPeriod' ? 'Active' : null}
            >
              Voting Period (
              {groupedProposals.VotingPeriod &&
                groupedProposals.VotingPeriod.length}
              )
            </button>
            <button
              onClick={() =>
                handleSelect(groupedProposals.GracePeriod, 'GracePeriod')
              }
              className={filter === 'GracePeriod' ? 'Active' : null}
            >
              Grace Period (
              {groupedProposals.GracePeriod &&
                groupedProposals.GracePeriod.length}
              )
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
              Ready For Processing (
              {groupedProposals.ReadyForProcessing &&
                groupedProposals.ReadyForProcessing.length}
              )
            </button>
            <button
              onClick={() =>
                handleSelect(groupedProposals.Completed, 'Completed')
              }
              className={filter === 'Completed' ? 'Active' : null}
            >
              Completed (
              {groupedProposals.Completed && groupedProposals.Completed.length})
            </button>
            <button
              onClick={() => handleSelect(groupedProposals.InQueue, 'InQueue')}
              className={filter === 'InQueue' ? 'Active' : null}
            >
              In Queue (
              {groupedProposals.InQueue && groupedProposals.InQueue.length})
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() =>
                handleSelect(groupedProposals.Unsponsored, 'Unsponsored')
              }
              className={filter === 'Unsponsored' ? 'Active' : null}
            >
              Open (
              {groupedProposals.Unsponsored &&
                groupedProposals.Unsponsored.length}
              )
            </button>

            <button
              onClick={() =>
                handleSelect(groupedProposals.Cancelled, 'Cancelled')
              }
              className={filter === 'Cancelled' ? 'Active' : null}
            >
              Cancelled (
              {groupedProposals.Cancelled && groupedProposals.Cancelled.length})
            </button>
          </>
        )}
      </div>
      <ProposalList proposals={filteredProposals} />
    </div>
  );
};

export default ProposalFilter;
