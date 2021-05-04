import React from 'react';
import { Stack } from '@chakra-ui/react';
import { RiTrophyLine } from 'react-icons/ri';

import NavLink from './navlink';
import { defaultHubData, generateDaoLinks } from '../utils/navLinks';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { getTerm } from '../utils/metadata';
// import { useMetaData } from '../contexts/MetaDataContext';
// import { getTerm } from '../utils/metadata';

const NavLinkList = ({ dao, view, toggleNav = null }) => {
  // const { daoMetaData } = useMetaData();

  const { address } = useInjectedProvider();
  const navLinks =
    dao?.chainID && dao?.daoID && dao.daoProposals
      ? generateDaoLinks(dao.chainID, dao.daoID, dao.daoProposals)
      : defaultHubData;
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
                dao?.customTerms
                  ? getTerm(dao.customTerms, link.label)
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
