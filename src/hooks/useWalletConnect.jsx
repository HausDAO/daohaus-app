import { useState, useCallback } from 'react';
import WalletConnect from '@walletconnect/client';
import { encodeSafeSignMessage } from '../utils/gnosis';

const rejectWithMessage = (connector, id, message) => {
  connector.rejectRequest({ id, error: { message } });
};

const useWalletConnect = () => {
  const [wcClientData, setWcClientData] = useState(null);
  const [txPayload, setTxPayload] = useState(null);
  const [wcConnector, setConnector] = useState();
  const [localStorageSessionKey, setLocalStorageSessionKey] = useState(null);

  const wcDisconnect = useCallback(
    async session => {
      try {
        await session?.killSession();
        setConnector(undefined);
        setWcClientData(null);
        localStorage.removeItem(localStorageSessionKey);
        setLocalStorageSessionKey(null);
      } catch (error) {
        console.log('Error trying to close WC session: ', error);
      }
    },
    [wcConnector],
  );

  const wcConnect = useCallback(
    async ({ chainId, safeAddress, session, uri }) => {
      const connector = new WalletConnect({
        uri,
        session,
        storageId: `session_${safeAddress}`,
      });
      setConnector(connector);
      setWcClientData(connector.peerMeta);
      setLocalStorageSessionKey(`session_${safeAddress}`);

      connector.on('session_request', (error, payload) => {
        if (error) {
          throw error;
        }

        connector.approveSession({
          accounts: [safeAddress],
          chainId: Number(chainId),
        });

        setWcClientData(payload.params[0].peerMeta);
      });

      connector.on('call_request', async (error, payload) => {
        try {
          if (error) {
            throw error;
          }
          switch (payload.method) {
            case 'eth_sendTransaction': {
              setTxPayload(payload);
              break;
            }
            case 'personal_sign': {
              const [message] = payload.params;
              const tx = encodeSafeSignMessage(chainId, message);
              setTxPayload({
                ...payload,
                params: [tx],
              });
              break;
            }
            default: {
              rejectWithMessage(connector, payload.id, 'Tx type not supported');
              break;
            }
          }
        } catch (err) {
          rejectWithMessage(connector, payload.id, err.message);
        }
      });

      connector.on('disconnect', error => {
        if (error) {
          throw error;
        }
        setTxPayload(null);
        if (wcConnector) wcDisconnect(wcConnector);
      });
    },
    [wcDisconnect],
  );

  return {
    wcConnector,
    wcClientData,
    txPayload,
    wcConnect,
    wcDisconnect,
  };
};

export default useWalletConnect;
