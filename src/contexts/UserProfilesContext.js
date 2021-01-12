import React, { useState, useEffect, useRef, useContext, createContext } from "react";

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children,  }) => {

  const [daoMembersProfiles, setDaoMembersProfiles] = useState(null)

  

  useEffect(() =>{

  }, [])


  return (
    <UserProfileContext.Provider value={{daoMembersProfiles}}>{children}</UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const {daoMembersProfiles} = useContext(UserProfileContext);
  return {daoMembersProfiles};
};
