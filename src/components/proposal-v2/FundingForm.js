import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
    LoaderContext,
    // DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { withApollo } from 'react-apollo';
import TributeInput from './TributeInput';
import Expandable from '../shared/Expandable';
import PaymentInput from './PaymentInput';
import { ProposalSchema } from './Validation';

const FundingForm = (props) => {
    // const { history } = props;

    const [gloading] = useContext(LoaderContext);
    const [loading,] = useState(false);
    //const [daoService] = useContext(DaoServiceContext);

    return (
        <div>
            <h1 className="Pad">Funding Proposal</h1>
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
                            paymentRequested: 0,
                            sharesRequested: 0,
                            lootRequested: 0,
                        }}
                        validationSchema={ProposalSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            console.log(values);

                            // const uuid = shortid.generate();
                            // setLoading(true);
                            // try {
                            //     await daoService.mcDao.submitProposal(
                            //         values.applicant,
                            //         ethToWei(values.tributeOffered.toString()),
                            //         values.sharesRequested + '',
                            //         JSON.stringify({
                            //             id: uuid,
                            //             title: values.title,
                            //             description: values.description,
                            //             link: values.link,
                            //         }),
                            //     );


                            //     history.push(`/dao/${daoService.daoAddress}/proposals`);
                            // } catch (e) {
                            //     console.error(`Error processing proposal: ${e.toString()}`);
                            // } finally {
                            //     console.log('done it it');

                            //     setSubmitting(false);
                            //     setLoading(false);
                            // }
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

                                <Field name="paymentRequested" component={PaymentInput} label="Payment Requested"></Field>


                                <ErrorMessage name="paymentRequested">
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
                                <Expandable label='SHARES'>
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
                                <Expandable label='TRIBUTE'>
                                    <Field name="tributeOffered" component={TributeInput} label="Token Tribute"></Field>
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

                </div>
            </div>
        </div>
    );
};

export default withRouter(withApollo(FundingForm));
