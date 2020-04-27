import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import MemberDetail from '../../components/member/MemberDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import { ViewDiv } from '../../App.styles';
import { MemberDetailDiv } from '../../components/member/Member.styles';
import { GET_MEMBER } from '../../utils/Queries';

const Member = (props) => {
  const { loading, error, data } = useQuery(GET_MEMBER, {
    variables: { id: props.match.params.id },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ViewDiv>
      <MemberDetailDiv>
        {data ? <MemberDetail member={data.member} /> : null}
      </MemberDetailDiv>
      <BottomNav />
    </ViewDiv>
  );
};

export default Member;
