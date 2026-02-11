import { useState } from "react";
import { useSignup } from "../../context/SignupContext";
import logo from "../../assets/image/coconuttalk.png"; // 로고 임포트


// [타입 정의] TypeScript 에러 방지
interface TermItemProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    required?: boolean;
    showArrow?: boolean;
}

const SignupTerms = () => {
    const { setStep } = useSignup();

    // [로직] 각 체크박스의 상태 관리
    const [agreements, setAgreements] = useState({
        all: false,
        age: false,
        terms: false,
        privacy: false,
        marketing: false,
    });

    // [로직] 전체 동의 체크박스 핸들러
    const handleAllCheck = (checked: boolean) => {
        setAgreements({
            all: checked,
            age: checked,
            terms: checked,
            privacy: checked,
            marketing: checked,
        });
    };

    // [로직] 개별 체크박스 핸들러
    const handleSingleCheck = (key: keyof typeof agreements, checked: boolean) => {
        const updated = { ...agreements, [key]: checked };
        setAgreements({
            ...updated,
            // 개별 항목이 모두 true일 때만 '전체 동의'도 true가 되도록 계산
            all: updated.age && updated.terms && updated.privacy && updated.marketing,
        });
    };

    // [로직] 필수 항목이 모두 체크되었는지 확인 (동의 버튼 활성화 조건)
    const isRequiredChecked = agreements.age && agreements.terms && agreements.privacy;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white">
            {/* 1. 상단 로고 (시안과 동일하게 배치) */}
            <div className="flex items-center justify-center gap-1 mb-3">
                <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
                <h1 className="text-[42px] font-normal font-nerko text-[#6F4E37] tracking-[-0.06em] leading-none">
                    CoconutTalk
                </h1>
            </div>

            {/* 2. 메인 약관 박스 */}
            <div className="w-[500px] min-h-[580px] bg-white border-[2px] border-[#743F24] p-12 flex flex-col shadow-sm">
                <h2 className="text-[26px] font-bold text-gray-800 mb-12 leading-tight">
                    코코넛톡 계정<br />서비스 약관에 동의해 주세요
                </h2>

                <div className="flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-6">
                        {/* 모두 동의 섹션 */}
                        <div className="flex items-start gap-4 pb-3 border-b border-gray-100">
                            <div className="relative flex items-center shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    id="all"
                                    className="
                                        peer appearance-none w-5 h-5 rounded-full cursor-pointer bg-white
                                        border-2 border-[#743F24]
                                        checked:border-[#743F24]
                                        focus:border-[#743F24]
                                        focus:outline-none focus:ring-0
                                        transition-all
                                    "
                                    checked={agreements.all}
                                    onChange={(e) => handleAllCheck(e.target.checked)}
                                />
                                {/* 체크 표시 아이콘 (SVG) */}
                                <svg
                                    className="absolute w-3 h-3 text-[#743F24] left-1 pointer-events-none hidden peer-checked:block"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <label htmlFor="all" className="flex flex-col cursor-pointer text-left w-full">
                                <span className="font-bold text-[16px] text-gray-800">모두 동의합니다.</span>
                                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                                    전체 동의는 필수 및 선택정보에 대한 동의를 포함하며, 개별적으로도 동의를 선택하실 수 있습니다. 선택항목에 대한 동의를 거부하시는 경우에도 서비스 이용이 가능합니다.
                                </p>
                            </label>
                        </div>

                        {/* 개별 항목 리스트 */}
                        <div className="font-bold flex flex-col gap-6 mt-2">
                            <TermItem label="만 14세 이상입니다." checked={agreements.age} onChange={(c) => handleSingleCheck("age", c)} />
                            <TermItem label="[필수] 코코넛톡 계정 약관" checked={agreements.terms} onChange={(c) => handleSingleCheck("terms", c)} showArrow />
                            <TermItem label="[필수] 개인정보 수집 및 이용 동의" checked={agreements.privacy} onChange={(c) => handleSingleCheck("privacy", c)} showArrow />
                            <TermItem label="[선택] 프로필정보 추가 수집 동의" checked={agreements.marketing} onChange={(c) => handleSingleCheck("marketing", c)} showArrow />
                        </div>
                    </div>

                    <button
                        disabled={!isRequiredChecked}
                        onClick={() => setStep("EMAIL")}
                        className={`w-full h-[52px] mt-7 rounded text-[16px] font-bold transition-colors ${isRequiredChecked
                            ? "bg-[#743F24] text-white"
                            : "bg-[#E5E5E5] text-white cursor-not-allowed"
                            }`}
                    >
                        동의
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mt-8 text-[12px] text-gray-500 font-medium">
                <span>이용약관</span>
                <span className="font-bold text-black">개인정보 처리방침</span>
                <span>운영정책</span>
                <span>고객센터</span>
                <span className="ml-2">©CoconutTalk Corp.</span>
            </div>
        </div>
    );
};

// 개별 아이템 컴포넌트 (동일한 체크 표시 로직 적용)
const TermItem = ({ label, checked, onChange, showArrow }: TermItemProps) => (
    <div className="flex items-center justify-between w-full group">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onChange(!checked)}>
            <div className="relative flex items-center shrink-0">
                <input
                    type="checkbox"
                    className="
                        peer appearance-none w-5 h-5 rounded-full cursor-pointer bg-white
                        border-2 border-[#743F24]
                        checked:border-[#743F24]
                        focus:border-[#743F24]
                        focus:outline-none focus:ring-0
                        transition-all
                    "
                    checked={checked}
                    readOnly
                />
                <svg
                    className="absolute w-3 h-3 text-[#743F24] left-1 pointer-events-none hidden peer-checked:block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-[15px] text-gray-700">{label}</span>
        </div>
        {showArrow && <span className="text-gray-300 text-xl font-light cursor-pointer">〉</span>}
    </div>
);

export default SignupTerms;
