import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SplitText = ({ 
  text, 
  className = '', 
  delay = 100, 
  duration = 0.6,
  stagger = 0.05,
  animateOnView = true 
}) => {
  const textRef = useRef(null);
  const chars = text.split('');

  useEffect(() => {
    if (!textRef.current) return;

    const charElements = textRef.current.querySelectorAll('.split-char');
    
    // Set initial state
    gsap.set(charElements, {
      opacity: 0,
      y: 50,
      rotationZ: 10
    });

    // Animate in
    const tl = gsap.timeline({
      delay: delay / 1000
    });

    tl.to(charElements, {
      opacity: 1,
      y: 0,
      rotationZ: 0,
      duration: duration,
      stagger: stagger,
      ease: "back.out(1.7)"
    });

  }, [text, delay, duration, stagger]);

  return (
    <span ref={textRef} className={`inline-block ${className}`}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="split-char inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
