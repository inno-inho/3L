import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ConnectionTest from './components/test/ConnectionTest';

const App: React.FC = () => {


  return(
    <>
      <div className="App"></div>
        <Router>
          <AuthProvider>
            <ConnectionTest />
          </AuthProvider>
        </Router>
    </>
  )
}

export default App;