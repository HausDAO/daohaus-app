import React from 'react';
import { TinyButton } from '../account/UserBalances';

const TributeInput = ({
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
            <TinyButton >
                <span>!</span> Unlock Token
                  </TinyButton>
            <TinyButton >
                token list
                  </TinyButton>
        </div>
    );

export default TributeInput
