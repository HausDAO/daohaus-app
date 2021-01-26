import React, { useState, useEffect } from 'react';
import { Avatar } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { handleGetProfile } from '../utils/3box';
import { truncateAddr } from '../utils/general';
import { chainByID } from '../utils/chain';
import { tallyUSDs } from '../utils/tokenValue';
// import ProfileBankList from '../components/profileBankList';
import ActivitiesFeed from '../components/activitiesFeed';
import { getProfileActivites } from '../utils/activities';

const handleAvatar = (member, profile) => {
  if (profile?.image?.length) {
    const url = profile?.image[0].contentUrl;
    return (
      <Avatar
        // uses key, otherwise React skips rerender
        key={`profile${member}`}
        name={profile?.name}
        size='lg'
        src={`https://ipfs.infura.io/ipfs/${url['/']}`}
      />
    );
  } else {
    return (
      <Avatar
        key={`no-profile${member}`}
        name={member?.memberAddress}
        size='lg'
        src={makeBlockie(member?.memberAddress)}
      />
    );
  }
};

const calcValue = (member, daoTokens, overview) => {
  if (daoTokens && member && overview) {
    const { loot, shares } = member;
    const { totalShares, totalLoot } = overview;
    const totalDaoVal = tallyUSDs(daoTokens);
    const memberProportion = (shares + loot) / (totalShares + totalLoot) || 0;

    const result = memberProportion * totalDaoVal;
    return result.toFixed(2);
  } else {
    return 0;
  }
};

const calcPower = (member, overview) => {
  if (member?.shares && overview?.totalShares) {
    const total = (member.shares / overview.totalShares) * 100;
    return total.toFixed(1);
  } else {
    return 0;
  }
};

const handleName = (member, profile) => {
  return profile?.name ? profile.name : truncateAddr(member.memberAddress);
};
const Profile = ({ members, overview, daoTokens, activities }) => {
  const { daochain, userid } = useParams();
  const [profile, setProfile] = useState(null);
  const [ens, setEns] = useState(null);

  const currentMember = members
    ? members.find((member) => member.memberAddress === userid)
    : null;

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await handleGetProfile(currentMember.memberAddress);
        if (profile.status === 'error') return;
        setProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentMember && !profile) {
      getProfile();
    }
  }, [currentMember, profile]);

  useEffect(() => {
    const lookupEns = async () => {
      if (currentMember?.memberAddress) {
        const ethersProvider = ethers.getDefaultProvider(
          chainByID(daochain).rpc_url,
        );
        const result = await ethersProvider.lookupAddress(userid);
        if (result) {
          setEns(result);
        }
      }
    };
    lookupEns();
  }, [currentMember, daochain, userid]);

  return (
    <div>
      {currentMember ? (
        <>
          <div>
            <h4>Profile Card</h4>
            <h2>{handleName(currentMember, profile)}</h2>
            {profile?.emoji && <span>{profile.emoji}</span>}
            {handleAvatar(currentMember, profile)}
            {ens && <p>{ens}</p>}
            {profile?.job && <p>{profile.job}</p>}
            {profile?.employer && <p>{profile.employer}</p>}
            <p>
              Exit Amount:{' '}
              {daoTokens &&
                overview &&
                calcValue(currentMember, daoTokens, overview)}{' '}
            </p>
            <p>
              Power:{' '}
              {daoTokens &&
                overview &&
                calcPower(currentMember, overview) + '%'}
            </p>
            <p>Shares: {currentMember.shares}</p>
            <p>Loot: {currentMember.loot}</p>
          </div>

          {activities && (
            <ActivitiesFeed
              limit={5}
              hydrateFn={getProfileActivites(currentMember.memberAddress)}
              activities={activities}
            />
          )}
          {/* <ProfileBankList tokenData={currentMember.tokenBalances} /> */}
        </>
      ) : (
        <h3>Member not found</h3>
      )}
    </div>
  );
};

export default Profile;
