import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { DaoContext, DaoDataContext } from '../../contexts/Store';
import { GET_MEMBERS_LEGACY, GET_MEMBERS } from '../../utils/Queries';
import MemberList from '../../components/member/MemberList';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import StateModals from '../../components/shared/StateModals';

const Members = () => {
  const [daoService] = useContext(DaoContext);
  const [daoData] = useContext(DaoDataContext);

  let memberQuery, options;

  if (daoData.isLegacy) {
    memberQuery = GET_MEMBERS_LEGACY;
    options = { client: daoData.legacyClient };
  } else {
    memberQuery = GET_MEMBERS;
    options = {
      variables: { contractAddr: daoService.contractAddr.toLowerCase() },
    };
  }

  const { loading, error, data } = useQuery(memberQuery, options);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="View">
      <StateModals />
      <div className="Members">
        <h3 className="Pad">Members</h3>
        <MemberList members={data.members} />
      </div>
      <BottomNav />
    </div>
  );
};

export default Members;
