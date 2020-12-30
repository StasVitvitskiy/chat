import React from 'react';
import './App.css';
import {auth} from './firebase'
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {SignIn} from './SignIn'
import {SignOut} from "./SignOut";
import {ChatRoom} from './chatRoom'
import {useAuthState} from 'react-firebase-hooks/auth'
import {Container} from 'react-bootstrap'
import {SignUp} from "./SignUp";
import {Provider} from "react-redux";
import {store} from "./store";

function App() {
  const [user] = useAuthState(auth);
  console.log("USER: ", user)

  return (
    <Provider store={store}>
        <div className="App">
            <AuthProvider>
                <section>
                    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                        <Router>
                            <Switch>
                                <Route exact path='/'>
                                    {user ? <div><ChatRoom/> <SignOut/></div>: <Redirect to='/sign-in' />}
                                </Route>
                                <div className="w-100" style={{maxWidth: "400px"}}>
                                    <Route exact path="/sign-in" component={SignIn} />
                                    <Route exact path="/sign-up" component={SignUp} />
                                </div>
                            </Switch>
                        </Router>
                    </Container>
                </section>
            </AuthProvider>
        </div>
    </Provider>
  );
}

export default App;
