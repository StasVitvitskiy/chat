import React, {ChangeEvent, PureComponent, SyntheticEvent} from "react";
import {auth} from '../firebase'
import firebase from "firebase/app";
import {Box, Button, CardContent} from "@material-ui/core";
import {Card, TextField} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import {Link} from 'react-router-dom'
import {connect} from "react-redux";
import {setSignInField, signIn, SignInState, WithSignInState} from "./signInReducer";
import {RouteComponentProps} from "react-router";

export const SignIn = connect(
    (state:WithSignInState): SignInState => state.signIn,
    {setSignInField, signIn} as {}
)(class extends PureComponent<
    SignInState & {
        setSignInField: typeof setSignInField,
        signIn: typeof signIn
    } & RouteComponentProps
> {
  signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    this.props.history.push('/');
  }
  handleSubmit = (e: SyntheticEvent) => {
    const {email, password, history} = this.props
    e.preventDefault();
    this.props.signIn(
        email,
        password,
        history
    )
  }
  updateField = (field: keyof SignInState) => (e: ChangeEvent<HTMLInputElement>) => {
    this.props.setSignInField(field, e.target.value)
  }
  render() {
    const {email, password, error, loading} = this.props
    return (
        <Box width='30%'>
          <Box margin='20px 0'>
              <Button variant='contained' color='primary' onClick={this.signInWithGoogle}>Sign In With Google</Button>
          </Box>
          <Card>
            <CardContent>
              <h2>Sign In</h2>
              {error && <Alert severity='error'>{error}</Alert>}
              <Box component="form" display="grid" gridRowGap="10px" width='100%' onSubmit={this.handleSubmit}>
                  <TextField
                      fullWidth
                      id='email'
                      variant='outlined'
                      label="email"
                      value={email}
                      onChange={this.updateField("email")}
                      required
                  />
                  <TextField
                      fullWidth
                      id="password"
                      variant='outlined'
                      label="password"
                      value={password}
                      onChange={this.updateField("password")}
                      required
                  />
                <Box width='120px' display='grid' justifySelf='center'>
                    <Button variant="contained" disabled={loading} color="primary" type='submit'>Sign In</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Box marginTop='10px'>
            Don't have an account? <Link to='/sign-up'>Sign Up</Link>
          </Box>
        </Box>
    )
  }
})



