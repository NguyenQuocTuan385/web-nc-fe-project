import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from 'config/themes';
import { useSelector } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { ReducerType } from 'redux/reducers';
import './App.scss';
import styled from 'styled-components';
import { ConnectedRouter } from 'connected-react-router';
import AppStatus from 'components/AppStatus';
import Routers from 'routers';
import { useEffect } from 'react';
import { getMe } from 'redux/reducers/User/actionTypes';
import { History } from 'history';
import { I18nextProvider } from 'react-i18next';
import i18n from 'locales';
import { langSupports } from 'models/general';
import { Helmet } from 'react-helmet';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import moment from 'moment';
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
interface AppProps {
  history: History;
  dispatch: Dispatch<AnyAction>;
}

const AppContainer = styled.div`
  background-color: #ffffff;
  height: 100%;
`;

const App = ({ history, dispatch }: AppProps) => {
  const theme = defaultTheme;
  const isLoadingAuth = useSelector((state: ReducerType) => state.status.isLoadingAuth)

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  useEffect(() => {
    if (!i18n.language) return
    if (!langSupports.find(lang => lang.key === i18n.language)) {
      i18n.changeLanguage(langSupports[0].key)
    }
    moment.locale(i18n.language)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <AppContainer>
                <ConnectedRouter history={history}>
                  <AppStatus />
                  <Helmet>
                    <title>Cimigo RapidSurvey</title>
                  </Helmet>
                  {!isLoadingAuth && <Routers />}
                </ConnectedRouter>
              </AppContainer>
            </I18nextProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
