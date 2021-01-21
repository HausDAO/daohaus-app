import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from "react";

export const DaoMemberContext = createContext();

export const DaoMemberProvider = ({ daoMembers, address, children }) => {
  const [daoMember, setDaoMember] = useState(null);
  const [isMember, setIsMember] = useState(null);

  const currentMemberRef = useRef(false);

  useEffect(() => {
    const checkForMember = (daoMembers) => {
      return daoMembers.find((member) => member.memberAddress === address);
    };
    if (daoMembers) {
      if (currentMemberRef.current !== address) {
        const currentMember = checkForMember(daoMembers);
        if (currentMember) {
          setDaoMember(currentMember);
          setIsMember(true);
        } else {
          setDaoMember(false);
          setIsMember(false);
        }
        currentMemberRef.current = address;
      }
    }
  }, [daoMembers, address]);

  return (
    <DaoMemberContext.Provider
      value={{ currentMemberRef, isMember, daoMember }}
    >
      {children}
    </DaoMemberContext.Provider>
  );
};

export const useDaoMember = () => {
  const { currentMemberRef, isMember, daoMember } = useContext(
    DaoMemberContext
  );
  return { currentMemberRef, isMember, daoMember };
};
