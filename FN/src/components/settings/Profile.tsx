
const Profile = () => {
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
                    <img className="border size-16" />
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