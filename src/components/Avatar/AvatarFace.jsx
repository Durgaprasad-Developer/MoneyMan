import React, { useState, useEffect } from 'react';
import './AvatarFace.css';

/**
 * Animated SVG Avatar Face
 * States: idle, listening, speaking, thinking
 * Mouth synced to SpeechSynthesis boundary events
 */
export default function AvatarFace({ state = 'idle', mouthOpen = false, size = 160 }) {
  const [blinkState, setBlinkState] = useState(false);

  // Random blink animation
  useEffect(() => {
    const blink = () => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    };
    const interval = setInterval(() => {
      if (Math.random() > 0.5) blink();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const eyeHeight = blinkState ? 1 : 8;
  const mouthHeight = mouthOpen ? 10 : 3;
  const mouthWidth = mouthOpen ? 18 : 14;
  const mouthRx = mouthOpen ? 9 : 7;

  // Colors based on state
  const glowColor = {
    idle: 'rgba(67, 97, 238, 0.4)',
    speaking: 'rgba(6, 214, 160, 0.5)',
    listening: 'rgba(255, 107, 53, 0.5)',
    thinking: 'rgba(123, 47, 247, 0.5)'
  }[state];

  const ringColor = {
    idle: '#4361ee',
    speaking: '#06d6a0',
    listening: '#ff6b35',
    thinking: '#7b2ff7'
  }[state];

  return (
    <div className={`avatar-container avatar-${state}`} style={{ width: size, height: size }}>
      {/* Glow rings */}
      <div className="avatar-glow-ring ring-1" style={{ borderColor: ringColor }} />
      <div className="avatar-glow-ring ring-2" style={{ borderColor: ringColor }} />
      
      {/* Listening ripple */}
      {state === 'listening' && (
        <>
          <div className="avatar-ripple" style={{ borderColor: ringColor }} />
          <div className="avatar-ripple delay-ripple" style={{ borderColor: ringColor }} />
        </>
      )}

      <svg
        viewBox="0 0 100 100"
        className="avatar-svg"
        style={{ filter: `drop-shadow(0 0 20px ${glowColor})` }}
      >
        <defs>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1f4e" />
            <stop offset="100%" stopColor="#0d1030" />
          </linearGradient>
          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6c8aff" />
            <stop offset="100%" stopColor={ringColor} />
          </linearGradient>
          <radialGradient id="faceShine" cx="35%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Face circle */}
        <circle cx="50" cy="50" r="42" fill="url(#faceGrad)" stroke={ringColor} strokeWidth="1.5" opacity="0.95" />
        <circle cx="50" cy="50" r="42" fill="url(#faceShine)" />

        {/* Left eye */}
        <rect x="32" y={42 - eyeHeight / 2} width="8" height={eyeHeight} rx={Math.min(4, eyeHeight / 2)} fill="url(#eyeGrad)">
          <animate attributeName="height" values={state === 'thinking' ? '8;4;8' : ''} dur="1s" repeatCount={state === 'thinking' ? 'indefinite' : '0'} />
        </rect>
        {/* Left eye glow */}
        {!blinkState && <circle cx="36" cy="42" r="6" fill={ringColor} opacity="0.1" />}

        {/* Right eye */}
        <rect x="60" y={42 - eyeHeight / 2} width="8" height={eyeHeight} rx={Math.min(4, eyeHeight / 2)} fill="url(#eyeGrad)">
          <animate attributeName="height" values={state === 'thinking' ? '8;4;8' : ''} dur="1s" repeatCount={state === 'thinking' ? 'indefinite' : '0'} />
        </rect>
        {!blinkState && <circle cx="64" cy="42" r="6" fill={ringColor} opacity="0.1" />}

        {/* Mouth */}
        <rect
          x={50 - mouthWidth / 2}
          y={62 - mouthHeight / 2}
          width={mouthWidth}
          height={mouthHeight}
          rx={mouthRx}
          fill={ringColor}
          opacity="0.8"
          className="avatar-mouth"
        />

        {/* Cheek indicators for speaking */}
        {state === 'speaking' && (
          <>
            <circle cx="25" cy="52" r="4" fill={ringColor} opacity="0.1">
              <animate attributeName="opacity" values="0.05;0.15;0.05" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="75" cy="52" r="4" fill={ringColor} opacity="0.1">
              <animate attributeName="opacity" values="0.05;0.15;0.05" dur="0.8s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Thinking dots */}
        {state === 'thinking' && (
          <>
            <circle cx="40" cy="62" r="2.5" fill={ringColor} opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="62" r="2.5" fill={ringColor} opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" begin="0.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="62" r="2.5" fill={ringColor} opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" begin="0.4s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      {/* State label */}
      <div className="avatar-state-label" style={{ color: ringColor }}>
        {state === 'listening' && '● Listening...'}
        {state === 'speaking' && '♪ Speaking...'}
        {state === 'thinking' && '◌ Thinking...'}
      </div>
    </div>
  );
}
