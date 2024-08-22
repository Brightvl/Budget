import React from 'react';

export default function PencilIcon({ onClick }) {
    return (
        <svg
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="icon pencilIcon"
            style={{ cursor: 'pointer' }}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l5-5 5 5m-6 4l-5-5-5 5v6h6l10-10z" />
        </svg>
    );
}
