import React, {useState} from 'react';

const UserContext = React.createContext();
let Context = (props)=>{
    const [state, setState] = useState({});
    return <UserContext.Provider value = {{data:state, setData:setState}}>
        {props.children}
    </UserContext.Provider>
}
export default Context;
export {UserContext}
