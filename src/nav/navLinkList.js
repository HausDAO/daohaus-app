import React from 'react';

import NavLink from './navlink';
import { defaultHubData, generateDaoLinks } from '../utils/navLinks';
import { RiTrophyLine } from 'react-icons/ri';

const NavLinkList = ({ dao, view }) => {
  const navLinks =
    dao?.chainID && dao?.daoID
      ? generateDaoLinks(dao.chainID, dao.daoID)
      : defaultHubData;
  const isDaoMember =
    dao?.daoMember?.memberAddress && dao?.chainID && dao?.daoID;
  return (
    <>
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
            />
          );
        })}
      {isDaoMember && (
        <NavLink
          label={'Profile'}
          path={`/dao/${dao.chainID}/${dao.daoID}/profile/${dao.daoMember.memberAddress}`}
          icon={RiTrophyLine}
          view={view}
        />
      )}
    </>
  );
};

export default NavLinkList;
