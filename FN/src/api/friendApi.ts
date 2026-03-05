import api from "@/api/api";
import { mockFriendships, dummyFriendRequests, dummyBlockedUsers, dummyUsers } from "@/mock/mockFriend";

// 더미모드
const USE_MOCK = true;

export const getFriends = async () => {
    if (USE_MOCK) {
        return mockFriendships;
    }
    const response = await api.get("/friends");
    return response.data;
}

// -------------------------------- 친구 요청 모달(FreindRequestModal) ----------------------------------
// 친구 요청 목록
export const getFriendRequests = async () => {
    if(USE_MOCK) {
        return dummyFriendRequests;
    }

    const response = await api.get("/friends/pending");
    return response.data;
};
// 친구 요청 수락
export const acceptFriendRequest = async (requesterEmail: string) => {
    if(USE_MOCK) {
        return true;
    }
    await api.post(`/friends/accept?requesterEmail=${requesterEmail}`);
}
//  친구 요청 거절
export const rejectFriendRequest = async (requesterEmail: string) => {
    if(USE_MOCK) {
        return true;
    }
    await api.post(`/friends/reject?requesterEmail=${requesterEmail}`);
};

// -------------------------------- 친구추가모달(FreindAddModal) ----------------------------------
// 유저 검색
export const searchUsers = async (keyword: string) => {
    if(USE_MOCK){
        return dummyUsers.filter(user =>
            user.email.includes(keyword) || 
            user.nickname.includes(keyword)
        );
    }
    
    const response = await api.get(`/friends/search?keyword=${keyword}`);
    return response.data;
}
// 친구 요청 보내기
export const requestFriend = async (targetEmail: string) => {
    if(USE_MOCK){
        return true;
    }

    await api.post(`/friends/request?targetEmail=${targetEmail}`);
}

// -------------------------------- 차단 친구 모달(FreindBlockedModal) ----------------------------------
// 차단 API
export const blockFriend = async (targetEmail: string) => {
    if(USE_MOCK) {
        return true;
    }
    await api.post(`friends/block?targetEmail=${targetEmail}`);
}
// 차단 목록 조회
export const getBlockedUsers = async () => {
    if (USE_MOCK) {
        return dummyBlockedUsers;
    }

    const response = await api.get("/friends/blocked-list");
    return response.data;
}

// 차단 해제
export const unblockFriend = async(targetEmail: string) => {
    if (USE_MOCK) {
        return true;
    }

    await api.delete(`/friends/unblock?targetEmail=${targetEmail}`);
}

// 친구 삭제
export const deleteFriend = async (targetEmail: string) => {
    if(USE_MOCK){
        return true;
    }

    await api.delete(`/friends/delete?targetEmail=${targetEmail}`);
};