import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Button, Icon } from '@chakra-ui/react';
import { RiArrowRightSLine } from 'react-icons/ri';
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
<<<<<<< HEAD
  )
}

export default BoostNotActive;
=======
  );
};

export default BoostNotActive;
>>>>>>> c7f1d525c3f5bdde31e60664a0647aba4aeb8722
