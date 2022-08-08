import './App.css';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import ManualPage from './pages/ManualPage';
import React, { useState, useEffect } from 'react';
import handleErrors from './utils/handleErrors';
import AppContext, { TContext } from './AppContext';
import AutomaticPage from './pages/AutomaticPage';
import TPage from './types/t-page';


const App : React.FC<{}> = ({}) => {
  const [contextValue, setContextValue] = useState<TContext>({ windowId: undefined });
  const [activePage, setActivePage] = useState<TPage>(TPage.Automatic);

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

  function renderActivePage() {
    switch(activePage) {
      case TPage.Automatic:
        return <AutomaticPage />
      case TPage.Manual:
        return <ManualPage />
      default:
        return <ManualPage />
    }
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-app h-app pl-28 pr-7 overflow-scroll">
        <Header />

        <div className="flex flex-row">
          <Toolbar 
            activePage={activePage} 
            changeActivePage={(page: TPage) => setActivePage(page)}
          />       
          
          {renderActivePage()}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
