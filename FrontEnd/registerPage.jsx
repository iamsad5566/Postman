import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authenticationService from '../../api/authenticationService';
import manipulateData from '../../api/manipulateData';

var num = 5;
const RegisterPage = () => {
    const navigate = useNavigate();

    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegestered] = useState(false);
    const [counting, setCounting] = useState(num);
    const [warning, setWarning] = useState(false);
    const [type, setType] = useState("password");

    const handleAccountChange = event => {
        setAccount(event.target.value);
    }

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    }

    const handleTypeAlternate = () => {
        if(type === "text")
            setType("password");
        else if(type === "password")
            setType("text");
    }

    const handleSubmitForm = event => {
        event.preventDefault();
        if(account.length === 0 || password.length === 0) {
            setWarning(true);
            return;
        }

        setWarning(false);
        
        // login to the backend
        if(authenticationService.isUserLoggedIn()) {
            let token = authenticationService.createJWTToken(sessionStorage.getItem(this.state.adminUser));
            authenticationService.setupAxiosInterceptor(token);
        } else {
            authenticationService.executeJWTAuthenticationService("guest", "guest")
            .then( response => {
                authenticationService.registerSuccessfulLogin("guest", response.data.token);
            })
        }
        
        // Sent to backend SQL
        manipulateData.gmailRegister(account, password)
        .then( response => {
            if(response.status === 200) {
                setRegestered(true);

                // Redirect
                let counter = setInterval( () => {
                    if(num > 0) {
                        num--;
                        console.log(num);
                        setCounting(num);
                    } else {
                        clearInterval(counter);
                        return navigate("/testing/postman");
                    }
                    
                }, 1000)
            }
        } )
    }

    return ( 
        <React.Fragment>
            <div style={{marginTop:"7em", textAlign:"center"}}>
                <h2>Please follow the instruction step by step:</h2>
                <span style={{marginTop:"2em", display:"inline-block", textAlign:"justify", width:"66%", lineHeight:"1.5em"}}>
                    <ol>
                        <li> Get your application password first, please see the driscription on google to get that password, and <span style={{color:"red"}}>REMEMBER</span> it. Here's the link to google page. <a href="https://support.google.com/accounts/answer/185833?hl=en" target = "_blank" rel="noreferrer" style={{color:"green"}}> <button className='btn btn-dark btn-sm'>Link</button> </a> </li>
                        <li style={{marginTop:"1em"}}> Fill in the input area with your Google account (Both with or without @gmail.com are fine) and the application password you just got. Press Register, if successful, the button color will turn green, done!</li>
                        <li style={{marginTop:"1em"}}> After the registration, you won't be asked to input the application password any longer. </li>
                    </ol>
                <div></div>
                <span style={{textAlign:"right"}}>
                    <form style={{marginTop:"3em"}} onSubmit={handleSubmitForm}>
                        <label style={{padding:"0.5em"}}> Gmail Account:
                            <input name = "account" value={account} style={{marginLeft:"1em"}} onChange={handleAccountChange} autoComplete="off"/>
                        </label>
                        <div></div>
                        <label style={{padding:"0.5em"}}> Password:
                            <input name = "password" value={password} type={type} style={{marginLeft:"1em"}} onChange={handlePasswordChange} autoComplete="off"/>
                            <button onClick={handleTypeAlternate} type="button" style={{border:"none", background:"none", position:"absolute", marginLeft:"-1.5em"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                            </button>
                        </label>
                        
                        <div></div>
                        <label style={{padding:"0.5em"}}>
                           <button className = {registered? "btn btn-success":"btn btn-info"} style={{width:"120px", height:"120px", borderRadius:"50%"}} type="submit"> <span style={{color:"white"}}>Register</span> </button>
                        </label>
                            
                    </form>
                </span>
                </span>
                
                {registered?
                    <p>Redirecting... {counting} seconds</p>:<></>}

                {warning?
                    <div className="alert alert-danger" style = {{marginTop:"2em"}}> Gmail Account and Password can't be empty! </div>:<></>
                }
            </div>
        </React.Fragment>
     );
}
 
export default RegisterPage;