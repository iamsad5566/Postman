import React from 'react';
import NavBar from '../../nav/nav';

const Notice = props => {
    const handleAgreement = props.handleAgreement;

    return ( 
        <React.Fragment>
            <NavBar/>
            <div style={{marginTop:"7em", textAlign:"center"}}>
                <h2>Register you Gmail on this website</h2>
                <p>Before the registration, please note the following points:</p>
                <span style={{display:"inline-block", textAlign:"justify", width:"66%"}}>
                    <ul>
                        <li> The owner of this website won't use your Gmail application password to do anything without your agreement. </li>
                        <li style={{marginTop:"1em"}}> Also, the owner of this website won't take responsibility for any leak of your account. I only keep the data so that I could provide service to you.</li>
                        <li style={{marginTop:"1em"}}> Your account would be basically safe, all the transports on this website are encrypted. However, there's always possibility gotten hacked, if there's any suspicious activity on your Gmail account, please don't be hesitate to delete the application password. </li>
                        <li style={{marginTop:"1em"}}> Pleas contact the owner of this website if you have any further question or concern.</li>
                        <li style={{marginTop:"1em"}}> If you know the risk and are willing to register your Gmail account on this website, please press the Agree button below to start the process.</li>
                    </ul>
                </span>
                <div style={{marginTop:"2em", display:"block"}}></div>
                <button type="button" className="btn btn-primary" style={{borderRadius:"35px"}} onClick={handleAgreement}>Agree</button>
                
            </div>
        </React.Fragment>
     );
}
 
export default Notice;