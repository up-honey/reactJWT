import React, { createContext, useState, useEffect, useCallback } from "react"; //Children 이 훅을 제외, useCallback 추가
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// API 서버 주소
const API_SERVER = 'http://192.168.0.208:10124';

// 세션 키
const SessionKey = 'smartchat-session';

// 초기 컨텍스트 생성
export const AuthContext = createContext();

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
    
    // 토큰이 게스트 토큰인지 확인
    const isGuestToken = (tokens) => {
        // 토큰의 payload를 확인하여 게스트 토큰인지 판단
        try{
            const decoded = jwtDecode(tokens.access_token);
            return decoded.role === 'guest';
        }catch(error){
            console.log('토큰 디코딩 오류', error);
            return true;
        }
    }

    // 세션상태관리
    // useState를 사용하여 세션을 초기화하고 관리
    const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem(SessionKey);
        return storedTokens ? JSON.parse(storedTokens) : null;
    });

    // jwt 디코딩, 사용자 정보 상태관리 
    const [user, setUser] = useState(() => {
        if(authTokens) {
            if(isGuestToken(authTokens)) {
                return { role: 'guest'};
            }else {
               return jwtDecode(authTokens.access_token);
            }
        }
        return null;
    });

    // 게스트 상태 관리
    const [isGuest, setIsGuest] = useState(() => {
        return authTokens ? isGuestToken(authTokens) : true;
    });

    // 게스트 토큰 발급
    useEffect(() => {
        if(!authTokens){
            const guestToken = async () => {
                try{
                    const response = await axios.get(`${API_SERVER}/api/v1/guest`,{
                        headers:{
                            'Accept' : 'application/json'
                        }
                    });
                    const data = response.data;
                    setAuthTokens(data);
                    localStorage.setItem(SessionKey, JSON.stringify(data));
                    console.log('게스트 데이터', response.data);
                    setIsGuest(true);
                    setUser({role: 'guest'});
                }catch(error){
                    console.log("게스트 토큰 발급 실패", error);
                }
            };
            guestToken();
        }else{
            // 기존 토큰이 게스트 토큰인지 확인
            if (isGuestToken(authTokens)) {
                setIsGuest(true);
                setUser({role: 'guest'});
            } else {
                setIsGuest(false);
                setUser(jwtDecode(authTokens.access_token));
            }
        }
    }, [authTokens]);

    // 로그인 함수 access 토큰
    const login = async (username, password) => {
        try{
            const response = await axios.post(`${API_SERVER}/api/v1/login/access-token`, {
                username,
                password
            }, {
                headers: { 
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/x-www-form-urlencoded'
                    }
            });
            
            const data = response.data;
            setAuthTokens(data);
            setUser(jwtDecode(data.access_token));
            setIsGuest(false);
            localStorage.setItem(SessionKey, JSON.stringify(data));
            
            console.log("로그인 성공");
        }catch(error){
            console.log('로그인 실패', error);
            throw error;
        }
    }

    // 리프레시 토큰
    const refreshToken = useCallback(async () => {
        try{
            const response = await axios.get(`${API_SERVER}/api/v1/login/access-token`, {

            }, {
                headers: { 
                    'Accept' : 'application/json',
                    'Authorization' : `${authTokens.token_type} ${authTokens.refresh_token}`
                 }
            });
            const data = response.data;
            setAuthTokens(data);
            setUser(jwtDecode(data.access_token));
            setIsGuest(false);
            localStorage.setItem(SessionKey, JSON.stringify(data));
        }catch(error){
            console.log('리프레시 토큰 실패', error);
            throw error;
        }
    }, [authTokens]); // authTokens 의존성 추가

    // 로그아웃 함수
    const logout = () => {
        setAuthTokens(null);
        setUser({role: 'guest'});
        setIsGuest(true);
        localStorage.removeItem(SessionKey);

        // 로그아웃 후 다시 게스트 토큰 발급 로직 필요
        const guestToken = async () => {
            try{
                const response = await axios.get(`${API_SERVER}/api/v1/guest`,{
                    headers:{
                        'Accept' : 'application/json'
                    }
                });
                const data = response.data;
                setAuthTokens(data);
                localStorage.setItem(SessionKey, JSON.stringify(data));
                console.log('게스트 데이터', response.data);
                setIsGuest(true);
                setUser({role: 'guest'});
            }catch(error){
                console.log("게스트 토큰 발급 실패", error);
            }
        };
        guestToken();
    }

    // 토큰 만료 여부 확인, 디코딩
    const isToKenExpired = (token) => {
        if(!token) return true;
        const decode = jwtDecode(token);
        const now = Date.now().valueOf() / 1000;
        return decode.exp < now;
    }

    // Axios 인터셉터 사용해 모든 요청을 자동으로 인증헤더로 포함
    // 토큰이 만료되었을 경우 자동으로 리프레시 토큰을 사용하여 새로운 토큰을 받아 재요청
    useEffect(() => {
        const requsetInterceptor = axios.interceptors.request.use(
            async(config) => {
                if(authTokens && !isGuest) {
                    if(isToKenExpired(authTokens.access_token)){
                        await refreshToken();
                    }
                    config.headers['Authorization'] = `${authTokens.token_type} ${authTokens.access_token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requsetInterceptor);
            //axios.interceptors.response.eject(requsetInterceptor);
        }
    }, [authTokens, refreshToken, isGuest]); //의존성 배열

    // 초기 세션 로드 useEffect로 세션를 관리
    useEffect(() => {
        if(authTokens && !isGuest) {
            setUser(jwtDecode(authTokens.access_token));
        }
    }, [authTokens, isGuest]);

    return(
        <AuthContext.Provider value={{ user, authTokens, isGuest, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
