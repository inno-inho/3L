import { useSignup } from "../../context/SignupContext";

const SignupStart = () => {
  const { setStep } = useSignup();

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl font-bold">CoconutTalk</h1>

      {/* 이메일 회원가입 */}
      <button
        className="w-64 py-3 bg-black text-white rounded"
        onClick={() => setStep("TERMS")}
      >
        회원가입
      </button>

      {/* 소셜 로그인 (UI만) */}
      <button className="w-64 py-3 bg-yellow-400 rounded">
        카카오로 시작하기
      </button>
      <button className="w-64 py-3 bg-green-500 text-white rounded">
        네이버로 시작하기
      </button>
      <button className="w-64 py-3 border rounded">
        Google로 시작하기
      </button>
    </div>
  );
};

export default SignupStart;
