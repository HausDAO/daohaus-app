import React from 'react';

import CustomThemeLaunch from '../components/Settings/CustomThemeLaunch';
import NewMinionForm from '../components/Settings/NewMinionForm';
import NotificationsLaunch from '../components/Settings/NotificationsLaunch';

export const boostList = [
  {
    name: 'Custom Theme',
    key: 'customTheme',
    description: 'Customize the visual theme of your community',
    price: '0',
    modalName: 'customThemeLaunch',
    modalBody: <CustomThemeLaunch />,
  },
  {
    name: 'Minion',
    key: 'vanillaMinions',
    description: 'Create and vote on execution of external contracts',
    price: '0',
    modalName: 'vanillaMinionLaunch',
    modalBody: <NewMinionForm />,
  },
  {
    name: 'Notifications: Level 1',
    key: 'notificationsLevel1',
    description:
      'Customize and send notifications of DAO activity to your discord server',
    price: '0',
    modalName: 'notificationsLevel1Launch',
    modalBody: <NotificationsLaunch />,
  },
  {
    name: 'Notifications: Level 2',
    key: 'notificationsLevel2',
    description:
      'Customize and send notifications of DAO activity to more of your social channels',
    comingSoon: true,
    modalName: 'notificationsLevel2Launch',
    price: '0',
  },
];

export const notificationBoostContent = {
  actions: [
    {
      id: 'proposal-ready',
      label: 'Proposal Ready for Voting',
    },
    {
      id: 'proposal-sponsor',
      label: 'Proposal Needs Sponsor',
    },
    {
      id: 'proposal-closing',
      label: 'Proposal Needs a Vote',
      comingSoon: true,
    },
    {
      id: 'new-member',
      label: 'New Member is Official',
      comingSoon: true,
    },
    {
      id: 'rage-quit',
      label: 'New Ragequit',
    },
  ],
  channels: [
    { name: 'discord' },
    { name: 'telegram', comingSoon: true },
    { name: 'email', comingSoon: true },
    { name: 'twitter', comingSoon: true },
  ],
};
