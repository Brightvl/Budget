import React, { useState, useEffect } from 'react';

export default function CheckIcon({ onClick, completionPercentage, isFailed, manualCompletion, isGoal }) {
    const [color, setColor] = useState('gray');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isFailed) {
            setColor('red');
            setMessage('Цель не достигнута');
        } else if (manualCompletion) {
            setColor('green');
            setMessage('Цель была отмечена выполненной вручную');
        } else if (completionPercentage >= 100) {
            setColor('green');
            setMessage('Все шаги выполнены, цель достигнута');
        } else {
            setColor('gray');
            setMessage('Цель в процессе выполнения');
        }
    }, [completionPercentage, isFailed, manualCompletion]);

    return (
        <div className="checkIconWrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <svg
                onClick={onClick}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="icon checkIcon"
                style={{ cursor: 'pointer', fill: color }}
            >
                <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
            {isGoal && (
                <div className="tooltip">
                    {message}
                </div>
            )}
        </div>
    );
}
