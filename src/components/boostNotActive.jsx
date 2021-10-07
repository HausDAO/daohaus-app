import React from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Button, Icon } from '@chakra-ui/react';

import TextBox from './TextBox';

const BoostNotActive = () => {
  const { daochain, daoid } = useParams();

  return (
    <Flex direction='column' w='100%' py={10} align='center'>
      <TextBox>Boost Not Active</TextBox>
      <Button
        as={RouterLink}
        to={`/dao/${daochain}/${daoid}/settings/boosts`}
        mt={10}
        w='200px'
        rightIcon={<Icon as={RiArrowRightSLine} />}
      >
        Head to Settings
      </Button>
    </Flex>
  );
};

export default BoostNotActive;
