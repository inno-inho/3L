import { useState } from "react";
import { useSignup } from "../../context/SignupContext";
import logo from "../../assets/image/coconuttalk.png";

const SignupEmail = () => {
    const { setStep, setEmail: setContextEmail } = useSignup(); // Context에서 setEmail 가져오기


    // 입력 상태 관리
    const [email, setEmail] = useState("");
    const [authCode, setAuthCode] = useState("");

    // UI 단계 및 모달 상태 관리
    const [viewStep, setViewStep] = useState<"EMAIL" | "VERIFY">("EMAIL");
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 재발송 모달 상태 추가

    // 이메일 유효성 검사
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // [Step 1] 인증요청
    const handleRequestAuth = () => {
        if (!isEmailValid) return;
        setIsLoading(true);
        setTimeout(() => {
            alert(`${email}로 인증번호가 발송되었습니다. (테스트 번호: 123456)`);
            setViewStep("VERIFY");
            setIsLoading(false);
        }, 1000);
    };

    // [다른 이메일로 변경] 클릭 시 초기화 로직
    const handleChangeEmail = () => {
        setEmail("");         // 1. 입력했던 이메일 삭제
        setAuthCode("");      // 2. 입력했던 인증번호 초기화
        setViewStep("EMAIL"); // 3. 이메일 입력 단계로 복귀
        setIsModalOpen(false);// 4. 모달 닫기
    };

    // [Step 2] 인증번호 확인
    // ‼️‼️백엔드 로직 완성 후 수정해야함(axios나 fectch사용)(현재는 FE단계별 확인을 위해 하드코딩해놓은 상태)
    const handleConfirmCode = () => {
        if (authCode === "123456") {
            alert("인증에 성공했습니다.");
            setContextEmail(email); //사용자가 입력한 이메일을 Context에 전역 저장
            setStep("PROFILE");
        } else {
            alert("인증번호가 일치하지 않습니다.");
        }
    };

//     // [Step 1] 인증요청 - BE 연결 버전
// const handleRequestAuth = async () => { // 비동기 통신을 위해 async를 붙입니다.
//     if (!isEmailValid) return;
//     setIsLoading(true);

//     try {
//         /* [미래의 BE 로직] 
//            1. fetch나 axios를 이용해 서버의 '인증번호 발송 API' 주소로 데이터 전송
//            2. 서버는 이메일이 중복인지, 유효한지 검사 후 실제 메일을 발송
//         */
//         const response = await fetch("https://api.coconuttalk.com/auth/email-request", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email: email }), // 서버에 이메일 주소를 담아 전송
//         });

//         if (response.ok) {
//             // 성공 시: 서버에서 메일 발송을 완료했다는 응답을 주면 다음 단계로 이동
//             alert(`${email}로 인증번호가 발송되었습니다.`);
//             setViewStep("VERIFY");
//         } else {
//             // 실패 시: 이미 가입된 이메일이거나 서버 에러인 경우
//             const errorData = await response.json();
//             alert(errorData.message || "메일 발송에 실패했습니다.");
//         }
//     } catch (error) {
//         // 네트워크 연결 끊김 등 예상치 못한 에러 처리
//         alert("서버와 통신 중 오류가 발생했습니다.");
//     } finally {
//         setIsLoading(false); // 성공하든 실패하든 로딩 상태는 해제
//     }
// };

// // [Step 2] 인증번호 확인 - BE 연결 버전
// const handleConfirmCode = async () => {
//     try {
//         /* [미래의 BE 로직] 
//            서버에 "이 사용자가 입력한 이 번호(authCode)가 맞나요?"라고 물어봄
//         */
//         const response = await fetch("https://api.coconuttalk.com/auth/email-verify", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email: email, code: authCode }),
//         });

//         if (response.ok) {
//             alert("인증에 성공했습니다.");
//             setStep("PROFILE"); // 인증 성공 시 다음 페이지로 이동
//         } else {
//             alert("인증번호가 틀렸습니다. 다시 확인해 주세요.");
//         }
//     } catch (error) {
//         alert("인증 확인 중 오류가 발생했습니다.");
//     }
// };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white relative">
            {/* 상단 로고 */}
            <div className="flex items-center justify-center gap-1 mb-3">
                <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
                <h1 className="text-[42px] font-normal font-nerko text-[#6F4E37] tracking-[-0.06em] leading-none">
                    CoconutTalk
                </h1>
            </div>

            {/* 메인 박스 (relative 추가로 모달 위치 기준 잡음) */}
            <div className="w-[500px] min-h-[380px] bg-white border-[2px] border-[#743F24] pt-16 pb-12 px-10 flex flex-col shadow-sm relative overflow-hidden">

                {viewStep === "EMAIL" && (
                    <div className="flex flex-col animate-fade-in w-full">
                        <h2 className="text-[26px] font-bold text-gray-800 mb-14 leading-tight text-left">
                            코코넛톡 계정으로 사용할 이메일 <br />을 입력해 주세요.
                        </h2>

                        <div className="w-full flex flex-col">
                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#743F24] transition-all pb-1 mb-4">
                                <input
                                    type="email"
                                    placeholder="이메일 입력"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-10 text-[16px] outline-none placeholder:text-gray-300"
                                />
                                <button
                                    onClick={handleRequestAuth}
                                    disabled={!isEmailValid || isLoading}
                                    className={`shrink-0 px-4 py-1.5 border rounded-full text-[13px] transition-all ml-2 ${isEmailValid
                                        ? "border-gray-300 text-gray-400 hover:bg-[#743F24] hover:text-white hover:border-[#743F24] active:bg-[#5a311b]"
                                        : "border-gray-200 text-gray-200 cursor-not-allowed"
                                        }`}
                                >
                                    {isLoading ? "발송중..." : "인증요청"}
                                </button>
                            </div>

                            <div className="text-[12px] text-gray-400 text-left">
                                <ul className="list-none p-0 m-0 space-y-1">
                                    <li className="flex items-start gap-1">
                                        <span className="shrink-0">◦</span>
                                        <span>입력한 이메일로 인증번호가 발송됩니다.</span>
                                    </li>
                                    <li className="flex items-start gap-1">
                                        <span className="shrink-0">◦</span>
                                        <span>인증메일을 받을 수 있도록 자주 쓰는 이메일을 입력해 주세요.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {viewStep === "VERIFY" && (
                    <div className="flex flex-col animate-fade-in w-full">
                        <h2 className="text-[26px] font-bold text-gray-800 mb-12 leading-tight text-left">
                            이메일로 전송된 인증번호를 <br />입력해 주세요.
                        </h2>
                        <div className="flex flex-col w-full">
                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#743F24] pb-1 mb-6">
                                <input
                                    type="text"
                                    placeholder="인증번호 6자리 입력"
                                    maxLength={6}
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    className="w-full h-10 text-[16px] outline-none placeholder:text-gray-300"
                                />
                            </div>
                            <p className="text-[12px] text-gray-400 text-left mb-12">
                                인증번호가 오지 않았나요?
                                <span
                                    className="underline cursor-pointer hover:text-[#743F24] ml-1"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    재전송하기
                                </span>
                            </p>
                            <button
                                onClick={handleConfirmCode}
                                disabled={authCode.length !== 6}
                                className={`w-full h-[52px] rounded text-[16px] font-bold transition-colors ${authCode.length === 6 ? "bg-[#743F24] text-white" : "bg-[#E5E5E5] text-white cursor-not-allowed"
                                    }`}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )}

                {/* --- 재발송 모달 팝업 레이어 --- */}
                {isModalOpen && (
                    <div className="absolute inset-0 bg-black/80 flex justify-center items-center z-50">
                        <div className="w-[65%] bg-white p-6 shadow-2xl relative animate-fade-in">
                            {/* 닫기 버튼 */}
                            <button
                                className="absolute top-3 right-4 text-gray-400 text-xl hover:text-gray-600"
                                onClick={() => setIsModalOpen(false)}
                            >✕</button>

                            <h3 className="font-bold text-[16px] mb-4 text-left">인증메일을 받지 못하셨나요?</h3>

                            <ul className="text-[11px] text-gray-500 space-y-2 mb-6 text-left list-disc pl-4 leading-relaxed">
                                <li>인증을 요청한 이메일 주소가 정확한지 확인해 주세요.</li>
                                <li>메일 서비스에 따라 인증번호 수신이 늦어질 수 있습니다. 스팸함, 휴지통 등 다른 메일함도 함께 확인해 주세요.</li>
                                <li>인증번호를 재발송해도 계속 받지 못했다면 고객센터로 문의해 주세요.</li>
                            </ul>

                            <div className="flex flex-col gap-2">
                                <button
                                    className="w-full py-3.5 bg-[#743F24] text-white text-[14px] font-bold rounded hover:bg-[#5a311b] transition-colors"
                                    onClick={() => { alert("인증번호가 재발송되었습니다."); setIsModalOpen(false); }}
                                >
                                    인증번호 재발송
                                </button>
                                <button
                                    className="w-full py-3.5 bg-[#4A4A4A] text-white text-[14px] font-bold rounded hover:bg-black transition-colors"
                                    onClick={handleChangeEmail}
                                >
                                    다른 이메일로 변경
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 푸터 */}
            <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-gray-500 font-medium">
                <span className="cursor-pointer hover:text-gray-800">이용약관</span>
                <span className="font-bold text-black cursor-pointer">개인정보 처리방침</span>
                <span className="cursor-pointer hover:text-gray-800">운영정책</span>
                <span className="cursor-pointer hover:text-gray-800">고객센터</span>
                <span className="text-gray-400 font-normal">© CoconutTalk Corp.</span>
            </div>
        </div>
    );
};

export default SignupEmail;