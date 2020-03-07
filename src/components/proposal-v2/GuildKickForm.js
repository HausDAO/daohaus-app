import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentUserContext,
  // DaoServiceContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

import { withApollo } from 'react-apollo';
import { WhiteListGuildKickSchema } from './Validation';
import shortid from 'shortid';

const GuildKickForm = (props) => {
  const { history } = props;

  const [gloading] = useContext(LoaderContext);
  const [formLoading, setFormLoading] = useState(false);
  const [currentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);

  return (
    <div>
      <h1 className="Pad">GuildKick Member Proposal</h1>
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
              onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                const uuid = shortid.generate();
                const detailsObj = JSON.stringify({
                  id: uuid,
                  title: values.title,
                  description: values.description,
                  link: values.link,
                });

                try {
                  await daoService.mcDao.submitGuildKickProposal(
                    values.applicant,
                    detailsObj,
                  );
                  setSubmitting(false);
                  setFormLoading(false);
                  history.push(`/dao/${daoService.daoAddress}/success`);
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
                        <label>Member Address</label>
                        <input type="text" {...field} />
                      </div>
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
    </div>
  );
};

export default withRouter(withApollo(GuildKickForm));
