import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Tooltip, Button, Icon, Link } from '@chakra-ui/react';

const Navlink = ({ label, path, icon, href, view, onClick }) => {
  if (view === 'mobile') {
    return (
      <>
        {href ? (
          <Button
            variant='sideNav'
            as={Link}
            href={href}
            _hover={{ backgroundColor: 'white' }}
            onClick={onClick}
            leftIcon={<Icon as={icon} w={6} h={6} />}
          >
            {label}
          </Button>
        ) : (
          <Button
            variant='sideNav'
            as={RouterLink}
            to={path}
            _hover={{ backgroundColor: 'white' }}
            onClick={onClick}
            leftIcon={<Icon as={icon} w={6} h={6} />}
          >
            {label}
          </Button>
        )}
      </>
    );
  }
  return (
    <Tooltip label={label} aria-label={label} placement='right' hasArrow>
      {href ? (
        <Button
          variant='sideNav'
          as={Link}
          href={href}
          _hover={{ backgroundColor: 'white' }}
          grow='none'
        >
          <Icon as={icon} w={6} h={6} />
        </Button>
      ) : (
        <Button
          variant='sideNav'
          as={RouterLink}
          to={path}
          _hover={{ backgroundColor: 'white' }}
          grow='none'
        >
          <Icon as={icon} w={6} h={6} />
        </Button>
      )}
    </Tooltip>
  );
};

export default Navlink;
