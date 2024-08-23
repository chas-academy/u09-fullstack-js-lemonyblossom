import logo from './logo.svg';
import './App.css';
import Register from './components/Register/Register';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
       
      </header>
      <Register />
    </div>
  );
}

export default App;
