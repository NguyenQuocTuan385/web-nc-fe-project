import LoadingScreen from 'components/LoadingScreen';
import Login from 'pages/Authentication/Login';
import Register from 'pages/Authentication/Register';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import ResetPassword from 'pages/Authentication/ResetPassword';
import ProjectManagement from 'pages/ProjectManagement';
import CreateProject from 'pages/ProjectManagement/CreateProject';
import Survey from 'pages/SurveyNew';
import { Suspense } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { routes } from './routes';
import ScrollToTop from './ScrollToTop';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import CallbackActiveUser from 'pages/Callback/User/Active';
import Admin from 'pages/Admin';
import CallbackInvoice from 'pages/Callback/Project/Invoice';
import AdminRoute from './AdminRoute';
import CallbackCreateProject from 'pages/Callback/Project/Create';
import InvalidResetPassword from 'pages/Authentication/InvalidResetPassword';
import CallbackForgotPassword from 'pages/Callback/User/ForgotPassword';
import HomePage from 'pages/Home';
import AccountPage from 'pages/Account';
import PaymentHistory from 'pages/PaymentHistory';
import OnePayCallback from 'pages/Callback/Project/OnePay';
import OnePayAgainLinkCallback from 'pages/Callback/Project/OnePayAgainLink';
import OnePayCallbackPaymentSchedule from 'pages/Callback/Project/OnePayPaymentSchedule';
import OnePayPaymentScheduleAgainLinkCallback from 'pages/Callback/Project/OnePayPaymentScheduleAgainLink';
import CallbackTryCreateProject from 'pages/Callback/Project/Try';
import VerifyEmail from 'pages/Authentication/VerifyEmail';

const Routers = () => {

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ScrollToTop/>
      <Switch>
        <Route exact path={routes.callback.project.create} component={CallbackCreateProject}/>
        
        <Route exact path={routes.callback.try.project.create} component={CallbackTryCreateProject}/>
        
        <PublicRoute exact path={routes.login} component={Login}/>
        <PublicRoute exact path={routes.register} component={Register}/>
        <PublicRoute exact path={routes.forgotPassword} component={ForgotPassword}/>
        <PublicRoute exact path={routes.resetPassword} component={ResetPassword}/>
        <PublicRoute exact path={routes.invalidResetPassword} component={InvalidResetPassword}/>
        <PublicRoute exact path={routes.callback.user.forgotPassword} component={CallbackForgotPassword}/>
        <PublicRoute exact path={routes.callback.user.active} component={CallbackActiveUser}/>
        <PublicRoute exact path={routes.verifyEmail} component={VerifyEmail}/>
        
        <PrivateRoute exact path={routes.callback.project.onePay} component={OnePayCallback}/>
        <PrivateRoute exact path={routes.callback.project.onePayAgainLink} component={OnePayAgainLinkCallback}/>
        <PrivateRoute exact path={routes.callback.project.onePayPaymentSchedule} component={OnePayCallbackPaymentSchedule}/>
        <PrivateRoute exact path={routes.callback.project.onePayPaymentScheduleAgainLink} component={OnePayPaymentScheduleAgainLinkCallback}/>
        <PrivateRoute exact path={routes.callback.project.invoice} component={CallbackInvoice}/>
        <PrivateRoute path={routes.account.root} component={AccountPage}/>
        <PrivateRoute path={routes.paymentHistory} component={PaymentHistory}/>
        <PrivateRoute exact path={routes.project.management} component={ProjectManagement} isAllowGuest/>
        <PrivateRoute exact path={routes.project.create} component={CreateProject} isAllowGuest/>
        <PrivateRoute path={routes.project.detail.root} component={Survey} isAllowGuest/>
        
        <AdminRoute path={routes.admin.root} component={Admin}/>
        <PublicRoute exact path={routes.homePage} component={HomePage}/>
        <Redirect to={routes.login} />
      </Switch>
    </Suspense>
  );
};

export default Routers;
