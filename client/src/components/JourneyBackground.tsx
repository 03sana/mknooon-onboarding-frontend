import React from 'react';

/**
 * JourneyBackground Component
 * 
 * Subtle hand-drawn pencil doodle background for onboarding screens.
 * Features:
 * - Very minimal, barely visible doodles
 * - Thin hand-drawn lines (sketch style)
 * - Warm neutral colors (beige, brown, soft red)
 * - Decorative background elements only
 * - Does not interfere with content
 * 
 * Design Philosophy:
 * - Decorative background behind UI cards
 * - Subtle and refined
 * - Creates a journey feeling without being obvious
 * - Professional and clean
 */

export const JourneyBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Define styles for doodles */}
        <defs>
          <style>{`
            .doodle-line {
              fill: none;
              stroke: #999;
              stroke-width: 0.8;
              stroke-linecap: round;
              stroke-linejoin: round;
              opacity: 0.15;
            }
            .doodle-fill {
              fill: #999;
              opacity: 0.1;
            }
            .doodle-accent {
              fill: #8B4513;
              opacity: 0.08;
            }
            .dotted-path {
              fill: none;
              stroke: #ddd;
              stroke-width: 0.5;
              stroke-dasharray: 2,2;
              opacity: 0.2;
            }
          `}</style>
        </defs>

        {/* Very subtle background wash */}
        <ellipse cx="200" cy="300" rx="400" ry="300" fill="#f5f1ed" opacity="0.08" />
        <ellipse cx="1000" cy="800" rx="350" ry="400" fill="#f5f1ed" opacity="0.06" />
        <ellipse cx="600" cy="1400" rx="300" ry="250" fill="#f5f1ed" opacity="0.05" />

        {/* Minimal dotted paths - very subtle */}
        <path
          className="dotted-path"
          d="M 100 400 Q 300 380, 500 420 T 900 480"
        />
        <path
          className="dotted-path"
          d="M 150 900 Q 400 950, 700 1000 T 1050 1100"
        />

        {/* TOP LEFT: Lightbulb - minimal */}
        <g transform="translate(120, 250)" opacity="0.15">
          <circle cx="0" cy="0" r="18" className="doodle-line" />
          <line x1="0" y1="18" x2="0" y2="25" className="doodle-line" />
          <line x1="-10" y1="25" x2="10" y2="25" className="doodle-line" />
        </g>

        {/* TOP RIGHT: Chocolate bar - minimal */}
        <g transform="translate(1050, 200)" opacity="0.12">
          <rect x="-12" y="-18" width="24" height="36" className="doodle-line" />
          <line x1="-8" y1="-12" x2="8" y2="-12" className="doodle-line" />
          <line x1="-8" y1="-2" x2="8" y2="-2" className="doodle-line" />
        </g>

        {/* MIDDLE LEFT: Notebook - minimal */}
        <g transform="translate(200, 700)" opacity="0.12">
          <rect x="-10" y="-14" width="20" height="28" className="doodle-line" />
          <line x1="-8" y1="-10" x2="8" y2="-10" className="doodle-line" />
          <line x1="-8" y1="0" x2="8" y2="0" className="doodle-line" />
        </g>

        {/* MIDDLE CENTER: Laptop - minimal */}
        <g transform="translate(600, 600)" opacity="0.12">
          <rect x="-18" y="-10" width="36" height="20" className="doodle-line" />
          <line x1="-18" y1="10" x2="18" y2="10" className="doodle-line" />
          <line x1="-6" y1="10" x2="6" y2="16" className="doodle-line" />
        </g>

        {/* MIDDLE RIGHT: Packaging box - minimal */}
        <g transform="translate(1000, 700)" opacity="0.12">
          <rect x="-15" y="-15" width="30" height="30" className="doodle-line" />
          <line x1="-15" y1="0" x2="15" y2="0" className="doodle-line" />
          <line x1="0" y1="-15" x2="0" y2="15" className="doodle-line" />
        </g>

        {/* BOTTOM LEFT: Megaphone - minimal */}
        <g transform="translate(250, 1200)" opacity="0.1">
          <path d="M -15 -6 L -2 0 L -15 6 Z" className="doodle-line" />
          <circle cx="8" cy="0" r="6" className="doodle-line" />
          <line x1="14" y1="0" x2="18" y2="0" className="doodle-line" />
        </g>

        {/* BOTTOM RIGHT: Star - minimal */}
        <g transform="translate(950, 1250)" opacity="0.12">
          <path
            d="M 0 -12 L 3 -3 L 12 -1 L 6 4 L 8 13 L 0 9 L -8 13 L -6 4 L -12 -1 L -3 -3 Z"
            className="doodle-line"
          />
        </g>

        {/* Scattered small decorative hearts - very subtle */}
        <g transform="translate(350, 400)" opacity="0.08">
          <path d="M 0 -2 C -2 -4 -4 -4 -4 -2 C -4 0 -2 2 0 3 C 2 2 4 0 4 -2 C 4 -4 2 -4 0 -2 Z" className="doodle-accent" />
        </g>

        <g transform="translate(750, 950)" opacity="0.08">
          <path d="M 0 -2 C -2 -4 -4 -4 -4 -2 C -4 0 -2 2 0 3 C 2 2 4 0 4 -2 C 4 -4 2 -4 0 -2 Z" className="doodle-accent" />
        </g>

        <g transform="translate(400, 1350)" opacity="0.08">
          <path d="M 0 -2 C -2 -4 -4 -4 -4 -2 C -4 0 -2 2 0 3 C 2 2 4 0 4 -2 C 4 -4 2 -4 0 -2 Z" className="doodle-accent" />
        </g>

        {/* Additional minimal brand doodles scattered */}

        {/* Soap bubbles - minimal */}
        <g transform="translate(850, 350)" opacity="0.1">
          <circle cx="0" cy="0" r="8" className="doodle-line" />
          <circle cx="12" cy="-5" r="6" className="doodle-line" />
        </g>

        {/* Candle - minimal */}
        <g transform="translate(500, 1100)" opacity="0.1">
          <rect x="-5" y="-14" width="10" height="18" className="doodle-line" />
          <circle cx="0" cy="-14" r="2" className="doodle-fill" />
        </g>

        {/* Cleaning spray - minimal */}
        <g transform="translate(700, 400)" opacity="0.1">
          <rect x="-4" y="-10" width="8" height="12" className="doodle-line" />
          <circle cx="0" cy="-10" r="2" className="doodle-line" />
        </g>

        {/* Small decorative lines - very subtle */}
        <line x1="300" y1="500" x2="315" y2="485" className="doodle-line" opacity="0.1" />
        <line x1="850" y1="1000" x2="865" y2="985" className="doodle-line" opacity="0.1" />
        <line x1="450" y1="1400" x2="465" y2="1385" className="doodle-line" opacity="0.1" />
      </svg>
    </div>
  );
};

export default JourneyBackground;
