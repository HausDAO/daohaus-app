import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { SwapOutlined } from '@ant-design/icons';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  FormContainer,
  FieldContainer,
  TinyP,
  TinyPLink,
  DataH2,
} from '../../App.styles';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentUserContext,
  Web3ConnectContext,
  DaoDataContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { TokenService } from '../../utils/TokenService';
import { GET_MOLOCH } from '../../utils/Queries';
import { useQuery } from 'react-apollo';

const TransmutationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 25px;
  margin-bottom: 25px;
  p {
    font-size: 0.85em;
  }
`;

const TransmutationIcon = styled.div`
  text-align: left;
  svg {
    width: 36px;
    height: 36px;
    margin-right: 15px;
    transform: rotate(-90deg);
  }
  color: ${(props) => props.theme.baseFontColor};
`;

const TransmutationReturn = styled.div`
  border: 1px solid ${(props) => props.theme.baseFontColor};
  padding: 5px 15px 15px 15px;
  border-radius: 25px;
  text-align: center;
`;

const TransmutationForm = (props) => {
  const { history, transmutationService } = props;

  const [gloading] = useContext(LoaderContext);
  const [formLoading, setFormLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState(0);
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [web3Connect] = useContext(Web3ConnectContext);
  const [daoData] = useContext(DaoDataContext);
  const [tokenData, setTokenData] = useState([]);

  console.log('daoData', daoData);

  const options = {
    variables: { contractAddr: daoData.contractAddress },
    fetchPolicy: 'no-cache',
  };
  const query = GET_MOLOCH;

  const { loading, error, data } = useQuery(query, options);

  const displayTribute = (val) => {
    return web3Connect.web3.utils.fromWei('' + val);
  };

  const submitProposal = async (paymentRequested, applicant, description) => {
    return transmutationService.propose(
      applicant,
      paymentRequested,
      description,
    );
  };

  useEffect(() => {
    const getBalance = async () => {
      const token = await transmutationService.giveToken();

      const tokenService = new TokenService(web3Connect.web3, token);

      const balance = await tokenService.balanceOf(
        transmutationService.setupValues.transmutation,
      );

      console.log('balance', web3Connect.web3.utils.fromWei(balance));
      setBalance(web3Connect.web3.utils.fromWei(balance));
      const symbol = await tokenService.getSymbol();
      setSymbol(symbol);
    };
    getBalance();

    // eslint-disable-next-line
  }, [web3Connect.web3]);

  // get getToken
  useEffect(() => {
    const getTokenBalance = async () => {
      const getTokenAddress = await transmutationService.getToken();
      console.log('getTokenAddress', getTokenAddress);
      const tokenArray = data.moloch.tokenBalances.filter(
        (token) =>
          token.token.tokenAddress === getTokenAddress.toLowerCase() &&
          token.guildBank,
      );

      if (!tokenArray) {
        setTokenData([]);
        return;
      }
      console.log('tokenArray', tokenArray);
      setTokenData(
        tokenArray.map((token) => ({
          label: token.token.symbol || token.token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balanceWei: token.tokenBalance,
          balance: web3Connect.web3.utils.fromWei(token.tokenBalance),
        })),
      );
    };
    if (data && data.moloch) {
      getTokenBalance();
    }
    // eslint-disable-next-line
  }, [data, web3Connect]);

  if (loading) return <Loading />;
  if (error) {
    console.log('error', error);
  }

  return (
    <FormContainer>
      <h1>Transmutation Proposal</h1>
      <div>
        {formLoading && <Loading />}
        {gloading && <Loading />}

        <div>
          {currentUser && currentUser.username ? (
            <Formik
              initialValues={{
                description: '',
                applicant: '',
                paymentRequested: '',
              }}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('submit', values);
                setFormLoading(true);
                setSubmitting(true);
                try {
                  await submitProposal(
                    values.paymentRequested,
                    values.applicant,
                    values.description,
                  );
                  setSubmitting(false);
                  setFormLoading(false);
                  history.push(`/dao/${daoService.daoAddress}/success`);
                } catch (err) {
                  setSubmitting(false);
                  setFormLoading(false);
                  console.log('Error:', err);
                }
              }}
            >
              {({ isSubmitting, setFieldValue, ...props }) => (
                <Form className="Form">
                  <Field name="description">
                    {({ field, form }) => (
                      <FieldContainer
                        className={
                          field.value || field.value === 0
                            ? 'Field HasValue'
                            : 'Field '
                        }
                      >
                        <label>Short Description</label>
                        <textarea rows="5" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="description">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <Field name="applicant">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Recipient Address</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="applicant">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <Field name="paymentRequested">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Amount</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="paymentRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <ErrorMessage name="paymentRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>
                  {tokenData[0] && (
                    <TinyPLink
                      onClick={() => {
                        setFieldValue('paymentRequested', tokenData[0].balance);
                      }}
                    >
                      DAO Balance:{' '}
                      {tokenData[0] && tokenData[0].balance.substring(0, 6)}{' '}
                      {tokenData[0] && tokenData[0].label}
                    </TinyPLink>
                  )}

                  <TransmutationRow>
                    <TransmutationIcon>
                      <SwapOutlined />
                    </TransmutationIcon>
                    <TinyP>
                      Exchange Rate: 1 {tokenData[0] && tokenData[0].label} ={' '}
                      {transmutationService.setupValues.exchangeRate} {symbol}
                    </TinyP>
                  </TransmutationRow>
                  <TransmutationReturn>
                    <h5>Will Return</h5>
                    <DataH2>
                      {displayTribute(
                        transmutationService
                          .calcTribute(props.values.paymentRequested)
                          .toString(),
                      )}{' '}
                      {symbol}
                    </DataH2>
                    <TinyP>
                      Balance: {balance} {symbol}
                    </TinyP>
                  </TransmutationReturn>

                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </FormContainer>
  );
};

export default withRouter(TransmutationForm);
