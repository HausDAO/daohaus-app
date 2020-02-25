import React from 'react';
import { TinyButton } from '../account/UserBalances';

const PaymentInput = ({
    field,
    form: { touched, errors },
    ...props
}) => (
        <div className={
            field.value !== '' ? 'Field HasValue' : 'Field '
        }>
            <label>
                {props.label}
            </label>
            <input type="number" {...field} />

        </div>
    );

export default PaymentInput
