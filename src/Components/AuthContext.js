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

    // 세션상태관리
    // useState를 사용하여 세션을 초기화하고 관리
    const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem(SessionKey);
        return storedTokens ? JSON.parse(storedTokens) : null;
    });

    // jwt 디코딩, 
    const [user, setUser] = useState(() => {
        return authTokens ? jwtDecode(authTokens.access_token) : null;
    });

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
            //console.log("로그인 시 통신 데이터", response.data);
            const data = response.data;
            setAuthTokens(data);
            setUser(jwtDecode(data.access_token));
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
            localStorage.setItem(SessionKey, JSON.stringify(data));
        }catch(error){
            console.log('리프레시 토큰 실패', error);
            throw error;
        }
    }, [authTokens]); // authTokens 의존성 추가

    // 로그아웃 함수
    const logout = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem(SessionKey);
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
                if(authTokens) {
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
            axios.interceptors.response.eject(requsetInterceptor);
        }
    }, [authTokens, refreshToken]); //의존성 배열

    // 초기 세션 로드 useEffect로 세션를 관리
    useEffect(() => {
        if(authTokens) {
            setUser(jwtDecode(authTokens.access_token));
        }
    }, [authTokens]);

    return(
        <AuthContext.Provider value={{ user, authTokens, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
