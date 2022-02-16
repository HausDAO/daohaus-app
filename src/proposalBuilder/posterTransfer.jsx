import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import Web3 from 'web3';
import { Button } from '@chakra-ui/react';

import { ParaMd } from '../components/typography';
import { useAppModal } from '../hooks/useModals';
import { parseIfJSON } from '../utils/general';
import { PropCardError, PropCardTransfer } from './proposalBriefPrimitives';

const getContentData = ({ minionAction }) => {
  const rawJSON = minionAction?.decoded?.actions?.[0]?.data?.params?.[0]?.value;
  if (rawJSON) {
    const data = parseIfJSON(rawJSON);
    if (data.content) {
      const withDecoded = {
        ...data,
        content: Web3.utils.hexToUtf8(data.content),
      };
      if (withDecoded) return withDecoded;
    }
  }
  return { error: true, message: 'Could decode content' };
};

const PosterTransfer = ({ minionAction }) => {
  const [contentData, setContentData] = useState(null);
  const { genericModal } = useAppModal();

  useEffect(() => {
    if (minionAction?.decoded) {
      setContentData(getContentData({ minionAction }));
    }
  }, [minionAction]);

  const displayDetails = () => {
    genericModal({
      title: contentData?.title,
      subtitle: 'Preview Mode',
      body: <MDEditor.Markdown source={contentData?.content} />,
      width: '1000px',
    });
  };
  const customUI = contentData?.content && (
    <ParaMd>
      Ratify &apos;{contentData?.title}&apos; (
      <Button
        size='fit-content'
        variant='text'
        color='secondary.400'
        onClick={displayDetails}
        transform='translateY(-1px)'
        lineHeight='1.1rem'
      >
        <ParaMd>View Details</ParaMd>
      </Button>
      )
    </ParaMd>
  );

  if (contentData?.error) {
    return <PropCardError message={contentData?.message} />;
  }

  return <PropCardTransfer customUI={customUI} />;
};

export default PosterTransfer;
