import React, { useState, useEffect } from 'react';

export default function EditableStepField({ value, onSave }) {
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
                <div className="editableInputGroupInput">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button className={"editableInputGroupButton"} onClick={handleSave}>✔</button>
                    <button className={"editableInputGroupButton"} onClick={() => setIsEditing(false)}>✖</button>
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
