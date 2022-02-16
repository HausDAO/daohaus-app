import MDEditor from '@uiw/react-md-editor';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Web3 from 'web3';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import { ParaMd } from '../components/typography';
import { DAO_DOC } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';

const decodeContent = doc => {
  const decoded = Web3.utils.hexToUtf8(doc.content);
  return { ...doc, content: decoded, isDecoded: true };
};

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
    const doc = res.contents?.[0];
    if (doc?.content) {
      const withDecoded = decodeContent(doc);
      setDoc(withDecoded);
    }
  } catch (error) {
    console.error(error);
  }
};

const DaoDoc = () => {
  const { daochain, daoid, docId } = useParams();

  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (docId) {
      getDAOdoc({
        daochain,
        daoid,
        docId,
        setDoc,
      });
    }
  }, []);
  return (
    <MainViewLayout isDao header={doc?.title || 'Loading'}>
      {doc?.isDecoded ? (
        <>
          <ContentBox mb={4}>
            <MDEditor.Markdown source={doc?.content} />
          </ContentBox>
        </>
      ) : (
        <ParaMd>Error decoding Content</ParaMd>
      )}
      <Link to={`/dao/${daochain}/${daoid}/docs`}> Back To Docs</Link>
    </MainViewLayout>
  );
};

export default DaoDoc;
