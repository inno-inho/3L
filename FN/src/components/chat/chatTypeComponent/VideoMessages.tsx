interface VideoMessageProps {
    url: string;
}

const VideoMessage = ({ url }: VideoMessageProps) => {
  return (
    <>
        <div className="rounded-xl overflow-hidden border border-gray-100 bg-black relative group">
            <video
                src={`${url}#t=0.1`} // 첫 0.1초 지점을 썸네일로 활용
                className="w-full max-h-[300px] object-cover cursor-pointer"
                preload="metadata"
                controls // 재생 바 표시
            />
            {/* 커스텀 재생 버튼 UI를 넣고 싶다면 여기에 추가 가능 */}
        </div>
    </>
  );
};

export default VideoMessage;