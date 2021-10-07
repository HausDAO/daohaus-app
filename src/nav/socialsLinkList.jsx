import React from 'react';
import { Icon } from '@chakra-ui/react';

import SocialLink from './socialLink';

const SocialsLinkList = ({
  socialLinks,
  discourseLinkData,
  view,
  toggleNav,
}) => {
  // console.log(dao.daoMetaData);
  // console.log(getTerm(dao.customTerms, 'proposals'));

  return (
    <>
      {socialLinks?.length > 0
        ? socialLinks?.map((link, index) => {
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
          })
        : null}

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
