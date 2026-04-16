import React, { useEffect, useRef, useState } from "react";
import api from "@/api/api";
import coconuttalk from "@/assets/image/coconuttalk.png";
import ProfileImage from "../common/ProfileImage";
import { useModal } from "@/context/ModalContext";
import { formatDate } from "@/utils/date";


const Profile = () => {
    const [userData, setUserData] = useState<any>(null);

    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        phone: "",
        nickname: "",
    }); 

    const { showAlert, showConfirm } = useModal();

    // 파일 입력을 위한 Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "정보 없음";
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("/auth/user"); // 기존 API 활용
                setUserData(response.data);
            } catch (error) {
                console.error("유저 정보 로드 실패:", error);
            }
        };
        fetchUserData();
    }, []);

    // 편집 모드 토글
    const toggleEdit = () => {
        if (!isEditing && userData) {
            setEditForm({
                phone: userData.phone || "",
                nickname: userData.nickname || "",
            });
        }
        setIsEditing(!isEditing);
    }

    // 정보 업데이트 요청 
    const handleUpdateProfile = async () => {
        try {
            await api.patch("/users/profile", editForm);
            setUserData({ ...userData, ...editForm});
            setIsEditing(false);
            showAlert("정보 수정", "계정 정보가 성공적으로 변경되었습니다.");
        }catch (error) {
            showAlert("수정 실패", "정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    // 이미지 파일 업로드
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/users/profile-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // 서버에서 저장된 새로운 이미지 URL을 받아와 상태 업데이트
            setUserData({ ...userData, ProfileImageUrl: response.data });
            showAlert("프로필 사진", "프로필 사진이 업데이트 되었습니다.");
        } catch (error) {
            console.error("업로드 실패: ", error);
            showAlert("프로필 사진", "프로필 사진 업로드 중 오류가 발생했습니다.");
        }
    };

    // 이미지 삭제
    const handleDeleteImage = () => {
        showConfirm(
            "프로필 사진 삭제",
            "사진을 삭제하고 기본 이미지로 변경하시겠습니까?",
            async () => {
                try {
                    await api.delete("/users/profile-image");
                    setUserData({ ...userData, ProfileImageUrl: null });
                    showAlert("프로필 사진", "기본 이미지로 변경되었습니다.");
                } catch (error) {
                    showAlert("프로필 사진", "사진 삭제 중 오류가 발생했습니다.");
                }
            }
        );
    };

    // 데이터 로딩 중 렌더링
    if (!userData) return <div className="p-20 text-center font-bold">사용자 정보를 불러오는 중...</div>

    return (
        <div className="mb-10">
            <div className="text-left w-full max-w-xl mx-auto mt-4 mb-10">
                <h1 className="text-3xl font-bold my-2">계정정보</h1>
                <p>로그인, 프로필, 연락처 정보를 확인하고 관리합니다.</p>
            </div>

            <button
                onClick={isEditing ? handleUpdateProfile : toggleEdit}
                className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${
                    isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-[#743F24] hover:brightness-110"
                }`}
            >
                {isEditing ? "저장하기" : "정보 수정"}
            </button>

            {/* 유저 정보 박스 */}
            <div className="w-full max-w-xl mx-auto p-4 my-10 border-2 border-[#743F24] rounded-lg flex flex-col">
                <h2 className="text-2xl text-left font-extrabold mb-4">로그인 정보</h2>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">대표 이메일</p>
                    <p className="text-xl font-medium">{userData.email}</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]" />
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">전화번호</p>
                    {isEditing ? (
                        <input 
                            value={editForm.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            className="border-b-2 border-[#743F24] outline-none text-right px-2 text-xl w-1/2"
                        />
                    ) : (
                        <p className="text-xl">{userData.phone || "미등록"}</p>
                    )}
                </div>
            </div>

            {/* 프로필 정보 박스 */}
            <div className="w-full max-w-xl mx-auto my-10 p-4 border-2 border-[#743F24] rounded-lg flex flex-col">
                <h2 className="text-2xl text-left font-extrabold mb-4">프로필 정보</h2>
                
                <div className="flex justify-between items-center my-3">
                    <div className="text-left">
                        <p className="text-xl text-left font-bold">프로필 사진</p>
                        <p>프로필은 코코넛 서비스에서 활용됩니다.</p>
                        {/* 이미지가 있을 때만 삭제 버튼 노출 */}
                        {userData?.ProfileImageUrl && (
                            <button
                                onClick={handleDeleteImage}
                                className="mt-2 text-xs text-red-500 hover:underline"
                            >
                                사진 삭제
                            </button>
                        )}
                    </div>

                    {/* 숨겨진 파일 입력창 */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* 클릭 가능한 이미지 */}
                    <div 
                        className="relative cursor-pointer group"
                        onClick={handleImageClick}
                    >
                        <ProfileImage 
                            url={userData.profileImageUrl}
                            nickname={userData.nickname}
                            size="lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">변경</span>
                        </div>
                    </div>
                </div>

                <hr className="my-2 border-2 border-[#743F24]" />

                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl font-bold">이름</p>
                    <p className="text-xl">{userData?.username || "로딩 중"}</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]" />
                
                {/* 닉네임은 변경 가능 */}
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl font-bold">닉네임</p>
                    {isEditing ? (
                        <input 
                            value={editForm.nickname}
                            onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                            className="border-b-2 border-[#743F24] outline-none text-right px-2 text-xl w-1/2"
                        />
                    ) : (
                        <p className="text-xl">{userData?.nickname || "로딩 중"}</p>
                    )}
                </div>

                <hr className="my-2 border-2 border-[#743F24]" />
                
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl font-bold">최근 비밀번호 변경일자</p>
                    <p className="text-xl">
                        {userData?.passwordUpdatedAt
                            ? `${formatDate(userData.passwordUpdatedAt)} 변경`
                            : "최근 변경 이력 없음"    
                        }
                    </p>
                </div>
            </div>
        </div>
    )

};
export default Profile;