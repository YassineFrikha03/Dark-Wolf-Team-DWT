import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Cookie, Lock } from 'lucide-react';

const LegalModal = ({ isOpen, initialTab = 'privacy', onClose }) => {
  const [tab, setTab] = useState(initialTab);

  React.useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

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
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95)',
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

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setTab('privacy')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'privacy' ? '#e60000' : 'transparent',
              color: '#fff',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock size={14} /> Politique de Confidentialité
          </button>

          <button
            type="button"
            onClick={() => setTab('terms')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'terms' ? '#e60000' : 'transparent',
              color: '#fff',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={14} /> Conditions d'Utilisation
          </button>

          <button
            type="button"
            onClick={() => setTab('cookies')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'cookies' ? '#e60000' : 'transparent',
              color: '#fff',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Cookie size={14} /> Gestion des Cookies
          </button>
        </div>

        {/* Content based on tab */}
        {tab === 'privacy' && (
          <div>
            <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '14px' }}>
              POLITIQUE DE CONFIDENTIALITÉ — DARK WOLF TEAM
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
              Chez Dark Wolf Team & Dark Lab, la protection de vos données personnelles est une priorité absolue. Nous collectons uniquement les informations nécessaires au traitement de vos commandes boutique (adresse de livraison, email de confirmation) et à votre expérience de supporter (statistiques de visionnage, candidatures e-sport).
            </p>
            <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '15px', color: '#e60000', marginBottom: '8px' }}>
              1. Données collectées
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
              • Identité & Coordonnées : nom, gamertag, adresse email, adresse de livraison.<br />
              • Informations de paiement : traitées de façon cryptée via des passerelles sécurisées SSL/TLS. Nous ne conservons jamais votre numéro de carte bancaire.
            </p>
            <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '15px', color: '#e60000', marginBottom: '8px' }}>
              2. Vos droits
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7 }}>
              Conformément à la réglementation sur la protection des données (RGPD), vous disposez à tout moment d'un droit d'accès, de rectification et de suppression de vos données en contactant notre équipe à <strong>contact@darkwolfteam.gg</strong>.
            </p>
          </div>
        )}

        {tab === 'terms' && (
          <div>
            <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '14px' }}>
              CONDITIONS GÉNÉRALES D'UTILISATION & DE VENTE
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
              L'utilisation du site officiel Dark Wolf Team et les achats effectués sur le store Dark Lab sont régis par les présentes conditions. En naviguant sur ce site ou en passant commande, vous acceptez l'ensemble de ces termes.
            </p>
            <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '15px', color: '#e60000', marginBottom: '8px' }}>
              1. Produits & Disponibilité
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
              Les maillots officiels, hoodies, casquettes et accessoires sont produits en séries limitées. Les stocks sont mis à jour en temps réel. En cas de rupture de stock consécutive à une commande, notre service client vous contacte sous 24h.
            </p>
            <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '15px', color: '#e60000', marginBottom: '8px' }}>
              2. Propriété intellectuelle
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7 }}>
              Tous les visuels, vidéos, photographies, logos DWT et designs Dark Lab sont la propriété exclusive de Dark Wolf Team. Toute reproduction non autorisée est strictement interdite.
            </p>
          </div>
        )}

        {tab === 'cookies' && (
          <div>
            <h2 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '14px' }}>
              POLITIQUE DE GESTION DES COOKIES
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
              Notre site utilise des cookies essentiels au bon fonctionnement de votre session de navigation, de la mémorisation de votre panier d'achat et des animations cybernétiques du curseur interactif.
            </p>
            <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>
                ✓ Cookies Essentiels (Toujours Actifs)
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Nécessaires pour le panier d'achat, l'authentification et la sécurité du formulaire.
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7 }}>
              Vous pouvez à tout moment configurer votre navigateur pour bloquer ou supprimer ces cookies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalModal;
