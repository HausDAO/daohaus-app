import React, { useState, useEffect } from 'react';
import { Flex, Skeleton, Box, Image, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';
import makeBlockie from 'ethereum-blockies-base64';

import {
  truncateAddr,
  memberProfile,
  numberWithCommas,
} from '../../utils/helpers';
import {
  useEns,
  useDaoGraphData,
  useMembers,
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

const OverviewCard = ({ user }) => {
  const [ens] = useEns();
  const [dao] = useDaoGraphData();
  const [prices] = usePrices();
  const [members] = useMembers();
  const [memberWallet] = useMemberWallet();
  const [member, setMember] = useState();
  const [memberValue, setMemberValue] = useState(0);
  const [ensName, setEnsName] = useState(null);
  const params = useParams();
  const [, setIsUser] = useState();
  const [showAlert, setShowAlert] = useState();
  const { modals } = useModals();

  useEffect(() => {
    if (user?.memberAddress) {
      setMember(user);
    } else {
      setMember(memberProfile(members, user.username));
    }
  }, [members, user]);

  useEffect(() => {
    const lookupEns = async () => {
      if (user?.memberAddress) {
        const result = await ens.provider.lookupAddress(user.memberAddress);
        setEnsName(result);
      }
    };
    lookupEns();
  }, [user, ens.provider]);

  useEffect(() => {
    if (dao && dao.tokenBalances && prices && member) {
      const total = getTotalBankValue(dao.tokenBalances, prices);
      const memberProportion =
        (+member.shares + +member.loot) / (+dao.totalShares + +dao.totalLoot);
      setMemberValue(memberProportion * total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao, prices, member]);

  useEffect(() => {
    if (memberWallet) {
      const userCheck =
        memberWallet.memberAddress.toLowerCase() === params.id.toLowerCase();
      setIsUser(userCheck);

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
      <Flex direction='row' width='50%'>
        <Flex direction='column' align='center' pr={5} minW='40%'>
          {user.profile.image && user.profile.image[0] ? (
            <Image
              w='100px'
              h='100px'
              rounded='full'
              src={`https://ipfs.infura.io/ipfs/${user.profile.image[0].contentUrl['/']}`}
            />
          ) : (
            <Image
              w='100px'
              h='100px'
              rounded='full'
              src={makeBlockie(
                user.username ? user.username : user.memberAddress,
              )}
            />
          )}
          <Skeleton isLoaded={user?.createdAt}>
            <Box fontFamily='heading' fontSize='xs' textAlign='center' mt={5}>
              Joined{' '}
              {user?.createdAt
                ? format(new Date(+user.createdAt * 1000), 'MMM. d, yyyy')
                : '--'}
            </Box>
          </Skeleton>
        </Flex>

        <Flex direction='column'>
          <Box fontSize='xl' fontFamily='heading'>
            {user?.profile.name ||
              truncateAddr(
                user.username ? user.username : user.memberAddress,
              )}{' '}
            <span>{user.profile.emoji || ''} </span>
          </Box>
          {user.name ? (
            <Box fontSize='sm' fontFamily='mono'>
              {truncateAddr(user.username ? user.username : user.memberAddress)}
            </Box>
          ) : null}
          {ensName && (
            <Box fontSize='sm' fontFamily='mono'>
              {ensName}
            </Box>
          )}
          {user.profile.description && (
            <Box fontSize='sm' fontFamily='mono'>
              {user.profile.description}
            </Box>
          )}
        </Flex>
      </Flex>
      <Flex w='48%' direction='column'>
        <Flex justify='space-between'>
          <Box>
            <TextBox size='sm'>Total Stake</TextBox>
            <TextBox size='4xl' variant='value'>
              ${numberWithCommas(memberValue.toFixed(2))}
            </TextBox>
          </Box>
          <Box>
            <ProfileMenu member={user} />
          </Box>
        </Flex>
        <Flex justify='space-between' align='flex-end' mt={4}>
          <Box w='30%'>
            <TextBox size='xs'>Power</TextBox>
            <Skeleton isLoaded={member?.shares && dao?.totalShares}>
              {showAlert ? (
                <TextBox size='xl' variant='value'>
                  <Flex direction='row' align='center' justify='space-around'>
                    <Icon as={FaStar} color='yellow.500' />
                    100%
                    <Icon as={FaStar} color='yellow.500' />
                  </Flex>
                </TextBox>
              ) : (
                <TextBox size='xl' variant='value'>
                  {member?.shares &&
                    dao?.totalShares &&
                    ((member?.shares / dao?.totalShares) * 100).toFixed(1)}
                  %
                </TextBox>
              )}
            </Skeleton>
          </Box>
          <Box w='30%'>
            <TextBox size='xs'>Shares</TextBox>
            <Skeleton isLoaded={member?.shares >= 0}>
              <TextBox size='xl' variant='value'>
                {member?.shares}
              </TextBox>
            </Skeleton>
          </Box>
          <Box w='30%'>
            <TextBox size='xs'>Loot</TextBox>
            <Skeleton isLoaded={member?.loot >= 0}>
              <TextBox size='xl' variant='value'>
                {member?.loot}
              </TextBox>
            </Skeleton>
          </Box>
        </Flex>
      </Flex>
      <RageQuitModal isOpen={modals.ragequitModal} />
    </ContentBox>
  );
};

export default OverviewCard;
