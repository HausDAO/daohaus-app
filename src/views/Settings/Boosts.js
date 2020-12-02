import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
// import { useDao } from '../../contexts/PokemolContext';

const boostList = [
  {
    name: 'Custom Theme',
    description: 'Customize the visual theme of your community',
  },
  {
    name: 'Notifications',
    description:
      'Customize and send notifications of DAO activity to your social channels',
  },
];

const Boosts = () => {
  // const [dao] = useDao();

  return (
    <Box>
      <Box
        fontFamily='heading'
        fontWeight={700}
        fontSize='sm'
        textTransform='uppercase'
        ml={8}
      >
        Available Apps
      </Box>
      <Flex pl={3}>
        {boostList.map((boost, i) => {
          return (
            <Flex
              key={i}
              rounded='lg'
              bg='blackAlpha.600'
              borderWidth='1px'
              borderColor='whiteAlpha.200'
              p={3}
              m={3}
              w='300px'
              h='370px'
              direction='column'
              align='center'
              justify='space-around'
            >
              <Box fontFamily='heading' fontSize='2xl' fontWeight={700}>
                {boost.name}
              </Box>
              <Box maxW='80%' textAlign='center'>
                {boost.description}
              </Box>
              <Button textTransform='uppercase' disabled={true}>
                Coming Soon
              </Button>
              {/* <Button
                as={Link}
                textTransform='uppercase'
                to={`/dao/${dao.address}/settings/boosts/new`}
              >
                Add This App
              </Button> */}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

export default Boosts;
