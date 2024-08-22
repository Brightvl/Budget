import React from 'react';

export default function MinusIcon({ onClick }) {
    return (
        <svg
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon minusIcon"
            style={{ cursor: 'pointer' }}
        >
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
