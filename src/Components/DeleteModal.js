import React from "react";

const DeleteModal = ({ onClose }) => {
    return (
        <div id="deleteModal" className="modal-overlay">
            <div className="modal">
                <h2 className="bold">삭제하시겠습니까?</h2>
                <div>
                    <button className="confirm bold">확인</button>
                    <button type="button" className="cancel bold" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;