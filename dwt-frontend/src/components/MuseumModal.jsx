import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

// Configuration officielle par défaut des drops d'archives du DWT Museum
export const defaultMuseumItems = [
  {
    name: 'Season 1 Jersey',
    cat: 'Pro Kit',
    year: '2022',
    price: 'TND 79',
    image: '/museum/season1-jersey.jpg',
    desc: 'The very first DWT competition jersey. Worn during the inaugural season. Only 50 were ever made.',
  },
  {
    name: 'OG Wolf Tee',
    cat: 'Limited Drop',
    year: '2021',
    price: 'TND 45',
    image: '/museum/og-wolf-tee.jpg',
    desc: 'The original Dark Wolf Team t-shirt. Simple. Raw. Where it all began. This started the culture.',
  },
  {
    name: 'Launch Hoodie 001',
    cat: 'New Collection',
    year: '2021',
    price: 'TND 99',
    image: '/museum/launch-hoodie-001.jpg',
    desc: 'First Dark Lab hoodie ever released. Sold out in 4 hours. Never reprinted. A true piece of DWT history.',
  },
  {
    name: 'Collab Wolf x Nocturne',
    cat: 'Collabs',
    year: '2023',
    price: 'TND 120',
    image: '/museum/collab-wolf-nocturne.jpg',
    desc: 'Collaboration with Nocturne design studio. 100 units. Hand-signed by DWT players. Legendary status.',
  },
  {
    name: 'Season 2 Competition Kit',
    cat: 'Pro Kit',
    year: '2023',
    price: 'TND 89',
    image: '/museum/season2-pro-kit.jpg',
    desc: 'Full kit worn during our first international tournament. The pack wore this into battle and came back champions.',
  },
  {
    name: 'Archive Cap Vol.1',
    cat: 'Accessories',
    year: '2022',
    price: 'TND 38',
    image: '/museum/archive-cap-vol1.jpg',
    desc: 'First ever Dark Lab headwear drop. Wool-blend construction. A collector piece for true DWT supporters.',
  }
];

export const museumItems = defaultMuseumItems;

const MuseumModal = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      API.get('/museum')
        .then((res) => {
          if (res.data?.success) {
            setItems(res.data.items || []);
          } else {
            setItems([]);
          }
        })
        .catch(() => {
          setItems([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`museumPage ${isOpen ? 'open' : ''}`} id="museumPage">
      <button className="musBack" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="musHero">
        <div className="slbl">Dark Lab</div>
        <h1 className="musTitle">DWT<br />MUSEUM</h1>
        <p className="musDesc">
          A tribute to every piece that shaped the culture. These drops are gone
          — but never forgotten. The archive of the wolfpack legacy.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          Chargement de l'archive DWT...
        </div>
      ) : items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#94a3b8',
          fontFamily: '"Rajdhani", sans-serif'
        }}>
          <div style={{
            fontSize: '52px',
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 16px rgba(230,0,0,0.4))'
          }}>
            🏛️
          </div>
          <h3 style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '18px',
            color: '#fff',
            marginBottom: '8px',
            letterSpacing: '0.08em'
          }}>
            AUCUNE PIÈCE D'ARCHIVE ACTUELLEMENT
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            Toutes les pièces d'archives ont été retirées ou sont en cours d'actualisation par l'administration de la Dark Wolf Team.
          </p>
        </div>
      ) : (
        <div className="musGrid" id="musGrid">
          {items.map((m, i) => {
            const imgUrl = getImageUrl(m.image);
            return (
              <div key={m._id || i} className="musCard">
                <div 
                  className="musCover" 
                  style={{ 
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#0d111a'
                  }}
                ></div>
                <div className="musOverlay">
                  <div className="musSoldBadge">Sold Out — Archive Only</div>
                </div>
                <div className="musInfo">
                  <div className="musYear">{m.year}</div>
                  <div className="musName">{m.name}</div>
                  <div className="musCat">{m.cat}</div>
                  <div className="musDesc2">{m.desc}</div>
                  <div className="musPrice">{m.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MuseumModal;
