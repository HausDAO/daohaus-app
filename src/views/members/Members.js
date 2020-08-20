import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { DaoServiceContext } from '../../contexts/Store';
import { GET_MEMBERS } from '../../utils/Queries';
import MemberList from '../../components/member/MemberList';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import { ViewDiv, PadDiv } from '../../App.styles';
import { Link } from 'react-router-dom';

const Members = () => {
  const [daoService] = useContext(DaoServiceContext);

  const { loading, error, data, fetchMore } = useQuery(GET_MEMBERS, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  fetchMore({
    variables: { skip: data.members.length },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return;
      return Object.assign({}, prev, {
        members: [...prev.members, ...fetchMoreResult.members],
      });
    },
  });

  return (
    <ViewDiv>
      <div>
        <PadDiv>
          <h3>Members</h3>
          <Link to={`/dao/${daoService.daoAddress}/rage`}>
            Check out Rage Quit History
          </Link>
          <MemberList members={data.members} />
        </PadDiv>
      </div>
      <BottomNav />
    </ViewDiv>
  );
};

export default Members;
