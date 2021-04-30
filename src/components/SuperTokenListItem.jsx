import React from 'react';
import {
  Flex,
  Box,
  Icon,
  Button,
  Link,
  Stack,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { RiQuestionLine } from 'react-icons/ri';
import { VscLinkExternal } from 'react-icons/vsc';

import { ToolTipWrapper } from '../staticElements/wrappers';
import { SF_LABEL } from '../utils/toolTipLabels';

const SuperTokenListItem = ({
  token,
  tokenAddress,
  handleCopyToast,
  daoMember,
  withdrawSupertoken,
  loading,
  successToast,
}) => {
  const isLoading = loading?.active && loading?.condition === tokenAddress;
  const shouldDisableWithdraw = token?.tokenBalance <= 0 || (loading?.active && loading?.condition === tokenAddress);

  const handleWithdraw = () => {
    withdrawSupertoken(tokenAddress);
  };

  const displayComingSoon = () => {
    successToast({ title: 'Coming Soon' });
  };

  return (
    <Flex h='60px' align='center' key={tokenAddress}>
      <Box
        w='15%'
        d={['none', null, null, 'inline-block']}
      >
        <Flex align='center'>
          <Box fontFamily='mono'>{token?.symbol}</Box>
          <CopyToClipboard
            text={tokenAddress}
            onCopy={handleCopyToast}
          >
            <Icon
              as={FaCopy}
              color='secondary.300'
              ml={2}
              _hover={{ cursor: 'pointer' }}
            />
          </CopyToClipboard>
        </Flex>
      </Box>
      <Box w={['35%', null, null, '35%']}>
        <Box fontFamily='mono'>
          {token?.tokenBalance && (
          <>
            {parseFloat(
              +token.tokenBalance / 10 ** +token.decimals,
            )
              .toFixed(4)
              .toString()}
            {' '}
            {token?.symbol}
          </>
          )}
        </Box>
      </Box>
      {daoMember && (
      <Stack direction='row' spacing={4}>

        <ToolTipWrapper
          placement='left'
          tooltip
          tooltipText={SF_LABEL.WITHDRAW}
        >
          <Button
            rightIcon={<RiQuestionLine />}
            variant='solid'
            onClick={handleWithdraw}
            loadingText='Withdrawing'
            isLoading={isLoading}
            disabled={shouldDisableWithdraw}
          >
            Return Balance
          </Button>
        </ToolTipWrapper>
        <ToolTipWrapper
          placement='right'
          tooltip
          tooltipText={SF_LABEL.UPGRADE}
        >
          <Button
            rightIcon={<RiQuestionLine />}
            variant='solid'
            onClick={displayComingSoon}
            loadingText='Upgrading'
            isLoading={isLoading}
            disabled
          >
            Upgrade
          </Button>
        </ToolTipWrapper>
        {!token.registeredToken && (
          <ToolTipWrapper
            placement='right'
            tooltip
            tooltipText={SF_LABEL.REGISTER}
          >
            <Button
              leftIcon={<Icon as={VscLinkExternal} />}
              rightIcon={<RiQuestionLine />}
              variant='outline'
              as={Link}
              href='https://www.notion.so/Add-New-Tokens-to-Superfluid-8464f8c116c24cd6a0c5cb4f4174bb2d'
              isExternal
            >

              Register Token
            </Button>
          </ToolTipWrapper>
        )}
      </Stack>
      )}
    </Flex>
  );
};

export default SuperTokenListItem;
