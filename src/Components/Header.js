import React, { useState } from "react";
import useAuth from "./useAuth";

const Header = ({ onLogin }) => {
    const [isStateToggle, setStateToggle] = useState(false);

    const stateToggle = () => {
        // 상태 토클
        setStateToggle(prevState => !prevState);
    }

    const { user, isGuest, logout } = useAuth();
    
    // console.log('사용자 정보 : ', user);
    // console.log(user.username);

    return (
        <header className="header">
            <h1 className="logo">y-SmartChat</h1>
            <div className="profile_box">
                <span><strong>{user && user.role ? `${user.role}` : ''}</strong>님</span>
                <div className="profile" onClick={stateToggle}>
                    <div className={`user-panel d-flex flex-d-column ${isStateToggle ? '' : 'hidden'}`}>
                        {!isGuest ? (
                            <div>
                                <div className="profile-panel">
                                    <div className="d-flex flex-d-column">
                                        <div className="d-flex w-100 justify-content-center">
                                            <span className="profile"></span>
                                        </div>
                                        <span className="bold" style={{ marginTop: '12px', fontSize: '18px' }}>
                                            {/* {user ? user.username : 'null'} */}
                                            {user && user.role ? `${user.role}` : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="panel-btns" onClick={logout}>
                                    <div className="block bold d-flex logout-btn">
                                        <i className="logout-icon"></i>
                                        <span>로그아웃</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="profile-panel">
                                    <div className="d-flex flex-d-column">
                                        <div className="d-flex w-100 justify-content-center">
                                            <span className="profile"></span>
                                        </div>
                                        <span className="bold" style={{ marginTop: '12px', fontSize: '16px', textAlign: 'center', lineHeight: '24px'}}>
                                            {user && user.role ? `${user.role}` : ''}님<br/>
                                            로그인하고 사용하세요!
                                        </span>
                                    </div>
                                </div>
                                <div className="panel-btns" onClick={onLogin}>
                                    <div className="block bold d-flex login-btn">
                                        <i className="login-icon"></i>
                                        <span>로그인</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 

export default Header;
