
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const PencilIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export const NibIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);

export const SprayIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 2h2v4h-2z" /><path d="m7 4 1.5 1.5" /><path d="m17 4-1.5 1.5" /><path d="M6 12h12v10H6z" /><path d="M9 12V8a3 3 0 0 1 6 0v4" />
  </svg>
);

export const BrushRoundIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-3.91 3.91-4.63 9.06-4.03 9.06s5.15-.12 9.06-4.03" />
    <path d="m11.69 11.39 2.92 2.92" />
  </svg>
);

export const EraserIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
    <path d="M22 21H7" /><path d="m5 11 9 9" />
  </svg>
);

export const DropperIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 22 7.85-7.85" /><path d="M10.5 13.5a2.5 2.5 0 1 0 3.5 3.5L21 10l-7-7L6.5 10.5a2.5 2.5 0 1 0 3.5 3.5Z" />
  </svg>
);

export const LayersIcon = ({ size = 20, className = "", color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.27a2 2 0 0 0 0 3.46l9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09a2 2 0 0 0 0-3.46Z" />
    <path d="m2.1 11.54 9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09" />
    <path d="m2.1 16.81 9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09" />
  </svg>
);
