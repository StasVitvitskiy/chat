import React, {ChangeEvent, SyntheticEvent, useCallback} from "react";
import {Box, Button, CardContent} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import {Card, TextField} from "@material-ui/core";
import {Link} from "react-router-dom";
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

  const handleSubmit = useCallback(
      (e: SyntheticEvent) => {
          e.preventDefault();

          dispatch(
              signUp(
                  email,
                  password,
                  confirmPassword,
              )
          )
      },
      [confirmPassword, dispatch, email, password]
  )

  return(
      <Box width='30%'>
        <Card>
          <CardContent>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert severity='error'>{error}</Alert>}
            <Box component='form' display='grid' gridRowGap='10px' onSubmit={handleSubmit}>
                <TextField
                    id="email"
                    value={email}
                    variant='outlined'
                    label='Email'
                    onChange={updateField("email")}
                    required
                />
                <TextField
                    id="password"
                    variant="outlined"
                    label="Password"
                    type='password'
                    value={password}
                    onChange={updateField("password")}
                    required
                />
                <TextField
                    id="passwordConfirm"
                    variant="outlined"
                    type='password'
                    label="Password Confirmation"
                    value={confirmPassword}
                    onChange={updateField("confirmPassword")}
                    required
                />
                <Box width='120px' display='grid' justifySelf='center'>
                    <Button variant='contained' disabled={loading} color="primary" type='submit'>Sign Up</Button>
                </Box>
            </Box>
          </CardContent>
        </Card>
        <Box marginTop='10px'>
          Already have an account? <Link to='sign-in'>Log In</Link>
        </Box>
      </Box>
  )
}
