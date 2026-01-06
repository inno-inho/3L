// components/ProfileImage.tsx
import React from 'react';

import coconuttalk_bg from '@/assets/image/coconuttalk_bg.png';

interface ProfileImageProps {
  url?: string;         // 이미지 주소
  nickname?: string;    // 이미지 alt 텍스트용 (접근성)
  size?: 'sm' | 'md' | 'lg' | number; // 미리 정의된 크기 혹은 직접 입력
}

const ProfileImage = ({ url, nickname, size = 'md' }: ProfileImageProps) => {
  // 1. 크기(Size) 정의
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  // size가 문자열이면 sizeMap에서 찾고, 숫자면 style로 직접 적용
  const sizeClass = typeof size === 'string' ? sizeMap[size] : '';
  const customStyle = typeof size === 'number' ? {width: size, height: size} : {};

  // 기본 이미지
  const defaultImage = coconuttalk_bg;

  return (
    <>
        <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0`}
            style={customStyle}
        >
            <img 
                src = {url || defaultImage}
                alt = {nickname ? `${nickname}의 프로필` : '프로필 이미지'}
                className = "w-full h-full object-cover"
                // 이미지 로딩 실패 시 처리
                onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultImage;
            }}
            />
        </div>
    </>
  );
};

export default ProfileImage;