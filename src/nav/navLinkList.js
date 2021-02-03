import React from 'react';
import { Stack } from '@chakra-ui/react';
import { RiTrophyLine } from 'react-icons/ri';

import NavLink from './navlink';
// import { useMetaData } from '../contexts/MetaDataContext';
import { defaultHubData, generateDaoLinks } from '../utils/navLinks';
// import { getCopy } from '../utils/metadata';

const NavLinkList = ({ dao, view, toggleNav = null }) => {
  // const { daoMetaData } = useMetaData();
  const navLinks =
    dao?.chainID && dao?.daoID
      ? generateDaoLinks(dao.chainID, dao.daoID)
      : defaultHubData;
  const isDaoMember =
    dao?.daoMember?.memberAddress && dao?.chainID && dao?.daoID;

  return (
    <Stack
      spacing={[1, null, null, 3]}
      d='flex'
      mt={[3, null, null, 12]}
      flexDirection='column'
    >
      {navLinks &&
        navLinks.map((link) => {
          return (
            <NavLink
              key={link.path || link.href}
              label={link.label} // {getCopy(daoMetaData, link.label)}
              path={link.path}
              href={link.href}
              icon={link.icon}
              view={view}
              onClick={toggleNav}
            />
          );
        })}
      {isDaoMember && (
        <NavLink
          label={'Profile'}
          path={`/dao/${dao.chainID}/${dao.daoID}/profile/${dao.daoMember.memberAddress}`}
          icon={RiTrophyLine}
          view={view}
          onClick={toggleNav}
        />
      )}
    </Stack>
  );
};

export default NavLinkList;
