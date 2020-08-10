import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormContainer, FieldContainer } from '../../App.styles';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentUserContext,
  Web3ConnectContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { TokenService } from '../../utils/TokenService';

import abi from '../../contracts/transmutation.json';

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

  const setupValues = {
    contractAddress: '0x8fB2cEa12c43573616be80148C182fCA14Eb9a26',
    exchangeRate: 0.5,
    paddingNumber: 10000,
  };

  const calcTribute = (paymentRequested) => {
    if (!paymentRequested || isNaN(paymentRequested)) {
      return '0';
    }
    const bnExchange = web3Connect.web3.utils.toBN(
      setupValues.exchangeRate * setupValues.paddingNumber,
    );
    // const bcProcessor = new BcProcessorService(web3);

    const bnTributeOffered = web3Connect.web3.utils.toBN(
      web3Connect.web3.utils.toWei('' + paymentRequested),
    );
    const tributeOffered = bnTributeOffered
      .mul(bnExchange)
      .div(web3Connect.web3.utils.toBN(setupValues.paddingNumber));

    return tributeOffered;
  };

  const displayTribute = (val) => {
    return web3Connect.web3.utils.fromWei('' + val);
  };

  const submitProposal = async (paymentRequested, applicant, description) => {
    console.log(web3Connect, setupValues, currentUser);
    const contract = new web3Connect.web3.eth.Contract(
      abi,
      setupValues.contractAddress,
    );

    console.log('contract', contract);
    return contract.methods
      .propose(
        applicant,
        calcTribute(paymentRequested),
        web3Connect.web3.utils.toWei('' + paymentRequested),
        description,
      )
      .send({ from: currentUser.username });
  };

  useEffect(() => {
    const getBalance = async () => {
      const contract = new web3Connect.web3.eth.Contract(
        abi,
        setupValues.contractAddress,
      );
      const token = await contract.methods.giveToken().call();

      const tokenService = new TokenService(web3Connect.web3, token);

      const balance = await tokenService.balanceOf(setupValues.contractAddress);

      console.log('balance', web3Connect.web3.utils.fromWei(balance));
      setBalance(web3Connect.web3.utils.fromWei(balance));
    };
    getBalance();
  }, [setupValues.contractAddress, web3Connect.web3]);

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

                  <Field name="paymentRequested">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Get Amount</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="paymentRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <H2Arrow>↓</H2Arrow>

                  <h2>Transmutation Balance: {balance}</h2>
                  <h2>Exchange Rate: {setupValues.exchangeRate}</h2>
                  <h2>
                    {displayTribute(
                      calcTribute(props.values.paymentRequested).toString(),
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
