import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import MemberInfoGuts from './memberInfoGuts';
import { getTerm, getTitle } from '../utils/metadata';

const MemberInfo = ({ member, customTerms, hideCopy }) => {
  const { address } = useInjectedProvider();
  const { daoid, daochain } = useParams();

  return (
    <>
      {member && (
        <>
          <Flex justify='space-between'>
            <TextBox size='sm' title={getTitle(customTerms, 'Member')}>
              {getTerm(customTerms, 'member')} Info
            </TextBox>
            {member && (
              <TextBox
                as={Link}
                to={`/dao/${daochain}/${daoid}/profile/${member.memberAddress}`}
                color='inherit'
                size='xs'
              >
                View
                {address?.toLowerCase() === member?.memberAddress
                  ? ' my '
                  : ' '}
                profile
              </TextBox>
            )}
          </Flex>
          <ContentBox mt={3}>
            <MemberInfoGuts member={member} hideCopy={hideCopy} />
          </ContentBox>
        </>
      )}
    </>
  );
};

export default MemberInfo;
