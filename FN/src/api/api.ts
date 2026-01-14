import axios from 'axios';

import type { 
    AxiosInstance,
    InternalAxiosRequestConfig, 
    AxiosResponse, 
    AxiosError, 
    Axios 
} from 'axios'; // 타입(Type) 전용

// 확장된 설정 타입을 위한 인터페이스 (무한 루프 방지용 _retry flag)
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig{
    _retry?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: '/api', // 실제 요청 주소, Vite proxy 설정에 의해 http://localhost:8080/api/notices로 변환됨
    withCredentials: true, // 쿠키를 요청에 포함
    timeout: 10000, // 10초 이상 응답 없으면 에러
    headers: { "Content-Type": "application/json" },
})

// 토큰 재발급 엔드포인트
const REFRESH_URL = '/reissue';

// -----------------------------------
// 요청 인터셉터
// -----------------------------------
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const publicPaths = ['/login', '/join']; // 인증이 필요 없는 경로
        if (publicPaths.some(path => config.url?.includes(path))){ // 요청 URL이 로그인/회원가입이면 그대로 통과
            return config;
        }

        // 여기서 보통 Authorization 헤더 추가, accessToken 붙이기 같은 작업 

        return config;
    },
    (error: Axios) => {
        console.error("[오류-요청 인터셉터]", error);
        return Promise.reject(error);
    }
);

// -----------------------------------------
// 응답 인터셉터
// -----------------------------------------
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // 백엔드 응답 구조에 맞게 수정
        // 백엔드에서 auth=false 라고 내려주면 "로그인 안 된 상태"라고 판단
        if (response.data?.auth === false){
            window.location.href = '/login';
            return Promise.reject(new Error('세션이 만료되었습니다. '));
        }
        return response; // 문제 없으면 응답 그대로 반환
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;
        const status = error.response?.status;

        // 401 에러 및 토큰 재발급 로직 : 401 + 아직 재시도 X + 재발급 요청이 아닐때 
        if (status === 401 &&  originalRequest.url !== REFRESH_URL && originalRequest.url !== REFRESH_URL && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지

            try{
                // Refresh Token으로 AccessToken 재발급
                await api.post(REFRESH_URL, null);
                console.log("Access Token 재발급 성공")

                return api(originalRequest);    // 기존 요청 재시도 
            } catch(refreshError){
                console.error("Refresh Token 만료, 로그인 필요");
                
                if (window.location.pathname !== '/login'){
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        // 기타 에러 처리
        if(error.response){
            switch (status){
                case 400: console.error("잘못된 요청 (400)"); break;
                case 403: console.error("권한 없음 (403)"); break;
                case 404: console.error("리소스를 찾을 수 없음 (404)"); break;
                case 500: console.error("서버 내부 에러 (500)"); break;
            }
        } else if (error.request){
            console.error("네트워크 오류 또는 서버 응답 없음");
        }

        return Promise.reject(error);
    }
);

export default api;