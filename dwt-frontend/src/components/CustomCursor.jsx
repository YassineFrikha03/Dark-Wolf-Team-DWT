import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    let rx = 0, ry = 0, mx = 0, my = 0, lmx = 0, lmy = 0;
    let animId;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
      const spd = Math.hypot(mx - lmx, my - lmy);
      if (spd > 14 && Math.random() > 0.65) {
        spawnTrail(mx, my);
      }
      lmx = mx;
      lmy = my;
    };

    const spawnTrail = (x, y) => {
      if (!particlesRef.current) return;
      const p = document.createElement('div');
      p.className = 'spark';
      p.style.cssText = `left:${x}px;top:${y}px;--tx:${(Math.random() - 0.5) * 18}px;--ty:${(Math.random() - 0.5) * 18}px`;
      particlesRef.current.appendChild(p);
      setTimeout(() => p.remove(), 700);
    };

    const spawnScrollP = () => {
      if (!particlesRef.current) return;
      const p = document.createElement('div');
      p.className = 'spark';
      p.style.cssText = `left:${Math.random() * window.innerWidth}px;top:${Math.random() * window.innerHeight}px;--tx:${(Math.random() - 0.5) * 28}px;--ty:${(Math.random() - 0.3) * -22}px;background:rgba(184,184,200,.45)`;
      particlesRef.current.appendChild(p);
      setTimeout(() => p.remove(), 700);
    };

    const onMouseDown = () => ringRef.current?.classList.add('click');
    const onMouseUp = () => ringRef.current?.classList.remove('click');

    const animRing = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      animId = requestAnimationFrame(animRing);
    };
    animRing();

    let lsy = 0;
    const onScroll = () => {
      const sy = window.scrollY;
      if (Math.abs(sy - lsy) > 4 && Math.random() > 0.55) {
        spawnScrollP();
      }
      lsy = sy;

      if (scrollbarRef.current) {
        const total = document.body.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (sy / total) * 100 : 0;
        scrollbarRef.current.style.width = pct + '%';
      }
    };

    const updateHoverListeners = () => {
      const interactiveEls = document.querySelectorAll(
        'button, a, .pcard, .gcard, .ncard, .ysitem, .soclink, .mcard, .memcard, .pdthumb, .chatSug'
      );
      interactiveEls.forEach((el) => {
        el.onmouseenter = () => ringRef.current?.classList.add('h');
        el.onmouseleave = () => ringRef.current?.classList.remove('h');
      });
    };

    const hoverTimer = setInterval(updateHoverListeners, 1500);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(hoverTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <div id="scrollbar" ref={scrollbarRef}></div>
      <div id="cDot" ref={dotRef}></div>
      <div id="cRing" ref={ringRef}></div>
      <div id="particles" ref={particlesRef}></div>
    </>
  );
};

export default CustomCursor;
