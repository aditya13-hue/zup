import React from 'react';

const Logo = ({ size = 24, color = 'white' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
    >
        <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
        />
    </svg>
);

export default Logo;
