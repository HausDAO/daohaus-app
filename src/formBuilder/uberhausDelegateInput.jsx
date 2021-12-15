import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';
import { getActiveMembers } from '../utils/dao';
import { handleGetProfile } from '../utils/3box';
import { truncateAddr } from '../utils/general';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { createContract } from '../utils/contract';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { LOCAL_ABI } from '../utils/abi';

const UberhausDelegateInput = props => {
  const { daoMembers, daoOverview } = useDao();

  const [uberMembers] = useSessionStorage('U-members', null);
  const [userAddresses, setAddresses] = useState([]);
  const [currentDelegate, setCurrentDelegate] = useState();

  const uberHausMinion = useMemo(() => {
    if (daoOverview) {
      return daoOverview?.minions?.find(
        minion =>
          minion.minionType === 'UberHaus minion' &&
          minion.uberHausAddress === UBERHAUS_DATA.ADDRESS,
      );
    }
    return null;
  }, [daoOverview]);

  useEffect(() => {
    const getDelegate = async () => {
      try {
        const minionContract = await createContract({
          address: uberHausMinion.minionAddress,
          abi: LOCAL_ABI.UBERHAUS_MINION,
          chainID: UBERHAUS_DATA.NETWORK,
        });
        const delegate = await minionContract.methods.currentDelegate().call();

        setCurrentDelegate(delegate);
      } catch (error) {
        console.error(error?.message);
      }
    };
    if (uberHausMinion) {
      getDelegate();
    }
  }, [uberHausMinion]);

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
      <GenericSelect
        {...props}
        placeholder='Select an Address'
        options={userAddresses}
      />
    </>
  );
};

export default UberhausDelegateInput;
