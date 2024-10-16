import React, { useState } from 'react';
import './App.css';
import './assets/css/base.css'
import './assets/css/font.css'
import './assets/css/reset.css'
import ChatArea from './Components/ChatArea';
import LoginModal from './Components/LoginModal';
import DeleteModal from './Components/DeleteModal';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import { AuthProvider } from './Components/AuthContext';

function App() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogin = () => {
      console.log("클릭 체크");
      setLoginModalOpen(true); // 로그인 모달 열기
  }
  
  return (
    <AuthProvider>
      <div className='container'>
        <Sidebar />
        <div id='smartChat'>
            <Header onLogin={handleLogin} />
            <ChatArea />
        </div>
        {/* 로그인 모달 렌더링 */}
        {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
        {isDeleteModalOpen && <DeleteModal onClose={() => setDeleteModalOpen(false)} />}
      </div>
    </AuthProvider>
  );
}

export default App;
