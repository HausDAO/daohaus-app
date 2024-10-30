import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import GenericFormDisplay from './genericFormDisplay';
import { useDao } from '../contexts/DaoContext';
import { useToken } from '../contexts/TokenContext';
import { numberWithCommas } from '../utils/general';
import { calcValue } from '../utils/profile';

import { fetchSingleMember } from '../utils/theGraph';

const MemberImpact = props => {
  const { localForm } = props;
  const [member, setMember] = useState(null);
  const { daoOverview } = useDao();
  const { currentDaoTokens } = useToken();
  const { daochain, daoid } = useParams();
  const values = localForm.getValues();
  useEffect(async () => {
    if (values?.applicant && daochain && daoid) {
      const member = await fetchSingleMember({
        chainID: daochain,
        memberAddress: values?.applicant,
        molochAddress: daoid,
      });
      setMember(member.member);
    } else {
      setMember(null);
    }
  }, [values?.applicant, daoid, daochain]);

  return (
    <>
      <Flex justifyContent='space-between'>
        <GenericFormDisplay
          override={member?.shares || '0'}
          localForm={localForm}
          label='Shares Owned'
          variant='value'
        />
        <GenericFormDisplay
          override={member?.loot || '0'}
          localForm={localForm}
          label='Loot Owned'
          variant='value'
        />
        <GenericFormDisplay
          override={
            (currentDaoTokens &&
              daoOverview &&
              member &&
              numberWithCommas(
                calcValue(member, currentDaoTokens, daoOverview),
              )) ||
            '0'
          }
          localForm={localForm}
          label='Treasury Impact'
          variant='value'
        />
      </Flex>
    </>
  );
};

export default MemberImpact;
