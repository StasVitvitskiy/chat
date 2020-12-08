import React from 'react';
import './App.css';
import {auth} from './firebase'
import {AuthProvider} from "./contexts/AuthContext";

import {SignIn, ChatRoom, SignOut} from './SignIn/SignIn'
import {useAuthState} from 'react-firebase-hooks/auth'
import {SignUp} from './SignUp/SignUp'
import {Container} from 'react-bootstrap'

function App() {
  const [user] = useAuthState(auth);
  console.log("USER: ", user)

  return (
    <div className="App">
        <AuthProvider>
            <section>
                {user ? <ChatRoom /> :
                    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                        <div className="w-100" style={{maxWidth: "400px"}}>
                            <SignIn /> <SignUp />
                        </div>
                    </Container>}
                <SignOut/>
            </section>
        </AuthProvider>
    </div>
  );
}

export default App;
