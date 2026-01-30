import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import ConnectionTest from './components/test/ConnectionTest';
import LoginPage from './components/user/LoginPage';
import MainLayout from './components/common/MainLayout';
import ChatPage from './components/chat/ChatPage';
import { ModalProvider } from './context/ModalContext';


const App: React.FC = () => {


  return(
    <>
      <div className="App">
        
          <Router>
            <AuthProvider>
              <ModalProvider>
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
                  
                  <Route element={<MainLayout />}>
                    <Route path="/chatPage" element={<ChatPage />} />
                  </Route>

                  {/* ChatPage */}
                    {/* <Route path='/chatPage' element={<MainLayout><ChatPage /></MainLayout>}/> */}
                </Routes>
              </ModalProvider>
            </AuthProvider>
          </Router>
        
      </div>  
    </>
  )
}

export default App;