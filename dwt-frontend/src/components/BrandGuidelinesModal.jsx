import React, { useState } from 'react';
import { X, Download, Copy, Check, Palette, Type, Shield, Sparkles } from 'lucide-react';

const BrandGuidelinesModal = ({ isOpen, onClose }) => {
  const [copiedHex, setCopiedHex] = useState(null);

  if (!isOpen) return null;

  const copyHex = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const colors = [
    { name: 'Wolf Crimson', hex: '#E60000', rgb: '230, 0, 0', role: 'Couleur primaire & accents' },
    { name: 'Cyber Void', hex: '#07080C', rgb: '7, 8, 12', role: 'Arrière-plan principal' },
    { name: 'Tactical Slate', hex: '#111622', rgb: '17, 22, 34', role: 'Cartes & surfaces' },
    { name: 'Neon Jade', hex: '#00D4AA', rgb: '0, 212, 170', role: 'Statut actif & victoires' },
    { name: 'Titanium Silver', hex: '#CBD5E1', rgb: '203, 213, 225', role: 'Typographie & icônes' },
  ];

  return (
    <div
      className="dash-modal-backdrop"
      style={{
        zIndex: 99999,
        background: 'rgba(3, 5, 10, 0.94)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'fixed',
        inset: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dash-modal-box"
        style={{
          maxWidth: '880px',
          width: '100%',
          maxHeight: '90vh',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 30px rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '12px' }}>
            <Shield size={32} color="#cbd5e1" />
          </div>
          <div className="slbl" style={{ color: '#cbd5e1' }}>Identité Visuelle Officielle</div>
          <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '26px', fontWeight: '900', color: '#fff', letterSpacing: '0.05em' }}>
            DARK WOLF TEAM • BRAND GUIDELINES
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            Ressources graphiques officielles pour diffuseurs, tournois et médias partenaires.
          </p>
        </div>

        {/* Section 1: Logo & Crest */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#e60000" />
            <span>1. LOGO OFFICIEL ET BLASON DE LA MEUTE</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px', textAlign: 'center' }}>
              <img src="/logo-dwt.png" alt="Logo Principal DWT" style={{ width: '80px', height: '80px', objectFit: 'contain', margin: '0 auto 16px' }} />
              <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '13px', fontWeight: '800', color: '#fff' }}>Blason Principal DWT</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Sur fond sombre • PNG Haute Résolution</div>
              <a
                href="/logo-dwt.png"
                download="DWT_Official_Logo.png"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '14px',
                  padding: '7px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <Download size={12} /> Télécharger PNG
              </a>
            </div>

            <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Orbitron", monospace', fontSize: '32px', fontWeight: '900', color: '#fff', border: '2px solid rgba(230,0,0,0.5)', borderRadius: '12px', background: 'rgba(230,0,0,0.1)' }}>
                DL
              </div>
              <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '13px', fontWeight: '800', color: '#fff' }}>Monogramme Dark Lab</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Streetwear & Apparel Monogram</div>
              <a
                href="/logo-dwt.png"
                download="DarkLab_Monogram.png"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '14px',
                  padding: '7px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <Download size={12} /> Télécharger Monogramme
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Color Palette */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={16} color="#e60000" />
            <span>2. PALETTE DE COULEURS OFFICIELLE</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {colors.map((c) => (
              <div
                key={c.name}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => copyHex(c.hex)}
                title="Cliquer pour copier le code hexadécimal"
              >
                <div style={{ height: '48px', borderRadius: '6px', background: c.hex, marginBottom: '8px', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '12px', fontWeight: '800', color: '#fff' }}>{c.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <code style={{ fontSize: '11px', color: '#94a3b8' }}>{c.hex}</code>
                  {copiedHex === c.hex ? <Check size={12} color="#22c55e" /> : <Copy size={12} color="#64748b" />}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{c.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Typography */}
        <div>
          <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Type size={16} color="#e60000" />
            <span>3. TYPOGRAPHIES OFFICIELLES</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '18px', fontWeight: '900', color: '#fff' }}>Orbitron</div>
              <div style={{ fontSize: '12px', color: '#e60000', fontWeight: '700', marginTop: '2px' }}>Titres Principaux & Badges Esport</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Police futuriste géométrique utilisée pour les scores, les gamertags et les bannières majeures.</div>
            </div>

            <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontFamily: '"Rajdhani", sans-serif', fontSize: '18px', fontWeight: '700', color: '#fff' }}>Rajdhani</div>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700', marginTop: '2px' }}>Sous-titres & Menus</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Police condensée technique pour la navigation, les caractéristiques produits et les rôles.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandGuidelinesModal;
