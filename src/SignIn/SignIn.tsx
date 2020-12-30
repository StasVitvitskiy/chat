import React, {ChangeEvent, PureComponent, SyntheticEvent} from "react";
import {auth} from '../firebase'
import firebase from "firebase/app";
import Button from "react-bootstrap/Button";
import {Alert, Card, Form} from "react-bootstrap";
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
        <div>
          <Button variant='outline-primary' onClick={this.signInWithGoogle}>Sign In With Google</Button>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign In</h2>
              {error && <Alert variant='danger'>{error}</Alert>}
              <Form onSubmit={this.handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={this.updateField("email")} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={this.updateField("password")} required/>
                </Form.Group>
                <Button disabled={loading} className="w-100" type='submit'>Sign In</Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Don't have an account? <Link to='/sign-up'>Sign Up</Link>
          </div>
        </div>
    )
  }
})



