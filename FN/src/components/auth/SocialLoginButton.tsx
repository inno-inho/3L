// export default function SocialLoginButton({
//     icon,
//     text,
//     bgColor,
//     textColor,
//     border=false,
//     onClick,
// }) {
//     return(
//         <button
//             onClick={onClick}
//             className={`flex items-center justify-center gap-3 w-full py-3 rounded-lg
//                         text-sm font-medium transition ${bgColor} ${textColor} ${border ? "border border-gray-300" : ""} hover:brightness-95
//                         `}
//         >
//             <img src={icon} alt="" className="w-10 h-10" />
//             <span>{text}</span>
//         </button>
//     );
// }