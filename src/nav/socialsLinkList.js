import { Icon } from '@chakra-ui/react';
import React from 'react';
import { defaultSocialLinks, generateDaoSocials } from '../utils/navLinks';
import SocialLink from './socialLink';

const SocialsLinkList = ({ dao }) => {
  const socialLinks = dao?.daoMetaData
    ? generateDaoSocials(dao?.daoMetaData)
    : defaultSocialLinks;
  return (
    <>
      {socialLinks?.map((link, index) => {
        return (
          <SocialLink
            key={`${link.href}-${index}`}
            href={link.href}
            label={link.label}
            icon={<Icon as={link.icon} w={6} h={6} />}
          />
        );
      })}
    </>
  );
};

export default SocialsLinkList;
