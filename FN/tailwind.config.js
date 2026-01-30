/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily : {
        sans: ['"IBM Plex Sans KR"', 'sans-serif'], // 전역 기본 폰트 
        nerko: ['"Nerko One"', 'cursive'], // coconutTalk 메인 폰트
      },
    },
  },
  plugins: [],
}

