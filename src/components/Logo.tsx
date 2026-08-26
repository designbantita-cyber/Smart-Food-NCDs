import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'badge' | 'minimal';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full',
}) => {
  // Dimension scales
  const dimensions = {
    sm: { width: 140, height: 46, iconSize: 'w-7 h-7' },
    md: { width: 180, height: 58, iconSize: 'w-9 h-9' },
    lg: { width: 230, height: 74, iconSize: 'w-14 h-14' },
    xl: { width: 300, height: 96, iconSize: 'w-20 h-20' },
  }[size];

  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className={dimensions.iconSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle minimal rounded container */}
          <rect width="100" height="100" rx="28" fill="#ECFDF5" />
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="26"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />

          {/* Minimalist Nurse Cap placed slightly above FOOD */}
          <g transform="translate(32, 14) rotate(-3)">
            <path
              d="M 4 20 C 6 11, 16 5, 24 5 C 32 5, 42 11, 44 20 L 40 24 C 32 22, 16 22, 8 24 Z"
              fill="#FFFFFF"
              stroke="#059669"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Soft inner curve */}
            <path
              d="M 9 10 Q 24 13 39 10"
              stroke="#A7F3D0"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Minimal Green Cross */}
            <rect x="21.5" y="9.5" width="5" height="9" rx="1" fill="#059669" />
            <rect x="19.5" y="11.5" width="9" height="5" rx="1" fill="#059669" />
          </g>

          {/* FOOD NCD */}
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontFamily="'Prompt', 'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="-0.5"
            fill="#064E3B"
          >
            FOOD <tspan fill="#059669">NCD</tspan>
          </text>

          {/* BCNR */}
          <text
            x="50"
            y="78"
            textAnchor="middle"
            fontFamily="'Prompt', 'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="10"
            letterSpacing="3"
            fill="#047857"
          >
            BCNR
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ minHeight: size === 'sm' ? 40 : size === 'md' ? 50 : size === 'lg' ? 66 : 86 }}
    >
      <svg
        viewBox="0 0 220 70"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'block',
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Minimalist Nurse Cap (หมวกพยาบาลมินิมอล วางไว้เล็กๆ เหนือคำว่า FOOD) */}
        <g transform="translate(24, 2) rotate(-5)">
          {/* White Cap Body */}
          <path
            d="M 4 19 C 6 10, 16 4, 24 4 C 32 4, 42 10, 44 19 L 40 23 C 32 21, 16 21, 8 23 Z"
            fill="#FFFFFF"
            stroke="#059669"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Subtle mint brim fold */}
          <path
            d="M 9 9 Q 24 13 39 9"
            stroke="#A7F3D0"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Minimalist Green Cross on Cap */}
          <rect x="21.5" y="9" width="5" height="8.5" rx="1" fill="#059669" />
          <rect x="19.5" y="10.8" width="9" height="5" rx="1" fill="#059669" />
        </g>

        {/* Top Text: FOOD NCD (Large bold minimalist text) */}
        <g transform="translate(0, 46)">
          <text
            x="2"
            y="0"
            fontFamily="'Prompt', 'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="-0.5"
            fill="#064E3B"
          >
            FOOD{' '}
            <tspan fill="#059669" fontWeight="900">
              NCD
            </tspan>
          </text>
        </g>

        {/* Bottom Text: BCNR (Small text placed underneath) */}
        <g transform="translate(4, 65)">
          <text
            x="0"
            y="0"
            fontFamily="'Prompt', 'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="12"
            letterSpacing="5"
            fill="#047857"
          >
            BCNR
          </text>
          {/* Minimalist leaf/dot accent */}
          <circle cx="82" cy="-4" r="2.2" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
};


