import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import ConnectionTest from './components/test/ConnectionTest';
<<<<<<< HEAD
import NoticeForm from './components/notice/NoticeForm';
import NoticeList from './components/notice/NoticeList';
import MainLayout from './components/common/MainLayout';
import LoginPage from './components/user/LoginPage';
=======
import LoginPage from './components/user/LoginPage';
import MainLayout from './components/common/MainLayout';
import ChatPage from './components/chat/ChatPage';
>>>>>>> origin/dev

const App: React.FC = () => {


  return(
    <>
      <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              {/* 홈페이지 입장하면 제일 먼저 보일 기본페이지, 로그인 페이지 */}
              <Route path='/' element={<LoginPage />} />
<<<<<<< HEAD
              <Route element={<MainLayout />} >
                <Route path="/notices" element={<NoticeList />} />
                <Route path="/notices/write" element={<NoticeForm />} />
                

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
=======
              
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
>>>>>>> origin/dev
    </>
  )
}

export default App;