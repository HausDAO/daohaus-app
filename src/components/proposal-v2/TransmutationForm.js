import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  FormContainer,
  FieldContainer,
  DropdownInputDiv,
} from '../../App.styles';
import PaymentInput from './PaymentInput';
import TokenSelect from './TokenSelect';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentUserContext,
  Web3ConnectContext,
  DaoDataContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { TokenService } from '../../utils/TokenService';
import {
  TransmutationService,
  setupValues,
} from '../../utils/TransmutationService';
import { BcProcessorService } from '../../utils/BcProcessorService';
import { GET_MOLOCH } from '../../utils/Queries';
import { useQuery } from 'react-apollo';

const H2Arrow = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.primary};
`;

const TransmutationForm = (props) => {
  const { history } = props;

  const [gloading] = useContext(LoaderContext);
  const [formLoading, setFormLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [web3Connect] = useContext(Web3ConnectContext);
  const [daoData] = useContext(DaoDataContext);
  const [tokenData, setTokenData] = useState([]);

  const bcProcessor = new BcProcessorService(web3Connect.web3);
  const transmutationService = new TransmutationService(
    web3Connect.web3,
    currentUser.user,
    bcProcessor,
  );

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

      const balance = await tokenService.balanceOf(setupValues.contractAddress);

      console.log('balance', web3Connect.web3.utils.fromWei(balance));
      setBalance(web3Connect.web3.utils.fromWei(balance));
    };
    getBalance();

    // eslint-disable-next-line
  }, [web3Connect.web3]);

  // get whitelist
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
      setTokenData(
        tokenArray.map((token) => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    };
    if (data && data.moloch) {
      getTokenBalance();
    }
    // eslint-disable-next-line
  }, [data]);

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
              {({ isSubmitting, ...props }) => (
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
                        <label>Applicant Address</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="applicant">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <DropdownInputDiv>
                    <Field
                      name="paymentRequested"
                      component={PaymentInput}
                      data={tokenData}
                      token={props.values.paymentToken || ''}
                      label="Payment Requested"
                    ></Field>
                    <Field
                      name="paymentToken"
                      component={TokenSelect}
                      label="Payment Token"
                      data={tokenData}
                    ></Field>
                  </DropdownInputDiv>

                  <ErrorMessage name="paymentRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <H2Arrow>↓</H2Arrow>

                  <h2>Transmutation Balance: {balance}</h2>
                  <h2>Exchange Rate: {setupValues.exchangeRate}</h2>
                  <h2>
                    {displayTribute(
                      transmutationService
                        .calcTribute(props.values.paymentRequested)
                        .toString(),
                    )}
                  </h2>

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
