import React, { useContext } from 'react';
import { DaoDataContext } from '../../contexts/Store';
import { useQuery } from 'react-apollo';
import { GET_MEMBER_V2 } from '../../utils/QueriesV2';
import Loading from '../shared/Loading';

const ProposalKickedMember = ({ proposal }) => {
  const [daoData] = useContext(DaoDataContext);

  const { loading, error, data } = useQuery(GET_MEMBER_V2, {
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
      <h4>Kicking </h4>
      <div className="Offer">
        <div className="Shares">
          <h5>Shares</h5>
          <h2 className="Data">{data.member.shares}</h2>
        </div>
        <div className="Shares">
          <h5>Loot</h5>
          <h2 className="Data">{data.member.loot}</h2>
        </div>
      </div>
    </>
  );
};

export default ProposalKickedMember;
