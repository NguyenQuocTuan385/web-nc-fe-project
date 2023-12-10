import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore, history } from 'redux/configureStore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from 'components/LoadingScreen';
import 'assets/scss/_variables.scss';
import 'react-quill/dist/quill.snow.css';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import 'moment/locale/vi'
import TagManager from 'react-gtm-module'

TagManager.initialize({
  gtmId: 'GTM-PHMMH2G'
})

const { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<LoadingScreen />} persistor={persistor}>
      <App history={history} dispatch={store.dispatch} />
    </PersistGate>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
