import React from 'react';
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
import { useTheme } from '../../contexts/PokemolContext';
import { PrimaryButton } from '../../themes/theme';

const ProposalFormModal = ({ isOpen, setShowModal }) => {
  const [theme] = useTheme();
  const {
    // handleSubmit,
    errors,
    // register,
    // formState
  } = useForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setShowModal(null)}
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
          <form>
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
                <PrimaryButton color='white'>Submit</PrimaryButton>
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
