import React, { useState } from 'react';

const Expandable = ({ children, label }) => {

    const [isShowing, setIsShowing] = useState(false);

    return (isShowing
        ? (<div>{children}</div>)
        : (<button onClick={() => setIsShowing(!isShowing)}>+ {label || ''}</button>));
}
export default Expandable;
