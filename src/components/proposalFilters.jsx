import React, { useEffect, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Flex,
  Icon,
  MenuDivider,
  Text,
} from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { getFilters, sortOptions } from '../utils/proposalContent';
import { determineUnreadProposalList } from '../utils/proposalUtils';

const ProposalFilters = ({ filter, setFilter, proposals, setSort }) => {
  // const [memberWallet] = useMemberWallet();
  const { daoMember } = useDaoMember();
  const [filterOptions, setFilterOptions] = useState();
  const [actionNeeded, setActionNeeded] = useState([]);

  useEffect(() => {
    let options;
    if (daoMember && daoMember.shares > 0) {
      const action =
        proposals &&
        proposals.filter(prop => {
          const unread = determineUnreadProposalList(
            prop,
            daoMember.shares > 0,
            daoMember.memberAddress,
          );
          return unread.unread;
        });

      setActionNeeded(action);

      const actionsCount = action ? action.length : 0;
      options = getFilters(daoMember.shares > 0, actionsCount);
    } else {
      options = getFilters(false);
    }
    setFilterOptions(options);
    setFilter(options[0]);

    if (options[0].value === 'Action Needed') {
      setSort(sortOptions[1]);
    }
  }, [daoMember]);

  const buildFilterName = () => {
    if (!filter) return '';

    return filter.value === 'Action Needed'
      ? `${filter.name} (${actionNeeded.length})`
      : filter.name;
  };

  const handleFilterSelect = option => {
    setFilter(option);
    if (option.value === 'Action Needed') {
      setSort(sortOptions[1]);
    }
  };

  return (
    <Flex
      direction='row'
      w={['100%', null, null, '50%']}
      mb={[5, null, null, 0]}
    >
      <Text
        textTransform='uppercase'
        fontFamily='heading'
        mr={3}
        fontSize={['sm', null, null, 'md']}
      >
        Filter By
      </Text>

      {filterOptions ? (
        <Menu isLazy>
          <MenuButton
            textTransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
            color='secondary.500'
            _hover={{ color: 'secondary.400' }}
          >
            {buildFilterName()}{' '}
            <Icon as={RiArrowDropDownFill} color='secondary.500' />
          </MenuButton>
          <MenuList bg='black'>
            <MenuGroup>
              {filterOptions?.map(option => {
                if (option.type === 'main') {
                  return (
                    <MenuItem
                      key={option.value}
                      onClick={() => handleFilterSelect(option)}
                      value={option.value}
                    >
                      {option.value === 'Action Needed'
                        ? `${option.name} (${actionNeeded.length})`
                        : option.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Proposal Type'>
              {filterOptions?.map(option => {
                if (option.type === 'proposalType') {
                  return (
                    <MenuItem
                      key={option.value}
                      onClick={() => handleFilterSelect(option)}
                      value={option.value}
                    >
                      {option.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Proposal Status'>
              {filterOptions?.map(option => {
                if (option.type === 'status') {
                  return (
                    <MenuItem
                      key={option.value}
                      onClick={() => handleFilterSelect(option)}
                      value={option.value}
                    >
                      {option.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </MenuGroup>
          </MenuList>
        </Menu>
      ) : null}
    </Flex>
  );
};

export default ProposalFilters;
