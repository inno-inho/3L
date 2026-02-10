import { useState, useEffect } from "react";
import { useSignup } from "../../context/SignupContext";
import { useNavigate } from "react-router-dom"; // 1. useNavigate 임포트
import logo from "../../assets/image/coconuttalk.png";

const SignupProfile = () => {
    const { email } = useSignup(); // Context에서 이전 단계 이메일 가져오기
    const navigate = useNavigate(); // 이동 함수 생성

    // 입력 상태 관리 (BE DTO 필드명과 일치시킴)
    const [formData, setFormData] = useState({
        email: email || "", // 자동 삽입 처리
        password: "",
        passwordConfirm: "",
        nickname: "",
        username: "",
        phone: "",
        agreement: "yes",
        birthYear: "2010",
        birthMonth: "01",
        birthDay: "01",
        gender: "male",
    });

    // 실시간 비밀번호 일치 여부 상태
    const [passwordMessage, setPasswordMessage] = useState("");
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);


    // 비밀번호 정규식 검사 상태
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [validMessage, setValidMessage] = useState("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    // Context의 email 값이 들어오면 formData에 즉시 반영
    useEffect(() => {
        if (email) {
            setFormData(prev => ({ ...prev, email: email }));
        }
    }, [email]);

    // ➕ 추가: 비밀번호 일치 여부 실시간 감시 (useEffect)
    useEffect(() => {

        // 1. 비밀번호 정규식 실시간 체크
        if (!formData.password) {
            setValidMessage("");
            setIsPasswordValid(false);
        } else if (passwordRegex.test(formData.password)) {
            setValidMessage("사용 가능한 비밀번호입니다.");
            setIsPasswordValid(true);
        } else {
            setValidMessage("대소문자, 숫자, 특수문자를 포함해 8~15자로 입력해주세요.");
            setIsPasswordValid(false);
        }

        // 비밀번호 확인 일치 여부 체크 [수정: 일치 시 메시지 제거]
        if (!formData.password || !formData.passwordConfirm) {
            setPasswordMessage("");
            setIsPasswordMatch(false);
            return;
        }

        if (formData.password === formData.passwordConfirm) {
            setPasswordMessage("");
            setIsPasswordMatch(true);
        } else {
            setPasswordMessage("비밀번호가 일치하지 않습니다.");
            setIsPasswordMatch(false);
        }
    }, [formData.password, formData.passwordConfirm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // 정규식 미통과 시 가입 방지
        if (!isPasswordValid) {
            alert("비밀번호 형식이 올바르지 않습니다. (8~15자 영문 대소문자, 숫자, 특수문자 조합)");
            return;
        }

        // 수정: 실시간 검사 상태값(isPasswordMatch)을 활용하도록 변경
        if (!isPasswordMatch) {
            alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    nickname: formData.nickname,
                    username: formData.username,
                    phone: formData.phone,
                    birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
                    gender: formData.gender,
                    agreement: formData.agreement
                }),
            });

            if (response.ok) {
                alert("회원가입이 완료되었습니다!");
                navigate("/");
            } else {
                const errorMsg = await response.text();
                alert(errorMsg || "회원가입에 실패했습니다.");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#FFF9F3]">
            {/* 1. 상단 로고 & 타이틀 (사진 비율에 맞게 조절) */}
            <div className="flex items-center justify-center gap-2 mb-3">
                <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                <h1 className="text-[48px] font-normal font-nerko text-[#6F4E37] tracking-tight">
                    CoconutTalk
                </h1>
            </div>

            {/* 2. 브라운 설명 박스 (너비를 입력 폼보다 넓게 설정) */}
            <div className="w-[650px] bg-[#743F24] text-white p-3 text-[11px] leading-relaxed mb-7 shadow-md">
                회원가입 관련 정보 입력 시, 필수항목은 반드시 작성하셔야 회원가입이 가능합니다.
                SMS, 이메일 및 코코넛톡 수신 동의 여부 '아니오' 선택 시, 관련 알림들 서비스 운영 및
                이용과 관련된 각종 알림 수신이 제한될 수 있습니다.
            </div>
            <div className="w-[650px] bg-white border-2 border-[#743F24] p-10 px-12">
                <form id="signup-form" onSubmit={handleSignup} className="space-y-7">
                    {/* 이메일 (아이디) - 읽기 전용 또는 자동입력 */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <label className="w-32 h-12 flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">아이디</label>
                            <input
                                name="email"
                                value={formData.email}
                                readOnly
                                className="flex-1 h-12 border border-[#E5E7EB] border-l-0 px-4 bg-gray-50 outline-none text-gray-400"
                            />
                        </div>
                    </div>

                    {/* 닉네임 구역 */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <label className="w-32 h-12 flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">닉네임</label>
                            <input
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="닉네임을 입력해주세요"
                                className="flex-1 h-12 border border-[#E5E7EB] border-l-0 px-4 outline-[#743F24] placeholder-gray-300"
                                required
                            />
                        </div>
                    </div>

                    {/* 비밀번호 구역 (안내 문구 추가) */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <label className="w-32 h-12 flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="비밀번호"
                                className="flex-1 h-12 border border-[#E5E7EB] border-l-0 px-4 outline-[#743F24] placeholder-gray-300"
                                required
                            />
                        </div>
                        {/* 비밀번호 하단 안내 문구 [수정] 폰트 크기 및 색상 로직 적용 */}
                        <div className="ml-32 h-5 mt-2 mb-[-21px]">
                            <p className={`text-[9px] leading-tight whitespace-nowrap ${formData.password ? (isPasswordValid ? "text-blue-500" : "text-red-500") : "text-gray-400"}`}>
                                {validMessage || "영문 대소문자, 숫자, 특수문자를 혼합하여 8~15자 이내로 입력해주세요."}
                            </p>
                        </div>
                    </div>

                    {/* 비밀번호 확인 구역 (실시간 메시지 추가) */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <label className="w-32 h-12 flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">비밀번호 확인</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                onChange={handleChange}
                                placeholder="비밀번호 확인"
                                className="flex-1 h-12 border border-[#E5E7EB] border-l-0 px-4 outline-[#743F24] placeholder-gray-300"
                                required
                            />
                        </div>
                        {/* 비밀번호 일치 실시간 메시지*/}
                        <div className="ml-32 h-5 mt-1 mb-[-20px]">
                            {passwordMessage && (
                                <p className="text-[9px] leading-tight text-red-500 whitespace-nowrap">
                                    {passwordMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 이름 (username) */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <label className="w-32 h-12 flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">이름</label>
                            <input
                                name="username"
                                onChange={handleChange}
                                className="flex-1 h-12 border border-[#E5E7EB] border-l-0 px-4 outline-[#743F24]"
                                required
                            />
                        </div>
                    </div>

                    {/* 생년월일 */}
                    <div className="flex items-center h-12">
                        <label className="w-32 h-full flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">생년월일</label>
                        <div className="flex-1 h-full flex gap-2 px-4 border border-[#E5E7EB] border-l-0 items-center">
                            <select name="birthYear" onChange={handleChange} className="flex-1 outline-none text-sm bg-transparent">
                                {Array.from({ length: 2010 - 1950 + 1 }, (_, i) => 2010 - i).map(y => (
                                    <option key={y} value={y}>{y}년</option>))}
                            </select>
                            <select name="birthMonth" onChange={handleChange} className="flex-1 outline-none text-sm bg-transparent">
                                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => <option key={m} value={m}>{m}월</option>)}
                            </select>
                            <select name="birthDay" onChange={handleChange} className="flex-1 outline-none text-sm bg-transparent">
                                {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => <option key={d} value={d}>{d}일</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 성별 */}
                    <div className="flex items-center h-12">
                        <label className="w-32 h-full flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">성별</label>
                        <div className="flex-1 h-full flex gap-10 px-6 border border-[#E5E7EB] border-l-0 items-center">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="gender" value="male" onChange={handleChange} className="accent-[#743F24]" /> 남자
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="gender" value="female" onChange={handleChange} className="accent-[#743F24]" /> 여자
                            </label>
                        </div>
                    </div>


                    {/* 연락처 */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <label className="w-32 h-12 flex items-center justify-center bg-[#743F24] text-white text-sm font-bold shrink-0">연락처</label>
                            <input
                                name="phone"
                                placeholder="-없이 숫자만 입력"
                                onChange={handleChange}
                                className="flex-1 h-12 border border-[#E5E7EB] border-l-0 px-4 outline-[#743F24] placeholder-gray-300"
                                required
                            />
                        </div>
                    </div>

                    {/* 수신여부(선택) */}
                    <div className="flex items-center h-12">
                        <label className="w-32 h-full flex items-center justify-center bg-[#743F24] text-white text-[14px] font-bold shrink-0">
                            수신여부(선택)
                        </label>
                        <div className="flex-1 h-full flex gap-10 px-6 border border-[#E5E7EB] border-l-0 items-center">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreement" // 성별처럼 이름을 하나로 통일
                                    value="yes"
                                    checked={formData.agreement === "yes"}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-[#743F24]"
                                /> 예
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreement" // 성별처럼 이름을 하나로 통일
                                    value="no"
                                    checked={formData.agreement === "no"}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-[#743F24]"
                                /> 아니오
                            </label>
                        </div>
                    </div>
                </form>

            </div>
            <div>
                {/* form 속성에 해당 id 연결 */}
                <button
                    type="submit"
                    form="signup-form"
                    className="w-[250px] bg-[#743F24] text-white font-bold py-4 mt-6 hover:bg-[#5a311b] transition-colors"
                >
                    가입하기
                </button>
            </div>
        </div>
    );
};

export default SignupProfile;