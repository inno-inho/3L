import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const ConnectionTest: React.FC = () => {
  const [message, setMessage] = useState<string>('백엔드 연결 중...');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
      // axios 인스턴스 api 사용
      api.get('/hello')
      .then(response => {
        setMessage(response.data)
        setStatus('success');
      })
      .catch(error => {
        setMessage('연결 실패: ' + (error instanceof Error ? error.message : String(error)));
        setStatus('error');
      });
  }, []);

  return (
    <>
      <div className={`p-4 border rounded-lg shadow-sm mb-6 ${
        status === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className="text-lg font-bold mt-0 mb-2 flex items-center gap-2">
          Backend Connection Test
        </h3>
      
        <div className="space-y-1 text-sm">
          <p className="text-gray-700">
            상태: <span className={`font-bold uppercase ${
              status === 'error' ? 'text-red-600' : 'text-blue-600'
            }`}>{status}</span>
          </p>
        
          <p className="text-gray-700">
            메시지: <code className={`px-2 py-0.5 rounded font-mono ${
              status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>{message}</code>
          </p>
        </div>
      </div>
    </>
  );
};

export default ConnectionTest;