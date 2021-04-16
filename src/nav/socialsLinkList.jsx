import { Icon } from '@chakra-ui/react';
import React from 'react';
import {
  defaultSocialLinks,
  generateDaoSocials,
  generateDiscourseLink,
} from '../utils/navLinks';
import SocialLink from './socialLink';

const SocialsLinkList = ({ dao, view, toggleNav }) => {
  // console.log(dao.daoMetaData);
  const socialLinks = dao?.daoMetaData?.links
    ? generateDaoSocials(dao?.daoMetaData?.links)
    : defaultSocialLinks;
  const discourseLinkData = dao?.daoMetaData?.boosts?.discourse?.active
    ? generateDiscourseLink(dao.daoMetaData.boosts.discourse.metadata)
    : null;
  // console.log(getTerm(dao.customTerms, 'proposals'));

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

      {discourseLinkData ? (
        <SocialLink
          key={discourseLinkData.categoryId}
          href={discourseLinkData.href}
          label={discourseLinkData.label}
          icon={<Icon as={discourseLinkData.icon} w={6} h={6} />}
          view={view}
          onClick={toggleNav}
        />
      ) : null}
    </>
  );
};

export default SocialsLinkList;
