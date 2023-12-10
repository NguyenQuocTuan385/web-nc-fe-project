import { Alert, Snackbar } from '@mui/material';
import LoadingScreen from 'components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { setSuccessMess, clearErrorMess } from 'redux/reducers/Status/actionTypes';

export const AppStatus = () => {
  const dispach = useDispatch()
  const status = useSelector((state: ReducerType) => state.status);

  return (
    <>
      {(status.isLoading || status.isLoadingAuth) && <LoadingScreen />}
      <Snackbar
        open={!!status.error}
        autoHideDuration={7000}
        onClose={() => dispach(clearErrorMess(undefined))}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => dispach(clearErrorMess(undefined))}
          severity="error"
        >
          {status.error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!status.success}
        autoHideDuration={7000}
        onClose={() => dispach(setSuccessMess(undefined))}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => dispach(setSuccessMess(undefined))}
          severity="success"
          sx={{ backgroundColor: "var(--cimigo-green)", color: '#293306', fontWeight: 500 }}
        >
          {status.success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppStatus;
