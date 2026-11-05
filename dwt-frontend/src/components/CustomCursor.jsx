import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let mx = rx;
    let my = ry;
    let lmx = mx;
    let lmy = my;
    let animId;
    let isVisible = false;

    const showCursor = () => {
      if (!isVisible) {
        isVisible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const hideCursor = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const onMouseMove = (e) => {
      showCursor();
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
      p.style.cssText = `left:${Math.random() * window.innerWidth}px;top:${Math.random() * window.innerHeight}px;--tx:${(Math.random() - 0.5) * 28}px;--ty:${(Math.random() - 0.3) * -22}px;background:rgba(255,42,42,.65)`;
      particlesRef.current.appendChild(p);
      setTimeout(() => p.remove(), 700);
    };

    const onMouseDown = () => {
      ringRef.current?.classList.add('click');
      dotRef.current?.classList.add('click');
    };

    const onMouseUp = () => {
      ringRef.current?.classList.remove('click');
      dotRef.current?.classList.remove('click');
    };

    const animRing = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
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
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (sy / total) * 100 : 0;
        scrollbarRef.current.style.width = pct + '%';
      }
    };

    // Instant, delegated hover detection across all interactive elements
    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const isInteractive = target.closest(
        'button, a, input, select, textarea, label, [role="button"], [tabindex], .pcard, .gcard, .ncard, .ysitem, .soclink, .mcard, .memcard, .pdthumb, .chatSug, .nb, .bsi, .bjn, .bcart, .pqv, .bva, .filter-btn, .shop-tab-btn, .clickable'
      );
      if (isInteractive) {
        ringRef.current?.classList.add('h');
        dotRef.current?.classList.add('h');
      } else {
        ringRef.current?.classList.remove('h');
        dotRef.current?.classList.remove('h');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', showCursor);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mouseenter', showCursor);
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
