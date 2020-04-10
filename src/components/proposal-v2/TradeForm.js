import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  FormContainer,
  FieldContainer,
  DropdownInputDiv,
} from '../../App.styles';

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
import { ProposalSchema } from './Validation';
import shortid from 'shortid';
import TokenSelect from './TokenSelect';
import { valToDecimalString } from '../../utils/Helpers';
import { GET_MOLOCH_V2 } from '../../utils/QueriesV2';

const H2Arrow = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.primary};
`;

const TradeForm = (props) => {
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
  const query = GET_MOLOCH_V2;

  const { loading, error, data } = useQuery(query, options);

  // get whitelist
  useEffect(() => {
    if (data && data.moloch) {
      console.log('set', data);

      setTokenData(
        data.moloch.tokenBalances
          .reverse()
          .filter((token) => token.guildBank)
          .map((token) => ({
            label: token.symbol || token.tokenAddress,
            value: token.token.tokenAddress,
            decimals: token.decimals,
            balance: token.tokenBalance,
          })),
      );
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) {
    console.log('error', error);
  }

  return (
    <FormContainer>
      <h1>Trade Proposal</h1>
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
                  valToDecimalString(
                    values.tributeOffered,
                    values.tributeToken,
                    tokenData,
                  ),
                  values.tributeToken,
                  valToDecimalString(
                    values.paymentRequested,
                    values.paymentToken,
                    tokenData,
                  ),
                  values.paymentToken,
                  detailsObj,
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
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Title</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="title">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>
                  <Field name="description">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Short Description</label>
                        <textarea {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="description">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>
                  <Field name="link">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Link</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="link">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <DropdownInputDiv>
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
                  </DropdownInputDiv>
                  <ErrorMessage name="tributeOffered">
                    {(msg) => (
                      <div className="Error">Tribute Offered: {msg}</div>
                    )}
                  </ErrorMessage>
                  <ErrorMessage name="tributeToken">
                    {(msg) => <div className="Error">Tribute Token: {msg}</div>}
                  </ErrorMessage>

                  <ErrorMessage name="tributeOffered">
                    {(msg) => <div className="Error">{msg}</div>}
                  </ErrorMessage>

                  <H2Arrow>↓</H2Arrow>

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

export default withRouter(withApollo(TradeForm));
