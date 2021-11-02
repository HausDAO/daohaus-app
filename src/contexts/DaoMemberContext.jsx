import React, {
  useContext,
	useCallback,
  createContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';

import { checkIfUserIsDelegate } from '../utils/general';
import { initMemberWallet } from '../utils/wallet';
import { handleGetProfile } from '../utils/3box';

export const DaoMemberContext = createContext();

export const DaoMemberProvider = ({
  daoMembers,
  address,
  overview,
  children,
}) => {
  const { daoid, daochain } = useParams();
  const [daoMember, setDaoMember] = useState(null);
  const [delegate, setDelegate] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [profile, setProfile] = useState(null);

  const currentMemberRef = useRef(false);
  const memberWalletRef = useRef(false);

	const refreshProfile = useCallback( async () => {
		if (!address) {
			return
		}
    try {
			console.log("Get address")
			console.log(address)
        const profile = await handleGetProfile(address);
        // if (profile.status === 'error') return;
			  console.log("profile XXX")
			  console.log(profile)
        setProfile(profile);
      } catch (error) {
        console.error(error);
      }

	}, [profile, address])

  useEffect(() => {
    const checkForMember = daoMembers => {
      return daoMembers.find(
        member => member.memberAddress === address && +member.shares > 0,
      );
    };

    if (daoMembers) {
      if (currentMemberRef.current !== address) {
        const currentMember = checkForMember(daoMembers);

        if (currentMember) {
          setDaoMember(currentMember);
          setIsMember(true);
          setDelegate(false);
        } else {
          const delegatees = checkIfUserIsDelegate(address, daoMembers);
          if (delegatees?.length) {
            setDelegate({
              delegateKey: address,
              delegatees,
            });
          }
          setDaoMember(false);
          setIsMember(false);
        }
        currentMemberRef.current = address;
      }
    }
  }, [daoMembers, address]);

  useEffect(() => {
    if (address && !profile) {
      refreshProfile();
    }
  }, [address, profile, refreshProfile]);

  useEffect(() => {
    const assembleMemberWallet = async () => {
      try {
        const wallet = await initMemberWallet({
          memberAddress: address,
          depositToken: overview.depositToken,
          daoAddress: daoid,
          chainID: daochain,
        });

        if (wallet) {
          if (daoMember) {
            setDaoMember(prevState => ({
              ...prevState,
              ...wallet,
              hasWallet: true,
            }));
          } else if (delegate) {
            setDelegate(prevState => ({
              ...prevState,
              ...wallet,
              hasWallet: true,
            }));
          }
        }
        memberWalletRef.current = address;
      } catch (error) {
        console.error(error);
        memberWalletRef.current = address;
      }
    };

    const canVote = daoMember || delegate;
    if (
      canVote &&
      memberWalletRef.current !== address &&
      overview &&
      daochain &&
      daoid &&
      address
    ) {
      assembleMemberWallet();
    }
  }, [daoMember, overview, daochain, daoid, delegate]);

  return (
    <DaoMemberContext.Provider
      value={{
        currentMemberRef,
        isMember,
        daoMember,
        memberWalletRef,
        delegate,
				profile,
				refreshProfile,
      }}
    >
      {children}
    </DaoMemberContext.Provider>
  );
};
export const useDaoMember = () => {
  const {
    currentMemberRef,
    isMember,
    daoMember,
    memberWalletRef,
    delegate,
		profile,
		refreshProfile,
  } = useContext(DaoMemberContext);
  return {
    currentMemberRef,
    isMember,
    daoMember,
    memberWalletRef,
    delegate,
		profile,
		refreshProfile,
  };
};
