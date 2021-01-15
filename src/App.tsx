import React from 'react';
import './App.css';
import {AuthProvider} from "./authContext";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {SignIn} from './SignIn'
import {ChatRoom} from './chatRoom'
import {Box} from '@material-ui/core'
import {SignUp} from "./SignUp";
import {Provider} from "react-redux";
import {store} from "./store";
import {AuthenticatedUser, NonAuthenticatedUser} from "./User";
import {PersonalInfo} from "./personalInfo";

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <AuthProvider>
                <section>
                        <Router>
                            <AuthenticatedUser>
                                <Switch>
                                    <Route exact path='/'>
                                        <ChatRoom/>
                                    </Route>
                                    <Route exact path='/personal-info'>
                                        <PersonalInfo />
                                    </Route>
                                </Switch>
                            </AuthenticatedUser>
                            <NonAuthenticatedUser>
                                <Box display='flex' justifyContent='center' alignItems='center'>
                                    <Switch>
                                        <Route exact path="/sign-in" component={SignIn} />
                                        <Route exact path="/sign-up" component={SignUp} />
                                        <Route>
                                            <Redirect to='/sign-in' />
                                        </Route>
                                    </Switch>
                                </Box>
                            </NonAuthenticatedUser>
                        </Router>
                </section>
            </AuthProvider>
        </div>
    </Provider>
  );
}

export default App;
