import './App.css';
import React from 'react'; // React import 추가
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

//FE작동확인을 위해 임시로 해놓은 Auth설정
import { AuthProvider, useAuth } from './context/AuthContext';




import ConnectionTest from './components/test/ConnectionTest';
import LoginPage from './components/user/LoginPage';
import MainLayout from './components/common/MainLayout';
import ChatPage from './components/chat/ChatPage';

//회원가입 컴포넌트 추가
import { SignupProvider } from "./context/SignupContext";
import SignupLayout from "./components/signup/SignupLayout";

const App: React.FC = () => {


  return (
    <>
      <div className="App">
        <Router>{/* Router : 주소를 감시하는 눈 */}
          <AuthProvider>
            {/* AuthProvider : 로그인 여부 / 유저 정보 관리 (회원가입 도중 아직 user 존재X) */}
            
            <Routes>{/*주소에 따라 화면을 갈아끼우는 표*/}

              {/* 홈페이지 입장하면 제일 먼저 보일 기본페이지, 로그인 페이지 */}
              <Route path='/' element={<LoginPage />} />

              {/* 회원가입 (URL은 하나) */}
              <Route // Route : 특정경로
                path="/auth/signup"
                element={
                  /**
                   * SignupProvider
                   * ----------------
                   * 회원가입 진행 상태(step, email 등)만 관리
                   * AuthProvider와 역할 완전히 다름
                   */
                  <SignupProvider>
                    {/*AuthProvider가 SignupProvider보다 바깥에 위치해있는 것은
                    로그인 관련 데이터는 앱 전체에서 쓰지만 
                    회원가입 데이터는 해당 주소 안에서만 쓰겠다"는 의도 */}
                    <SignupLayout />
                  </SignupProvider>
                }
              />

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
              <Route path='/chatPage' element={<MainLayout><ChatPage /></MainLayout>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div >
    </>
  )
}

export default App;