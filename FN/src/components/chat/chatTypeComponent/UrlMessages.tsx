import React from 'react';
import type { ChatMessageDto } from '../../../types/chat';



const UrlMessages = ({ msg, isMine }: { msg: ChatMessageDto; isMine: boolean }) => {
    // 가정: msg.metadata 안에 ogTitle, ogImage, ogDescription이 들어있다고 가정
    // 데이터가 없다면 기본 텍스트 링크로 폴백 처리
    const { ogTitle, ogDescription, ogImage, url } = msg.metadata || {};

    // 데이터가 아예 없는 경우 렌더링 안함
    if (!ogTitle && !ogImage) return null;
    return (
        <>
            <div
                className='mt-2 w-full max-w-[260px] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => window.open(url || msg.message, '_blank')}
            >
                {ogImage && (
                    <div className="w-full h-32 overflow-hidden bg-gray-100">
                        <img
                            src={ogImage}
                            alt='preview'
                            className='w-full h-full object-cover'
                            // 이미지 로드 실패 시 처리
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                )}
                <div className='p-2.5'>
                    <h4 className='text-[13px] font-bold text-gray-800 truncate'>
                        {ogTitle || "링크 미리보기"}
                    </h4>
                    {ogDescription && (
                        <p className='text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug'>
                            {ogDescription}
                        </p>
                    )}
                    <span className='text-[10px] text-blue-500 mt-1.5 block truncate opacity-80'>
                        {url || msg.message}
                    </span>
                </div>
            </div>
        </>
    );
};

export default UrlMessages;