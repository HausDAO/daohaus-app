import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth } from 'aws-amplify';
import GreenCheck from '../../assets/GreenCheck.svg'

const ResendCode = ({history}) => {
  const [focused, setFocused] = React.useState(false)
  const [userName, setUserName] = React.useState('')
  const [resendSuccess, setResendSuccess] = React.useState(false)
  let authError = null;
  return (
    <div className="Confirm">
      <Formik
        initialValues={{ userName: '' }}
        validate={(values) => {
          let errors = {};
          if (!values.userName) {
            errors.userName = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
           const resend = await Auth.resendSignUp(values.userName)
            setResendSuccess(resend)
            setUserName(values.userName)
          } catch (err) {
            console.log('error confirming signing up: ', err);
            authError = err;
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, values }) => {
          
          return (
              
            <Form className="Form">
              {authError &&
                <div className="Form__auth-error">{authError.message}</div>
              }
              {resendSuccess ? 
              <>
                <h2>We sent the code to your email</h2>
                <img src={GreenCheck} alt='check svg'/>
                <button type="button" onClick={()=>history.push({
  pathname: '/confirm',
  state: { userName: userName }
})}>
                Confirm
              </button>
              </>
              :<>
              <h2 className="Pad">Resend confirmation code</h2>
              
              <Field name="userName">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Pseudonym</label>
                  <input type="text" {...field} onInput={()=>setFocused(true)}/>
                </div>
              )}
              </Field>
              <ErrorMessage name="userName"  render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" className={(Object.keys(errors).length<1 && focused)?"":"Disabled"} disabled={isSubmitting}>
                Resend code
              </button></>}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(ResendCode);
