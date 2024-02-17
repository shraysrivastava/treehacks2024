import React, {useState} from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

export const Auth = () => {  

  const [hasAccount, setHasAccount] = useState(true);

  if (!hasAccount) {
    return (<SignUp setHasAccount={setHasAccount}/>);
  } else {
    return (<SignIn setHasAccount={setHasAccount}/>);
  }
};