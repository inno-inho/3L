import type { FriendRequestModalProps, Friendship } from '@/types/friend';
import type { BlockedUser } from "@/types/friend";
  
// mockFriends -> 나중에 API 응답으로 교체
export const mockFriendships: Friendship[] = [
    {
        id: 100, // friendship id
        status: "ACCEPTED",
        friend:{
            id:1,
            name: "변우석",
            email:"bws123@gmail.com",
            statusMessage: "취업 파이팅!",
            profileImage: "/profile/111.jpg",
        },
    },
    {
        id: 101,
        status:"ACCEPTED",
        friend:{
            id: 2,
            name: "김선호",
            email:"kshoho345@naver.com",
            statusMessage: "취업 성공 기원",
            profileImage: "",
        },
    },
    {
        id: 102,
        status:"ACCEPTED",
        friend: {
            id: 3,
            name: "강동원",
            email:"",
            statusMessage: "조각미남 등장",
            profileImage: "/profile/333.jpg",
        },
    },
    {
        id: 103,
        status:"ACCEPTED",
        friend: {
            id: 4,
            name: "장릉혁",
            email:"thajahao@naver.com",
            statusMessage: ".",
            profileImage: "/profile/444.jpg",
        },
    },
    {
        id: 104,
        status:"ACCEPTED",
        friend: {
            id: 5,
            name: "주익연",
            email:"halo@gmail.com",
            statusMessage: "Sie Sie",
            profileImage: "/profile/555.jpg",
        },
    },
    {
        id: 105,
        status:"ACCEPTED",
        friend: {
            id: 6,
            name: "진비우",
            email:"jin@chinese.com",
            statusMessage: "Hi Nice to meet U",
            profileImage: "/profile/666.jpg",
        },
    },
    {
        id: 106,
        status:"ACCEPTED",
        friend: {
            id: 7,
            name: "빵빵덕",
            email:"duchisking@hanmail.net",
            statusMessage: "안녕하세여",
            profileImage: "/profile/777.jpg",
        },
    },
];

// 친구 요청 모달(FriendRequestModal)
export const dummyFriendRequests:FriendRequestModalProps[] = [
    {
        email: "apple123@gmail.com",
        nickname: "코코넛러버"
    },
    {
        email: "banana77@gmail.com",
        nickname: "바나나킥"
    },
    {
        email: "carrot99@gmail.com",
        nickname: "당근당근"
    }
];

// 친구 추가 모달(FriendAddModal)
// 친구 리스트 확인용 데이터
export const dummyUsers = [
    { email: "coco1@gmail.com", nickname: "코코넛왕" },
    { email: "bsw1031@gmail.com", nickname: "rombird" },
    { email: "jcw0927@naver.com", nickname: "more as mill" },
    { email: "gdw0118@gmail.com", nickname: "임새롬" },
    { email: "verylongemailaddress123456@gmail.com", nickname: "엄청긴닉네임테스트입니다" }
];

// 차단 - 더미데이터
export const dummyBlockedUsers: BlockedUser[] = [
    { email: "blocked1@naver.com", nickname: "차단유저1"},
    { email: "blocked22@naver.com", nickname: "차단유저2"},
    { email: "blocked333@naver.com", nickname: "차단유저3"},
    { email: "blocked4444@naver.com", nickname: "차단유저4"},
    { email: "blocked55555@naver.com", nickname: "차단유저5"},
];