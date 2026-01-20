// /**
//  * SignupLayout.tsx
//  * ------------------------
//  * 현재 step 값에 따라
//  * "보여줄 화면 하나만" 렌더링
//  */

// import { useSignup } from "../../context/SignupContext";

// import SignupStart from "./SignupStart";
// import SignupTerms from "./SignupTerms";
// import SignupEmail from "./SignupEmail";
// import SignupVerify from "./SignupVerify";
// import SignupProfile from "./SignupProfile";

// const SignupLayout = () => {
//   const { step } = useSignup();

//   switch (step) {
//     case "START":
//       return <SignupStart />;
//     case "TERMS":
//       return <SignupTerms />;
//     case "EMAIL":
//       return <SignupEmail />;
//     case "VERIFY":
//       return <SignupVerify />;
//     case "PROFILE":
//       return <SignupProfile />;
//     default:
//       return null;
//   }
// };

// export default SignupLayout;
