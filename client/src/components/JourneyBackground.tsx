import React from 'react';

interface JourneyBackgroundProps {
  accentColor?: string;
}

export default function JourneyBackground({ accentColor = '#8B7355' }: JourneyBackgroundProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#FAFAF8',
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Dotted curved path */}
        <defs>
          <style>{`
            .dotted-path {
              fill: none;
              stroke: ${accentColor};
              stroke-width: 2;
              stroke-dasharray: 8, 6;
              opacity: 0.7;
            }
            .doodle-icon {
              fill: none;
              stroke: ${accentColor};
              stroke-width: 1.5;
              stroke-linecap: round;
              stroke-linejoin: round;
              opacity: 0.8;
            }
            .decorative-shape {
              fill: ${accentColor};
              opacity: 0.25;
            }
          `}</style>
        </defs>

        {/* Main curved journey path */}
        <path
          className="dotted-path"
          d="M 100 700 Q 300 600, 500 500 T 900 300"
        />

        {/* Decorative dots and shapes along the path */}
        <circle cx="100" cy="700" r="3" className="decorative-shape" />
        <circle cx="300" cy="600" r="2.5" className="decorative-shape" />
        <circle cx="500" cy="500" r="2" className="decorative-shape" />
        <circle cx="700" cy="400" r="2.5" className="decorative-shape" />
        <circle cx="900" cy="300" r="3" className="decorative-shape" />

        {/* Icon 1: Lightbulb (Idea) - Start */}
        <g transform="translate(80, 680)">
          <circle cx="0" cy="0" r="8" className="doodle-icon" />
          <path d="M -3 8 Q -5 12 -3 14 M 3 8 Q 5 12 3 14 M -2 14 L 2 14" className="doodle-icon" />
        </g>

        {/* Icon 2: Notebook (Learning) */}
        <g transform="translate(280, 580)">
          <rect x="-6" y="-8" width="12" height="16" className="doodle-icon" />
          <line x1="-4" y1="-4" x2="4" y2="-4" className="doodle-icon" />
          <line x1="-4" y1="0" x2="4" y2="0" className="doodle-icon" />
          <line x1="-4" y1="4" x2="4" y2="4" className="doodle-icon" />
        </g>

        {/* Icon 3: Laptop (Building Skills) */}
        <g transform="translate(480, 480)">
          <rect x="-8" y="-6" width="16" height="12" className="doodle-icon" />
          <line x1="-8" y1="6" x2="8" y2="6" className="doodle-icon" />
          <line x1="-2" y1="6" x2="2" y2="10" className="doodle-icon" />
        </g>

        {/* Icon 4: Package Box (Product) */}
        <g transform="translate(680, 380)">
          <rect x="-8" y="-6" width="16" height="12" className="doodle-icon" />
          <line x1="-8" y1="-2" x2="8" y2="-2" className="doodle-icon" />
          <line x1="0" y1="-6" x2="0" y2="6" className="doodle-icon" />
        </g>

        {/* Icon 5: Megaphone (Marketing) */}
        <g transform="translate(880, 280)">
          <path d="M -8 -4 L 4 0 L -8 4 Z" className="doodle-icon" />
          <circle cx="6" cy="0" r="3" className="doodle-icon" />
        </g>

        {/* Decorative hearts scattered */}
        <g transform="translate(150, 500)" opacity="0.3">
          <path d="M -2 -1 Q -4 -3 -5 -2 Q -6 -1 -5 0 L 0 4 L 5 0 Q 6 -1 5 -2 Q 4 -3 2 -1" className="decorative-shape" />
        </g>

        <g transform="translate(400, 350)" opacity="0.3">
          <path d="M -2 -1 Q -4 -3 -5 -2 Q -6 -1 -5 0 L 0 4 L 5 0 Q 6 -1 5 -2 Q 4 -3 2 -1" className="decorative-shape" />
        </g>

        <g transform="translate(750, 250)" opacity="0.3">
          <path d="M -2 -1 Q -4 -3 -5 -2 Q -6 -1 -5 0 L 0 4 L 5 0 Q 6 -1 5 -2 Q 4 -3 2 -1" className="decorative-shape" />
        </g>

        {/* Decorative stars scattered */}
        <g transform="translate(200, 350)" opacity="0.25">
          <path d="M 0 -3 L 1 -1 L 3 -1 L 1 1 L 2 3 L 0 1 L -2 3 L -1 1 L -3 -1 L -1 -1 Z" className="decorative-shape" />
        </g>

        <g transform="translate(600, 250)" opacity="0.25">
          <path d="M 0 -3 L 1 -1 L 3 -1 L 1 1 L 2 3 L 0 1 L -2 3 L -1 1 L -3 -1 L -1 -1 Z" className="decorative-shape" />
        </g>

        <g transform="translate(950, 150)" opacity="0.25">
          <path d="M 0 -3 L 1 -1 L 3 -1 L 1 1 L 2 3 L 0 1 L -2 3 L -1 1 L -3 -1 L -1 -1 Z" className="decorative-shape" />
        </g>

        {/* Additional small decorative circles */}
        <circle cx="350" cy="250" r="2" className="decorative-shape" opacity="0.2" />
        <circle cx="550" cy="150" r="1.5" className="decorative-shape" opacity="0.2" />
        <circle cx="800" cy="200" r="2" className="decorative-shape" opacity="0.2" />
        <circle cx="1000" cy="400" r="1.5" className="decorative-shape" opacity="0.2" />
      </svg>
    </div>
  );
}
