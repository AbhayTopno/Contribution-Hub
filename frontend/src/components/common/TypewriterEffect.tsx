'use client';

import { useState, useEffect, useRef } from 'react';
import { JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface TypewriterEffectProps {
  text: string;
  speed?: number; // ms per character
  pauseDuration?: number; // ms after typing before reset
  loop?: boolean;
  className?: string;
}

export default function TypewriterEffect({
  text,
  speed = 100,
  pauseDuration = 2000,
  loop = true,
  className,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCaret, setShowCaret] = useState(true);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const caretIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = () => {
    setIsTyping(true);
    setCharIndex(0);
    setDisplayedText('');
  };

  useEffect(() => {
    if (isTyping) {
      if (charIndex < text.length) {
        typingTimeoutRef.current = setTimeout(() => {
          setDisplayedText((prev) => prev + text.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        }, speed);
      } else {
        setIsTyping(false);
        // Start pause after typing is complete
        pauseTimeoutRef.current = setTimeout(() => {
          if (loop) {
            startTyping(); // Restart typing
          }
        }, pauseDuration);
      }
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [charIndex, isTyping, text, speed, pauseDuration, loop]);

  // Blinking caret effect
  useEffect(() => {
    caretIntervalRef.current = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => {
      if (caretIntervalRef.current) clearInterval(caretIntervalRef.current);
    };
  }, []);

  // Determine if caret should be visible (blinking)
  const shouldShowCaret =
    showCaret && (isTyping || (charIndex === text.length && loop));

  return (
    <h1
      className={cn(
        `text-5xl md:text-7xl font-extrabold mb-6 leading-tight ${jetbrainsMono.className}`,
        className
      )}
    >
      {displayedText}
      <span
        className={`inline-block w-[0.15em] h-[1.2em] bg-slate-900 align-middle ml-1 transition-opacity duration-200 ${
          shouldShowCaret ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
    </h1>
  );
}
