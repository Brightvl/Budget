import React from 'react';

export default function TrashIcon({ onClick }) {
    return (
        <svg
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="icon trashIcon"
            style={{ cursor: 'pointer' }}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6h12zm-5 4v6m-4-6v6m8-6v6"
            />
        </svg>
    );
}
