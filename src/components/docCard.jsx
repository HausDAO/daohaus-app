import React from 'react';
import { Badge, Flex } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

import ContentBox from './ContentBox';
import { ParaLg, ParaMd, ParaSm } from './typography';

import { charLimit, formatCreatedAt } from '../utils/general';
import {
  isCurrentDocAtLocation,
  isEncoded,
  isIPFS,
  isRatified,
} from '../utils/poster';

const DocCard = ({ doc, specialLocationDocs }) => {
  const { daochain, daoid } = useParams();

  const title = doc?.title === 'n/a' ? 'Title Missing' : doc.title;

  return (
    <ContentBox key={doc?.id} mb={6} mr={6} height='12.5rem' width='25rem'>
      <Flex justifyContent='space-between' flexDirection='column' height='100%'>
        <Flex width='350px' flexDir='column'>
          <ParaLg fontSize='1.3rem' mb={2} fontWeight='500'>
            {charLimit(title)}
          </ParaLg>
          <ParaSm mb={4} fontStyle='italic' fontWeight='100'>
            {`${isRatified(doc) ? 'Ratified ' : 'Posted '} on ${
              doc?.createdAt ? formatCreatedAt(doc.createdAt) : 'n/a'
            }`}
          </ParaSm>
          <ParaMd mb={3}>{doc?.description || 'No description'}</ParaMd>
        </Flex>
        <Flex justifyContent='space-between' mt='auto'>
          <Flex>
            {isRatified(doc) && <Badge mr={2}>Ratified</Badge>}
            {isIPFS(doc) && <Badge mr={2}>IPFS</Badge>}
            {isEncoded(doc) && <Badge mr={2}>Chain</Badge>}
            {isCurrentDocAtLocation(doc, specialLocationDocs) && (
              <Badge>{doc?.location}</Badge>
            )}
          </Flex>
          <Link to={`/dao/${daochain}/${daoid}/doc/${doc.id}`}>
            <ParaMd>VIEW</ParaMd>
          </Link>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

export default DocCard;
