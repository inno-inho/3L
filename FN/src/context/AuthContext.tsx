import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react'; // 타입 전용 임포트 분리

import api from '../api/api';

// 사용자 정보 타입 정의 (임의로)
interface User {
  email: string;              // ID
  nickname: string;           // 화면에 표시될 이름
  profileImageUrl?: string;   // 프로필 이미지 경로(카멜 케이스 권장)
  statusMessage?: string;     // 상태 메시지 또는 접속 상태
  role: "USER" | 'ADMIN';     // 권한
  // emailVerified: boolean;   // 인증 여부에 따른 기능 제한 처리용    
  // 필요한 필드있다면 추가
}

// Context가 제공할 값들의 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;  // 로그인 했는지
  user: User | null;  // 유저 정보
  isLoading: boolean; // 초기 인증 체크 중인지 여부
  login: () => Promise<void>; // 로그인 시 상태 업데이트 함수
  logout: () => Promise<void>;  // 로그아웃 함수
}

// 초기값 설정 (undefined로 시작하여 Provider 없이 사용 시 에러 방지)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>({
    email: "test@example.com",
    nickname: "채팅 개발자",
    role: "USER",
    profileImageUrl: "https://via/placeholder.com/150"
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);


  // 사용자 정보 조회 함수(재사용을 위해 useCallback 사용)
  const fetchUserInfo = useCallback(async (): Promise<User | null> => {
    try {
      // 프록시(/api)를 사용하므로 baseURL이 적용된 api 인스턴스 사용
      const response = await api.get<User>('/user');    // GET /api/user
      setUser(response.data);
      setIsLoggedIn(true);  // 정보 조회 성공 시 로그인 상태도 true로 변경
      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패: ", error);
      setUser(null);
      setIsLoggedIn(false);
      return null;
    }
  }, []);

  // 앱 실행 시 최초 1회 인증 상태 체크
  useEffect(() => {
    console.log("개발 모드, 가짜 유저 정보 사용 중: " + user?.nickname);
  }, []);

  // 로그인 상태 갱신 함수
  const login = async () => {
    try {
      const userInfo = await fetchUserInfo();
      if(userInfo) setIsLoggedIn(true);
    } catch (error) {
      console.error("로그인 후 정보 로드 실패:", error);
      setIsLoggedIn(false);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await api.post('/logout');    // POST /api/logout, 세션/쿠키 무효화
    } catch (error) {
      console.error("로그아웃 요청 실패(세션 이미 만료 등):", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("accessToken"); // 토큰 삭제
      window.location.href = '/';  // 로그인 화면으로 이동
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthProvider 내부에서 사용해야 합니다');
  }
  return context;
};

