
const Profile = () => {
    return (
        <div>
            <div className="text-center">
                <h1 className="flex-1 text-2xl font-bold">계정정보</h1>
                <p>로그인, 프로필, 연락처 정보를 확인하고 관리합니다.</p>
            </div>
            <div className="border rounded-sm">
                <h2 className="text-left text-xl">로그인 정보</h2>
                <div className="flex">
                    <p>대표 이메일</p>
                    <p>nasangjo@naver.com</p>
                </div>
                <div className="flex">
                    <p>전화번호</p>
                    <p>+82 10-1234-5678</p>
                </div>
            </div>
            <div>
                <h2>프로필 정보</h2>
                <div>
                    <p>프로필 사진</p>
                    <p>프로필은 코코넛 서비스에서 활용됩니다.</p>
                    <img />
                </div>
                <div>
                    <p>이름</p>
                    <p>username</p>
                </div>
                <div>
                    <p>닉네임</p>
                    <p>nasangjo</p>
                </div>
                <div>
                    <p>비밀번호 변경</p>
                    <p>2026.01.01 변경</p>
                </div>

            </div>
        </div>
    )

};
export default Profile;