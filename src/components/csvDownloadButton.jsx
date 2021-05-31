import React from 'react';
import { Box, Icon, useToast } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';
import { downloadFromBrowser, prepCsvData } from '../utils/csv';

const CsvDownloadButton = ({ entityList, typename }) => {
  const toast = useToast();
  const handleDownload = () => {
    const csvArray = prepCsvData(entityList);
    const nowSeconds = (new Date() / 1000).toFixed(0);
    const filename = `${typename}_${nowSeconds}.csv`;
    downloadFromBrowser(csvArray, filename);
    toast({
      title: 'Download complete',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <Box onClick={handleDownload}>
      <Icon
        transform='translateY(2px)'
        as={BsDownload}
        color='secondary.300'
        ml={2}
        _hover={{ cursor: 'pointer' }}
      />
    </Box>
  );
};

export default CsvDownloadButton;
