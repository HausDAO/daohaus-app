import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import { fetchProfile, TestFetchMultiple } from "../utils/3box";

export const UserProfileContext = createContext();

export const UserProfileProvider = React.memo(function ({ children, members }) {
  const [daoMembersProfiles, setDaoMembersProfiles] = useState(null);

  useEffect(() => {}, []);

  return (
    <UserProfileContext.Provider value={{ daoMembersProfiles }}>
      {children}
    </UserProfileContext.Provider>
  );
});

export const useUserProfile = () => {
  const { daoMembersProfiles } = useContext(UserProfileContext);
  return { daoMembersProfiles };
};
