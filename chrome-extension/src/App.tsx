import './App.css';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import ManualPage from './pages/ManualPage';
import React, { useState, useEffect } from 'react';
import handleErrors from './utils/handleErrors';
import AppContext, { TContext } from './AppContext';

const App : React.FC<{}> = ({}) => {
  const [contextValue, setContextValue] = useState<TContext>({ windowId: undefined });

  /* Set up the React context containing the id of the current Chrome window.
     The window ID will be used to retrieve the state of the extension for the current window */
  useEffect(() => {
    (async () => {
      handleErrors(async () => {
        const window = await chrome.windows.getCurrent();
        setContextValue({ windowId: window.id });
      })
    })();
  }, [])

  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-app h-app pl-28 pr-7 overflow-scroll">
        <Header />

        <div className="flex flex-row">
          <Toolbar />        
          <ManualPage />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
