import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import * as settings from '../../settings';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Container, CssBaseline, LinearProgress, TextField, Typography } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { AppProps } from '../../App';
import { PasswordUpdateError } from '../../interfaces/axios/AxiosError';
import ValidationMessages from '../../helpers/ValidationMessages'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.success.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  success: {
    color: theme.palette.success.main,
  }
}));


function PasswordUpdate(props: AppProps) {
  const classes = useStyles();
  const [new_password1, setNewPassword1] = useState("");
  const [new_password2, setNewPassword2] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleFormFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    switch (event.target.id) {
      case 'new_password1': setNewPassword1(event.target.value); break;
      case 'new_password2': setNewPassword2(event.target.value); break;
      case 'old_password': setOldPassword(event.target.value); break;
      default: return null;
    }
    setValidationErrors({})
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    if (new_password1 !== new_password2) {
      setValidationErrors({ "error": ["Passwords do not match!"] })
    } else if (new_password1 === "") {
      setValidationErrors({ "error": ["Password can't be blank!"] })
    }
    else {
      let headers = { 'Authorization': `Token ${props.token}` };
      const method = 'POST';
      let url = settings.API_SERVER + '/api/auth/change_password/';
      let passwordFormData = new FormData();
      passwordFormData.append("old_password", oldPassword);
      passwordFormData.append("new_password1", new_password1);
      passwordFormData.append("new_password2", new_password2);
      let config: AxiosRequestConfig = { headers, method, url, data: passwordFormData };
      //Axios update_password API call
      axios(config).then((res: any) => {
        setSuccess(true);
      }).catch(
        (error: PasswordUpdateError) => {
          setValidationErrors(error?.response?.data)
        })
    }
    setIsLoading(false)
  }

  const passwordsMatch = new_password1 === new_password2

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {success ? <Typography variant="button" className={classes.success} gutterBottom>Password update successful!</Typography> : null}
        <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>
        {!success ?
          <>
            <Typography component="h1" variant="h5">
              Update Password
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="old_password"
                label="Old Password"
                type="password"
                id="old_password"
                onChange={handleFormFieldChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="new_password1"
                label="Enter New Password"
                type="password"
                id="new_password1"
                onChange={handleFormFieldChange}
                error={!passwordsMatch}
                helperText={!passwordsMatch ? "Passwords do not match" : null}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="new_password2"
                label="Enter Your Password Again"
                type="password"
                id="new_password2"
                onChange={handleFormFieldChange}
                error={!passwordsMatch}
                helperText={!passwordsMatch ? "Passwords do not match" : null}
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
                Update Password
          </Button>
            </form>
          </> :
          <Button
            fullWidth
            variant="contained"
            color="primary"
            href="/"> Return Home
          </Button>
        }
      </div >
    </Container >
  );
}


export default PasswordUpdate;