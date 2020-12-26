import React, {SyntheticEvent, useState} from "react";
import {auth} from '../firebase'
import firebase from "firebase/app";
import Button from "react-bootstrap/Button";
import {Alert, Card, Form} from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'

export function SignIn() {
  const { signin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if(signin) {
        await signin(email,password);
        setLoading(false)
        history.push('/')
      }
    } catch {
      setError("Failed to sign in")
      setLoading(false)
    }
  }

  return (
      <div>
        <Button variant='outline-primary' onClick={signInWithGoogle}>Sign In With Google</Button>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign In</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={input => setEmail(input.target.value)} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
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



