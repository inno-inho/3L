import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/image/coconuttalk.png';

const LoginPage: React.FC = () => {
    // 1. 입력값을 담을 상태(State) 생성
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();    // context에서 login 함수 가져오기

    // 2. 로그인 버튼 클릭 시 실행될 함수
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // 페이지 새로고침 방지

        try {
            // 3. 백엔드 로그인 API 호출
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            });

            // 4. 로그인 성공 시 처리
            const { token, nickname } = response.data;

            // 5. 토큰 저장
            localStorage.setItem('accessToken', token);
            localStorage.setItem('nickname', nickname);

            await login();

            alert(`${nickname}님, 환영합니다!`);
            
            navigate('/chatPage'); 

        } catch (error: any) {
            console.error('로그인 에러:', error);
            alert(error.response?.data?.message || '로그인에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[#fff9ed] relative">
            <div className="bg-white border-2 border-[#6F4E37] w-full max-w-md rounded-md p-4 my-4" >
                <div className="flex items-center justify-center gap-1 mb-4">
                    <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                    <h1 className="text-7xl font-nerko text-[#6F4E37] tracking-tight leading-none">
                        CoconutTalk
                    </h1>
                </div>
                <div className="mb-4">
                    <form className="flex flex-col mx-3 my-1" onSubmit={handleLogin}>
                        <input 
                            type="text" 
                            placeholder='코코넛톡 계정(이메일)' 
                            className="border rounded-sm p-2 my-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input 
                            type="password"
                            placeholder='비밀번호' 
                            className="border rounded-sm p-2 my-2" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="border rounded-md p-2 my-2 hover:bg-[#6F4E37] hover:text-white">
                            로그인
                        </button>
                    </form>

                    <div className="flex items-center my-4 px-3">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 text-sm text-gray-500">또는</span>
                        <div className="flex-grow border-t border-gray-300" />
                    </div>

                    <div className="flex flex-col mb-3 mx-3">
                        <button className="border rounded-md p-2 my-2 bg-[#03A94D] text-white">Naver로 시작하기</button>
                        <button className="border rounded-md p-2 my-2 bg-[#FEE500] ">Kakao로 시작하기</button>
                        <button className="border rounded-md p-2 my-2 bg-white">Google로 시작하기</button>
                    </div>

                    <div className="flex justify-center items-center mx-auto text-sm">
                        <Link to="#" className="px-2 hover:text-gray-600 hover:underline">코코넛톡 계정 찾기</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="#" className="px-2 hover:text-gray-600 hover:underline">비밀번호 재설정</Link>
                    </div>
                </div>
                <div className="w-full mt-4 px-3 pt-4 border-t border-gray-300">
                    계정이 없으신가요?
                    <Link to="/auth/signup" className="ml-1 font-bold text-[#6F4E37] hover:underline"> 회원가입</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;