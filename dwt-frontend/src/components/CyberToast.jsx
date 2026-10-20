import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { WolfLogo } from './WolfLogo';

/**
 * CyberToast - Dark Wolf Team Notification Banner
 * Remplace tous les alert() natifs par des notifications cyber esport animées.
 */
export const CyberToast = ({
  toast, // { id, text, type, duration }
  onClose
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration || 4000;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose?.();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success' || !toast.type;
  const isInfo = toast.type === 'info';

  const accentColor = isError ? '#ef4444' : isSuccess ? '#10b981' : '#38bdf8';
  const accentGlow = isError
    ? 'rgba(239, 68, 68, 0.4)'
    : isSuccess
    ? 'rgba(16, 185, 129, 0.4)'
    : 'rgba(56, 189, 248, 0.4)';

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999999,
        minWidth: '320px',
        maxWidth: '460px',
        background: 'linear-gradient(135deg, #0e121d 0%, #080a11 100%)',
        border: `1px solid ${accentColor}`,
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: '12px',
        boxShadow: `0 14px 40px rgba(0, 0, 0, 0.85), 0 0 25px ${accentGlow}`,
        padding: '16px 18px',
        color: '#fff',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        animation: 'cyberToastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Icône de statut */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `rgba(${isError ? '239, 68, 68' : isSuccess ? '16, 185, 129' : '56, 189, 248'}, 0.15)`,
          border: `1px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
          flexShrink: 0
        }}
      >
        {isError ? (
          <AlertTriangle size={20} />
        ) : isSuccess ? (
          <CheckCircle2 size={20} />
        ) : (
          <WolfLogo size={20} />
        )}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '800',
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '3px'
          }}
        >
          {isError ? 'Erreur Système' : isSuccess ? 'Confirmation Meute' : 'Information DWT'}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#f8fafc',
            lineHeight: 1.45,
            wordBreak: 'break-word'
          }}
        >
          {toast.text}
        </div>
      </div>

      {/* Bouton de fermeture */}
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
      >
        <X size={16} />
      </button>

      {/* Barre de progression dégressive en bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${accentColor}, #ffffff)`,
          boxShadow: `0 0 8px ${accentColor}`,
          transition: 'width 20ms linear'
        }}
      />
    </div>
  );
};
