import React, { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-08-15T18:00:00');

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });

  useEffect(() => {
    const updateTimer = () => {
      const diff = TARGET_DATE - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
        return;
      }
      setTimeLeft({
        days: String(Math.floor(diff / 864e5)).padStart(2, '0'),
        hours: String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0'),
        mins: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0'),
        secs: String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0'),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="countdown"
      style={{
        padding: '80px 60px',
        background: 'var(--black)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(180, 180, 200, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      ></div>

      <div className="cev rv vis">— Next Major Event —</div>
      <h2 className="ctitle rv d1 vis">DWT Summer Championship 2026</h2>

      <div className="tblocks rv d2 vis">
        <div className="tblock">
          <div className="tnum" id="tdays">{timeLeft.days}</div>
          <div className="tlbl">Days</div>
        </div>
        <div className="tsep">:</div>
        <div className="tblock">
          <div className="tnum" id="thours">{timeLeft.hours}</div>
          <div className="tlbl">Hours</div>
        </div>
        <div className="tsep">:</div>
        <div className="tblock">
          <div className="tnum" id="tmins">{timeLeft.mins}</div>
          <div className="tlbl">Min</div>
        </div>
        <div className="tsep">:</div>
        <div className="tblock">
          <div className="tnum" id="tsecs">{timeLeft.secs}</div>
          <div className="tlbl">Sec</div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
