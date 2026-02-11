import { useNavigate } from "react-router-dom";
import { useSignup } from "../../context/SignupContext";
// 로고 이미지 import
import logo from "../../assets/image/coconuttalk.png";

const SignupStart = () => {
  const { setStep } = useSignup();
  const navigate = useNavigate();

  // 소셜 인증 핸들러 : 로그인과 회원가입을 동시에 처리함 (추후에 API 연결예정)
  /* [나중의 동작 방식]
    1. 사용자를 각 플랫폼(카카오/구글 등)의 인증 주소로 리다이렉트 시킴
    2. 인증 성공 후 우리 서버는 사용자의 고유 식별값(Social ID)을 받음
    3. 우리 DB에 해당 ID가 없다면 자동 '회원가입', 있다면 '로그인'으로 처리됨
    
    따라서 '소셜 로그인' 버튼 하나로 '소셜 가입'까지 모두 해결됨
            ⚠️소셜 가입만으로는 사용자의 '닉네임'이나 '전화번호'를 다 가져오지 못할 수도 있기에
               소셜 가입 직후 "추가 정보 입력 페이지"로 이동시켜 정보를 마저 받도록 설계하기도 함⚠️
  */
  const handleSocialLogin = (platform: string) => {
    console.log(`${platform} 인증 프로세스 시작`);
    // API 연동 예시: 
    // window.location.href = `http://localhost:8080/oauth2/authorization/${platform}`;  
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      {/* 1. 메인 카드 박스*/}
      <div className="w-[500px] min-h-[600px] bg-[#FDF8F3] border-[3px] border-[#743F24] pt-16 pb-0 px-0 flex flex-col items-center justify-between shadow-sm rounded-md">
        <div className="flex flex-col items-center w-full">
          {/* 2. 로고 영역:*/}
          <div className="w-[435px] flex items-center justify-center gap-1 mb-5 mt-5">
            <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
            <h1 className="font-normal text-7xl text-[#6F4E37] tracking-[-0.06em] leading-none drop-shadow-[0.5px_0.5px_0px_#6F4E37] font-nerko">
              CoconutTalk
            </h1>
          </div>

          {/* 3. 이메일 회원가입 버튼*/}
          <button
            className="w-[380px] h-[60px] flex items-center justify-center bg-white tracking-widest rounded shadow-md mb-8 hover:bg-[#743F24] transition-colors"
            onClick={() => setStep("TERMS")}
          >
            이메일로 회원가입
          </button>

          {/* 구분선 */}
          <div className="w-[380px] flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-gray-400 font-bold text-sm">또는</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* 5. 소셜 로그인 버튼 리스트 (넓이 362px 고정 및 중앙 정렬) */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="w-[300px] h-[45px] bg-[#FEE500] text-[#3c1e1e] font-bold rounded-lg flex items-center justify-center gap-3 shadow-sm hover:opacity-90"
            >
              <span className="text-lg">💬</span> 카카오로 시작하기
            </button>

            <button
              onClick={() => handleSocialLogin('naver')}
              className="w-[300px] h-[45px] bg-[#03C75A] text-white font-bold rounded-lg flex items-center justify-center gap-3 shadow-sm hover:opacity-90"
            >
              <span className="text-xl font-black">N</span> 네이버로 시작하기
            </button>

            <button
              onClick={() => handleSocialLogin('google')}
              className="w-[300px] h-[45px] bg-white border border-gray-300 text-gray-600 font-bold rounded-lg flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="google" />
              Google로 시작하기
            </button>
          </div>
        </div>



        {/* 하단 안내 텍스트: justify-between 덕분에 박스의 pb-10 지점까지 바짝 내려갑니다 */}
        <p className="text-[10px] text-gray-400 text-center leading-tight pb-4">
          가입하면 <span className="font-bold">CoconutTalk</span>의 약관, 데이터 정책 및 쿠키 정책에 동의하게 됩니다.
        </p>
      </div>

      {/* 하단 로그인 이동 박스 */}
      <div className="w-full max-w-[500px] bg-[#FDF8F3] border-3 border-[#743F24] mt-2 py-6 text-center shadow-sm rounded-md">
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