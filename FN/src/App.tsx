import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('백엔드 연결 중...')

  useEffect(() => {
    fetch('/api/hello') // vite.config.ts의 proxy 설정으로 인해 백엔드로 연결됨
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage('연결 실패: ' + err))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>CoconutTalk 놀러 가고 싶다 운영배포/ 개발 분리 </h1>
      <p>백엔드 메시지: <strong>{message}</strong></p>
    </div>
  )
}

export default App