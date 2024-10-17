import React, { useState, useEffect, useRef } from 'react';
import useAuth from './useAuth';
import axios from 'axios';

const ChatArea = () => {
    const { API_SERVER } = useAuth();
    const [input, setInput] = useState(''); //인풋 설정 
    const [messages, setMessages] = useState([]); // 메세지 배열 설정
    const chatEndPoint = useRef(null); // 채팅 끝포인트 체크
    const [isToggle, setIsToggle] = useState(false);

    const IsToggle = () => {
        setIsToggle(toggle => !toggle);
    }

    // 채팅
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if(!input.trim()) return; //빈값 입력 막기

        const textMessages = {role: 'user', content: input}; // 메세지에 인풋 값 설정
        setMessages(prevMessages => [...prevMessages, textMessages]); // 전개 연산자로 배열 데이터로 업데이트함
        setInput(''); // 인풋 초기화

        try{
            const response = await axios.post(`${API_SERVER}/api/v1/chat`, 
                { messages: input },
                { headers : { 'Content-Type': 'application/json' }}
            );
            console.log('api server : ', API_SERVER);
            const chatBotMessage = {
                role: 'chatBot',
                content: response.data.response || '응답이 없습니다.'
            };
            console.log('server request: ', response.data);
            setMessages(prevMessages => [...prevMessages, chatBotMessage]);
        }catch(error){
            console.log('API 호출 오류', error);

            const errorMessage = {
                role : 'chatBot',
                content: 'API 호출 중 오류'
            }
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
    };

    // 입력 창 끝 포인트 내려주기
    // useEffect(() => {
    //     chatEndPoint.current?.scrollIntoView({ behavior: "smooth"});
    // }, [messages]);

    return (
        <section id="chatArea">
            <div className="chatConversation">
                <div className="inner">
                    <div id="chatResult">
                        <div className="reply-chat">
                            <div className="chat-cont">
                                <p>🤖 안녕하세요. 저는 y-SmartChat입니다. <br />무엇이든 물어봐 주세요!</p>
                            </div>
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-cont ${msg.role}`}>
                                    <p>
                                        {msg.role === 'user' ? '' : ''}{msg.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div id="chatForm">
                <div className="inner">
                    <div className={`textareaWrap ${isToggle ? 'focused' : ''}`}>
                        <div>
                            <form onSubmit={handleChatSubmit}>
                                <button type="button" className="file">파일 첨부</button>
                                <textarea 
                                    id="chatTextarea" 
                                    rows="1" 
                                    placeholder="무엇이든 물어보세요"
                                    // ref={chatEndPoint}
                                    onChange={(e => setInput(e.target.value))}
                                    value={input}
                                    onClick={IsToggle}
                                >
                                </textarea>
                                <button type="submit" className="submit" id="save">전송하기</button>
                            </form>
                        </div>
                    </div>
                    <p>y-SmartChat은 실수를 할 수 있습니다. 중요한 정보를 확인하세요</p>
                </div>
            </div>
        </section>
    );
};

export default ChatArea;
