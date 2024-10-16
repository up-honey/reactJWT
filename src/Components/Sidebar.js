import React, { useState } from "react";

const Sidebar = () => {
    const [isStateToggle, setStateToggle] = useState(false);

    const sideMenuToggle = () => {
        setStateToggle(openState => !openState);
    }

    return (
        <div className={`sidebar ${isStateToggle ? 'collapsed':''}`}>
            <div className="header">
                <button onClick={sideMenuToggle} className="collapse-icon"></button>
                <button className="new-page-icon new"></button>
            </div>
            <div className="body">
                {/* Sidebar content goes here */}
            </div>
        </div>
    );
}

export default Sidebar;