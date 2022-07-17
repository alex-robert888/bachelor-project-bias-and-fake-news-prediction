import './App.css';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import ManualPage from './pages/ManualPage';


const App = () => {
  return (
    <div className="w-app h-app pl-28 pr-7 overflow-scroll">
      <Header />

      <div className="flex flex-row">
        <Toolbar />        
        <ManualPage />
      </div>
    </div>
  );
}

export default App;
