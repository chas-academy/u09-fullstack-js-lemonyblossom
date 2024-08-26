import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './components/LoginRegister/Register';
import Login from './components/LoginRegister/Login';
import logo from './logo.svg';  

function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        
       
      </header>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} /> {/* Redirect to login as the default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
