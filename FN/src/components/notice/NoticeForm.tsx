// 등록 수정 공용
const NoticeForm = () =>{
    return (
        <div className="flex bg-white">
            <main className="flex-1 bg-white">
                <div className="max-w-4xl p-8">
                    <h1 className="text-3xl font-bold text-left mb-4">공지사항 &gt; 등록</h1>
                    <hr/>
                </div>
                <form className="px-8">
                    <div className="flex flex-row items-center space-y-2">
                        <label for="noticeTitle" class="font-semibold text-gray-700 text-left mx-8 w-24">제목</label>
                        <input placeholder="제목을 입력해주세요." type="text" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" id="noticeTitle" />
                    </div>
                    <div className="flex flex-row items-center space-y-2">
                        <label className="font-semibold text-gray-700 text-left mx-8 w-24">파일첨부</label>
                        <button className="border px-4 py-2 rounded-lg hover:bg-gray-300 transition">내 PC</button>
                    </div>
                    <div className="flex flex-row items-center space-y-2 ">
                        <label for="noticeContent" class="font-semibold text-gray-700 text-left mx-8 w-24">내용</label>
                        <textarea placeholder="내용을 입력해주세요." id="noticeContent" className="min-h-80 p-2 flex-1 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div className="py-8">
                        <button type="button" className="w-20 px-4 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all" >등록</button>
                    </div>
                </form>
            </main>

        </div>
    )
}

export default NoticeForm