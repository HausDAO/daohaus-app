import React, { useState, useEffect } from 'react';
import { SkeletonText } from '@chakra-ui/react';
import MDEditor from '@uiw/react-md-editor';
import { Link, useParams } from 'react-router-dom';

import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';

import { DAO_DOC } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';
import { getDocContent } from '../utils/poster';

const getDAOdoc = async ({ daochain, setDoc, docId }) => {
  const endpoint = chainByID(daochain)?.poster_graph_url;
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
    if (docId) {
      getDAOdoc({
        daochain,
        daoid,
        docId,
        setDoc,
      });
    }
  }, [docId]);

  return (
    <MainViewLayout isDao header={doc?.title || 'Loading'}>
      {doc?.isDecoded && (
        <ContentBox mb={4}>
          <MDEditor.Markdown source={doc?.content} />
        </ContentBox>
      )}
      {doc === 'loading' && <SkeletonText height='400px' />}
      <Link to={`/dao/${daochain}/${daoid}/docs`}> Back To Docs</Link>
    </MainViewLayout>
  );
};

export default DaoDoc;
