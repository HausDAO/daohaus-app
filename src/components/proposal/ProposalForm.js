import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import shortid from 'shortid';

import { ethToWei } from '@netgum/utils'; // returns BN

import Web3Service from '../../utils/Web3Service';
import { BcProcessorService } from '../../utils/BcProcessorService';

import {
  LoaderContext,
  CurrentUserContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { GET_METADATA } from '../../utils/Queries';
import { withApollo } from 'react-apollo';
import { post } from '../../utils/Requests';

const ProposalForm = (props) => {
  const { history, client } = props;
  const { proposalDeposit, tokenSymbol } = client.cache.readQuery({
    query: GET_METADATA,
  });
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);

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
              const errors = {};
              if (!values.title) {
                errors.title = 'Required';
              }
              if (!values.description) {
                errors.description = 'Required';
              }
              if (!values.link) {
                errors.link = 'Required';
              }
              if (!values.applicant) {
                errors.applicant = 'Required';
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const web3Service = new Web3Service();
              const bcprocessor = new BcProcessorService();

              const bnZed = ethToWei(0);
              const sdk = currentUser.sdk;
              const uuid = shortid.generate();
              setLoading(true);

              try {
                const data = await daoService.submitProposal(
                  currentUser.attributes['custom:account_address'],
                  values.applicant,
                  web3Service.toWei(values.tokenTribute),
                  Math.floor(values.sharesRequested) + '',
                  `id~${uuid}~title~${values.title}`,
                  true,
                );
                const estimated = await sdk.estimateAccountTransaction(
                  daoService.contractAddr,
                  bnZed,
                  data,
                );
                if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
                  alert(
                    `you need more gas, at least: ${web3Service.fromWei(
                      estimated.totalCost.toString(),
                    )}`,
                  );
                  setLoading(false);
                  setSubmitting(false);
                  return false;
                }

                const queueLength = await daoService.getProposalQueueLength();
                const hash = await sdk.submitAccountTransaction(estimated);

                const proposalObj = {
                  proposalId: queueLength + '',
                  molochContractAddress: daoService.contractAddr,
                  title: values.title,
                  description: values.description,
                  link: values.link,
                };

                post('moloch/proposal', proposalObj);

                bcprocessor.setTx(
                  hash,
                  currentUser.attributes['custom:account_address'],
                  `Submit proposal (${values.title})`,
                  true,
                );

                setSubmitting(false);

                history.push(`/dao/${daoService.contractAddr}/proposals`);
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
                    <div className={field.value ? 'Field HasValue' : 'Field '}>
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
                    <div className={field.value ? 'Field HasValue' : 'Field '}>
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
                    <div className={field.value ? 'Field HasValue' : 'Field '}>
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
                    <div className={field.value ? 'Field HasValue' : 'Field '}>
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
                        field.value !== '' ? 'Field HasValue' : 'Field '
                      }
                    >
                      <label>
                        Token Tribute (will fail if applicant has not approved)
                      </label>
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
                        field.value !== '' ? 'Field HasValue' : 'Field '
                      }
                    >
                      <label>Shares Requested</label>
                      <input min="0" step="1" type="number" {...field} />
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
          <div className="ProposalWarning">
            <h3>Not enough Eth or {tokenSymbol} in your account.</h3>
            <p>
              <strong>
                To submit a proposal, you need the following in your account:
              </strong>
            </p>
            <ol>
              <li>
                {proposalDeposit} {tokenSymbol} for a deposit.
              </li>
              <li>
                {tokenSymbol} unlocked so the dao can use it for the deposit.
              </li>
              <li>Enough Eth to run the transaction.</li>
            </ol>
            <p>
              <strong>
                You can address any of these in your{' '}
                <Link to={`/dao/${daoService.contractAddr}/account`}>
                  Account
                </Link>{' '}
                page.
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(withApollo(ProposalForm));
