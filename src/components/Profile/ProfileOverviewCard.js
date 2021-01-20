import React, { useState, useEffect } from 'react';
import { Avatar, Flex, Skeleton, Box, Icon, Tooltip } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { RiQuestionLine } from 'react-icons/ri';
import { format } from 'date-fns';
import makeBlockie from 'ethereum-blockies-base64';

import { truncateAddr, numberWithCommas } from '../../utils/helpers';
import {
  useEns,
  useDaoGraphData,
  usePrices,
  useMemberWallet,
  useModals,
} from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import ProfileMenu from '../Shared/ProfileMenu';
import { getTotalBankValue } from '../../utils/bank-helpers';
import { useParams } from 'react-router-dom';
import { contra } from '../../utils/blood-and-guts';
import RageQuitModal from '../Modal/RageQuitModal';

const ProfileOverviewCard = ({ profile }) => {
  const [ens] = useEns();
  const [dao] = useDaoGraphData();
  const [prices] = usePrices();
  const [memberWallet] = useMemberWallet();
  const [memberValue, setMemberValue] = useState(0);
  const [votingPower, setVotingPower] = useState(0);
  const [ensName, setEnsName] = useState(null);
  const params = useParams();
  const [showAlert, setShowAlert] = useState();
  const { modals } = useModals();

  useEffect(() => {
    const lookupEns = async () => {
      if (profile?.memberAddress) {
        const result = await ens.provider.lookupAddress(profile.memberAddress);
        setEnsName(result);
      }
    };
    lookupEns();
  }, [profile, ens.provider]);

  useEffect(() => {
    if (dao && dao.tokenBalances && prices && profile) {
      const total = getTotalBankValue(dao.tokenBalances, prices);

      const memberProportion =
        (+profile.shares + +profile.loot) /
          (+dao.totalShares + +dao.totalLoot) || 0;

      setMemberValue(memberProportion * total);

      const shares = profile.shares || 0;
      const power = ((+shares / +dao.totalShares) * 100).toFixed(1);
      setVotingPower(power);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao, prices, profile]);

  useEffect(() => {
    if (memberWallet) {
      const userCheck =
        memberWallet.memberAddress.toLowerCase() === params.id.toLowerCase();

      if (userCheck) {
        contra(powerUp);
      }
    }
  }, [memberWallet, params]);

  const powerUp = () => {
    setShowAlert(true);
  };

  return (
    <ContentBox as={Flex} p={6} w='100%' justify='space-between'>
      {profile ? (
        <>
          <Flex direction='row' width='50%'>
            <Flex direction='column' align='center' pr={5} minW='40%'>
              {profile?.profile.image && profile?.profile.image[0] ? (
                <Avatar
                  w='100px'
                  h='100px'
                  src={`https://ipfs.infura.io/ipfs/${profile.profile.image[0].contentUrl['/']}`}
                />
              ) : (
                <Avatar
                  w='100px'
                  h='100px'
                  src={makeBlockie(
                    profile.username ? profile.username : profile.memberAddress,
                  )}
                />
              )}
              <Skeleton isLoaded={profile}>
                {profile.memberAddress ? (
                  <Box
                    fontFamily='heading'
                    fontSize='xs'
                    textAlign='center'
                    mt={5}
                  >
                    Joined{' '}
                    {profile?.createdAt
                      ? format(
                          new Date(+profile.createdAt * 1000),
                          'MMM. d, yyyy',
                        )
                      : '--'}
                  </Box>
                ) : null}
              </Skeleton>
            </Flex>

            <Flex direction='column'>
              <Box fontSize='xl' fontFamily='heading'>
                {profile?.profile.name ||
                  truncateAddr(
                    profile.username ? profile.username : profile.memberAddress,
                  )}{' '}
                <span>{profile.profile.emoji || ''} </span>
              </Box>
              {profile.name ? (
                <Box fontSize='sm' fontFamily='mono'>
                  {truncateAddr(
                    profile.username ? profile.username : profile.memberAddress,
                  )}
                </Box>
              ) : null}
              {ensName && (
                <Box fontSize='sm' fontFamily='mono'>
                  {ensName}
                </Box>
              )}
              {profile.profile.description && (
                <Box fontSize='sm' fontFamily='mono'>
                  {profile.profile.description}
                </Box>
              )}
            </Flex>
          </Flex>
          <Flex w='48%' direction='column'>
            <Flex justify='space-between'>
              <Box>
                <TextBox size='sm'>
                  Exit Amount
                  <Tooltip
                    hasArrow
                    shouldWrapChildren
                    placement='top'
                    label='Estimated amount you would receive in tokens if you were to Ragequit'
                  >
                    <Icon mt='-4px' as={RiQuestionLine} />
                  </Tooltip>
                </TextBox>
                <TextBox size='4xl' variant='value'>
                  ${numberWithCommas(memberValue.toFixed(2))}
                </TextBox>
              </Box>
              <Box>
                {profile.memberAddress ? (
                  <ProfileMenu member={profile} />
                ) : null}
              </Box>
            </Flex>
            <Flex justify='space-between' align='flex-end' mt={4}>
              <Box w='30%'>
                <TextBox size='xs'>Power</TextBox>
                <Skeleton isLoaded={profile}>
                  {showAlert ? (
                    <TextBox size='xl' variant='value'>
                      <Flex
                        direction='row'
                        align='center'
                        justify='space-around'
                      >
                        <Icon as={FaStar} color='yellow.500' />
                        100%
                        <Icon as={FaStar} color='yellow.500' />
                      </Flex>
                    </TextBox>
                  ) : (
                    <TextBox size='xl' variant='value'>
                      {votingPower}%
                    </TextBox>
                  )}
                </Skeleton>
              </Box>
              <Box w='30%'>
                <TextBox size='xs'>Shares</TextBox>
                <Skeleton isLoaded={profile?.shares >= 0}>
                  <TextBox size='xl' variant='value'>
                    {profile?.shares}
                  </TextBox>
                </Skeleton>
              </Box>
              <Box w='30%'>
                <TextBox size='xs'>Loot</TextBox>
                <Skeleton isLoaded={profile?.loot >= 0}>
                  <TextBox size='xl' variant='value'>
                    {profile?.loot}
                  </TextBox>
                </Skeleton>
              </Box>
            </Flex>
          </Flex>
          <RageQuitModal isOpen={modals.ragequitModal} />
        </>
      ) : null}
    </ContentBox>
  );
};

export default ProfileOverviewCard;
