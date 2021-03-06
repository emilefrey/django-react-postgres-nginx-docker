import React, { Dispatch, useContext, useEffect } from 'react';
import Router from './routes/Router';
import Layout from './components/Layout/Layout';
import { connect } from 'react-redux';
import * as actions from './auth/authActions';
import { PrivateRouteProps } from './routes/PrivateRoute';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, ThemeProvider } from '@material-ui/core';
import { theme } from './Theme'
import { AlertContext } from './contexts/AlertContext';
import Alert from '@material-ui/lab/Alert';
import { AxiosError } from './interfaces/axios/AxiosError'
import { ThemeContext } from './contexts/ThemeContext';
import { useLocation } from "react-router-dom";
import { DialogContext } from './contexts/DialogContext';


type Error = {
  message: string
  response: {
    data: Record<string, string[]>
  }
}
export interface AuthProps {
  logout: Function
  setAuthenticatedIfRequired: Function
  onAuth: Function
  token: string
  error: Error
}

export interface AppProps extends AuthProps, PrivateRouteProps { }

function App(props: AppProps) {

  const { alertType, openAlert, alertMessage, handleAlertClose } = useContext(AlertContext);
  const { showDialog, dialogTitle, dialogBody, dialogActions, handleDialogClose } = useContext(DialogContext);
  const { darkMode } = useContext(ThemeContext);
  const palletType = darkMode ? "dark" : "light"
  const location = useLocation().pathname

  useEffect(() => {
    props.setAuthenticatedIfRequired();
  }, [props]);

  useEffect(() => {
    handleAlertClose()
  }, [location])

  return (
    <div className="App">
      <ThemeProvider theme={theme(palletType)}>
        <Layout {...props} >
          <Router {...props} />
        </Layout>
        <Snackbar id="appAlertSnackbar" open={openAlert} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert variant="filled" onClose={handleAlertClose} severity={alertType}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <Dialog maxWidth="md" fullWidth open={showDialog} onClose={handleDialogClose} aria-labelledby="alert-dialog-title">
          <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            {dialogBody}
          </DialogContent>
          <DialogActions>
            {dialogActions}
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}

interface MapStateToPropsInterface {
  auth: {
    token: string,
    error: AxiosError
  }
}

//This means that one or more of the redux states in the store are available as props
const mapStateToProps = (state: MapStateToPropsInterface) => {
  return {
    isAuthenticated: state.auth.token !== null && typeof state.auth.token !== 'undefined',
    token: state.auth.token,
    error: state.auth.error
  }
}

//This means that one or more of the redux actions in the form of dispatch(action) combinations are available as props
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setAuthenticatedIfRequired: () => dispatch(actions.authCheckState()),
    logout: () => dispatch(actions.authLogout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
