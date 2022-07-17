import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {Store} from 'webext-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const proxyStore = new Store();

console.log("PROXY STORE BEFORE READY")
// proxyStore.ready().then(() => {
  console.log("PROXY STORE AFTER READY")

  root.render(
    <React.StrictMode>
      {/* <Provider store={proxyStore}> */}
        <App />
      {/* </Provider> */}
    </React.StrictMode>
  );
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
