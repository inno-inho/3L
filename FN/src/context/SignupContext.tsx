import { createContext, useContext, useState } from "react";

/**
 * 1. 유니온 타입 (Union Type) 활용
 * 회원가입은 딱 이 5가지 상태만 가질 수 있다고 선언
 * 단계를 숫자(1, 2, 3)가 아닌 의미 있는 단어로 정의
 * -> 코드를 읽을 때 "지금이 약관 동의 단계라는 걸 알 수 있음 (가독성↑)
 */
export type SignupStep =
  | "START"
  | "TERMS"   // 약관동의
  | "EMAIL"   // 이메일입력 + 인증번호
  | "PROFILE"; // 프로필설정

/**
 * 2. 인터페이스 (Interface)
 * 메모장에 어떤 항목(데이터)과 어떤 도구(함수)가 있는지 미리 목록을 작성하는 설계도
 * 메모장의 '목차'와 동일
 * 무엇이 저장되어 있고(데이터), 어떻게 수정할 수 있는지(함수)를 미리 정의하여 코딩 실수(오타, 잘못된 데이터 입력 등)를 방지하는 역할
 */
interface SignupContextType {
  step: SignupStep; //현재 사용자가 회원가입의 어느 단계(약관 동의, 이메일 입력 등)에 머물고 있는지 보여주는 값
  //set 함수 : 메모장의 내용을 수정하고 싶을 때 누르는 버튼
  setStep: (step: SignupStep) => void; // 단계를 'EMAIL'로 바꿔!"라고 명령할 때 쓰는 함수

  // Entity와 매칭되는 필드들
  email: string; //사용자가 입력창에 타이핑한 이메일 주소 그 자체
  setEmail: (v: string) => void; // 메모장의 이메일 칸에 'abc@test.com'이라고 적어!"라고 시킬 때 사용
  password: string;
  setPassword: (v: string) => void;
  nickname: string;
  setNickname: (v: string) => void;
  username: string;     //추가: 실명/내부 식별용 이름
  setUsername: (v: string) => void;
  phone: string;        //추가: 연락처
  setPhone: (v: string) => void;


  isEmailVerified: boolean; //이메일 인증을 마쳤는지(true) 아직 안 했는지(false)를 나타내는 전등 스위치 같은 값
  setIsEmailVerified: (v: boolean) => void; // 인증이 성공하면 "이메일 인증 완료 상태를 '참'으로 변경해!"라고 지시하는 도구
}

/**
 * 3. Context 생성 (저장소 본체)
 * 초기값 null: 실수로 Provider 밖에서 이 메모장을 쓰려고 하면 
 * 에러를 발생시켜서 개발자의 실수를 방지함 (안전장치)
 */
const SignupContext = createContext<SignupContextType | null>(null);

/**
 * 4. SignupProvider (데이터 공급 장치)
 * 실제 상태를 관리하는 컴포넌트
 * App.tsx에서 이 컴포넌트로 하위 페이지들을 감싸면 그 안의 모든 컴포넌트가 동일한 메모장을 공유함
 */
export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  // useState : React에게 "나 이런 데이터를 저장할 칸이 필요해"라고 요청하는 명령어
  const [step, setStep] = useState<SignupStep>("START");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  return (
    // value 안에 담긴 데이터들이 하위 컴포넌트들에게 전달됨
    <SignupContext.Provider
      value={{
        step,
        setStep,
        email,
        setEmail,
        password,
        setPassword,
        nickname,
        setNickname,
        username,
        setUsername,
        phone,
        setPhone,
        isEmailVerified,
        setIsEmailVerified,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

/**
 * 5. 커스텀 훅 (useSignup)
 * 다른 파일에서 메모장을 꺼내 쓸 때 매번 useContext를 쓰는 번거로움을 줄여줌
 * "메모장 빌려줘!"라고 말하는 단축키 같은 역할
 */
export const useSignup = () => {
    const ctx = useContext(SignupContext);

    //만약 감싸진 범위 밖에서 호출한다면 경고를 띄움
    if(!ctx) {
        throw new Error(
            "useSignup은 SignupProvider 안에서만 사용가능합니다."
        );
    }

    return ctx;
}