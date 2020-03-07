import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  LoaderContext,
  DaoServiceContext,
  DaoDataContext,
  CurrentUserContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { withApollo, useQuery } from 'react-apollo';
import TributeInput from './TributeInput';
import PaymentInput from './PaymentInput';
import Expandable from '../shared/Expandable';
import { ProposalSchema } from './Validation';
import shortid from 'shortid';
import TokenSelect from './TokenSelect';
import { GET_TOKENS_V2 } from '../../utils/QueriesV2';

const FundingForm = (props) => {
  const { history } = props;

  const [gloading] = useContext(LoaderContext);
  const [formLoading, setFormLoading] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);
  const [currentUser] = useContext(CurrentUserContext);

  const options = {
    variables: { contractAddr: daoData.contractAddress },
    client: daoData.altClient,
    fetchPolicy: 'no-cache',
  };
  const query = GET_TOKENS_V2;

  const { loading, error, data } = useQuery(query, options);

  // get whitelist
  useEffect(() => {
    if (data && data.moloch) {
      console.log('set');

      setTokenData(
        data.moloch.approvedTokens.reverse().map((token) => ({
          label: token.symbol || token.tokenAddress,
          value: token.tokenAddress,
          decimals: token.decimals,
        })),
      );
    }
  }, [data]);

  const valToDecimal = (value, tokenAddress, tokens) => {
    const tdata = tokens.find((token) => token.value === tokenAddress);
    const decimals = +tdata.decimals;

    return '' + value * 10 ** decimals;
  };

  if (loading) return <Loading />;
  if (error) {
    console.log('error', error);
  }

  return (
    <div>
      <h1 className="Pad">Funding Proposal</h1>
      <div>
        {formLoading && <Loading />}
        {gloading && <Loading />}

        <div>
          {tokenData.length && currentUser.username ? (
            <Formik
              initialValues={{
                title: '',
                description: '',
                link: '',
                applicant: '',
                tributeOffered: 0,
                tributeToken: tokenData[0].value,
                paymentRequested: 0,
                paymentToken: tokenData[0].value,
                sharesRequested: 0,
                lootRequested: 0,
              }}
              validationSchema={ProposalSchema}
              onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                setFormLoading(true);
                setSubmitting(true);

                const uuid = shortid.generate();
                const detailsObj = JSON.stringify({
                  id: uuid,
                  title: values.title,
                  description: values.description,
                  link: values.link,
                });

                await daoService.mcDao.submitProposal(
                  values.sharesRequested,
                  values.lootRequested,
                  valToDecimal(
                    values.tributeOffered,
                    values.tributeToken,
                    tokenData,
                  ),
                  values.tributeToken,
                  valToDecimal(
                    values.paymentRequested,
                    values.paymentToken,
                    tokenData,
                  ),
                  values.paymentToken,
                  detailsObj,
                  values.applicant,
                );

                setSubmitting(false);
                setFormLoading(false);
                history.push(`/dao/${daoService.daoAddress}/success`);
              }}
            >
              {({ isSubmitting, ...props }) => (
                <Form className="Form">
                  <Field name="title">
                    {({ field, form }) => (
                      <div
                        className={field.value ? 'Field HasValue' : 'Field '}
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
                        className={field.value ? 'Field HasValue' : 'Field '}
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
                        className={field.value ? 'Field HasValue' : 'Field '}
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
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Applicant Address</label>
                        <input type="text" {...field} />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="applicant">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <div className="DropdownInput">
                    <Field
                      name="paymentRequested"
                      component={PaymentInput}
                      label="Payment Requested"
                    ></Field>
                    <Field
                      name="paymentToken"
                      component={TokenSelect}
                      label="Payment Token"
                      data={tokenData}
                    ></Field>
                  </div>

                  <ErrorMessage name="paymentRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>
                  <Expandable label="LOOT">
                    <Field name="lootRequested">
                      {({ field, form }) => (
                        <div
                          className={
                            field.value !== '' ? 'Field HasValue' : 'Field '
                          }
                        >
                          <label>Loot Requested</label>
                          <input min="0" step="1" type="number" {...field} />
                        </div>
                      )}
                    </Field>
                  </Expandable>
                  <ErrorMessage name="lootRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>
                  <Expandable label="SHARES">
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
                  </Expandable>
                  <ErrorMessage name="sharesRequested">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>
                  <Expandable label="TRIBUTE">
                    <div className="DropdownInput">
                      <Field
                        name="tributeOffered"
                        component={TributeInput}
                        label="Token Tribute"
                        token={props.values.tributeToken}
                      ></Field>
                      <Field
                        name="tributeToken"
                        component={TokenSelect}
                        label="Token Tribute"
                        data={tokenData}
                      ></Field>
                    </div>
                    <ErrorMessage name="tributeOffered">
                      {(msg) => (
                        <div className="Error">Tribute Offered: {msg}</div>
                      )}
                    </ErrorMessage>
                    <ErrorMessage name="tributeToken">
                      {(msg) => (
                        <div className="Error">Tribute Token: {msg}</div>
                      )}
                    </ErrorMessage>
                  </Expandable>
                  <ErrorMessage name="tributeOffered">
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
    </div>
  );
};

export default withRouter(withApollo(FundingForm));
