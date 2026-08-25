import React, { useEffect, useRef, useState } from 'react';

export default function CaptchaWidget({ onVerify }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      // In development mode without siteKey, notify parent with dev token
      onVerify('dev-bypass-token');
      return;
    }

    // Load Turnstile script if not present
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, [siteKey, onVerify]);

  useEffect(() => {
    if (scriptLoaded && window.turnstile && containerRef.current && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          onVerify(token);
        },
        'expired-callback': () => {
          onVerify('');
        },
      });
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [scriptLoaded, siteKey, onVerify]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} style={{ margin: '15px 0', minHeight: '65px' }} />;
}
