import React, { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import GenericInput from './genericInput';
import GenericSelect from './genericSelect';
import ModButton from './modButton';
import { getActiveMembers } from '../utils/dao';
import { handleGetProfile } from '../utils/3box';
import { isEthAddress, truncateAddr } from '../utils/general';
import { lookupENS } from '../utils/ens';

const ModButtonWithLoading = ({ loading, fn }) => {
  return (
    <>
      {loading && <Spinner mr={2} />}
      <ModButton text='Address' fn={fn} />
    </>
  );
};

const AddressInput = props => {
  const { daoMembers } = useDao();
  const { name, localForm, localValues } = props;

  const [textMode, setTextMode] = useState(true);
  const [userAddresses, setAddresses] = useState([]);
  const [helperText, setHelperText] = useState('Use ETH address or ENS');
  const [loadingMembers, setLoadingMembers] = useState(false);

  const { setValue } = localForm;

  useEffect(() => {
    let shouldSet = true;
    const fetchMembers = async () => {
      setLoadingMembers(true);
      const memberProfiles = await Promise.all(
        getActiveMembers(daoMembers)?.map(async member => {
          const profile = await handleGetProfile(member.memberAddress);
          if (!profile) {
            return {
              name: profile.name || truncateAddr(member.memberAddress),
              value: member.memberAddress,
            };
          }
          return {
            name: truncateAddr(member.memberAddress) || member.memberAddress,
            value: member.memberAddress,
          };
        }),
      );
      setLoadingMembers(false);
      if (shouldSet) {
        setAddresses(memberProfiles);
      }
    };
    if (daoMembers) {
      fetchMembers();
    }
    return () => {
      shouldSet = false;
    };
  }, [daoMembers]);

  useEffect(() => {
    if (localValues?.memberAddress) {
      setValue(name, localValues.memberAddress);
    }
  }, [localValues?.memberAddress]);

  const switchElement = () => {
    setTextMode(prevState => !prevState);
  };

  const handleLookupENS = async ens => {
    setHelperText(<Spinner />);
    const result = await lookupENS(ens);
    if (result) {
      setHelperText(ens);
      setValue(name, result);
    } else {
      setHelperText('No ENS Set');
    }
  };

  const checkApplicant = e => {
    if (e?.target?.value == null) return;
    const input = e.target.value;
    if (isEthAddress(input)) {
      setHelperText('Valid Address');
    } else if (input.endsWith('.eth')) {
      handleLookupENS(input);
    } else {
      setHelperText('Use ETH address or ENS');
    }
  };

  return (
    <>
      {textMode ? (
        <GenericInput
          {...props}
          btn={<ModButton text='Members' fn={switchElement} />}
          onChange={checkApplicant}
          helperText={helperText}
        />
      ) : (
        <GenericSelect
          {...props}
          placeholder='Select an Address'
          options={userAddresses}
          listLoading={loadingMembers}
          btn={
            <ModButtonWithLoading loading={loadingMembers} fn={switchElement} />
          }
        />
      )}
    </>
  );
};

export default AddressInput;
