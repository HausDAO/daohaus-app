import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import MainViewLayout from '../components/mainViewLayout';
import { DAO_DOC, DAO_DOC_COLLECTION } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';

// const decodeContent = async doc => {
//   const decoded = Web3.utils.hex
// };

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
      setDoc(decodeContent(doc));
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
    <MainViewLayout isDao header='Loading'>
      {/* {doc.content ? : <ParaMd>Error decoding Content</ParaMd>} */}
    </MainViewLayout>
  );
};

export default DaoDoc;
