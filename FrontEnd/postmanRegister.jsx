import React, { useState } from 'react';
import NavBar from '../../nav/nav';
import Notice from './notice';
import RegisterPage from './registerPage';

const PostmanRegister = () => {
    const [agree, setAgree] = useState(false);

    const handleAgreement = () => {
        setAgree(true);
    }

    return ( 
        <React.Fragment>
            <NavBar/>
            {agree? <RegisterPage/>:<Notice handleAgreement = {handleAgreement}/>}
            
        </React.Fragment>
     );
}
 
export default PostmanRegister;