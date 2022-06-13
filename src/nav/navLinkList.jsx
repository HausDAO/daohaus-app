import React from 'react';
import { RiTrophyLine } from 'react-icons/ri';
import { Stack } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
// import { useMetaData } from '../contexts/MetaDataContext';
import NavLink from './navlink';
import {
  defaultHubData,
  generateDaoLinks,
  generateDaoLinksLoading,
} from '../utils/navLinks';
import { getTerm } from '../utils/metadata';

const NavLinkList = ({ dao, view, toggleNav = null }) => {
  // const { daoMetaData } = useMetaData();

  const { address } = useInjectedProvider();

  let navLinks;
  if (dao?.chainID && dao?.daoID) {
    navLinks =
      dao.daoProposals && dao.daoVaults && dao.daoMetaData
        ? generateDaoLinks(
            dao.chainID,
            dao.daoID,
            dao.daoProposals,
            dao.daoVaults,
            dao.daoMetaData,
          )
        : generateDaoLinksLoading(dao.chainID, dao.daoID);
  } else {
    navLinks = defaultHubData;
  }

  const inDao = dao?.daoID && address;

  return (
    <Stack
      spacing={[1, null, null, 3]}
      d='flex'
      mt={[3, null, null, 12]}
      flexDirection='column'
    >
      {navLinks &&
        navLinks.map(link => {
          return (
            <NavLink
              key={link.path || link.href}
              label={
                dao?.customTermsConfig
                  ? getTerm(dao.customTermsConfig, link.label)
                  : link.label
              }
              path={link.path}
              href={link.href}
              icon={link.icon}
              view={view}
              onClick={toggleNav}
            />
          );
        })}
      {inDao ? (
        <NavLink
          label='Profile'
          path={`/dao/${dao.chainID}/${dao.daoID}/profile/${address}`}
          icon={RiTrophyLine}
          view={view}
          onClick={toggleNav}
        />
      ) : null}
    </Stack>
  );
};

export default NavLinkList;
