import React, { useEffect, useState } from 'react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import DaoMetaForm from '../forms/daoMetaForm';

const Meta = ({ isMember, daoMetaData, refetchMetaData }) => {
  const [localMetadata, setLocalMetadata] = useState();
  const history = useHistory();
  const { daochain, daoid } = useParams();

  useEffect(() => {
    if (daoMetaData && !localMetadata) {
      setLocalMetadata({
        address: daoMetaData.contractAddress,
        name: daoMetaData.name,
        description: daoMetaData.description,
        purpose: daoMetaData.purpose,
        links: daoMetaData.links,
        avatarImg: daoMetaData.avatarImg,
        version: daoMetaData.version,
        tags: daoMetaData.tags,
      });
    }
  }, [daoMetaData, localMetadata]);

  const handleUpdate = () => {
    refetchMetaData();
    history.push(`/dao/${daochain}/${daoid}/settings`);
  };

  return (
    <Flex wrap='wrap'>
      <Flex justify='space-between' align='center' w='100%'>
        <Flex
          as={RouterLink}
          to={`/dao/${daochain}/${daoid}/settings`}
          align='center'
        >
          <Icon as={BiArrowBack} color='secondary.500' mr={2} />
          Back
        </Flex>
      </Flex>
      {isMember ? (
        <Box w='40%' mt={2}>
          <DaoMetaForm handleUpdate={handleUpdate} metadata={localMetadata} />
        </Box>
      ) : (
        <Box
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          p={6}
          m={[10, 'auto', 0, 'auto']}
          w='50%'
          textAlign='center'
          fontSize={['lg', null, null, '3xl']}
          fontFamily='heading'
          fontWeight={700}
        >
          Members Only
        </Box>
      )}
    </Flex>
  );
};

export default Meta;
