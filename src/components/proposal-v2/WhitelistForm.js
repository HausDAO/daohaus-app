import React, { useContext, useState } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormContainer, FieldContainer } from '../../App.styles';

import {
  LoaderContext,
  CurrentUserContext,
  DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { withApollo } from 'react-apollo';
import { WhiteListGuildKickSchema } from './Validation';
import shortid from 'shortid';

const WhitelistForm = () => {
  const [gloading] = useContext(LoaderContext);
  const [formLoading, setFormLoading] = useState(false);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);

  const txCallBack = (txHash, name) => {
    if (currentUser?.txProcessor) {
      currentUser.txProcessor.setTx(
        txHash,
        currentUser.username,
        name,
        true,
        false,
      );
      currentUser.txProcessor.forceUpdate = true;
      setCurrentUser({ ...currentUser });
    }
  };

  return (
    <FormContainer>
      <h1>Whitelist Token Proposal</h1>
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
              }}
              validationSchema={WhiteListGuildKickSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                console.log(values);
                setFormLoading(true);

                const uuid = shortid.generate();
                const detailsObj = JSON.stringify({
                  id: uuid,
                  title: values.title,
                  description: values.description,
                  link: values.link,
                });

                try {
                  await daoService.mcDao.submitWhiteListProposal(
                    values.applicant,
                    detailsObj,
                    txCallBack,
                  );
                  setSubmitting(false);
                  setFormLoading(false);
                  resetForm();
                } catch (err) {
                  console.log('cancelled');
                  setSubmitting(false);
                  setFormLoading(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="Form">
                  <Field name="title">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Ticker</label>
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
                        <textarea rows="5" {...field} />
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

                  <Field name="applicant">
                    {({ field, form }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Token Address</label>
                        <input type="text" {...field} />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage name="applicant">
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
    </FormContainer>
  );
};

export default withApollo(WhitelistForm);
