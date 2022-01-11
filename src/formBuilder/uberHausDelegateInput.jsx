import React, { useEffect, useState } from 'react';

import { Flex } from '@chakra-ui/layout';
import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';
import { getActiveMembers } from '../utils/dao';
import { handleGetProfile } from '../utils/3box';
import { truncateAddr } from '../utils/general';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { createContract } from '../utils/contract';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { LOCAL_ABI } from '../utils/abi';
import TextBox from '../components/TextBox';
import AddressAvatar from '../components/addressAvatar';

const UberHausDelegateInput = props => {
  const { localValues } = props;
  const { daoMembers } = useDao();

  const [uberMembers] = useSessionStorage('U-members', null);
  const [userAddresses, setAddresses] = useState([]);
  const [currentDelegate, setCurrentDelegate] = useState();

  useEffect(() => {
    const getDelegate = async () => {
      try {
        const minionContract = await createContract({
          address: localValues.minionAddress,
          abi: LOCAL_ABI.UBERHAUS_MINION,
          chainID: UBERHAUS_DATA.NETWORK,
        });
        const delegate = await minionContract.methods.currentDelegate().call();

        setCurrentDelegate(delegate);
      } catch (error) {
        console.error(error?.message);
      }
    };
    if (localValues?.minionAddress) {
      getDelegate();
    }
  }, [localValues]);

  useEffect(() => {
    let shouldSet = true;
    const fetchMembers = async () => {
      const memberProfiles = await Promise.all(
        getActiveMembers(daoMembers)?.map(async member => {
          const profile = await handleGetProfile(member.memberAddress);
          if (profile?.status !== 'error') {
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
      if (shouldSet) {
        setAddresses(
          memberProfiles.filter(member => {
            const isNotDelegate =
              member.value !== currentDelegate.toLowerCase();
            const isNotUberMemberOrDelegate = uberMembers.every(
              uberMember =>
                member.value !== uberMember.memberAddress &&
                member.value !== uberMember.delegateKey,
            );
            if (isNotDelegate && isNotUberMemberOrDelegate) {
              return member;
            }
            return null;
          }),
        );
      }
    };
    if (daoMembers && uberMembers && currentDelegate) {
      fetchMembers();
    }
    return () => {
      shouldSet = false;
    };
  }, [daoMembers, uberMembers, currentDelegate]);

  return (
    <>
      <TextBox size='xs' htmlFor='name' mb={3}>
        Current Delegate
      </TextBox>
      <Flex w='100%' align='center' justify='space-between' pb={3} mb={2}>
        <AddressAvatar addr={currentDelegate} />
      </Flex>
      <GenericSelect
        {...props}
        placeholder='Select an Address'
        options={userAddresses}
      />
    </>
  );
};

export default UberHausDelegateInput;
