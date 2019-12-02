import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_MEMBERS_QUERY } from '../../utils/MemberService';
import MemberList from '../../components/member/MemberList';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import StateModals from '../../components/shared/StateModals';
import { DaoContext } from '../../contexts/Store';

const Members = () => {
  const [daoService] = useContext(DaoContext);
  const { loading, error, data } = useQuery(GET_MEMBERS_QUERY, {
    variables: { contractAddr: daoService.contractAddr.toLowerCase() },
  });

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
