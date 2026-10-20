import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, Info, Check, X, ShieldAlert } from 'lucide-react';
import { WolfLogo } from './WolfLogo';

/**
 * CyberConfirmModal - Dark Wolf Team Esport Design System
 * Remplace tous les window.confirm() natifs du navigateur par une modale cyber esport premium.
 */
export const CyberConfirmModal = ({
  isOpen,
  title = 'Confirmation Requise',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  subtext = 'Cette action sera enregistrée dans le système Dark Wolf Team.',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
  loading = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter' && !loading) onConfirm?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onConfirm, onCancel]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  const accentColor = isDanger ? '#e60000' : isWarning ? '#f59e0b' : '#38bdf8';
  const accentGlow = isDanger
    ? 'rgba(230, 0, 0, 0.45)'
    : isWarning
    ? 'rgba(245, 158, 11, 0.45)'
    : 'rgba(56, 189, 248, 0.45)';

  return (
    <div
      className="dash-modal-backdrop"
      style={{
        zIndex: 9999999,
        background: 'rgba(4, 6, 12, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel?.();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #0d101a 0%, #080a12 100%)',
          border: `1px solid ${accentGlow}`,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          padding: '28px 24px',
          boxShadow: `0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px ${accentGlow}`,
          position: 'relative',
          animation: 'cyberModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Ligne lumineuse en haut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          }}
        />

        {/* Bouton de fermeture en haut à droite */}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <X size={18} />
        </button>

        {/* En-tête avec badge d'icône */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: `radial-gradient(circle, ${accentGlow} 0%, rgba(13, 16, 26, 0.8) 70%)`,
              border: `1px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              flexShrink: 0,
              boxShadow: `0 0 16px ${accentGlow}`
            }}
          >
            {isDanger ? (
              <Trash2 size={24} />
            ) : isWarning ? (
              <AlertTriangle size={24} />
            ) : (
              <WolfLogo size={26} />
            )}
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display, "Orbitron", sans-serif)',
                fontSize: '18px',
                fontWeight: '900',
                letterSpacing: '1px',
                color: '#ffffff',
                textTransform: 'uppercase'
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: accentColor,
                fontWeight: '700',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}
            >
              {isDanger ? '⚠️ Action Destructive' : isWarning ? '⚡ Attention' : '🐺 Dark Wolf Team'}
            </div>
          </div>
        </div>

        {/* Corps du message */}
        <div
          style={{
            background: 'rgba(15, 18, 28, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '22px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: '#f1f5f9',
              lineHeight: 1.5,
              fontWeight: '600'
            }}
          >
            {message}
          </div>

          {subtext && (
            <div
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                marginTop: '8px',
                lineHeight: 1.4
              }}
            >
              {subtext}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '11px 20px',
              borderRadius: '8px',
              background: '#121622',
              border: '1px solid #252e42',
              color: '#cbd5e1',
              fontWeight: '700',
              fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#475569';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#252e42';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '11px 24px',
              borderRadius: '8px',
              background: isDanger
                ? 'linear-gradient(135deg, #cc1111 0%, #880b0b 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              border: `1px solid ${accentColor}`,
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: `0 4px 18px ${accentGlow}`,
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 6px 22px ${accentGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 4px 18px ${accentGlow}`;
            }}
          >
            {loading ? (
              <span>Traitement...</span>
            ) : (
              <>
                {isDanger ? <Trash2 size={16} /> : <Check size={16} />}
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
