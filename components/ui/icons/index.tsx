import React from 'react';



interface IconProps {
  size?: number;
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}

// Existing Icons
export const TickIcon: React.FC<IconProps> = ({
  size = 16,
  className,
  fill = '#22C55E',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M13 4L6 11L3 8"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({
  size = 16,
  className,
  fill = '#EF4444',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const BackCircleIcon: React.FC<IconProps> = ({
  size = 16,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8l-4 4 4 4M16 12H8" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 16,
  className,
  fill = '#11181C',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 13.1714L17.4498 7.72168L18.3639 8.63579L12 15L5.63604 8.63579L6.55015 7.72168L12 13.1714Z"
      fill={fill}
    />
  </svg>
);

// New Icons from components

// Divider Line Icon (from Footer)
export const DividerLineIcon: React.FC<IconProps> = ({
  width = 1,
  height = 16,
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width={width} height={height} fill="#DFE3E6" />
  </svg>
);

// Info Icon (from Measurement Help)
export const InfoIcon: React.FC<IconProps> = ({
  size = 40,
  className,
}) => (
  <svg 
    width={size} 
    height={size + 1} 
    viewBox={`0 0 ${size} ${size + 1}`} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M20 30.5C14.4771 30.5 10 26.0228 10 20.5C10 14.9771 14.4771 10.5 20 10.5C25.5228 10.5 30 14.9771 30 20.5C30 26.0228 25.5228 30.5 20 30.5ZM19 23.5V25.5H21V23.5H19ZM21 21.8551C22.4457 21.4248 23.5 20.0855 23.5 18.5C23.5 16.567 21.933 15 20 15C18.302 15 16.8864 16.2092 16.5673 17.8135L18.5288 18.2058C18.6656 17.5182 19.2723 17 20 17C20.8284 17 21.5 17.6716 21.5 18.5C21.5 19.3284 20.8284 20 20 20C19.4477 20 19 20.4477 19 21V22.5H21V21.8551Z" 
      fill="#687076"
    />
  </svg>
);

// Close Icon (from Measurement Help)
export const CloseIcon: React.FC<IconProps> = ({
  size = 24,
  className,
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox={`0 0 ${size} ${size}`} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M11.9996 10.8221L16.1244 6.69727L17.3029 7.87577L13.1781 12.0006L17.3029 16.1253L16.1244 17.3038L11.9996 13.1791L7.87481 17.3038L6.69629 16.1253L10.8211 12.0006L6.69629 7.87577L7.87481 6.69727L11.9996 10.8221Z" 
      fill="#687076"
    />
  </svg>
);

// Profile Icon (from Nav Links)
export const ProfileIcon: React.FC<IconProps> = ({
  size = 40,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 0.833008C30.5855 0.833008 39.167 9.41454 39.167 20C39.167 30.5855 30.5855 39.167 20 39.167C9.41454 39.167 0.833008 30.5855 0.833008 20C0.833008 9.41454 9.41454 0.833008 20 0.833008Z"
      fill="#F8F9FA"
    />
    <path
      d="M20 0.833008C30.5855 0.833008 39.167 9.41454 39.167 20C39.167 30.5855 30.5855 39.167 20 39.167C9.41454 39.167 0.833008 30.5855 0.833008 20C0.833008 9.41454 9.41454 0.833008 20 0.833008Z"
      stroke="#DFE3E6"
      strokeWidth="1.66667"
    />
    <path
      d="M19.9999 13.3334C20.884 13.3334 21.7318 13.6846 22.3569 14.3097C22.9821 14.9348 23.3333 15.7827 23.3333 16.6667C23.3333 17.5508 22.9821 18.3986 22.3569 19.0237C21.7318 19.6489 20.884 20 19.9999 20C19.1159 20 18.268 19.6489 17.6429 19.0237C17.0178 18.3986 16.6666 17.5508 16.6666 16.6667C16.6666 15.7827 17.0178 14.9348 17.6429 14.3097C18.268 13.6846 19.1159 13.3334 19.9999 13.3334ZM19.9999 21.6667C23.6833 21.6667 26.6666 23.1584 26.6666 25V26.6667H13.3333V25C13.3333 23.1584 16.3166 21.6667 19.9999 21.6667Z"
      fill="#11181C"
    />
  </svg>
);

// Google Icon (from OAuth Signin)
export const GoogleIcon: React.FC<IconProps> = ({
  size = 20,
  className,
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC04"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Check Icon (from Reset Password)
export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Pattern SVG for Slider
interface PatternSVGProps {
  width: number;
  className?: string;
  color?: string;
  lightColor?: string;
}

export const PatternSVG: React.FC<PatternSVGProps> = ({ 
  width, 
  className, 
  color = "#FFD204", 
  lightColor = "#FFEC9A" 
}) => (
  <svg 
    width={width} 
    height="18" 
    viewBox={`0 0 ${width} 18`} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`absolute left-0 top-0 ${className || ''}`}
    style={{ width: `${width}px` }}
  >
    <g clipPath={`url(#clip0_pattern_${width})`}>
      <rect width={width} height="18" fill={color}/>
      <g opacity="0.5">
        <circle cx="13.3385" cy="2.70484" r="2" transform="rotate(28 13.3385 2.70484)" fill={lightColor}/>
        <circle cx="10.5217" cy="8.00245" r="2" transform="rotate(28 10.5217 8.00245)" fill={lightColor}/>
        <circle cx="7.70484" cy="13.3003" r="2" transform="rotate(28 7.70484 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="37.3385" cy="2.70484" r="2" transform="rotate(28 37.3385 2.70484)" fill={lightColor}/>
        <circle cx="34.5217" cy="8.00245" r="2" transform="rotate(28 34.5217 8.00245)" fill={lightColor}/>
        <circle cx="31.7048" cy="13.3003" r="2" transform="rotate(28 31.7048 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="61.3387" cy="2.70484" r="2" transform="rotate(28 61.3387 2.70484)" fill={lightColor}/>
        <circle cx="58.5218" cy="8.00245" r="2" transform="rotate(28 58.5218 8.00245)" fill={lightColor}/>
        <circle cx="55.705" cy="13.3003" r="2" transform="rotate(28 55.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="85.3387" cy="2.70484" r="2" transform="rotate(28 85.3387 2.70484)" fill={lightColor}/>
        <circle cx="82.5218" cy="8.00245" r="2" transform="rotate(28 82.5218 8.00245)" fill={lightColor}/>
        <circle cx="79.705" cy="13.3003" r="2" transform="rotate(28 79.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="109.339" cy="2.70484" r="2" transform="rotate(28 109.339 2.70484)" fill={lightColor}/>
        <circle cx="106.522" cy="8.00245" r="2" transform="rotate(28 106.522 8.00245)" fill={lightColor}/>
        <circle cx="103.705" cy="13.3003" r="2" transform="rotate(28 103.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="133.339" cy="2.70484" r="2" transform="rotate(28 133.339 2.70484)" fill={lightColor}/>
        <circle cx="130.522" cy="8.00245" r="2" transform="rotate(28 130.522 8.00245)" fill={lightColor}/>
        <circle cx="127.705" cy="13.3003" r="2" transform="rotate(28 127.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="157.339" cy="2.70484" r="2" transform="rotate(28 157.339 2.70484)" fill={lightColor}/>
        <circle cx="154.522" cy="8.00245" r="2" transform="rotate(28 154.522 8.00245)" fill={lightColor}/>
        <circle cx="151.705" cy="13.3003" r="2" transform="rotate(28 151.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="25.3385" cy="2.70484" r="2" transform="rotate(28 25.3385 2.70484)" fill={lightColor}/>
        <circle cx="22.5217" cy="8.00245" r="2" transform="rotate(28 22.5217 8.00245)" fill={lightColor}/>
        <circle cx="19.7048" cy="13.3003" r="2" transform="rotate(28 19.7048 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="49.3385" cy="2.70484" r="2" transform="rotate(28 49.3385 2.70484)" fill={lightColor}/>
        <circle cx="46.5217" cy="8.00245" r="2" transform="rotate(28 46.5217 8.00245)" fill={lightColor}/>
        <circle cx="43.7048" cy="13.3003" r="2" transform="rotate(28 43.7048 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="73.3387" cy="2.70484" r="2" transform="rotate(28 73.3387 2.70484)" fill={lightColor}/>
        <circle cx="70.5218" cy="8.00245" r="2" transform="rotate(28 70.5218 8.00245)" fill={lightColor}/>
        <circle cx="67.705" cy="13.3003" r="2" transform="rotate(28 67.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="97.3387" cy="2.70484" r="2" transform="rotate(28 97.3387 2.70484)" fill={lightColor}/>
        <circle cx="94.5218" cy="8.00245" r="2" transform="rotate(28 94.5218 8.00245)" fill={lightColor}/>
        <circle cx="91.705" cy="13.3003" r="2" transform="rotate(28 91.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="121.339" cy="2.70484" r="2" transform="rotate(28 121.339 2.70484)" fill={lightColor}/>
        <circle cx="118.522" cy="8.00245" r="2" transform="rotate(28 118.522 8.00245)" fill={lightColor}/>
        <circle cx="115.705" cy="13.3003" r="2" transform="rotate(28 115.705 13.3003)" fill={lightColor}/>
      </g>
      <g opacity="0.5">
        <circle cx="145.339" cy="2.70484" r="2" transform="rotate(28 145.339 2.70484)" fill={lightColor}/>
        <circle cx="142.522" cy="8.00245" r="2" transform="rotate(28 142.522 8.00245)" fill={lightColor}/>
        <circle cx="139.705" cy="13.3003" r="2" transform="rotate(28 139.705 13.3003)" fill={lightColor}/>
      </g>
    </g>
    <defs>
      <clipPath id={`clip0_pattern_${width}`}>
        <rect width={width} height="18" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// Premium Line Icon
export const PremiumLineIcon: React.FC<IconProps> = ({
  width = 314,
  height = 2,
  className,
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox={`0 0 ${width} ${height}`} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect y="0.5" width={width} height="1" fill="#967200"/>
  </svg>
);

// Premium Tick Icon
export const PremiumTickIcon: React.FC<IconProps> = ({
  size = 17,
  className,
}) => (
  <svg 
    width={size} 
    height="12" 
    viewBox="0 0 17 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M15.9422 1.06729L5.94217 11.0673C5.88412 11.1254 5.81519 11.1715 5.73932 11.203C5.66344 11.2344 5.58212 11.2506 5.49998 11.2506C5.41785 11.2506 5.33652 11.2344 5.26064 11.203C5.18477 11.1715 5.11584 11.1254 5.05779 11.0673L0.682794 6.69229C0.565518 6.57502 0.499634 6.41596 0.499634 6.2501C0.499634 6.08425 0.565518 5.92519 0.682794 5.80792C0.800069 5.69064 0.959129 5.62476 1.12498 5.62476C1.29083 5.62476 1.44989 5.69064 1.56717 5.80792L5.49998 9.74151L15.0578 0.182916C15.1751 0.0656402 15.3341 -0.000244142 15.5 -0.000244141C15.6658 -0.000244139 15.8249 0.0656402 15.9422 0.182916C16.0594 0.300191 16.1253 0.459251 16.1253 0.625103C16.1253 0.790956 16.0594 0.950016 15.9422 1.06729Z" 
      fill="#FFD204"
    />
  </svg>
); 