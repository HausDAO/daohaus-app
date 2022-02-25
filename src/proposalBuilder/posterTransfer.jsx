import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@chakra-ui/react';

import { ParaMd } from '../components/typography';
import { useAppModal } from '../hooks/useModals';
import { AsyncCardTransfer, PropCardError } from './proposalBriefPrimitives';
import { contentFromMinionAction } from '../utils/poster';

const PosterTransfer = ({ minionAction }) => {
  const [contentData, setContentData] = useState(null);
  const { genericModal } = useAppModal();

  useEffect(() => {
    let shouldUpdate = true;
    const handleContentData = async () => {
      if (shouldUpdate) {
        setContentData(await contentFromMinionAction({ minionAction }));
      }
    };

    if (minionAction?.decoded) {
      handleContentData();
    }
    return () => (shouldUpdate = false);
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

  return <AsyncCardTransfer customUI={customUI} isLoaded={customUI} />;
};

export default PosterTransfer;
