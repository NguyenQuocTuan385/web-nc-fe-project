import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import { AuthState, authReducer } from './Auth';
import { StatusState, statusReducer } from './Status';
import { userReducer, UserState } from './User';
import { projectReducer, ProjectState } from './Project';
import {  paymentReducer, PaymentState } from './Payment';


const createRootReducer = (history: History) => {
  const reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    status: statusReducer,
    project: projectReducer,
    payment: paymentReducer,
    router: connectRouter(history),
  });
  return reducers;
};

export interface ReducerType {
  auth: AuthState;
  status: StatusState;
  user: UserState;
  project: ProjectState;
  router: {
    location: {
      pathname: string;
      search: string;
      hash: string;
    };
    action: string;
  };
  payment:PaymentState;
}

export default createRootReducer;
