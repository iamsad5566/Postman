import React from 'react';

const TextHandler = props => {
    let index = 0;
    let template = "";
    if(props.text !== undefined)
        template = props.text;

    return ( 
        <React.Fragment>
            <span style = {{display:"inline-block", width:"60%", textAlign:"justify"}}>
                {template.split("\n").map( p => {
                    if(p.includes("<ul>")) {
                        let list = p.replace("<ul>","").split("<li>");
                        
                        return (
                            list.map( li => {
                                if(li.includes("<red>") && li.includes("<i><strong>")) {
                                    let focusArr = li.replaceAll("<red>", "").split("<i><strong>");
                                    return (
                                            <li style={{marginLeft:"3em", marginTop:"1em", color:"red"}} key={index++}>
                                                {focusArr[0]}
                                                <i>
                                                    <strong>
                                                        {focusArr[1]}
                                                    </strong>
                                                </i>
                                                {focusArr[2]}
                                            </li>
                                    ) 
                                }

                                return <li style={{marginLeft:"3em", marginTop:"1em"}} key={index++}>{li}</li>
                            } )
                        )
                    }

                    else if(p.includes("<red>")) {
                        return (
                            <span key={index++} style={{color:"red", display:"inline-block", marginTop:"1em"}}> {p.replaceAll("<red>", "")} </span>
                        )
                    }

                    return <span key={index++} style = {{display:"inline-block", marginTop:"1em"}}> {p} </span>
                } )}
            </span>
        </React.Fragment>
     );
}
 
export default TextHandler;