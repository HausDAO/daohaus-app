import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { useMetaData } from '../contexts/MetaDataContext';
import { getCopy } from '../utils/metadata';
import MemberInfoGuts from './memberInfoGuts';
import TextBox from './TextBox';
import ContentBox from './ContentBox';

const MemberInfoCard = ({ member }) => {
  const { daoid, daochain } = useParams();
  const { customTerms } = useMetaData();

  return (
    <>
      {member && (
        <>
          <Flex justify='space-between'>
            <TextBox size='sm'>{getCopy(customTerms, 'member')} Info</TextBox>
            {member && (
              <TextBox
                as={Link}
                to={`/dao/${daochain}/${daoid}/profile/${member.memberAddress}`}
                color='inherit'
                size='xs'
              >
                View profile
              </TextBox>
            )}
          </Flex>
          <ContentBox mt={3}>
            <MemberInfoGuts member={member} showMenu={true} />
          </ContentBox>
        </>
      )}
    </>
  );
};

export default MemberInfoCard;
