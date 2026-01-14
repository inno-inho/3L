import more_vert from "@/assets/image/more_vert.png";
import coconuttalk from "@/assets/image/coconuttalk.png";
import stat_minus from "@/assets/image/stat_minus.png";
import ChatDropdownMenu from "./ChatDropdownMenu";
import type { ChatRoomDto } from "../../types/chat";

interface Props {
    isSearchMode: boolean;
    setIsSearchMode: (v: boolean) => void;
    roomInfo: ChatRoomDto;
    searchQuery: string;
    searchResults: string[];
    currentSearchIndex: number;
    handleSearch: (q: string) => void;
    moveSearchIndex: (d: 'next' | 'prev') => void;
    handleCloseSearch: () => void;
    isChatDropdownOpen: boolean;
    setChatIsDropdownOpen: (v: boolean) => void;
    chatDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const ChatSearchHeader = ({
    isSearchMode, setIsSearchMode, roomInfo, searchQuery, searchResults,
    currentSearchIndex, handleSearch, moveSearchIndex, handleCloseSearch,
    isChatDropdownOpen, setChatIsDropdownOpen, chatDropdownRef
}: Props) => {
    return (
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
            {!isSearchMode ? (
                // 기본 모드
                <>               
                    <div className="flex items-center gap-3">
                        {/* roomImage 처리 */}
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                            {roomInfo.roomImageUrls && roomInfo.roomImageUrls.length > 0 ? (
                                <img
                                    src={roomInfo.roomImageUrls[0]}
                                    alt={roomInfo.roomName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                // 이미지가 없을 때 보여줄 기본 아이콘이나 대체 텍스트
                                <img src={coconuttalk} alt="코코넛톡 기본 이미지" />
                            )}
                        </div>

                        {/* 방 이름 및 인원수 and Search Icon */}
                        <div className="flex items-center">
                            <span className="font-bold text-[#4A3F35] leading-none">
                                {roomInfo.roomName}
                            </span>
                            {roomInfo.userCount > 2 && (
                                <span className="text-xs text-gray-400 pl-3">
                                    {roomInfo.userCount}명
                                </span>
                            )}
                            <button
                                className="h-8 w-8 pl-3"
                                onClick={() => setIsSearchMode(true)}
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* 누르면 드롭다운메뉴 나오는 곳 ... */}
                    <div
                        className="relative"
                        ref={chatDropdownRef}
                    >
                        <button
                            className=" hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full"
                            onClick={() => setChatIsDropdownOpen(!isChatDropdownOpen)}
                        >
                            <img src={more_vert} alt="채팅알람 관련 설정" className="w-7 h-7" />
                        </button>
                        
                        {/* 드롭다운 컴포넌트 적용 */}
                        <ChatDropdownMenu
                            isOpen={isChatDropdownOpen}
                            chatRoomType={roomInfo.chatRoomType}
                        />
                    </div>
                </>
            ) : (
                // 검색창 모드
                <>                         
                    <div className="flex items-center gap-4 w-full animate-in silde-in-from-top-1 duration-200">
                        {/* 검색창 */}
                        <div className="flex-1 flex items-center bg-[#F8F6F2] rounded-xl px-4 py-2 border border-transparent focus-within:border-[#B5A492] transition-all">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                autoFocus
                                className="bg-transparent flex-1 outline-none text-sm"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();         // 페이지 새로고침 
                                        
                                        // 검색 결과가 있는 상태(화살표가 있음)에서 엔터를 치면
                                        if(searchResults.length > 0){
                                            moveSearchIndex('next');    // 엔터 누르면 다음 결과로 이동
                                        }
                                    }
                                }}
                            />
                            {/* 검색 결과 컨트롤(결과가 있을 때만 표시) */}
                            {searchResults.length > 0 && (
                                <div className="flex items-center gap-3 border-1 border-gray-300 ml-2 pl-3 text-gray-500">
                                    <span className="text-[11px] font-medium min-w-[35px]">
                                        {currentSearchIndex + 1} / {searchResults.length}
                                    </span>
                                    <div className="flex gap-1">
                                        <button onClick={() => moveSearchIndex('prev')} className="p-1 hover:bg-gray-200 rounded-3xl h-5 w-5">
                                            <img
                                                src={stat_minus}
                                                alt="채팅 검색 내용 위로 이동"
                                                className="rotate-180"
                                            />
                                        </button>
                                        <button onClick={() => moveSearchIndex('next')} className="p-1 hover:bg-gray-200 rounded-3xl h-5 w-5">
                                            <img
                                                src={stat_minus}
                                                alt="채팅 검색 내용 아래로 이동"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleCloseSearch}
                            className="text-sm text-darkgray-50 hover:text-[#743F24] px-1 transition-colors font-semibold"
                        >
                            X
                        </button>
                    </div>            
                </>
            )}
        </div>
    );
};

export default ChatSearchHeader;