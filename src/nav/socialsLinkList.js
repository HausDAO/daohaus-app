import { Icon } from '@chakra-ui/react';
import React from 'react';
import { defaultSocialLinks, generateDaoSocials } from '../utils/navLinks';
import SocialLink from './socialLink';

const SocialsLinkList = ({ dao, view, toggleNav }) => {
  const socialLinks = dao?.customTerms
    ? generateDaoSocials(dao?.customTerms)
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
            view={view}
            onClick={toggleNav}
          />
        );
      })}
    </>
  );
};

export default SocialsLinkList;
