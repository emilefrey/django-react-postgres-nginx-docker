import React, { Dispatch, useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { connect } from 'react-redux';
import * as actions from '../../auth/authActions';

import { useHistory, useLocation } from "react-router-dom";
import { AppProps } from '../../App';
import ValidationMessages from '../../helpers/ValidationMessages'
import { Grid, LinearProgress, Link } from '@material-ui/core';
import { APP_NAME } from '../../settings'
import { ForgotPassword } from './ForgotPassword'

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  helper: {
    margin: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2), paddingLeft: theme.spacing(4),
    color: theme.palette.primary.main,
    fontWeight: 700
  },
}));

interface LocationState {
  from: {
    pathname: string;
  };
}


function Login(props: AppProps) {
  const classes = useStyles();
  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  let history = useHistory();
  let location = useLocation<LocationState>();
  let { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (props.isAuthenticated) { history.replace(from) };
  });

  useEffect(() => {
    setValidationErrors(props.error?.response?.data)
    setIsLoading(false)
  }, [props.error])

  const handleFormFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case 'username': setuserName(event.target.value); break;
      case 'password': setPassword(event.target.value); break;
      default: return null;
    }
    setValidationErrors({})
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onAuth(username, password);
    setIsLoading(true)
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography className={classes.title} align="center" variant="h2" color="textPrimary">{APP_NAME}</Typography>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {passwordReset ? "Reset Password" : "Sign in"}
        </Typography>
        {passwordReset ? <ForgotPassword /> :
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleFormFieldChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleFormFieldChange}
            />
            <ValidationMessages validationErrors={validationErrors} />
            {isLoading && <LinearProgress color="secondary" />}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
          </Button>
          </form>
        }
        <Grid container justify="center">
          <Grid item xs={12}>
            <Grid container justify="center">
              <Link onClick={() => setPasswordReset(!passwordReset)}>
                {passwordReset ? 'Back to Login' : 'Forgot password?'}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onAuth: (username: string, password: string) => dispatch(actions.authLogin(username, password))
  }
}

export default connect(null, mapDispatchToProps)(Login);