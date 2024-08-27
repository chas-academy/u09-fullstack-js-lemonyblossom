import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoute/ProtectedRoutes';
import './App.css';
import Register from './components/LoginRegister/Register';
import Login from './components/LoginRegister/Login';
import Logs from './components/Logs/Logs'; 
import LogForm from './components/Logs/LogForm';
import Profile from './components/Profile/Profile';
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
          <Route element={<ProtectedRoutes />}>

          <Route path="/logs" element={<Logs />} /> 
          <Route path="/add-log" element={<LogForm />} />
          <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Login />} /> {/* Redirect to login as the default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
