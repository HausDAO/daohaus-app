import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { checkIfUserIsDelegate } from '../utils/general';
import { initMemberWallet } from '../utils/wallet';

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

  const currentMemberRef = useRef(false);
  const memberWalletRef = useRef(false);

  useEffect(() => {
    const checkForMember = daoMembers => {
      return daoMembers.find(member => member.memberAddress === address);
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
  } = useContext(DaoMemberContext);
  return {
    currentMemberRef,
    isMember,
    daoMember,
    memberWalletRef,
    delegate,
  };
};
