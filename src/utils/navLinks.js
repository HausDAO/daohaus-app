import {
  RiBookMarkLine,
  RiDiscordFill,
  RiTelegramFill,
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
  RiLinksLine,
} from 'react-icons/ri';
import { GiCastle } from 'react-icons/gi';

// no slash on the path
export const defaultDaoData = [
  { icon: RiBookMarkLine, label: 'Proposals', path: 'proposals' },
  { icon: RiBankLine, label: 'Bank', path: 'bank' },
  { icon: RiTeamLine, label: 'Members', path: 'members' },
  { icon: RiSettings3Line, label: 'Settings', path: 'settings' },
  { icon: RiRocket2Line, label: 'Boosts', path: 'settings/boosts' },
];
export const defaultHubData = [
  { icon: RiSearch2Line, label: 'Explore', path: '/explore' },
  { icon: RiFireLine, label: 'Summon', path: '/summon' },
  {
    icon: RiTeamLine,
    label: 'HausDao',
    path: '/dao/0x64/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50',
  },
  {
    icon: RiQuestionLine,
    label: 'Help',
    href: 'https://daohaus.club/help',
  },
  {
    icon: GiCastle,
    label: 'About Dao Haus',
    href: 'https://daohaus.club/about',
  },
];

export const generateDaoLinks = (chainID, daoID, proposals) => {
  return defaultDaoData.map((link) => {
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
  { icon: RiDiscordFill, label: 'Discord', href: 'https://discord.gg/NPEJysW' },
  {
    icon: RiTelegramFill,
    label: 'Telegram',
    href: 'https://t.me/joinchat/IJqu9xPa0xzYLN1mmFKo8g',
  },
  {
    icon: RiMediumFill,
    label: 'Medium',
    href: 'https://medium.com/daohaus-club',
  },
  {
    icon: RiGlobeLine,
    label: 'Website',
    href: 'https://app.daohaus.club/',
  },
  {
    icon: RiTwitterFill,
    label: 'Twitter',
    href: 'https://twitter.com/@nowdaoit',
  },
  { icon: RiLinksLine, label: 'Other', href: 'https://wikipedia.com' },
];
export const generateDaoSocials = (customTerms) => {
  if (!customTerms) return;
  return defaultSocialLinks
    .filter((link) => customTerms[link.label.toLowerCase()])
    .map((link) => ({ ...link, href: customTerms[link.label.toLowerCase()] }));
};
