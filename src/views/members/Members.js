import React, {useContext} from 'react';
import { Query } from 'react-apollo';

import { GET_MEMBERS_QUERY } from '../../utils/MemberService';
import MemberList from '../../components/member/MemberList';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import StateModals from '../../components/shared/StateModals';
import { DaoContext } from '../../contexts/Store';

const Members = () => {
  const [daoService] = useContext(DaoContext)
  return (
    <div className="View">
      <StateModals />

      <Query 
        query={GET_MEMBERS_QUERY} 
        variables={{ contractAddr: daoService.contract.options.address.toLowerCase() }}
        >
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error} />;

          return (
            <div className="Members">
              <h3 className="Pad">Members</h3>
              <MemberList members={data.members} />
            </div>
          );
        }}
      </Query>
      <BottomNav />
    </div>
  );
};

export default Members;
