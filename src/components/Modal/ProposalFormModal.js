import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  // FormErrorMessage,
  FormLabel,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  // Button,
  Icon,
  Stack,
  Select,
  Box,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/core';
import {
  useDao,
  useTheme,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { PrimaryButton } from '../../themes/theme';
import { Web3MolochServiceV2 } from '../../utils/moloch-service';

const ProposalFormModal = ({ isOpen, setShowModal }) => {
  const [loading, setLoading] = useState(false);

  const [theme] = useTheme();
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [web3Connect] = useWeb3Connect();

  const {
    handleSubmit,
    errors,
    // register,
    // formState
  } = useForm();

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false);
      txProcessor.forceUpdate = true;

      updateTxProcessor(txProcessor);
      // close model here
      // onClose();
      // setShowModal(null);
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    console.log('SUBMIT', dao.daoService);
    // console.log('SUBMIT', dao.daoService);

    try {
      // const moloch = new Web3MolochServiceV2(
      //   web3Connect.web3,
      //   dao.contractAddr,
      //   user.username,
      //   '2',
      // );
      const data = {
        applicant: '',
        tributeOffered: '10000000000000000',
        tributeToken: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        sharesRequested: '10',
        lootRequested: '0',
        details: JSON.stringify({
          title: 'prop 1 test',
          description: 'new member',
          link: 'https://github.com/',
        }),
      };
      dao.daoService.moloch.submitProposal(
        data.sharesRequested,
        data.lootRequested,
        data.tributeOffered,
        data.tributeToken,
        0,
        data.tributeToken,
        data.details,
        // data.applicant,
        // user.username,
        '0x68d36DcBDD7Bbf206e27134F28103abE7cf972df',
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setLoading(false);
        setShowModal(null);
      }}
      size={1000}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
      >
        <ModalHeader>
          <Text
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
            color='#7579C5'
            mb={4}
          >
            New {theme.daoMeta.proposal}
          </Text>
          <Text
            fontFamily={theme.fonts.heading}
            fontSize='xl'
            fontWeight={700}
            color='white'
          >
            New {theme.daoMeta.member} {theme.daoMeta.proposal}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color='#C4C4C4' mb={6}>
            Submit your membership proposal here.
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isInvalid={errors.name}
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              mb={5}
            >
              <Box w='48%'>
                <FormLabel
                  htmlFor='title'
                  color='white'
                  fontFamily={theme.fonts.heading}
                  textTransform='uppercase'
                  fontSize='xs'
                  fontWeight={700}
                >
                  Details
                </FormLabel>
                <Stack spacing={4}>
                  <Input
                    name='title'
                    placeholder='Proposal Title'
                    mb={5}
                    // ref={register({ validate: validateName })}
                  />
                  <Textarea
                    name='description'
                    placeholder='Short Description'
                    type='textarea'
                    mb={5}
                    h={10}
                    // ref={register({ validate: validateName })}
                  />
                  <InputGroup>
                    <InputLeftAddon>https://</InputLeftAddon>
                    <Input placeholder='mylink.com' />
                  </InputGroup>
                </Stack>
              </Box>
              <Box w='48%'>
                <FormLabel
                  htmlFor='name'
                  color='white'
                  fontFamily={theme.fonts.heading}
                  textTransform='uppercase'
                  fontSize='xs'
                  fontWeight={700}
                >
                  Shares Requested
                </FormLabel>
                <Input
                  name='title'
                  placeholder='0'
                  mb={5}
                  // ref={register({ validate: validateName })}
                />
                <FormLabel
                  htmlFor='tributeOffered'
                  color='white'
                  fontFamily={theme.fonts.heading}
                  textTransform='uppercase'
                  fontSize='xs'
                  fontWeight={700}
                >
                  Token Tributed
                </FormLabel>
                <InputGroup>
                  <Input
                    name='tributeOffered'
                    placeholder='0'
                    mb={5}
                    // ref={register({ validate: validateName })}
                  />
                  <InputRightAddon>
                    <Select>
                      <option default value='weth'>
                        WETH
                      </option>
                      <option value='dai'>Dai</option>
                      <option value='usdc'>USDC</option>
                    </Select>
                  </InputRightAddon>
                </InputGroup>
                <Text
                  color='white'
                  fontFamily={theme.fonts.heading}
                  textTransform='uppercase'
                  fontSize='xs'
                  fontWeight={700}
                >
                  Additional Options <Icon name='small-add' color='white' />
                </Text>
              </Box>
            </FormControl>
            <Flex justify='flex-end' align='center' h='60px'>
              <Box>
                <PrimaryButton
                  color='white'
                  type='submit'
                  loadingText='Submitting'
                  isLoading={loading}
                  disabled={loading}
                >
                  Submit
                </PrimaryButton>
              </Box>
            </Flex>
          </form>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProposalFormModal;
