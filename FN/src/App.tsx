import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import ConnectionTest from './components/test/ConnectionTest';
import NoticeForm from './components/notice/NoticeForm';
import NoticeList from './components/notice/NoticeList';
import NoticeDetail from './components/notice/NoticeDetail';
import LoginPage from './components/user/LoginPage';
import MainLayout from './components/common/MainLayout';
import ChatPage from './components/chat/ChatPage';

import SettingsLayout from './components/settings/SettingsLayout';
import Profile from './components/settings/Profile';
import Security from './components/settings/Security';
import CustomerCenter from './components/settings/CustomerCenter';


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
                <Route path="/notices" element={<NoticeList />} />
                <Route path="/notices/write" element={<NoticeForm />} />
                <Route path="/notices/:id" element={<NoticeForm />} />
                <Route path="/notices/:id" element={<NoticeDetail />} />

                <Route path="/settings" element={<SettingsLayout />} >
                  <Route index element={<Navigate to="profile" replace />} /> {/* settings로 들어왔을 때 자동으로 settings/profile로 들어옴 */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="security" element={<Security />} />
                  <Route path="support" element={<CustomerCenter />} />
                </Route>
                {/* test용 */}
                <Route path='/test' element={<ConnectionTest />} />

                <Route path='/chatPage' element={<ChatPage />} />
                
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