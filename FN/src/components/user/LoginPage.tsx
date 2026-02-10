import {Link} from 'react-router-dom';
import logo from '@/assets/image/coconuttalk.png';
// import SocialLogin from "@/components/auth/SocialLogin";

const LoginPage: React.FC = () => {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[#fff9ed] relative">
            <div className="w-[500px] bg-white border-2 border-[#6F4E37] rounded-md p-4 my-4" >
                <div className="flex items-center justify-center gap-1 mb-4">
                    <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                    <h1 className="text-7xl font-nerko text-[#6F4E37] tracking-tight leading-none">
                        CoconutTalk
                    </h1>
                </div>
                <div className="mb-4">
                    <form className="flex flex-col my-1 w-[380px] mx-auto">
                        <input type="text" placeholder='코코넛톡 계정(이메일)' className="border rounded-sm p-2 my-2 " />
                        <input type="text" placeholder='비밀번호' className="border rounded-sm p-2 my-2" />
                        <button type="submit" className="border rounded-md p-2 my-2 hover:bg-[#6F4E37] hover:text-white">로그인</button>
                    </form>
                    <div className="flex items-center mt-5 my-4 px-3">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 text-sm text-gray-500">또는</span>
                        <div className="flex-grow border-t border-gray-300" />
                    </div>
                    <div className="flex justify-center items-center mx-auto text-sm">
                        <Link to="#" className="px-2 hover:text-gray-600 hover:underline">코코넛톡 계정 찾기</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="#" className="px-2 hover:text-gray-600 hover:underline">비밀번호 재설정</Link>
                    </div>
                </div>
                <div className="w-full mt-15 px-3 pt-4 border-t-2 border-[#6F4E37] text-lg">
                    계정이 없으신가요?
                    <Link to="/auth/signup" className="ml-1 font-bold text-[#6F4E37] hover:underline"> 회원가입</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
