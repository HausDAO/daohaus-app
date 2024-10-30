import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import TextBox from './TextBox';
import { newLocationMaker } from '../utils/proposalUtils';
import { DAO_DOC } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';
import { getDocContent } from '../utils/poster';

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
const ProposalDocLocationCard = ({ proposal }) => {
  const { daochain, daoid } = useParams();
  const [doc, setDoc] = useState('loading');
  const [newLocation, docId] = newLocationMaker(proposal);

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
  const currentLoc =
    doc?.location === 'n/a' ? 'Location Missing' : doc.location;

  return (
    <>
      <Flex mt={6}>
        <Flex flexDir='column'>
          <TextBox size='xs' variant='mono'>
            Document: {title}
          </TextBox>
          <TextBox size='xs' variant='mono'>
            Current Location: {currentLoc}
          </TextBox>
          <TextBox size='xs' variant='mono'>
            Proposed New Location: {newLocation}
          </TextBox>
        </Flex>
      </Flex>
    </>
  );
};

export default ProposalDocLocationCard;
