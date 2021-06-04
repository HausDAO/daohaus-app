import {
  RiBookMarkLine,
  RiDiscordFill,
  // RiTelegramFill,
  RiMediumFill,
  RiTwitterFill,
  RiGlobeLine,
  RiTeamLine,
  RiSettings3Line,
  RiBankLine,
  RiQuestionLine,
  RiFireLine,
  RiRocket2Line,
  RiSearch2Line,
  // RiLinksLine,
  // RiHeartsLine,
} from 'react-icons/ri';
import { FaDiscourse, FaRegHandshake } from 'react-icons/fa';
// import { GiCastle } from 'react-icons/gi';

// no slash on the path
export const defaultDaoData = [
  { icon: RiBookMarkLine, label: 'Proposals', path: 'proposals' },
  { icon: RiBankLine, label: 'Bank', path: 'bank' },
  { icon: RiTeamLine, label: 'Members', path: 'members' },
  { icon: RiSettings3Line, label: 'Settings', path: 'settings' },
  { icon: RiRocket2Line, label: 'Boosts', path: 'settings/boosts' },
  { icon: FaRegHandshake, label: 'Allies', path: 'allies' },
];
export const defaultHubData = [
  { icon: RiSearch2Line, label: 'Explore', path: '/explore' },
  { icon: RiFireLine, label: 'Summon', path: '/summon' },
  {
    icon: RiQuestionLine,
    label: 'Help',
    href: 'https://daohaus.club/docs',
  },
  // {
  //   icon: GiCastle,
  //   label: 'About DaoHaus',
  //   href: 'https://daohaus.club/',
  // },
  // {
  //   icon: RiTeamLine,
  //   label: 'UberHaus',
  //   path: '/dao/0x64/???',
  // },
];

export const generateDaoLinks = (chainID, daoID, proposals) => {
  return defaultDaoData.map(link => {
    let path = `/dao/${chainID}/${daoID}/${link.path}`;
    if (link.path === 'proposals' && !proposals.length) {
      path = `${path}/new`;
    }
    return {
      ...link,
      path,
    };
  });
};

export const defaultSocialLinks = [
  { icon: RiDiscordFill, label: 'Discord', href: 'https://discord.gg/daohaus' },
  {
    icon: RiMediumFill,
    label: 'Blog',
    href: 'https://daohaus.substack.com',
  },
  {
    icon: RiGlobeLine,
    label: 'Website',
    href: 'https://daohaus.club/',
  },
  {
    icon: RiTwitterFill,
    label: 'Twitter',
    href: 'https://twitter.com/@nowdaoit',
  },
];

const socialLinksBaseUrls = {
  twitter: 'https://twitter.com/',
  discord: 'https://discord.gg/',
  telegram: 'https://t.me/',
  medium: 'https://medium.com/',
};

export const generateDaoSocials = linksMetaObj => {
  if (!linksMetaObj) return;

  const fixedSocials = Object.keys(linksMetaObj).reduce(
    (acc, metaObjKey) => ({
      ...acc,
      [metaObjKey]:
        linksMetaObj[metaObjKey] &&
        socialLinksBaseUrls[metaObjKey] &&
        !linksMetaObj[metaObjKey].includes(socialLinksBaseUrls[metaObjKey])
          ? `${socialLinksBaseUrls[metaObjKey]}${linksMetaObj[metaObjKey]}`
          : linksMetaObj[metaObjKey],
    }),
    {},
  );

  return defaultSocialLinks
    .filter(link => fixedSocials[link.label.toLowerCase()])
    .map(link => ({ ...link, href: fixedSocials[link.label.toLowerCase()] }));
};

export const generateDiscourseLink = metadata => {
  return {
    ...metadata,
    href: `https://forum.daohaus.club/c/${metadata.slug}/${metadata.categoryId}`,
    label: 'Discourse',
    icon: FaDiscourse,
  };
};
