import React from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import {
  RiBookMarkLine,
  RiTeamLine,
  RiSettings3Line,
  RiBankLine,
  RiRocket2Line,
  // RiTrophyLine,
} from 'react-icons/ri';

import NavLink from './navlink';
import { useParams } from 'react-router-dom';

const navLinks = [
  {
    end: `/proposals`,
    icon: RiBookMarkLine,
    label: 'Proposals',
  },
  {
    end: `/bank`,
    icon: RiBankLine,
    label: 'Bank',
  },
  {
    end: `/members`,
    icon: RiTeamLine,
    label: 'Members',
  },
  { end: `/settings`, icon: RiSettings3Line, label: 'Settings' },
  {
    end: `/boosts`,
    icon: RiRocket2Line,
    label: 'Boosts',
  },
];

const DaoMenu = ({ daoMember }) => {
  const { daoid, daochain } = useParams();

  return (
    <Flex direction='column' wrap='wrap'>
      <Stack
        spacing={[1, null, null]}
        d='flex'
        mt={[3, null, null, 12]}
        flexDirection='column'
      >
        {navLinks &&
          navLinks.map((link) => {
            return (
              <NavLink
                key={link.label}
                label={link.label}
                path={`'/dao/${daochain}/${daoid}/${link.end}`}
                icon={link.icon}
              />
            );
          })}
        {/* {daoMember && (
          <NavLink
            label={'My Profile'}
            path={`/dao/${daochain}/${daoid}/${link.end}`}
            icon={<RiTrophyLine />}
          />
        )} */}
      </Stack>
    </Flex>
  );
};

export default DaoMenu;
