import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const text = "TALENTORA AI";

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out container
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4, // Faster container fade out
          ease: "power2.inOut",
          onComplete: onComplete
        });
      }
    });

    // Initial state
    gsap.set(".preloader-char", { y: 100, opacity: 0 });

    // Animate Text
    tl.to(".preloader-char", {
      y: 0,
      opacity: 1,
      duration: 0.5, // Faster entry
      stagger: 0.05,
      ease: "power4.out"
    })
    .to(".preloader-char", {
      y: -100,
      opacity: 0,
      duration: 0.4, // Faster exit
      stagger: 0.02,
      ease: "power2.in",
      delay: 0.2 // Less delay before exit
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-midnight-900 flex items-center justify-center pointer-events-none"
    >
      <div ref={textRef} className="overflow-hidden">
        <h1 className="text-4xl md:text-7xl font-bold font-display text-white tracking-widest flex">
          {text.split("").map((char, i) => (
            <span key={i} className={`preloader-char inline-block ${i >= 10 ? 'text-gold' : ''}`}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
};

export default Preloader;
