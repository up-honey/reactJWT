import React from 'react';

const ChatArea = () => {
    return (
        <section id="chatArea">
            <div className="chatConversation">
                <div className="inner">
                    <div id="chatResult">
                        <div className="reply-chat">
                            <div className="chat-cont">
                                <p>안녕하세요. 저는 y-SmartChat입니다. <br />무엇이든 물어봐 주세요!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="chatForm">
                <div className="inner">
                    <div className="textareaWrap">
                        <div>
                            <form action="">
                                <button type="button" className="file">파일 첨부</button>
                                <textarea id="chatTextarea" rows="1" placeholder="무엇이든 물어보세요"></textarea>
                                <button type="button" className="submit" id="save">전송하기</button>
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
