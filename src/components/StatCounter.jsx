import React, { useEffect, useRef, useState } from 'react';

export default function StatCounter({ value, label }) {
  const [displayVal, setDisplayVal] = useState('0');
  const counterRef = useRef(null);

  useEffect(() => {
    // Parse target number and suffix from string e.g. "25+" -> target=25, suffix="+"
    const val = parseInt(value);
    const suffix = value.replace(/[0-9,]/g, '');

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const duration = 2000;
          const step = val / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < val) {
              setDisplayVal(Math.ceil(current) + suffix);
              requestAnimationFrame(updateCounter);
            } else {
              setDisplayVal(val + suffix);
            }
          };
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="stat-item" ref={counterRef}>
      <div className="stat-number">{displayVal}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
