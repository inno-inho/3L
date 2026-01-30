
const Security = () => {
    return(
        <div>
            <div className="text-left w-full max-w-xl mx-auto mt-4 mb-10">
                <h1 className="text-3xl font-bold my-2">보안</h1>
                <p>계정 보안 상태를 진단하고, 로그인 상태를 제어합니다.</p>
            </div>
            <div className="w-full max-w-xl mx-auto p-4 my-10 border-2 border-[#743F24] rounded-lg flex flex-col">
                <h2 className="text-2xl text-left font-extrabold mb-4">보안 기능</h2>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">비밀번호 변경</p>
                    <p className="text-xl">&gt;</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]"/>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">회원 탈퇴</p>
                    <p className="text-xl">&gt;</p>
                </div>
            </div>
            <div className="w-full max-w-xl mx-auto p-4 border-2 border-[#743F24] rounded-lg flex flex-col">
                <h2 className="text-2xl text-left font-extrabold mb-3">로그인 관리</h2>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">로그인 이력 조회</p>
                    <p className="text-xl">&gt;</p>
                </div>
                <hr className="my-2 border-2 border-[#743F24]"/>
                <div className="flex justify-between my-3 py-2">
                    <p className="text-xl">서비스 이용 관리</p>
                    <p className="text-xl">&gt;</p>
                </div>
            </div>
        </div>
    )
};
export default Security;