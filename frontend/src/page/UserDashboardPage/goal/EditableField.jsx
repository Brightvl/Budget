import React, { useState, useEffect } from 'react';
import CheckIcon from "../../../assets/svg/CheckIcon.jsx";
import XIcon from "../../../assets/svg/XIcon.jsx";

export default function EditableField({ value, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleSave = () => {
        onSave(inputValue)
            .then(() => setIsEditing(false))
            .catch((error) => console.error('Failed to save:', error));
    };

    return (
        <div className="editableField">
            {isEditing ? (
                <div className="editableInputGroup">
                    <input
                        className={"editableInputGroupInput"}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                        className={"editableInputGroupButton"} onClick={handleSave}>
                        <CheckIcon>
                        </CheckIcon>
                    </button>
                    <button  className={"editableInputGroupButton"} onClick={() => setIsEditing(false)}><XIcon/></button>
                </div>
            ) : (
                <span
                    className="editableDisplay"
                    onClick={() => setIsEditing(true)}
                    title="Click to edit"
                >
                    {value}
                </span>
            )}
        </div>
    );
}
