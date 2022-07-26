import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Icon, Link, Spinner } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { RiCheckboxCircleLine, RiExternalLinkLine } from 'react-icons/ri';
import { VscError } from 'react-icons/vsc';
import { TiWarningOutline } from 'react-icons/ti';

import TextBox from './TextBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { chainByID } from '../utils/chain';
import {
  BRIDGE_MODULES,
  getNomadTxStatus,
  processNomadMessage,
} from '../utils/gnosis';

const AMBExecute = ({ chainID, proposal }) => {
  const monitoringAppUrl =
    proposal.minion.crossChainMinion &&
    chainByID(chainID).zodiac_amb_module?.monitoring_app[
      proposal.minion.foreignChainId
    ];
  return (
    <Flex alignItems='center' flexDir='column'>
      <Box mb={2}>Executed</Box>
      {monitoringAppUrl && proposal.minionExecuteActionTx?.id && (
        <Link
          href={`${monitoringAppUrl}/${proposal.minionExecuteActionTx.id}`}
          isExternal
        >
          <Button>Watch Cross-Chain Tx</Button>
        </Link>
      )}
    </Flex>
  );
};

const NomadExecute = ({ chainID, proposal }) => {
  const SHOULD_EXECUTE = {
    '0x1': true,
    '0x5': true,
  };
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState();
  const { injectedChain, injectedProvider } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();

  const foreignChainConfig = chainByID(proposal.minion.foreignChainId);
  const homeChainConfig = chainByID(chainID);

  const connectedToForeignChain = () => {
    return injectedChain?.chain_id === proposal.minion.foreignChainId;
  };

  const getNomadStatus = async (
    homeChainId,
    foreignChainId,
    txHash,
    retry = 0,
  ) => {
    if (retry > 1) return;
    // { statusMsg, stage, txHash }
    const currentStatus = await getNomadTxStatus({
      homeChainId,
      foreignChainId,
      txHash,
    });
    if (!currentStatus)
      // Retry after 15sec
      setTimeout(
        () => getNomadStatus(homeChainId, foreignChainId, txHash, retry + 1),
        15000,
      );
    setStatus(currentStatus);
  };

  // Called only when Tx is not subsidized on the Foreign chain
  const executeTx = async () => {
    setLoading('executeTx');
    const homeChainId = chainID;
    const foreignChainId = proposal.minion.foreignChainId;
    const txHash = proposal.minionExecuteActionTx.id;
    const success = await processNomadMessage({
      homeChainId,
      foreignChainId,
      txHash,
      injectedProvider,
    });
    if (!success) {
      errorToast({
        title: 'Tx Error',
        description: 'Failed to Execute Tx in the Foreign Chain',
      });
      setLoading(false);
      return;
    }
    successToast({
      title: 'Success',
      description: 'Tx Executed in the Foreign Chain',
    });
    setStatus(null);
    getNomadStatus(homeChainId, foreignChainId, txHash);
    setLoading(false);
  };

  const ExecuteTxComponent = () => {
    if (connectedToForeignChain())
      return (
        <Button
          onClick={executeTx}
          isLoading={loading === 'executeTx'}
          mt={2}
          size='md'
        >
          Execute Tx
        </Button>
      );
    return (
      <Flex alignItems='center' flexDir='column' mt={2}>
        <TiWarningOutline
          style={{
            width: '30px',
            height: '30px',
            color: 'yellow',
          }}
        />
        <TextBox mt={2} size='xs'>
          Tx is Ready
        </TextBox>
        <TextBox size='xs'>
          Please Switch to {foreignChainConfig.network} to Execute
        </TextBox>
      </Flex>
    );
  };

  const ProcessedIcon = props => {
    const { mb, success, style } = props;
    const iconProps = { mb, style };
    return success ? (
      <RiCheckboxCircleLine {...iconProps} />
    ) : (
      <VscError {...iconProps} />
    );
  };

  useEffect(() => {
    const homeChainId = chainID;
    const { foreignChainId } = proposal.minion;
    const txHash = proposal.minionExecuteActionTx?.id;
    if (txHash) {
      getNomadStatus(homeChainId, foreignChainId, txHash);
    }
  }, [proposal]);

  return (
    <Flex alignItems='center' flexDir='column'>
      <TextBox>Nomad Tx Status</TextBox>
      <TextBox mb={4} size='xs'>
        {homeChainConfig.network} - {foreignChainConfig.network}
      </TextBox>
      {(!['Relayed', 'Processed'].includes(status?.statusMsg) ||
        (status?.statusMsg === 'Relayed' &&
          (!status?.attestOK ||
            !SHOULD_EXECUTE[foreignChainConfig.chain_id]))) && <Spinner />}
      {status?.statusMsg === 'Processed' && (
        <ProcessedIcon
          success={status.success}
          style={{
            width: '50px',
            height: '50px',
            color: status.success ? 'green' : 'red',
          }}
          mb={3}
        />
      )}
      {status ? (
        <Box>
          <Text align='center'>
            {status.statusMsg} at {status.stage}
          </Text>
          <Flex alignItems='center' flexDir='column'>
            {status.txHash && (
              <Link
                href={`${
                  status.stage === 'Home'
                    ? homeChainConfig.block_explorer
                    : foreignChainConfig.block_explorer
                }/tx/${status.txHash}`}
                isExternal
              >
                <Icon
                  as={RiExternalLinkLine}
                  name='explorer link'
                  color='secondary.300'
                  _hover={{ cursor: 'pointer' }}
                />
              </Link>
            )}
            <Text>Stage Tx</Text>
            {injectedProvider &&
              status.statusMsg === 'Relayed' &&
              status.attestOK &&
              SHOULD_EXECUTE[foreignChainConfig.chain_id] && (
                <ExecuteTxComponent />
              )}
          </Flex>
        </Box>
      ) : (
        <Text>Fetching Tx Info...</Text>
      )}
    </Flex>
  );
};

const CrossChainMinionExecute = ({ chainID, proposal }) => {
  const { bridgeModule } = proposal.minion;

  if (bridgeModule === BRIDGE_MODULES.AMB_MODULE)
    return <AMBExecute chainID={chainID} proposal={proposal} />;
  if (bridgeModule === BRIDGE_MODULES.NOMAD_MODULE)
    return <NomadExecute chainID={chainID} proposal={proposal} />;
  return null;
};

export default CrossChainMinionExecute;
