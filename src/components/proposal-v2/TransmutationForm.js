import React, { useContext, useState } from 'react';
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

import abi from '../../contracts/transmutation.json';

const H2Arrow = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.primary};
`;

const TransmutationForm = (props) => {
  const { history } = props;

  const [gloading] = useContext(LoaderContext);
  const [formLoading, setFormLoading] = useState(false);
  const [daoService] = useContext(DaoServiceContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [web3Connect] = useContext(Web3ConnectContext);

  const setupValues = {
    contractAddress: '0x8fB2cEa12c43573616be80148C182fCA14Eb9a26',
    exchangeRate: 2,
    paddingNumber: 100,
  };
  const submitProposal = async (paymentRequested, description) => {
    console.log(web3Connect, setupValues, currentUser);
    const contract = new web3Connect.web3.eth.Contract(
      abi,
      setupValues.contractAddress,
    );

    const bnExchange = web3Connect.web3.utils.toBN(
      setupValues.exchangeRate * setupValues.paddingNumber,
    );
    // const bcProcessor = new BcProcessorService(web3);

    const bnTributeOffered = web3Connect.web3.utils
      .toBN(paymentRequested)
      .mul(web3Connect.web3.utils.toBN(setupValues.paddingNumber));
    const tributeOffered = bnTributeOffered
      .mul(bnExchange)
      .div(web3Connect.web3.utils.toBN(setupValues.paddingNumber));

    console.log('contract', contract);
    return contract.methods
      .propose(
        currentUser.username,
        tributeOffered,
        paymentRequested,
        description,
      )
      .send({ from: currentUser.username });
  };

  //   function propose(
  //     address _applicant,
  //     uint256 _giveAmt,
  //     uint256 _getAmt,
  //     string calldata _details
  // )

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
                // link: '',
                applicant: '',
                tributeOffered: 0,
                paymentRequested: 0,
              }}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('submit', values);
                setFormLoading(true);
                setSubmitting(true);
                try {
                  await submitProposal(
                    values.paymentRequested,
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
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Short Description</label>
                        <textarea rows="5" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="description">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <h2>{setupValues.exchangeRate}</h2>

                  <H2Arrow>↓</H2Arrow>

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
