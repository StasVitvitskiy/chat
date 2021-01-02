import React from 'react';
import './App.css';
import {AuthProvider} from "./authContext";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {SignIn} from './SignIn'
import {SignOut} from "./SignOut";
import {ChatRoom} from './chatRoom'
import {Container} from 'react-bootstrap'
import {SignUp} from "./SignUp";
import {Provider} from "react-redux";
import {store} from "./store";
import {AuthenticatedUser, NonAuthenticatedUser} from "./User";

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <AuthProvider>
                <section>
                    <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                        <Router>
                            <AuthenticatedUser>
                                <Switch>
                                    <Route exact path='/'>
                                        <ChatRoom/>
                                        <SignOut/>
                                    </Route>
                                </Switch>
                            </AuthenticatedUser>
                            <NonAuthenticatedUser>
                                <div className="w-100" style={{maxWidth: "400px"}}>
                                    <Switch>
                                        <Route exact path="/sign-in" component={SignIn} />
                                        <Route exact path="/sign-up" component={SignUp} />
                                        <Route>
                                            <Redirect to='/sign-in' />
                                        </Route>
                                    </Switch>
                                </div>
                            </NonAuthenticatedUser>
                        </Router>
                    </Container>
                </section>
            </AuthProvider>
        </div>
    </Provider>
  );
}

export default App;
