import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import ConnectionTest from './components/test/ConnectionTest';
import LoginPage from './components/user/LoginPage';
import MainLayout from './components/common/MainLayout';
import ChatPage from './components/chat/ChatPage';

const App: React.FC = () => {


  return(
    <>
      <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              {/* 홈페이지 입장하면 제일 먼저 보일 기본페이지, 로그인 페이지 */}
              <Route path='/' element={<LoginPage />} />
              
              {/* test용 */}
              <Route 
                path='/test' 
                element={
                <MainLayout>
                  <ConnectionTest />
                </MainLayout>
                }
              />

              {/* ChatPage */}
                <Route path='/chatPage' element={<MainLayout><ChatPage /></MainLayout>}/>
            </Routes>
          </AuthProvider>
        </Router>
      </div>  
    </>
  )
}

export default App;