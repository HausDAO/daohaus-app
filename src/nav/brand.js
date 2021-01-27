import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Avatar, Flex, Box } from '@chakra-ui/react';
import BrandImg from '../assets/img/Daohaus__Castle--Dark.svg';
import ChangeDao from './changeDao';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { themeImagePath } from '../utils/metadata';

const Brand = React.memo(function Brand({ dao }) {
  const brandImg = dao?.daoMetaData?.avatarImg
    ? themeImagePath(dao?.daoMetaData?.avatarImg)
    : themeImagePath(BrandImg);
  const brandLink =
    dao?.daoID && dao?.chainID ? `/dao/${dao?.chainID}/${dao?.daoID}` : '/';
  const { theme } = useCustomTheme();

  return (
    <Flex
      direction={['row', 'row', 'row', 'column']}
      justify='start'
      align={['center', 'center', 'center', 'start']}
      w='100%'
      wrap='wrap'
    >
      <Flex
        align={['center', 'center', 'center', 'start']}
        justify={['space-between', 'space-between', 'space-between', 'start']}
        direction='row'
        w='100%'
        wrap='wrap'
      >
        <Avatar
          d='block'
          as={RouterLink}
          to={brandLink}
          size='md'
          cursor='pointer'
          border='none'
          src={brandImg}
          bg={theme.colors.primary}
          borderWidth='2px'
          borderStyle='solid'
          borderColor='transparent'
          _hover={{ border: '2px solid ' + theme.colors.whiteAlpha[500] }}
          order={[1, null, null, 1]}
        />
        <Box
          d={['inline-block', null, null, 'none']}
          order='3'
          ml='auto'
          mr={2}
        >
          {/* {user ? (
            <>
              <Button variant="ghost" onClick={() => openModal("accountModal")}>
                <UserAvatar
                  user={user.profile ? user.profile : user}
                  hideCopy={true}
                />
              </Button>

              <AccountModal isOpen={modals.accountModal} />
            </>
          ) : (
            <></>
            // <Web3SignIn />
          )} */}
        </Box>
        <Box
          w={['auto', null, null, '100%']}
          order={[3, null, null, 3]}
          mt={[0, null, null, 6]}
        >
          <ChangeDao />
        </Box>
      </Flex>
    </Flex>
  );
});

//  <Avatar
//    d="block"
//    as={RouterLink}
//    to={`/`}
//    size="md"
//    cursor="pointer"
//    border="none"
//    src={BrandImg}
//    bg={theme.colors.primary}
//    borderWidth="2px"
//    borderStyle="solid"
//    borderColor="transparent"
//    _hover={{ border: "2px solid " + theme.colors.whiteAlpha[500] }}
//    order={[1, null, null, 1]}
//  />;

export default Brand;
