import { useState } from 'react';
import search from '@/assets/image/search.svg';

const faqList = [
  {
    question: "Q. 코코넛톡의 비밀번호가 기억나지 않아요",
    answer: "설정(⚙️) > 보안 메뉴에서 비밀번호를 변경할 수 있습니다."
  },
  {
    question: "Q. 코코넛톡에 등록된 전화번호를 바꾸고 싶어요.",
    answer: `아래의 경로로 인증된 연락처를 최신화해 주세요.

            • 코코넛톡 > 설정(⚙️) > 계정정보 > 로그인 정보 > 전화번호

            사용 중인 코코넛계정의 비밀번호 입력 후 
            새로운 전화번호로 인증을 완료하면 전화번호가 변경됩니다. `                 
  },
  {
    question: "Q. 인증메일이 오지 않아요. 어떻게 하나요?",
    answer: `이메일형식을 올바르게 입력하였는지 다시 한번 확인해 주세요.
            
            하루가 지나도 인증번호가 도착하지 않을 경우 고객센터를 통해 문의해 주세요.`
  },
  {
    question:"",
    answer:``
  }                           
];

const CustomerCenter = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
        setOpenIndexes(prev => 
            prev.includes(index)
            ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return(
        <div>
            <div className="text-left w-full max-w-lg mx-auto mt-4 mb-10">
                <h1 className="text-3xl font-bold my-2">고객센터</h1>
                <p>무엇을 도와드릴까요?</p>
            </div>
            <div className="flex justify-between w-full max-w-2xl mx-auto border border-[#743F24] rounded-lg focus-within:ring-1 focus-within:ring-[#743F24]">
                <input className="flex-grow p-2 m-2 rounded-lg bg-transparent outline-none" type="text" placeholder="궁금하신 점을 검색해보세요." />
                <button className="flex-shrink-0 hover:scale-110 transition-transform active:opacity-70">
                    <img src={search} alt="검색" className="mr-2 w-7 h-7 opacity-60 pointer-eventes-none" />
                </button>
            </div>
            
            <div className="w-full max-w-lg mx-auto mt-4 mb-10">
                <h2 className="text-left text-2xl font-bold my-5">자주 묻는 질문</h2>
                {faqList.map((faq, index) => (
                    <div key={index} className="mb-10" >
                        <button 
                            onClick={() => handleClick(index)}
                            className="w-full font-semibold text-left"
                        >
                            {faq.question}
                        </button>
                        {openIndexes.includes(index) && (
                            <p className="m-2 whitespace-pre-line text-left">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <button type="button" className="w-28 mx-2 px-4 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-gray-300 hover:text-white transition-all">더보기</button>
                <button type="button" className="w-38 mx-2 px-4 py-2 rounded-lg border border-[#743F24] text-[#743F24] hover:bg-[#743F24] hover:text-white transition-all">문의 남기기</button>
            </div>
        </div>
    )
}
export default CustomerCenter;