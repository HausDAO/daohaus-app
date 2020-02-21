import React, { useContext, useState } from 'react';
import { TinyButton } from '../account/UserBalances';
import { DaoServiceContext } from '../../contexts/Store';

const TributeInput = ({
    field,
    form: { touched, errors },
    token,
    ...props
}) => {
    const [unlocked, setUnlocked] = useState(false)
    const [daoService] = useContext(DaoServiceContext);

    const unlock = (token) => {
        daoService.token.unlock(token)
            .on("transactionHash", (txHash) => {
                console.log('txhash, txhash');
            }).on('receipt', () => {
                setUnlocked(true);
            });
    }

    const isUnlocked = async (token, amount) => {
        console.log('check allownace', token);
        if(!amount) {
            return
        }

        const isUnlocked = await daoService.token.allowance(token)
        console.log('isUnlocked', isUnlocked);
        
        setUnlocked(isUnlocked);
    }

//await isUnlocked(token, field.value)
    return (
        <div className={
            field.value !== '' ? 'Field HasValue' : 'Field '
        }>
            <label>
                {props.label}
            </label>
            <input type="number" onBlur={() => console.log('test')} {...field} />
            {!unlocked && (
            <TinyButton onClick={() => unlock(token)} >
                <span>!</span> Unlock Token
            </TinyButton>
            )}
        </div>
    )
};

export default TributeInput
