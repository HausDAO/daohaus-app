import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Storage } from 'aws-amplify';
import shortid from 'shortid';

import { ethToWei } from '@netgum/utils'; // returns BN

import McDaoService from '../../utils/McDaoService';
import Web3Service from '../../utils/Web3Service';
import BcProcessorService from '../../utils/BcProcessorService';

import {
  LoaderContext,
  CurrentUserContext,
  CurrentWalletContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { GET_METADATA } from '../../utils/Queries';
import { withApollo } from 'react-apollo';

const ProposalForm = (props) => {
  const { history, client } = props;
  const { proposalDeposit } = client.cache.readQuery({ query: GET_METADATA });
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  return (
    <div>
      {loading && <Loading />}

      <div>
        {+currentWallet.tokenBalance >= +proposalDeposit &&
        +currentWallet.allowance >= +proposalDeposit ? (
          <Formik
            initialValues={{
              title: '',
              description: '',
              link: '',
              applicant: '',
              tokenTribute: 0,
              sharesRequested: 0,
            }}
            validate={(values) => {
              let errors = {};
              if (!values.title) {
                errors.title = 'Required';
              }
              if (!values.title) {
                errors.description = 'Required';
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const dao = new McDaoService();
              const web3Service = new Web3Service();
              const bcprocessor = new BcProcessorService();

              const bnZed = ethToWei(0);
              const sdk = currentUser.sdk;
              const uuid = shortid.generate();
              setLoading(true);

              try {
                const data = await dao.submitProposal(
                  currentUser.attributes['custom:account_address'],
                  values.applicant,
                  web3Service.toWei(values.tokenTribute),
                  values.sharesRequested + '',
                  `id~${uuid}~title~${values.title}`,
                  true,
                );
                const estimated = await sdk.estimateAccountTransaction(
                  dao.contractAddr,
                  bnZed,
                  data,
                );
                if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
                  alert(
                    `you need more gas, at least: ${web3Service.fromWei(
                      estimated.totalCost.toString(),
                    )}`
                  );
                  setLoading(false);
                  setSubmitting(false);
                  return false;
                }
                
                const hash = await sdk.submitAccountTransaction(estimated);
                const jsonse = JSON.stringify(values, null, 2);
                const blob = new Blob([jsonse], {
                  type: 'application/json',
                });

                Storage.put(`proposal_${uuid}.json`, blob, {
                  contentType: 'text/json',
                })
                  .then((result) => console.log(result))
                  .catch((err) => console.log(err));

                bcprocessor.setTx(
                  hash,
                  currentUser.attributes['custom:account_address'],
                  `Submit proposal (${values.title})`,
                  true,
                );

                setSubmitting(false);
                setLoading(false);

                history.push('/proposals');
              } catch (err) {
                console.log('submit error', err);
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="Form">
                <h3>Proposal deposit: {proposalDeposit} token</h3>
                <Field name="title">
                  {({ field, form }) => (
                    <div
                      className={
                        field.value
                          ? 'Field HasValue'
                          : 'Field '
                      }
                    >
                      <label>Title</label>
                      <input type="text" {...field} />
                    </div>
                  )}
                </Field>
                <ErrorMessage name="title">
                  {(msg) => <div className="Error">{msg}</div>}
                </ErrorMessage>
                <Field name="description">
                  {({ field, form }) => (
                    <div
                      className={
                        field.value
                          ? 'Field HasValue'
                          : 'Field '
                      }
                    >
                      <label>Short Description</label>
                      <textarea {...field} />
                    </div>
                  )}
                </Field>
                <ErrorMessage name="description">
                  {(msg) => <div className="Error">{msg}</div>}
                </ErrorMessage>
                <Field name="link">
                {({ field, form }) => (
                  <div
                    className={
                      field.value
                        ? 'Field HasValue'
                        : 'Field '
                    }
                  >
                    <label>Link</label>
                    <input type="text" {...field} />
                  </div>
                )}
                </Field>
                <ErrorMessage name="link">
                  {(msg) => <div className="Error">{msg}</div>}
                </ErrorMessage>
                <Field name="applicant">
                {({ field, form }) => (
                  <div
                    className={
                      field.value
                        ? 'Field HasValue'
                        : 'Field '
                    }
                  >
                  <label>Applicant</label>
                  <input type="text" {...field} />
                </div>
                )}
                </Field>
                <ErrorMessage name="applicant">
                  {(msg) => <div className="Error">{msg}</div>}
                </ErrorMessage>
                <Field name="tokenTribute">
                {({ field, form }) => (
                  <div
                    className={
                      field.value
                        ? 'Field HasValue'
                        : 'Field '
                    }
                  >
                  <label>Token Tribute</label>
                  <input type="number" {...field} />
                  </div>
                )}
                </Field>
                <ErrorMessage name="tokenTribute">
                  {(msg) => <div className="Error">{msg}</div>}
                </ErrorMessage>
                
                <Field name="sharesRequested">
                {({ field, form }) => (
                  <div
                    className={
                      field.value
                        ? 'Field HasValue'
                        : 'Field '
                    }
                  >
                  <label>Shares Requested</label>
                  <input type="number" {...field} />
                  </div>
                )}
                </Field>
                <ErrorMessage name="sharesRequested">
                  {(msg) => <div className="Error">{msg}</div>}
                </ErrorMessage>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <p className="Pad">Your ETH is empty or dangerously low.</p>
            <p className="Pad">
              If you are going to submit a proposal you need some ETH for gas
              and approved token for deposit ({proposalDeposit}). Go to your
              Account to top them off.
            </p>
            <p>
              <Link to="/account">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z" />
              </svg>
                Account
              </Link>
            </p>
            
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(withApollo(ProposalForm));
