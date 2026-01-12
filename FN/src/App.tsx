import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ConnectionTest from './components/test/ConnectionTest';
import NoticeForm from './components/notice/NoticeForm';
import MainLayout from './components/common/MainLayout';
import LoginPage from './components/user/LoginPage';

const App: React.FC = () => {


  return(
    <>
      <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              {/* 홈페이지 입장하면 제일 먼저 보일 기본페이지, 로그인 페이지 */}
              <Route path='/' element={<LoginPage />} />
              <Route element={<MainLayout />} >
                <Route path="/notices" element={<NoticeForm />} />

                {/* test용 */}
                <Route path='/test' element={<ConnectionTest />} />

                {/* <Route path='/chatPage' element={<ChatPage />} /> */}
                
              </Route>
              {/* 없는 주소 접근 시 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
              
          </AuthProvider>
        </Router>
      </div>
    </>
  )
}

export default App;