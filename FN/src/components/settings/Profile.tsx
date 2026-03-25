import React, { useRef, useState } from "react";

const Profile = () => {
    // 파일 입력을 위한 Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 프로필 이미지 상태
    const [ profileImage, setProfileImage ] = useState<string | null>(null);

    // 이미지 클릭 시 input 클릭 이벤트 발생
    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    // 파일 선택 시 실행될 함수
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 브라우저 내에서 미리보기를 위한 임시 URL 생성
            const previewUrl = URL.createObjectURL(file);
            setProfileImage(previewUrl);

            // 여기서 서버로 이미지를 업로드 하는 API 호출
        }
    };

    return (
        <div className="mb-10">
            <div className="text-left w-full max-w-xl mx-auto mt-4 mb-10">
                <h1 className="text-3xl font-bold my-2">계정정보</h1>
                <p>로그인, 프로필, 연락처 정보를 확인하고 관리합니다.</p>
            </div>
            <div className="w-full max-w-xl mx-auto p-4 my-10 border-2 border-[#743F24] rounded-lg flex flex-col">
                <h2 className="text-2xl text-left font-extrabold mb-4">로그인 정보</h2>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">대표 이메일</p>
                    <p className="text-xl">nasangjo@naver.com</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]"/>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">전화번호</p>
                    <p className="text-xl">+82 10-1234-5678</p>
                </div>
            </div>
            <div className="w-full max-w-xl mx-auto my-10 p-4 border-2 border-[#743F24] rounded-lg flex flex-col">
                <h2 className="text-2xl text-left font-extrabold mb-4">프로필 정보</h2>
                <div className="flex justify-between items-center my-3">
                    <div className="">
                        <p className="text-xl text-left font-bold">프로필 사진</p>
                        <p>프로필은 코코넛 서비스에서 활용됩니다.</p>
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
                        <img 
                            src={profileImage || "기본_이미지_경로.png"}
                            alt="프로필"
                            className="border size-20 rounded-full object-cover border-[#743F24] hover:brightness-90 transition-all" 
                        />
                        {/* 마우스 올렸을 때 나타나는 오버레이 */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs">변경</span>
                        </div>
                    </div>
                </div>

                <hr className="my-2 border-2 border-[#743F24]"/>
                
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl font-bold">이름</p>
                    <p className="text-xl">username</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]"/>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl font-bold">닉네임</p>
                    <p className="text-xl">nasangjo</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]"/>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl font-bold">비밀번호 변경</p>
                    <p className="text-xl">2026.01.01 변경</p>
                </div>
            </div>
        </div>
    )

};
export default Profile;