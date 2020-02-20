import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ethToWei } from '@netgum/utils'; // returns BN

import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
    LoaderContext, DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { withApollo } from 'react-apollo';
import TributeInput from './TributeInput';
import Expandable from '../shared/Expandable';
import { ProposalSchema } from './Validation';
import shortid from 'shortid';
import TokenSelect from './TokenSelect';

const NewMemberForm = (props) => {
    // const { history } = props;

    const [gloading] = useContext(LoaderContext);
    const [loading, setLoading] = useState(false);
    const [daoService] = useContext(DaoServiceContext);

    // get whitelist
    const data = [{label: 'Weth', value: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'}];

    return (
        <div>
            <h1 className="Pad">New Member Proposal</h1>
            <div>
                {loading && <Loading />}
                {gloading && <Loading />}

                <div>

                    <Formik
                        initialValues={{
                            title: '',
                            description: '',
                            link: '',
                            applicant: '',
                            tributeOffered: 0,
                            tributeToken: '',
                            paymentRequested: 0,
                            sharesRequested: 0,
                            lootRequested: 0,
                        }}
                        validationSchema={ProposalSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            console.log(values);
                            const uuid = shortid.generate();
                            const detailsObj = JSON.stringify({
                                id: uuid,
                                title: values.title,
                                description: values.description,
                                link: values.link,
                            })


                            // submitProposal(
                            //     applicant,
                            //     sharesRequested,
                            //     lootRequested,
                            //     tributeOffered,
                            //     tributeToken,
                            //     paymentRequested,
                            //     PaymentToken,
                            //     details,

                            const submitRes = await daoService.mcDao.submitProposal(
                                values.applicant,
                                values.sharesRequested,
                                values.lootRequested,
                                ethToWei(values.tributeOffered.toString()), // this needs to convert on token decimal length not just wei
                                values.tributeToken,
                                0,
                                "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
                                detailsObj
                            )

                            console.log('submitRes', submitRes);

                            setSubmitting(false);
                            setLoading(false);



                        }}
                    >
                        {({ isSubmitting }) => (
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
                                <Field name="tributeOffered" component={TributeInput} label="Token Tribute"></Field>
                                <Field name="tributeToken" component={TokenSelect} label="Token Tribute" data={data}></Field>

                                <ErrorMessage name="tributeOffered">
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
                                <Expandable label='LOOT'>
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
                                <button type="submit" disabled={isSubmitting}>
                                    Submit
                            </button>
                            </Form>
                        )}
                    </Formik>

                </div>
            </div>
        </div>
    );
};

export default withRouter(withApollo(NewMemberForm));
