import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Tooltip } from '@chakra-ui/react';
import ToolTipLabel from '../components/toolTipLabel';

export const LinkWrapper = ({ children, link }) => (link
  ? <Box as={Link} to={link}>{children}</Box>
  : <Box>{children}</Box>);

export const ToolTipWrapper = ({
  children, tooltip, tooltipText, bg = 'primary.500', placement = 'top',
}) => (
  tooltip ? (
    <Tooltip
      hasArrow
      label={<ToolTipLabel text={tooltipText} />}
      bg={bg}
      placement={placement}
    >
      {children}
    </Tooltip>)
    : <>{children}</>
);
