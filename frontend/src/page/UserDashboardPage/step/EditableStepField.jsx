import React, {useEffect, useState} from 'react';
import XIcon from "../../../assets/svg/XIcon.jsx";
import CheckIcon from "../../../assets/svg/CheckIcon.jsx";

export default function EditableStepField({ value, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        if (isEditing) {
            setInputValue(value); // Сброс значения на актуальное при начале редактирования
        }
    }, [isEditing, value]);

    const handleSave = () => {
        onSave(inputValue)
            .then(() => setIsEditing(false))
            .catch((error) => console.error('Failed to save:', error));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setInputValue(value); // Сброс значения при отмене
    };

    return (
        <div className="editableField">
            {isEditing ? (
                <div className="editableInputGroup">
                    <textarea
                        className={"editableInputGroupInput"}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="editableInputGroupButtonBox">
                        <button className={"editableInputGroupButton"} onClick={handleSave}>
                            <CheckIcon/>
                        </button>
                        <button className={"editableInputGroupButton"} onClick={handleCancel}>
                            <XIcon />
                        </button>
                    </div>
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
