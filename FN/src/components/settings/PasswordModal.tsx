import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useModal } from "@/context/ModalContext";

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordModal = ({ isOpen, onClose }: PasswordModalProps) => {
    const { showAlert } = useModal();
    const [ form, setForm ] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // 비밀번호 정규식
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    const [validMessage, setValidMessage] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    // 새 비밀번호 입력 시 실시간 정규식 검사
    useEffect(() => {
        if (!form.newPassword) {
            setValidMessage("");
            setIsPasswordValid(false);
        } else if (passwordRegex.test(form.newPassword)) {
            setValidMessage("사용 가능한 비밀번호입니다.");
            setIsPasswordValid(true);
        } else {
            setValidMessage("대소문자, 숫자, 특수문자를 포함해 8~15자로 입력해주세요.");
            setIsPasswordValid(false);
        }
    }, [form.newPassword]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // 새 비밀번호 정규식 검사
        if (!isPasswordValid) {
            return showAlert("형식 오류", "비밀번호 형식이 올바르지 않습니다.");
        }

        // 새 비밀번호 확인 일치 검사
        if (form.newPassword !== form.confirmPassword) {
            return showAlert("불일치", "새 비밀번호가 서로 일치하지 않습니다.");
        }

        // 기존 비밀번호와 새 비밀번호 동일 여부 검사
        if (form.currentPassword === form.newPassword) {
            return showAlert("중복 오류", "과거에 사용한 비밀번호입니다.");
        }

        try {
            await api.patch("/users/password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });

            showAlert("성공", "비밀번호가 안전하게 변경되었습니다.");
            onClose();
        } catch (error: any) {
            const errorMsg = error.response?.data || "비밀번호 변경 중 오류가 발생했습니다.";
            showAlert("변경 실패", errorMsg);
        }
    };
    

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
                <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-extrabold text-[#743F24] mb-6">비밀번호 변경</h2>

                    <div className="space-y-4">
                        {/* 현재 비밀번호 입력해서 확인 */}
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-600">현재 비밀번호</label>
                            <input 
                                type="password"
                                className="w-full border-2 border-[#743F24]/20 rounded-lg p-3 outline-[#743F24]"
                                placeholder="현재 비밀번호 입력"
                                onChange={(e) => setForm({...form, currentPassword: e.target.value})}
                            />
                        </div>

                        <hr className="border-gray-100"/>

                        {/* 새 비밀번호 입력칸 */}
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-600">새 비밀번호</label>
                            <input 
                                type="password"
                                className={`w-full border-2 rounded-lg p-3 outline-[#743F24] ${
                                    form.newPassword ? (isPasswordValid ? "border-blue-500" : "border-red-500") : "border-[#743F24]/20"
                                }`}
                                placeholder="새 비밀번호 입력"
                                onChange={(e) => setForm({...form, newPassword: e.target.value})}
                            />
                            {/* 정규식 안내 문구 */}
                            <p className={`text-[11px] mt-1 ${isPasswordValid ? "text-blue-500" : "text-red-500"}`}>{validMessage}</p>
                        </div>
                        
                        {/* 새 비밀번호 한 번 더 입력 */}
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-600">새 비밀번호 확인</label>
                            <input 
                                type="password"
                                className="w-full border-2 border-[#743F24]/20 rounded-lg p-3 outline-[#743F24]"
                                placeholder="변경하실 비밀번호를 한 번 더 입력해주세요."
                                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`flex-1 py-3 text-white font-bold rounded-lg transition-all ${
                                isPasswordValid ? "bg-[#743F24] hover:brightness-110" : "bg-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!isPasswordValid}
                        >
                            변경하기
                        </button>
                    </div>
                </div>
            </div>  
        </>
    );
};

export default PasswordModal;

