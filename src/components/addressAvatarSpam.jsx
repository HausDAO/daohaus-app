import React from 'react';

import StaticAvatar from './staticAvatar';

const AddressAvatarSpam = React.memo(({ addr, hideCopy }) => {
  return (
    <StaticAvatar
      address={addr}
      avatarImg={null}
      name={null}
      hideCopy={hideCopy}
    />
  );
});

export default AddressAvatarSpam;
