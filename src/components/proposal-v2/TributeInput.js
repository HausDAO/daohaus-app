import React, { useContext, useState, useEffect } from 'react';
import { TinyButton } from '../account/UserBalances';
import { DaoServiceContext } from '../../contexts/Store';
import Loading from '../shared/Loading';


const TributeInput = ({
    field,
    form: { touched, errors },
    token,
    ...props
}) => {
    const [unlocked, setUnlocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [daoService] = useContext(DaoServiceContext);

    const unlock = async (token) => {
        console.log('unlock ', token);
        setLoading(true);
        const ul = await daoService.token.unlock(token)
        console.log(ul);
        
        setUnlocked(true);
        setLoading(false);

        
    }

    const checkUnlocked = async (token, amount) => {
        if(amount === '' ) {
            return
        }
        console.log('check unlocked', token, amount);
        console.log('unlock props ', props);        

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
            {!unlocked && !loading && (
            <TinyButton onClick={() => unlock(token)} >
                <span>!</span> Unlock Token
            </TinyButton>
            )}
            {loading && <Loading />}
        </div>
    )
};

export default TributeInput
