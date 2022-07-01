import React, { useState, useEffect } from 'react';
import { Badge, Flex, SkeletonText, Heading, Box } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import MarkdownDisplay from '../components/MarkdownDisplay';
import TextBox from '../components/TextBox';
import { ParaMd } from '../components/typography';

import { DAO_DOC } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';
import {
  getDocContent,
  isEncoded,
  isIPFS,
  isRatified,
  isSpecialLocation,
} from '../utils/poster';
import { formatCreatedAt } from '../utils/general';

const getDAOdoc = async ({ daochain, setDoc, docId }) => {
  const endpoint = chainByID(daochain)?.subgraph_url;
  try {
    const res = await graphQuery({
      endpoint,
      query: DAO_DOC,
      variables: {
        id: docId,
      },
    });

    const docData = res.contents?.[0];
    if (docData?.content && docData?.contentType) {
      const withDecoded = await getDocContent({ docData });
      setDoc(withDecoded);
    }
  } catch (error) {
    console.error(error);
  }
};

const DaoDoc = () => {
  const { daochain, daoid, docId } = useParams();

  const [doc, setDoc] = useState('loading');

  useEffect(() => {
    let shouldUpdate = true;
    if (docId) {
      getDAOdoc({
        daochain,
        daoid,
        docId,
        setDoc,
        shouldUpdate,
      });
    }
    return () => (shouldUpdate = false);
  }, [docId]);
  const title = doc?.title === 'n/a' ? 'Title Missing' : doc.title;
  return (
    <MainViewLayout isDao>
      <Link to={`/dao/${daochain}/${daoid}/docs`}>
        <Flex alignItems='center' mb={4}>
          <RiArrowLeftLine size='1.1rem' />
          <TextBox ml='2' color='seconfary.500'>
            All Documents
          </TextBox>
        </Flex>
      </Link>
      <ContentBox mb={4} maxWidth='1000px'>
        <Flex flexDirection={['column', 'column', 'row']}>
          <Box mb={6}>
            <Box mb={14}>
              <Heading>{title}</Heading>
              <ParaMd mb={4} fontStyle='italic' fontWeight='100'>
                {`${isRatified(doc) ? 'Ratified ' : 'Posted '} on ${
                  doc?.createdAt ? formatCreatedAt(doc.createdAt) : 'n/a'
                }`}
              </ParaMd>
              <ParaMd>{doc?.description}</ParaMd>
            </Box>
            <MarkdownDisplay source={doc?.content} />
          </Box>
          {doc?.isDecoded && (
            <Flex alignItems='flex-start' mb={6}>
              {isRatified(doc) && <Badge mr={2}>Ratified</Badge>}
              {isIPFS(doc) && <Badge mr={2}>IPFS</Badge>}
              {isEncoded(doc) && <Badge mr={2}>Chain</Badge>}
              {isSpecialLocation(doc) && <Badge mr={2}>{doc?.location}</Badge>}
            </Flex>
          )}
        </Flex>

        {doc === 'loading' && <SkeletonText height='400px' />}
      </ContentBox>
    </MainViewLayout>
  );
};

export default DaoDoc;
