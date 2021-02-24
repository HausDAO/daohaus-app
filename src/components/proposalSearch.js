import React from 'react';
import {
  Button,
  Flex,
  FormControl,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
// import ContentBox from './ContentBox';

const TemporaryPopoverFix = styled.span`
  .css-n0uled {
    max-width: 100%;
  }
`;

const ProposalSearch = () => {
  return (
    <Flex
      direction='row'
      // w={['60%', null, null, '60%']}
      mb={[5, null, null, 0]}
      justifyContent={['flex-start', null, null, 'flex-end']}
      position={['relative', null, null, 'absolute']}
      right='-10px'
      mt='1'
      zIndex='0'
    >
      <Popover placement='bottom-end'>
        <PopoverTrigger>
          <Button
            textTransform='uppercase'
            fontFamily='heading'
            mr={3}
            fontSize={['sm', null, null, 'md']}
            variant='text'
            p='0'
            h='inherit'
            zIndex='15'
          >
            Search
          </Button>
        </PopoverTrigger>
        <TemporaryPopoverFix>
          <PopoverContent
            p='6'
            mt='1'
            // mr='-10px'
            // width='60%'
            rounded='lg'
            bg='rgba(0,0,0,0.85)'
            borderWidth='1px'
            borderColor='whiteAlpha.200'
          >
            <Text
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              variant='text'
              mb={4}
            >
              search by address
            </Text>
            <FormControl w='auto'>
              <Input
                type='search'
                className='input'
                placeholder='Search My Daos'
              />
            </FormControl>
          </PopoverContent>
        </TemporaryPopoverFix>
      </Popover>
    </Flex>
  );
};

export default ProposalSearch;
