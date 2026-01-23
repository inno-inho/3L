# 3L

## 메신저 구현을 위한 참고 사이트 
https://qkrqkrrlrl.tistory.com/193

## 캘린더 구현하기
https://www.youtube.com/watch?v=fIUxbj1f7SE
https://junesker.tistory.com/125?category=1238556

## 기획,설계 예시 유투브
https://www.youtube.com/watch?v=NTZgPYlassE&list=PLbq5jHjpmq7q-Td2jOXtpf7SD5c53RqXh&index=1
- 이 유투버가 문서화 해놓은거
https://www.youtube.com/redirect?event=comments&redir_token=QUFFLUhqbXVjNkZoQVVybExZUDg4VkhKZ3hUOTNYYW5kQXxBQ3Jtc0tuVFlyX1FPZGVzaTFoTmwwLTJxYzc3ZnBmQ2Z6Nk5wS0JUWHd2NzJjbExUOUNOa1k0TDA5RmhlY2VfOFlKalNzWkdETWtKNS1MQkJJYmJ3cG5sNXRBclA3eXdPX3RKM0NaN0J3cEdWZGZ5bEtCOG5PTQ&q=https%3A%2F%2Fprickle-textbook-12d.notion.site%2FHoons-Board-REST-API-89f600999f6548ff998d8ec8211062a7%3Fpvs%3D4
- 피그마
- https://www.youtube.com/redirect?event=comments&redir_token=QUFFLUhqbG45dDkxZWh2T3laQUVGeHZ2ODBVMWxQbTg5QXxBQ3Jtc0tuUnE0R1Y4NHdGdW1IdGxWSVJ0c1hmWFFTVWxmb2xqNkp6OEtZblpBeUVkMFFUMjRzSDNfRGV1d3piNkUwTm9BX2ZOYVFsa2JNb1dGbzk0bGs4eHNzU3pvd3g5QS1fazhtU1hoN1dxdVJWRkVWaTVGWQ&q=https%3A%2F%2Fwww.figma.com%2Ffile%2FMrSRMXiws59G33s8Wpo8Ni%2F%25ED%2595%2599%25EC%2583%259D%25EC%259A%25A9-%28Copy%29%3Ftype%3Ddesign%26node-id%3D0%253A1%26mode%3Ddesign%26t%3D7iQ8crkyU2l6Z7Pv-1

## Tainwind Youtube
https://youtu.be/Y3Vauv7Rpkk?si=uIz9n7VKZaoOggtx

## TypeScript Youtube
https://youtu.be/vs9lFblZ7oE?si=0tqi5_Nz9jKBWM6G


## Modal 사용법

1. 사용하고 싶은 컴포넌트(전역 적용되니까 최상단이 좋긴함)에서 모달 함수를 useModal에서 가져온다. showAlert는 확인만 있는 Modal, showConfirm은 확인, 취소 버튼이 같이 있는 Modal
` const { showAlert, showConfirm } = useModal(); `

2-1. AlertModal 사용법 

- 밑과 같이 필요한 곳에 showAlert를 넣고 넣고싶은 제목{title}과 본문 내용{message}을 넣는다. (ex: 제목 == '전송실패', 본문 == '메시지 전송에 실패했습니다')
```
} catch (error) {
            console.error("전송 에러: ", error);
            showAlert("전송 실패", "메시지 전송에 실패했습니다.");
        }
```

2-2.1. ConfirmModal 사용법. 
- 사용할 곳의 상위 컴포넌트에 적용시킬 함수를 설정한다.
- onDeleteClick은 '삭제하기'라는 버튼을 누르면 모달을 띄울 함수, AlertModal과 같이 title과 message 설정을 해준다
- 예를 들어 삭제 버튼을 눌렀을 시 실제로 삭제되기 위한 함수(예: executeDelete) 를 만든다
```
// 삭제 버튼 클릭 시 실행된 핸들러
    const onDeleteClick = (messageId: string) => {
            showConfirm("메시지 삭제", "정말 이 메시지를 삭제하시겠습니까?", () => {
            executeDelete(messageId);
        })
    }

    // 실제 삭제 API 호출 로직(ConfrimModal 안에서의 확인 버튼을 누를)
    const executeDelete = async (messageId: string) => {
        try {
            await api.delete(`/chatrooms/messages/${messageId}?email=${currentUser?.email}`);
        } catch (error) {
            console.error("삭제 실패: ", error);
            showAlert("삭제 실패", "메시지 삭제 중 오류가 발생했습니다.");
        }
    };
```

2-2.2 적용시킬 곳에 2-2.1에서 만들어둔 클릭 함수를 연결한다.
- 예시: 채팅기능의 ChatWindow.tsx
```
{/* 메시지 리스트 영역 */}
                <ChatMessageList 
                    messages={messages}
                    currentUser={currentUser}
                    scrollRef={scrollRef}
                    messagesEndRef={messagesEndRef}
                    messageRefs={messageRefs}
                    handleScroll={handleScroll}
                    onDeleteClick={onDeleteClick}
                    onReplyClick={onReplyClick}
                />
```

***쓰는 방법을 전체적인 그림으로 예시로 들자면***
```
import React from 'react';
import { useModal } from "../../context/ModalContext";  // modal
import api from "../../api/api";

const MessageItem = ({ msg }) => {
    const { showConfirm, showAlert } = useModal();  // modal

    // 1. 삭제 버튼 클릭 핸들러
    const handleDeleteClick = () => {
        // showConfirm(제목, 메시지, 확인시_실행할_함수)  
        showConfirm(      // modal
            "메시지 삭제", 
            "이 메시지를 정말로 삭제하시겠습니까?", 
            () => executeDelete() // '확인'을 눌렀을 때만 이 함수가 실행됨
        );
    };

    // 2. 실제 API 호출 로직
    const executeDelete = async () => {
        try {
            await api.delete(`/messages/${msg.id}`);
            showAlert("성공", "삭제되었습니다.");  // modal
        } catch (error) {
            showAlert("오류", "삭제에 실패했습니다.");  // modal
        }
    };

    return (
        <div className="message-item">
            <p>{msg.content}</p>
            {/* 사용자가 누르는 버튼 */}
            <button onClick={handleDeleteClick}>삭제</button>  // ConfrimModal 연결하는 함수
        </div>
    );
};
```
