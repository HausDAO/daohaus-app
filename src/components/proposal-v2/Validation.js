
import * as Yup from 'yup';

export const ProposalSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    description: Yup.string()
        .min(2, 'Too Short!')
        .max(2000, 'Too Long!')
        .required('Required'),
    link: Yup.string()
        .url('Invalid url')
        .required('Required'),
    applicant: Yup.string()
        .matches(/\b0x[0-9a-f]{10,40}\b/, 'Invalid Address')
        .required('Required'),
    tokenTribute: Yup.number()
        .positive('Number must positive'),
    paymentRequested: Yup.number()
        .positive('Number must positive'),
    sharesRequested: Yup.number()
        .moreThan(-1, 'Number must be 0 or positive')
        .integer('Invalid Number'),
    lootRequested: Yup.number()
        .moreThan(-1, 'Number must be 0 or positive')
        .integer('Invalid Number'),
});