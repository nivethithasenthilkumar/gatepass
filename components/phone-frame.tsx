"use client";

import { useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface PhoneFrameProps {
  children: ReactNode;
}

interface Bubble {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  type: 'yellow' | 'purple';
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const [isSwapping, setIsSwapping] = useState(false);
  const [displayChildren, setDisplayChildren] = useState<ReactNode>(children);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Generate bubbles only on the client to avoid hydration mismatch
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 40,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: Math.random() * 10 + 15,
      type: (i % 2 === 0 ? 'yellow' : 'purple') as 'yellow' | 'purple'
    }));
    setBubbles(newBubbles);
  }, []);

  useEffect(() => {
    // Only trigger the swap animation for Login and Registration pages
    const shouldSwap = pathname === '/' || pathname === '/register';
    
    if (shouldSwap) {
      setIsSwapping(true);
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsSwapping(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <>
      {/* Background Bubbles - Fixed in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-slate-50">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`bubble bubble-${bubble.type}`}
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main App Container - Centered and Fixed */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-10 pointer-events-none">
        <div className={`phone-container pointer-events-auto ${isSwapping ? 'swapping' : ''}`}>
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="phone-front-camera"></div>
              {displayChildren}
            </div>
            {/* Android-style 3 Button Navigation - Always Visible */}
            <div className="phone-nav-bar">
              <button 
                className="phone-nav-button" 
                onClick={() => window.history.back()}
                aria-label="Back"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                className="phone-nav-button" 
                onClick={() => router.push('/dashboard')}
                aria-label="Home"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </button>
              <button 
                className="phone-nav-button"
                aria-label="Recent Apps"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </button>
            </div>
          </div>

          <div className="phone-frame-back">
            <div className="backcase-pattern"></div>
            <div className="camera-module">
              <div className="camera-lens"></div>
              <div className="camera-lens"></div>
              <div className="camera-lens"></div>
            </div>
            <div className="text-white text-3xl font-bold text-center px-8 z-10">
              VSB Engineering College
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
