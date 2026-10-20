import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const defaultSlides = [
  {
    _id: 's0',
    label: 'New Collection 2026',
    title: 'HUNT. DOMINATE. CONQUER.',
    subtitle: 'Dark Wolf Team — Elite esports. Dark Lab — Premium gear crafted for champions who refuse to lose.',
    btn1Text: 'Shop Collection',
    btn1Target: '#shop',
    btn2Text: 'Meet the Pack',
    btn2Target: '#teams',
    backgroundImage: '/backgrounds/hero-gaming-bg.jpg',
  },
  {
    _id: 's1',
    label: 'Dark Lab Pro Kit',
    title: 'PRO GEAR ONLY.',
    subtitle: 'Performance-grade equipment engineered for the elite. Built by wolves, worn by champions.',
    btn1Text: 'View Pro Kit',
    btn1Target: '#shop:pro-kit',
    btn2Text: 'Meet the Pack',
    btn2Target: '#teams',
    backgroundImage: '/backgrounds/bg-red-moon-pack.png',
  },
  {
    _id: 's2',
    label: 'Exclusive Collabs Drop',
    title: 'LIMITED COLLAB DROP.',
    subtitle: 'Exclusive collaborations. Limited units. Zero reprints. Move fast or miss out.',
    btn1Text: 'See Collabs',
    btn1Target: '#shop:collabs',
    btn2Text: 'Next Drop Timer',
    btn2Target: '#countdown',
    backgroundImage: '/backgrounds/bg-alpha-eyes.png',
  },
];

const HeroSlider = ({ onNavigate }) => {
  const [slides, setSlides] = useState(defaultSlides);
  const [cur, setCur] = useState(0);
  const dragX = useRef(0);

  // Fetch real slides from MongoDB
  useEffect(() => {
    API.get('/slides?active=true')
      .then((res) => {
        if (res.data?.slides && res.data.slides.length > 0) {
          setSlides(res.data.slides);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCur((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleButtonClick = (e, target, text) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(target, text);
    } else {
      // Smart Fallback if onNavigate is not provided
      const rawTarget = (target || '').trim();
      const rawText = (text || '').toLowerCase().trim();
      if (rawTarget.startsWith('http://') || rawTarget.startsWith('https://')) {
        window.open(rawTarget, '_blank');
        return;
      }
      if (rawText.includes('pack') || rawText.includes('team') || rawText.includes('équipe')) {
        document.querySelector('#teams')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (rawText.includes('timer') || rawText.includes('countdown') || rawText.includes('drop')) {
        document.querySelector('#countdown')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (rawTarget.startsWith('#')) {
        document.querySelector(rawTarget.split(':')[0])?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    dragX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    const diff = dragX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCur((prev) => (prev + 1) % slides.length);
      } else {
        setCur((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  const handleTouchStart = (e) => {
    dragX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = dragX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCur((prev) => (prev + 1) % slides.length);
      } else {
        setCur((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  const renderTitle = (title) => {
    if (React.isValidElement(title)) return title;
    if (!title) return 'DARK WOLF TEAM';
    const parts = title.split('.').filter(Boolean);
    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {i === 1 ? <span style={{ color: 'var(--red-primary, #e60000)' }}>{part.trim()}.</span> : `${part.trim()}.`}
              {i < parts.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    }
    return title;
  };

  return (
    <section className="hero">
      <div
        className="hslides"
        id="hslides"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {slides.map((s, idx) => {
          const bgImg = s.backgroundImage || s.posterImage;
          const bgUrl = bgImg ? getImageUrl(bgImg) : '/backgrounds/hero-gaming-bg.jpg';

          return (
            <div key={s._id || s.id || idx} className={`hslide ${idx === cur ? 'act' : ''}`}>
              <div
                className="hsbg"
                style={{
                  background: '#0a0a14',
                  backgroundImage: `url(${bgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
              <div className="hsov"></div>
              <div className="hcont">
                <div className="hlbl">{s.label || s.lbl}</div>
                <h1 className="htitle">{renderTitle(s.title)}</h1>
                <p className="hsub">{s.subtitle || s.sub}</p>
                <div className="hbtns">
                  {s.btn1Text && (
                    <button 
                      type="button"
                      className="bp" 
                      onClick={(e) => handleButtonClick(e, s.btn1Target, s.btn1Text)}
                      title={`Accéder à : ${s.btn1Text}`}
                    >
                      {s.btn1Text}
                    </button>
                  )}
                  {s.btn2Text && (
                    <button 
                      type="button"
                      className="bs" 
                      onClick={(e) => handleButtonClick(e, s.btn2Target, s.btn2Text)}
                      title={`Accéder à : ${s.btn2Text}`}
                    >
                      {s.btn2Text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="hdrag"
        id="hdrag"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      ></div>

      <div className="hdots" id="hdots">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`hdot ${idx === cur ? 'act' : ''}`}
            onClick={() => setCur(idx)}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
