import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ethToWei } from '@netgum/utils'; // returns BN

import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
    LoaderContext, DaoServiceContext, DaoDataContext, CurrentUserContext,
    // DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { withApollo, useQuery } from 'react-apollo';
import TributeInput from './TributeInput';
import PaymentInput from './PaymentInput';
import { ProposalSchema } from './Validation';
import { GET_TOKENS_V2 } from '../../utils/QueriesV2';
import TokenSelect from './TokenSelect';
import shortid from 'shortid';

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
        fetchPolicy: 'no-cache'
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
                })),
            );
        }
    }, [data]);

    if (loading) return <Loading />;
    if (error) {
        console.log('error', error);
    }

    return (
        <div>
            <h1 className="Pad">Trade Proposal</h1>
            <div>
                {formLoading && <Loading />}
                {gloading && <Loading />}

                <div>
                    {currentUser.username && (
                        <Formik
                            initialValues={{
                                title: '',
                                description: '',
                                link: '',
                                applicant: '',
                                tributeOffered: 0,
                                paymentRequested: 0,
                                paymentToken: 0,
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

                                try {
                                    //TODO: this needs to be for trades
                                    await daoService.mcDao.submitProposal(
                                        values.sharesRequested,
                                        values.lootRequested,
                                        ethToWei(values.tributeOffered.toString()), // this needs to convert on token decimal length not just wei
                                        values.tributeToken,
                                        ethToWei(values.paymentRequested.toString()), // this needs to convert on token decimal length not just wei
                                        values.paymentToken,
                                        detailsObj,
                                    );
                                    
                                    history.push(`/dao/${daoService.daoAddress}/proposals`);
                                    setSubmitting(false);
                                    setFormLoading(false);
                                } catch (err) {
                                    console.log('cancelled');
                                    setSubmitting(false);
                                    setFormLoading(false);
                                }

                            }}
                        >
                            {({ isSubmitting, ...props }) => (
                                <Form className="Form">
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
                                        {(msg) => <div className="Error">{msg}</div>}
                                    </ErrorMessage>

                                    <div className="DropdownInput">
                                        <Field
                                            name="paymentRequested"
                                            component={PaymentInput}
                                            label="Payment Requested"></Field>
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


                                    <button type="submit" disabled={isSubmitting}>
                                        Submit
                            </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </div >
    );
};

export default withRouter(withApollo(TradeForm));
