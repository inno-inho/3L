import { useNavigate } from "react-router-dom";
import { useSignup } from "../../context/SignupContext";
// 로고 이미지 import
import logo from "../../assets/image/coconuttalk.png";

const SignupStart = () => {
  const { setStep } = useSignup();
  const navigate = useNavigate();

  // 소셜 로그인 핸들러 (나중에 API 연결)
  const handleSocialLogin = (platform: string) => {
    console.log(`${platform} 로그인 시도`);
    // window.location.href = `현재_백엔드_주소/oauth2/authorization/${platform}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      {/* 메인 카드 박스 */}
      <div className="w-[573px] bg-[#FDF8F3] border-3 border-[#743F24] pt-4 pb-4 px-0 flex flex-col items-center shadow-sm">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3 mb-12 mt-4">
          <img src={logo} alt="logo" className="w-14 h-14" />
          <h1 className="text-5xl font-black text-[#6F4E37] tracking-tighter italic">
            CoconutTalk
          </h1>
        </div>

        {/* 이메일 회원가입 버튼 */}
        <button
          className="w-[435px] h-[60px] flex items-center justify-center bg-[#743F24] text-white text-2xl font-extrabold tracking-widest rounded shadow-md mb-8 hover:bg-[#5a3e2b] transition-colors"
          onClick={() => setStep("TERMS")}
        >
          회원가입
        </button>

        {/* 구분선 */}
        <div className="w-[435px] flex items-center gap-4 mb-8">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-400 font-bold text-sm">또는</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

{/* 5. 소셜 로그인 버튼 리스트 (넓이 362px 고정 및 중앙 정렬) */}
        <div className="w-full flex flex-col items-center gap-3">
          <button 
            onClick={() => handleSocialLogin('kakao')}
            className="w-[362px] h-[52px] bg-[#FEE500] text-[#3c1e1e] font-bold rounded-lg flex items-center justify-center gap-3 shadow-sm hover:opacity-90"
          >
            <span className="text-lg">💬</span> 카카오로 시작하기
          </button>
          
          <button 
            onClick={() => handleSocialLogin('naver')}
            className="w-[362px] h-[52px] bg-[#03C75A] text-white font-bold rounded-lg flex items-center justify-center gap-3 shadow-sm hover:opacity-90"
          >
            <span className="text-xl font-black">N</span> 네이버로 시작하기
          </button>

          <button 
            onClick={() => handleSocialLogin('google')}
            className="w-[362px] h-[52px] bg-white border border-gray-300 text-gray-600 font-bold rounded-lg flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="google" />
            Google로 시작하기
          </button>
        </div>

        <p className="mt-8 text-[10px] text-gray-400 text-center leading-tight">
          가입하면 CoconutTalk의 약관, 데이터 정책 및 쿠키 정책에 동의하게 됩니다.
        </p>
      </div>

      {/* 하단 로그인 이동 박스 */}
      <div className="w-full max-w-[573px] bg-[#FDF8F3] border-3 border-[#743F24] mt-4 py-6 text-center shadow-sm">
        <span className="text-gray-600">계정이 있으신가요? </span>
        <button
          onClick={() => navigate("/")}
          className="text-[#6F4E37] font-bold hover:underline"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default SignupStart;