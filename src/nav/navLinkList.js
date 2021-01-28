import React from 'react';
import { Stack } from '@chakra-ui/react';

import NavLink from './navlink';
import { defaultHubData, generateDaoLinks } from '../utils/navLinks';
import { RiTrophyLine } from 'react-icons/ri';

const NavLinkList = ({ dao, view, toggleNav = null }) => {
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
              label={link.label}
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
