import React, { useState } from "react";
import useAuth from "./useAuth";

const LoginModal = ({ onClose }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await login(username, password);
            onClose();
        }catch(err){
            setError('로그인 실패, 다시 로그인하세요.')
        }
    };

    return (
        <div id="loginModal" className="modal-overlay">
            <div className="modal">
                <h2 className="bold">로그인</h2>
                <form id="loginForm" onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" id="username" name="username" required onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="error">{error}</p>}
                    <div>
                        <button className="login bold">로그인</button>
                        <button type="button" className="cancel bold" onClick={onClose}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;