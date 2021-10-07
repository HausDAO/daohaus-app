import React, { useEffect } from 'react';
import { useMediaQuery } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import MemberInfo from './memberInfo';

const MemberInfoWrapper = ({ member, customTerms }) => {
  const { setGenericModal } = useOverlay();
  const [isDesktop] = useMediaQuery('(min-width: 48em)');

  useEffect(() => {
    if (member && !isDesktop) {
      setGenericModal({ memberInfoModal: true });
    }
  }, [member]);

  return isDesktop ? (
    <MemberInfo member={member} customTerms={customTerms} />
  ) : (
    <GenericModal closeOnOverlayClick modalId='memberInfoModal'>
      <MemberInfo member={member} customTerms={customTerms} />
    </GenericModal>
  );
};

export default MemberInfoWrapper;
