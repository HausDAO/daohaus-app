import React, { useState, useEffect } from 'react';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Select,
  Icon,
} from '@chakra-ui/react';

export default function NftFilter({
  filters,
  setFilters,
  searchText = '',
  setSearchText,
  collection = 'all',
  setCollection,
  allCollections,
  options,
}) {
  const [filterOptions, setFilterOptions] = useState();

  useEffect(() => {
    setFilterOptions(options);
  }, []);

  const handleFilterSelect = option => {
    if (filters.indexOf(option.value) === -1) {
      setFilters([...filters, option.value]);
    } else {
      setFilters([...filters].filter(item => item !== option.value));
    }
  };

  const handleCollectionSelect = e => {
    setCollection(e.nativeEvent.target.value);
  };

  const handleSearchInput = e => {
    setSearchText(e.nativeEvent.target.value);
  };

  return (
    <Flex direction='row'>
      {filterOptions && (
        <Menu isLazy autoSelect={false}>
          <MenuButton
            textTransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
            _hover={{ color: 'secondary.400' }}
          >
            filters (
            {filters.length +
              (searchText !== '' ? 1 : 0) +
              (collection !== 'all' ? 1 : 0)}
            )
          </MenuButton>
          <MenuList bg='blackAlpha.900' w={300} maxWidth='90vw' p={5} ml={-5}>
            <Input
              placeholder='Keyword'
              value={searchText}
              mb={5}
              onChange={handleSearchInput}
            />
            <Select mb={5} value={collection} onChange={handleCollectionSelect}>
              <option value='all'>Collections (All)</option>
              {allCollections.map((option, i) => (
                <option value={option} key={i}>
                  {option}
                </option>
              ))}
            </Select>
            {filterOptions?.map(option => (
              <MenuItem
                fontFamily='heading'
                textTransform='uppercase'
                fontSize='xs'
                key={option.value}
                onClick={() => handleFilterSelect(option)}
                value={option.value}
                mb={2}
              >
                {option.name}
                {filters.indexOf(option.value) !== -1 && (
                  <Icon
                    as={RiCheckboxCircleLine}
                    ml='auto'
                    w={6}
                    h={6}
                    mr={-2}
                  />
                )}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}
