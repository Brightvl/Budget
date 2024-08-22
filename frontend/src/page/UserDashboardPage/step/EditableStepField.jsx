import React, { useState, useEffect } from 'react';
import PencilIcon from '../../../assets/svg/PencilIcon.jsx';
import CheckIcon from '../../../assets/svg/CheckIcon.jsx';
import XIcon from '../../../assets/svg/XIcon.jsx';

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
                <div className="editableInputGroup">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <CheckIcon onClick={handleSave} />
                    <XIcon onClick={() => setIsEditing(false)} />
                </div>
            ) : (
                <div className="editableDisplay">
                    <span>{value}</span>
                    <PencilIcon onClick={() => setIsEditing(true)} />
                </div>
            )}
        </div>
    );
}
