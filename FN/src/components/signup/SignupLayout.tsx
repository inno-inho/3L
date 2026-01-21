/**
 * SignupLayout.tsx
 * ------------------------
 * 현재 step 값에 따라
 * "보여줄 화면 하나만" 렌더링
 */

import { useSignup } from "../../context/SignupContext";

import SignupStart from "./SignupStart";
// import SignupTerms from "./SignupTerms";
// import SignupEmail from "./SignupEmail";
// import SignupVerify from "./SignupVerify";
// import SignupProfile from "./SignupProfile";

const SignupLayout = () => {
  const { step } = useSignup();

  //switch문을 이용한 조건부 렌더링(Conditional Rendering)수행
  //step이라는 변수에 들어있는 값이 무엇인지에 따라 내보낼 그릇 결정
  switch (step) {
    case "START":
      return <SignupStart />; //SignupStart컴포넌트(화면)을 끼워줘
    // case "TERMS":
    //   return <SignupTerms />;
    // case "EMAIL":
    //   return <SignupEmail />;
    // case "VERIFY":
    //   return <SignupVerify />;
    // case "PROFILE":
    //   return <SignupProfile />;
    default:
        // if 정의되지 않은 값이 들어온다면 아무것도 보여주지 않는 안전장치
      return null;
  }
};

export default SignupLayout;
