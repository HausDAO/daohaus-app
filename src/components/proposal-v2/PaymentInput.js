import React, {useState, useEffect} from 'react';

const PaymentInput = ({
    field,
    form: { touched, errors },
    data,
    token,
    ...props
}) => {
    const [balance, setBalance] = useState(0);
    useEffect(() => {
      const runCheck = async () => {
          
        const selected = data.find((item) => item.value === token)
        if (selected) {
          setBalance(selected.balance / 10 ** selected.decimals);
        }
      };
      runCheck();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className={
            field.value !== '' ? 'Field HasValue' : 'Field '
        }>
            <label>
                {props.label}
            </label>
            <input type="number" {...field} />
            <div className="MaxLabel">
                max: {balance.toFixed(4)}
            </div>
        </div>
    )
};

export default PaymentInput
