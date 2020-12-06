import React, { useState } from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';
import TextBox from '../Shared/TextBox';
import { useEns, useMembers, useUser } from '../../contexts/PokemolContext';
import { truncateAddr } from '../../utils/helpers';

const AddressInput = ({
  register,
  setValue,
  watch,
  formLabel,
  guildKick,
  newMember,
  member,
}) => {
  formLabel = formLabel || 'applicant';
  const [ens] = useEns();
  const [user] = useUser();
  const [anyApplicant, setAnyApplicant] = useState(false);
  const [members] = useMembers();

  const ensAddr = watch('applicantHidden', '');

  const handleChange = async (e) => {
    if (e.target.value.endsWith('.eth')) {
      const address = await ens.provider.resolveName(e.target.value);
      if (address) {
        setValue('applicantHidden', address);
      } else {
        setValue('applicantHidden', 'No ENS set');
      }
    } else {
      setValue('applicantHidden', '');
    }
  };

  return (
    <>
      {anyApplicant || member ? (
        <FormControl mb={5}>
          <TextBox as={FormLabel} htmlFor='applicant'>
            {formLabel}
          </TextBox>
          <Input
            name='applicant'
            placeholder='0x'
            defaultValue={newMember ? user.username : null}
            ref={register({
              required: {
                value: true,
                message: `${formLabel} is required`,
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
            onChange={handleChange}
          />
          <FormHelperText fontSize='xs' id='applicant-helper-text' mb={1}>
            {ensAddr || 'Use ETH address or ENS'}
          </FormHelperText>
          <Input type='hidden' name='applicantHidden' ref={register} />
        </FormControl>
      ) : (
        <FormControl mb={5}>
          <TextBox as={FormLabel} htmlFor='memberApplicant'>
            {formLabel}
          </TextBox>
          <Flex>
            <Select
              icon={<AiOutlineCaretDown />}
              name='memberApplicant'
              ref={register}
            >
              {members &&
                members.map((member) => {
                  return (
                    <option
                      key={member.memberAddress}
                      value={member.memberAddress}
                    >
                      {member.profile.name
                        ? member.profile.name
                        : truncateAddr(member.memberAddress)}
                    </option>
                  );
                })}
            </Select>
            {!guildKick && (
              <Button
                onClick={() => setAnyApplicant(true)}
                ml='2px'
                variant='outline'
              >
                Other
              </Button>
            )}
          </Flex>
        </FormControl>
      )}
    </>
  );
};

export default AddressInput;
