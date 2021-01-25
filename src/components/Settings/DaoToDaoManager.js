import React from 'react';
import { Image, Flex, Box, Button } from '@chakra-ui/react';
import { useModals } from '../../contexts/PokemolContext';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import DAOHaus from '../../assets/Daohaus__Castle--Dark.svg';

// TODO don't show for rinkeby/kovan. how does this work across network? will uberhaus be on mainnet or xdai? matic?

const DaoToDaoManager = () => {
  const { openModal } = useModals();

  return (
    <>
      <TextBox size='xs' mb={2} mt={10}>
        DAO On DAO Memberships
      </TextBox>
      <ContentBox w='40%'>
        <Flex align='center'>
          <Image src={DAOHaus} w='50px' h='50px' mr={4} />
          <Box fontFamily='heading' fontSize='xl' fontWeight={900}>
            UberHAUS
          </Box>
        </Flex>
        <Flex justify='space-between' py={4}>
          <Box>
            <TextBox size='sm'>Shares</TextBox>
            <TextBox variant='value'>42</TextBox>
          </Box>
          <Box>
            <TextBox size='sm'>Loot</TextBox>
            <TextBox variant='value'>0</TextBox>
          </Box>
          <Box>
            <TextBox size='sm'>Join Date</TextBox>
            <TextBox variant='value'>Jan 11, 2111</TextBox>
          </Box>
        </Flex>
        <Box>
          <TextBox mb={2} size='sm'>
            Delegate
          </TextBox>
          <Flex justify='space-between'>
            <Flex>
              <Image
                src={DAOHaus}
                alt='delegate name'
                w='50px'
                h='50px'
                mr={3}
              />
              <Box>
                <Box fontFamily='heading' fontWeight={800}>
                  Takashi
                </Box>
                <Box fontFamily='mono' fontSize='sm'>
                  Takashi.eth
                </Box>
              </Box>
            </Flex>

            <Button w='25%' onClick={() => openModal('daoToDaoProposalType')}>
              Manage
            </Button>
          </Flex>
        </Box>
      </ContentBox>
    </>
  );
};

export default DaoToDaoManager;
