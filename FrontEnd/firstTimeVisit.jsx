import React from 'react';
import { Link } from 'react-router-dom';

const FirstTimeVisit = () => {
    const attention = "Since Google has chaged the privacy policies, if it is your first time using this APP, please register your Gmail on this website first so that the APP can be authorized to log in your google account with an App password. You can finish your registration by clicking the button below and following the instruction then."

    const styleForAttentionBox = {
        marginTop:"7em",
        textAlign:"center",
    }

    const styleForAttentionP = {
        marginTop:"0.5em",
        display:"inline-block",
        width:"20em",
        textAlign:"justify"
    }

    const styleForButton = {
        borderRadius:"50% 50% 50% 50% / 100% 0% 100% 0%",
        color:"gray"
        
    }

    return ( 
        <React.Fragment>
            <div style = {styleForAttentionBox}>
                <h1 style = {{color:"red"}}> Attention </h1>
                <span style = {styleForAttentionP}> {attention} </span>
                <div style = {{marginTop:"2em"}}>
                    <Link to = "register" style = {styleForButton} className="btn btn-warning"> Register </Link>
                </div>
                
            </div>
        </React.Fragment>
     );
}
 
export default FirstTimeVisit;