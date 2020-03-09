import React, { useContext, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import shortid from 'shortid';
import { weiToEth, anyToBN, ethToWei } from '@netgum/utils';

import {
  LoaderContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { GET_METADATA, GET_ACTIVE_PROPOSALS_QUERY } from '../../utils/Queries';
import { withApollo, useQuery } from 'react-apollo';

import ValueDisplay from '../shared/ValueDisplay';

const ProposalForm = (props) => {
  const { history, client } = props;
  const { proposalDeposit, 
    tokenSymbol,
    totalShares,
    guildBankValue, } = client.cache.readQuery({
    query: GET_METADATA,
  });
  const [gloading] = useContext(LoaderContext);
  const [loading, setLoading] = useState(false);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);
  const [estimatedProposalValue, setEstimatedProposalValue] = useState(0);

  const { loading: activeProposalsLoading, error, data } = useQuery(
    GET_ACTIVE_PROPOSALS_QUERY,
  );

  const calculateEstimatedProposalValue = (
    numSharesRequested,
    tokenTribute,
  ) => {
    let guildBankValuePlusPending = ethToWei(guildBankValue).add(ethToWei(tokenTribute));
    let totalSharesPlusPending = totalShares + +numSharesRequested;
    for (const proposal of data.proposals) {
      // if proposal is likely passing, add tribute and shares
      if (+proposal.yesVotes > +proposal.noVotes) {
        guildBankValuePlusPending.add(anyToBN(proposal.tokenTribute));
        totalSharesPlusPending += +proposal.sharesRequested;
      }
    }

    const estimatedShareValue = parseFloat(
      weiToEth(
        anyToBN(guildBankValuePlusPending)
          .div(anyToBN(totalSharesPlusPending)),
      ),
    );

    const estimatedProposal = estimatedShareValue * numSharesRequested;
    return estimatedProposal;
  };

  if (activeProposalsLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {loading && <Loading />}
      {gloading && <Loading />}

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

              const estimated = calculateEstimatedProposalValue(values.sharesRequested, values.tokenTribute);
              setEstimatedProposalValue(estimated);

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const uuid = shortid.generate();
              setLoading(true);
              try {
                await daoService.mcDao.submitProposal(
                  values.applicant,
                  ethToWei(values.tokenTribute.toString()),
                  values.sharesRequested + '',
                  JSON.stringify({
                    id: uuid,
                    title: values.title,
                    description: values.description,
                    link: values.link,
                  }),
                );
              } catch (e) {
                console.error(`Error processing proposal: ${e.toString()}`);
              } finally {
                console.log('done it it');

                setSubmitting(false);
                setLoading(false);
                history.push(`/dao/${daoService.daoAddress}/success`);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="Form">
                <h3>Proposal deposit: <ValueDisplay value={proposalDeposit} /></h3>
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
                      <label>Applicant Ethereum Address</label>
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
                      <input min="0" type="number" {...field} />
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
                <span>
                  {' '}
                  Estimated Value: <ValueDisplay value={estimatedProposalValue} />
                </span>
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
                <Link to={`/dao/${daoService.daoAddress}/account`}>
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
