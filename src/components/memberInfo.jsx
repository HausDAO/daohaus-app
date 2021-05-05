import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getTerm } from '../utils/metadata';
import MemberInfoGuts from './memberInfoGuts';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import UberHausMemberInfoGuts from './uberHausMemberInfoGuts';

const MemberInfoCard = ({ member, customTerms, hideCopy }) => {
  const { address } = useInjectedProvider();
  const { daoid, daochain } = useParams();

  return (
    <>
      {member && (
        <>
          <Flex justify='space-between'>
            <TextBox size='sm'>
              {`${getTerm(customTerms, 'member')} Info`}
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
            {member.isUberMinion ? (
              <UberHausMemberInfoGuts member={member} />
            ) : (
              <MemberInfoGuts member={member} hideCopy={hideCopy} />
            )}
          </ContentBox>
        </>
      )}
    </>
  );
};

export default MemberInfoCard;
