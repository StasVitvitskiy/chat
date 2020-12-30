import React, {ChangeEvent, SyntheticEvent, useCallback} from "react";
import {Form, Button, Card, Alert} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {signUpStateSelector} from "./signUpSelectors";
import {setSignUpField, signUp, SignUpState} from "./signUpReducer";

export function SignUp() {
  const {email, password, confirmPassword, error, loading} = useSelector(signUpStateSelector)
  const dispatch = useDispatch()
  const updateField = useCallback(
      (field: keyof SignUpState) => (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(
            setSignUpField(field, e.target.value)
        )
      },
      [dispatch]
  )
  const history = useHistory();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    dispatch(
        signUp(
            email,
            password,
            confirmPassword,
            history
        )
    )
  }

  return(
      <div>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={updateField("email")} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={updateField("password")} required/>
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={updateField("confirmPassword")} required/>
              </Form.Group>
              <Button disabled={loading} className="w-100" type='submit'>Sign Up</Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to='sign-in'>Log In</Link>
        </div>
      </div>
  )
}