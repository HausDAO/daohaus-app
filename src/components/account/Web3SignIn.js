import React, {useContext} from 'react';
import { DaoServiceContext, ThemeContext } from '../../contexts/Store';

export const Web3SignIn = ({ history }) => {
    const [daoService] = useContext(DaoServiceContext);
    const [themeVariables] = useContext(ThemeContext);  

    const ThemedButton = themeVariables.StyledButton;


    return (
        <ThemedButton
            onClick={async () => {
                localStorage.setItem('loginType', 'web3');
                history.push('/dao/'+daoService.daoAddress.toLowerCase()+'/proposals');
                window.location.reload();
            }}
        >
            Sign In With Web3
    </ThemedButton>
    );
};
