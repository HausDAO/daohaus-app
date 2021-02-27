import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  InputGroup,
  FormLabel,
  Input,
  InputRightAddon,
  FormHelperText,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
// import { useMetaData } from '../contexts/MetaDataContext';
import { boostList } from '../content/boost-content';
import GenericModal from '../modals/genericModal';
import { useOverlay } from '../contexts/OverlayContext';
import BoostLaunchWrapper from '../components/boostLaunchWrapper';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { getTerm } from '../utils/metadata';

const Staking = ({ customTerms, daoMember, daoOverview, daoMetaData }) => {
  // const { daoMetaData } = useMetaData();

  // const canInteract =
  //   daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) &&
  //   +daoMember?.shares > 0;

  // const hasDependentBoost = (boostKey) => {
  //   if (boostKey === 'vanillaMinions') {
  //     const minions = daoOverview.minions.length;
  //     return minions;
  //   }
  //   const boostData = daoMetaData.boosts[boostKey];
  //   console.log(daoMetaData.boosts, daoOverview);
  //   return boostData && boostData.active;
  // };

  // const renderBoostCard = (boost, i) => {
  //   const boostData = daoMetaData.boosts && daoMetaData.boosts[boost.key];
  //   const hasBoost = boostData && boostData.active;

  //   return (
  //     <ContentBox
  //       d='flex'
  //       key={i}
  //       w={['100%', '100%', '40%', '30%']}
  //       h='370px'
  //       m={3}
  //       mb={6}
  //       p={6}
  //       flexDirection='column'
  //       alignItems='center'
  //       justifyContent='space-around'
  //     >
  //       <Box fontFamily='heading' fontSize='2xl' fontWeight={700}>
  //         {boost.name}
  //       </Box>
  //       <Box textAlign='center'>{boost.description}</Box>
  //       {boost.price === '0' ? (
  //         <Box textAlign='center' fontFamily='heading'>
  //           Cost
  //         </Box>
  //       ) : null}

  //       <Box textAlign='center'>
  //         {boost.price === '0' ? (
  //           <Box fontFamily='heading' fontSize='xl' m={0}>
  //             Free
  //           </Box>
  //         ) : null}
  //       </Box>
  //       {boost.comingSoon ? (
  //         <Button textTransform='uppercase' disabled={true}>
  //           Coming Soon
  //         </Button>
  //       ) : (
  //         <>
  //           {hasBoost ? (
  //             <Button
  //               as={RouterLink}
  //               to={`/dao/${daochain}/${daoid}/settings/${boost.successRoute}`}
  //               textTransform='uppercase'
  //               disabled={!canInteract}
  //             >
  //               Settings
  //             </Button>
  //           ) : (
  //             <>
  //               {boost.dependency && !hasDependentBoost(boost?.dependency) ? (
  //                 <Button textTransform='uppercase' disabled={true}>
  //                   Needs {boost.dependency}
  //                 </Button>
  //               ) : (
  //                 <Button
  //                   textTransform='uppercase'
  //                   onClick={() => setGenericModal({ [boost.key]: true })}
  //                   disabled={!canInteract}
  //                 >
  //                   Add This App
  //                 </Button>
  //               )}
  //             </>

  //             // <Button
  //             //   textTransform='uppercase'
  //             //   onClick={() => setGenericModal({ [boost.key]: true })}
  //             //   disabled={!canInteract}
  //             // >
  //             //   Add This {getTerm(customTerms, 'boost')}
  //             // </Button>
  //           )}
  //         </>
  //       )}
  //       <GenericModal closeOnOverlayClick={false} modalId={boost.key}>
  //         <>
  //           {!boost.comingSoon ? (
  //             <>
  //               <BoostLaunchWrapper boost={boost} />
  //             </>
  //           ) : null}
  //         </>
  //       </GenericModal>
  //     </ContentBox>
  //   );
  // };
  const onStakeHaus = () => {};
  // const

  const StakeHausBtn = () => (
    <Button textTransform='uppercase' onClick={onStakeHaus}>
      stake $haus
    </Button>
  );

  return (
    <MainViewLayout header='Stake' headerEl={<StakeHausBtn />} isDao={true}>
      <Box>
        <TextBox size='sm' mb={3} textTransform='uppercase'>
          stake $haus, earn $haus
        </TextBox>

        <Flex>
          <StakeCard
            title='Ronan'
            description='Stake $Haus on your own'
            reward='Get 1x Rewards, Soft Signaling'
            label='My Wallet: 314.51489 $HAUS'
          />
          <StakeCard title='Clan' />
          <StakeCard title='Shogun' mr='auto' />
          {/* {daoMetaData
            ? boostList.map((boost, i) => {
              return renderBoostCard(boost, i);
            })
          : null} */}
          <PriceBox />
        </Flex>
        <TextBox size='sm' mb={3} textTransform='uppercase'>
          staking snapshot
        </TextBox>
      </Box>
    </MainViewLayout>
  );
};

export default Staking;

const StakeCard = (props) => {
  const { title, description, reward, label, ...rest } = props;

  const handleClick = () => {};
  return (
    <ContentBox
      d='flex'
      minWidth='260px'
      width='100%'
      maxWidth='350px'
      mr={4}
      {...rest}
      flexDirection='column'
      alignItems='center'
      justifyContent='space-around'
    >
      <Box fontFamily='heading' fontSize='2xl' mb={3} fontWeight={700}>
        {title}
      </Box>
      <Box fontSize='sm' textTransform='center'>
        {description}
      </Box>
      <Box fontSize='sm' textAlign='center' mb={3}>
        {reward}
      </Box>
      <Flex
        maxWidth='250px'
        width='100%'
        minWidth='200px'
        justifyContent='flex-start'
      >
        <Box as={FormLabel} fontSize='xs' color='whiteAlpha.700'>
          {label}
        </Box>
      </Flex>
      <InputGroup
        maxWidth='250px'
        width='100%'
        minWidth='200px'
        justifyContent='center'
      >
        <Input
          // name='tributeOffered'
          placeholder='0'
          mb={5}
          // ref={register({
          color='white'
          focusBorderColor='secondary.500'
          // onChange={handleChange}
        />
        <InputRightAddon background='primary.500' p={0}>
          <Button size='md' variant='text'>
            Max
          </Button>
        </InputRightAddon>
      </InputGroup>
      <Button
        px='2.5rem'
        mb={5}
        // size='lg'
        textTransform='uppercase'
        onClick={handleClick}
      >
        Stake
      </Button>
      <Flex align='center' mb={3}>
        <TextBox size='xs' transform='translateY(2px)' mr={2}>
          Earned:{' '}
        </TextBox>
        <Box fontFamily='mono' fontSize='xl' fontWeight={700}>
          {title}
        </Box>
      </Flex>
      <Flex>
        <Button size='sm' variant='outline' px='1.5rem' mr={4}>
          Harvest
        </Button>
        <Button size='sm' variant='outline' px='1.5rem'>
          Withdraw All
        </Button>
      </Flex>
    </ContentBox>
  );
};

const PriceBox = () => (
  <ContentBox
    d='flex'
    // key={i}
    width='350px'
    mr={4}
    // h='370px'
    // m={3}
    // mb={6}
    // p={6}
    flexDirection='column'
    alignItems='center'
    justifyContent='space-around'
  ></ContentBox>
);
