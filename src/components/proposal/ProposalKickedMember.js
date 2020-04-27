import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';

import { DaoDataContext } from '../../contexts/Store';
import { GET_MEMBER_SUPER } from '../../utils/QueriesSuper';
import Loading from '../shared/Loading';

const ProposalKickedMember = ({ proposal }) => {
  const [daoData] = useContext(DaoDataContext);

  const { loading, error, data } = useQuery(GET_MEMBER_SUPER, {
    variables: {
      id: `${daoData.contractAddress}-member-${proposal.applicant}`,
    },
    client: daoData.altClient,
  });

  if (loading) return <Loading />;
  if (error) {
    console.log('error', error);
    return <p>Error Loading Member</p>;
  }

  return (
    <>
      <h4>{proposal.status === 'Passed' ? 'Kicked' : 'Kicking'}</h4>
      <div className="Offer">
        {proposal.status !== 'Passed' ? (
          <>
            <div className="Shares">
              <h5>Shares</h5>
              <h2 className="Data">{data.member.shares}</h2>
            </div>
            <div className="Shares">
              <h5>Loot</h5>
              <h2 className="Data">{data.member.loot}</h2>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ProposalKickedMember;
