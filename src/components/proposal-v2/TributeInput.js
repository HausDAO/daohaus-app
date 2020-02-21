import React, { useContext, useState, useEffect } from 'react';
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

    const checkUnlocked = async (token, amount) => {
        if(amount === '' ) {
            return
        }

        const amountApproved = await daoService.token.unlocked(token)
        const isUnlocked = amountApproved > amount;        
        setUnlocked(isUnlocked);
    }

    useEffect(()=>{
        const runCheck = async () => {            
            await checkUnlocked(token, field.value)
            return true;
        };
        runCheck();
        
    }, [])
    

    return (
        <div className={
            field.value !== '' ? 'Field HasValue' : 'Field '
        }>
            <label>
                {props.label}
            </label>
            <input type="number" {...field} {...props}
                                onBlur={e => {                                    
                                    field.onBlur(e);
                                    checkUnlocked(token, field.value)
                                    }}/>
            {!unlocked && (
            <TinyButton onClick={() => unlock(token)} >
                <span>!</span> Unlock Token
            </TinyButton>
            )}
        </div>
    )
};

export default TributeInput
