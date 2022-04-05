import React, { Component } from 'react';
import authenticationService from '../../api/authenticationService';
import manipulateData from '../../api/manipulateData';

class PostmanManager extends Component {
    state = { 
        toList:[],
        dateList:[],
        nameList:[],
        emailAccount:"",
        subject:"",
        sent:false,
        finished:false,
        allGood:true,
        wrong:false,
        reSent:false,
        registered:true,
        warnAccount:false,
        warnSubject:false,
        mustStop:false,
        totalNum:0,
        curr:0,
        notSent:[]
     }

    handleChange = event => {
        this.setState( {[event.target.name]: event.target.value} );
    }

    handleInputFile = event => {
        let file = event.target.files[0];
        let reader = new FileReader();
        if(file !== undefined) {
            reader.readAsText(file);
            reader.onload = () => {
                if(reader.result.includes("PDF") || reader.result.includes("xml")) {
                    this.setState({mustStop:true});
                } else {
                    this.setState({mustStop:false});
                }
                    
                let text = reader.result.split("\r\n");
                let tmpToArr = [];
                let tmpDateArr = [];
                let tmpNameArr = [];
                let toIndex = 0;
                let dateIndex = 0;
                let nameIndex = 0;
                
                for(let i = 0; i < text.length; i++) {
                    let textEachRow = text[i].split(",");
                    if(i === 0) {    // First row contains "name", "date", "mail"
                        for(let j = 0; j < textEachRow.length; j++) {
                            if(textEachRow[j].includes("mail")) {
                                toIndex = j;
                            }

                            if(textEachRow[j].includes("date")) {
                                dateIndex = j;
                            }

                            if(textEachRow[j].includes("name")) {
                                nameIndex = j;
                            }
                        }

                        continue;
                    }

                    tmpToArr.push(textEachRow[toIndex]);
                    tmpDateArr.push(textEachRow[dateIndex]);
                    tmpNameArr.push(textEachRow[nameIndex]);
                }

                this.setState({toList:tmpToArr});
                this.setState({dateList:tmpDateArr});
                this.setState({nameList:tmpNameArr});
                this.setState({totalNum:tmpToArr.length});
            }
        }
    }

    handleSubmitForm = event => {
        event.preventDefault();
        let data = this.props;
        let tmpNotSent = [];
        let tmpSent = [];
        let len = this.state.toList.length;
        
        if(this.state.mustStop) {
            this.setState({reSent:true});
            return;
        }

        if(this.state.emailAccount.length === 0) {
            this.setState({warnAccount:true});
            return;
        }
        
        if(this.state.subject.length === 0) {
            this.setState({warnSubject:true});
            return;
        }

        if(len > 0) {
            this.setState({sent:true});
        }
        else if(len === 0 || len >= 500){
            this.setState({reSent:true});
            return;
        }

        // Check if the account has registered
        let keepGoing = false;
        manipulateData.checkGmail(this.state.emailAccount)
        .then( response => {
            keepGoing = response.data;
            this.setState({registered:response.data});
        } )
        
        .then( () => {
            if(keepGoing) {
                this.setState({reSent:false});
                this.setState({warnAccount:false});
                this.setState({warnSubject:false});

                for(let i = 0; i < len; i++) {
                    manipulateData.postman(this.state.emailAccount, this.state.subject, this.state.toList[i], this.state.dateList[i], this.state.nameList[i], data.text, data.index)
                    .then(
                        response => {
                            if(response.data === 1) {
                                tmpSent.push(this.state.toList[i]);
                                let current = this.state.curr;
                                this.setState({curr:current+1});
                            } else {
                                tmpNotSent.push(this.state.toList[i]);
                                this.setState({notSent:tmpNotSent});
                                this.setState({allGood:false});
                            }
                        }
                    )
                    
                    .then( () => {
                        if(this.state.curr === len) {
                            this.setState({finished:true});
        
                            if(tmpSent.length === 0)
                                this.setState({wrong:true});
                        }
                    } )
                }
            } else {
                return;
            }
        } )
        
    }

    componentDidMount() {
        if(authenticationService.isUserLoggedIn()) {
            let token = authenticationService.createJWTToken(sessionStorage.getItem(this.state.adminUser));
            authenticationService.setupAxiosInterceptor(token);
        } else {
            authenticationService.executeJWTAuthenticationService("guest", "guest")
            .then( response => {
                authenticationService.registerSuccessfulLogin("guest", response.data.token);
            })
        }
    }

    render() { 
        const {emailAccount, subject, sent, curr, totalNum, notSent, finished, allGood, reSent, wrong, registered, warnAccount, warnSubject} = this.state;
        let progression = 100 * (curr/totalNum).toFixed(2);
        let barLen = progression.toString() + "%";
        let errorIndex = 0;

        return (
            <React.Fragment>
                <form style ={{textAlign:"center", marginTop:"4em"}} onSubmit={this.handleSubmitForm}>
                    <span>
                        <label htmlFor="file" id = "select">
                            <input style={{width:"100%"}} type="file" className="form-control form-control-sm" id="formFileSm" onChange={this.handleInputFile} />
                        </label>
                    </span>

                    <span style = {{display:"block", marginTop:"4em"}}>
                        <label>
                            Account:　
                            <input type="text" name = "emailAccount" value = {emailAccount} onChange = {this.handleChange} autoComplete="off"/>
                        </label>
                    </span>

                    <span style = {{display:"block", marginTop:"0.5em", marginLeft:"0.3em"}}>
                        <label>
                            Subject:　
                            <input type="text" name = "subject" value = {subject} onChange = {this.handleChange} autoComplete="off"/>
                        </label>
                    </span>

                    <div style={{marginTop:"1em"}}>
                        <button type = "submit" className="btn btn-success m-2" style={{borderRadius:"2em"}}> Send </button>
                    </div>
                </form>

                {reSent?
                    <p style={{color:"red"}}>Please upload csv file!</p>:<></>
                }

                {warnAccount?
                    <div className="alert alert-warning" style = {{marginTop:"2em"}}> Please provide your account! </div>:<></>
                }

                {warnSubject?
                    <div className="alert alert-warning" style = {{marginTop:"2em"}}> Please provide subject of the mail! </div>:<></>
                }

                {!registered?
                    <React.Fragment>
                        <div className="alert alert-danger" style = {{marginTop:"2em"}}> Please register first or</div>
                        <div className="alert alert-danger"> check if there's any type error!</div>
                    </React.Fragment>
                    :<></>
                }

                {sent? 
                    <div className="progress" style={{marginTop:"3em", height:"3em"}}>
                        <div className="progress-bar" role="progressbar" style={{width:barLen, fontSize:"2em"}} aria-valuenow={barLen} aria-valuemin="0" aria-valuemax="100">{barLen}</div>
                    </div>:<></>}

                {finished && allGood?
                    <div className="alert alert-success" style = {{marginTop:"2em"}}> Sent! </div>:<></>}

                {finished && !allGood?
                    <div style = {{marginTop:"2em"}}> Not sent list: {notSent.map( mail => {
                        return <div key={errorIndex++}> {mail} </div>;
                    } )}</div>:<></>}

                {finished && wrong?
                    <div style={{color:"red"}}>Can't send!</div>:<></>}

            </React.Fragment>
        );
    }
}
 
export default PostmanManager;