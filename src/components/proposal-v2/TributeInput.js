import React, {useContext} from 'react';
import { TinyButton } from '../account/UserBalances';
import { DaoServiceContext } from '../../contexts/Store';

const TributeInput = ({
    field,
    form: { touched, errors },
    token,
    ...props
}) => {
    
    const [daoService] = useContext(DaoServiceContext);

    const approve = (token) => {
        daoService.token.unlock(10, token)
    }
    
    
    return (
        <div className={
            field.value !== '' ? 'Field HasValue' : 'Field '
        }>
            <label>
                {props.label}
            </label>
            <input type="number" {...field} />
            <TinyButton onClick={() => approve(token)}>
                <span>!</span> Unlock Token
            </TinyButton>
        </div>
    )};

export default TributeInput
