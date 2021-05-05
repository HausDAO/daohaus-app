import React, { useState } from 'react';
import { Button, Flex, useBreakpointValue } from '@chakra-ui/react';
import WithdrawForm from './uberWithdraw';
import PullForm from './uberPullForm';

const WithdrawPullForm = ({
  uberMembers,
  uberHausMinion,
  uberDelegate,
  uberOverview,
  refetchAllies,
}) => {
  const [currentView, setCurrentView] = useState('withdraw');

  const BothForms = () => (
    <>
      <WithdrawForm
        uberMembers={uberMembers}
        uberHausMinion={uberHausMinion}
        refetchAllies={refetchAllies}
      />
      <PullForm
        uberDelegate={uberDelegate}
        uberHausMinion={uberHausMinion}
        uberOverview={uberOverview}
        refetchAllies={refetchAllies}
      />
    </>
  );
  const getCurrentMobileForm = currentView => {
    return currentView === 'withdraw' ? (
      <WithdrawForm
        uberMembers={uberMembers}
        uberHausMinion={uberHausMinion}
        refetchAllies={refetchAllies}
      />
    ) : (
      <PullForm
        uberDelegate={uberDelegate}
        uberHausMinion={uberHausMinion}
        uberOverview={uberOverview}
        refetchAllies={refetchAllies}
      />
    );
  };

  const mobileForm = getCurrentMobileForm(currentView);
  const formLayout = useBreakpointValue({
    lg: <BothForms />,
    md: mobileForm,
    sm: mobileForm,
    base: mobileForm,
  });

  const switchView = e => {
    if (e?.target?.value) {
      setCurrentView(e.target.value);
    }
  };

  return (
    <Flex width='100%' mt={-4} flexDirection={['column', null, null, 'row']}>
      <Flex mb={6} display={['flex', null, null, 'none']}>
        <Button
          size='sm'
          variant={currentView === 'withdraw' ? 'solid' : 'outline'}
          value='withdraw'
          onClick={switchView}
          borderRadius='6px 0 0 6px'
          _hover={{ scale: '1' }}
          outline='none'
        >
          Withdraw
        </Button>
        <Button
          size='sm'
          variant={currentView === 'pull' ? 'solid' : 'outline'}
          value='pull'
          onClick={switchView}
          borderRadius='0 6px 6px 0'
          _hover={{ scale: '1' }}
          outline='none'
        >
          Pull Funds
        </Button>
      </Flex>
      {formLayout}
    </Flex>
  );
};

export default WithdrawPullForm;
