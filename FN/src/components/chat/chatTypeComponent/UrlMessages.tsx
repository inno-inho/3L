import React from 'react';
import type { ChatMessageDto } from '../../../types/chat';



const UrlMessages = ({ msg, isMine }: {msg: ChatMessageDto; isMine: boolean}) => {
    // 가정: msg.metadata 안에 ogTitle, ogImage, ogDescription이 들어있다고 가정
    // 데이터가 없다면 기본 텍스트 링크로 폴백 처리
    const { ogTitle, ogDescription, ogImage, url } = msg.metadata || {};

    return(
        <>
            <div className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[260px] rounded-2xl overflow-hidden border ${
                        isMine ? 'bg-white border-yellow-200' : 'bg-white border-gray-200'
                        } shadow-sm cursor-pointer hover:opacity-95 transition-opacity`}
                    onClick={() => window.open(url || msg.message, '_blank')}
                >
                    {/* 사이트 썸네일 이미지 */}
                    {ogImage && (
                        <img 
                            src={ogImage} alt='preview' className='w-full h-32 object-cover border-b border-gray-100'
                        />
                    )}

                    {/* 메타데이터 텍스트 */}
                    <div className='p-3 bg-white'>
                        <h4 className='text-sm font-bold text-gray-800 truncate'>{ogTitle || "링크 공유"}</h4>
                        <p className='text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed'>
                            {ogDescription || msg.message}
                        </p>
                        <span className='text-[10px] text-blue-500 mt-2 block truncate'>{url || msg.message}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UrlMessages;