import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Image,
  Box,
} from '@chakra-ui/react';
// import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';

// import {
//   useDao,
//   useTxProcessor,
//   useUser,
//   useModals,
// } from '../../../contexts/PokemolContext';
import TextBox from '../components/TextBox';
import DetailsFields from './detailFields';
import AddressInput from './addressInput';
import { detailsToJSON } from '../utils/general';
// import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import DelegateMenu from '../components/DelegateMenu';

// TODO pass delegate to delegate menu
// TODO replace delegate with user avatar
// TODO sort out term limits, emergency recall

const DelegateProposalForm = () => {
  const [loading, setLoading] = useState(false);
  // const { daoid } = useParams();
  // const { address } = useInjectedProvider();
  const [currentError, setCurrentError] = useState(null);
  const { setD2dProposalModal } = useOverlay();

  const { handleSubmit, errors, register, setValue, watch } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newE = Object.keys(errors)[0];
      setCurrentError({
        field: newE,
        ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  const onSubmit = async (values) => {
    setLoading(true);

    const details = detailsToJSON(values);
    console.log(details);
    // try {
    //   dao.daoService.moloch.submitProposal(
    //     values.sharesRequested ? values.sharesRequested?.toString() : '0',
    //     values.lootRequested ? values.lootRequested?.toString() : '0',
    //     values.tributeOffered
    //       ? utils.toWei(values.tributeOffered?.toString())
    //       : '0',
    //     values.tributeToken || dao.graphData.depositToken.tokenAddress,
    //     values.paymentRequested
    //       ? utils.toWei(values.paymentRequested?.toString())
    //       : '0',
    //     values.paymentToken || dao.graphData.depositToken.tokenAddress,
    //     details,
    //     values?.applicantHidden?.startsWith('0x')
    //       ? values.applicantHidden
    //       : values?.applicant
    //       ? values.applicant
    //       : user.username,
    //     txCallBack,
    //   );
    // } catch (err) {
    //   setLoading(false);
    //   console.log('error: ', err);
    // }
    setD2dProposalModal((prevState) => !prevState);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        flexWrap='wrap'
      >
        <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
          <DetailsFields register={register} />
        </Box>
        <Box w={['100%', null, '50%']}>
          <TextBox size='xs' htmlFor='name' mb={2}>
            Current Delegate
          </TextBox>
          <Flex w='60%' align='center' justify='space-between' pb={3}>
            <Image src={DAOHaus} w='40px' h='40px' />
            <Box fontFamily='heading' fontWeight={900}>
              takashi.eth
            </Box>
            <DelegateMenu />
          </Flex>

          <AddressInput
            name='delegate'
            formLabel='Delegate Address'
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <TextBox as={FormLabel} size='xs' htmlFor='name' mb={2}>
            Term
          </TextBox>
          <Input
            name='delegateTerm'
            placeholder='0'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Delegate term is required for Delegate Proposals',
              },
              pattern: {
                value: /[0-9]/,
                message: 'Term must be a number in months',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
          />
        </Box>
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Box color='secondary.300' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
            {currentError.message}
          </Box>
        )}
        <Box>
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export default DelegateProposalForm;
