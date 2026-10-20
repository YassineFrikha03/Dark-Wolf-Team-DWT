import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  MapPin, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import API from '../services/api';
import RecruitmentSection from '../sections/RecruitmentSection';
import { WolfLogo } from '../components/WolfLogo';
import { SOCIAL_LINKS } from '../config/socialLinks';

const ContactPage = () => {
  const location = useLocation();
  // Déterminer l'onglet actif selon la route URL (/recrutement ou /contact)
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('recrutement') ? 'recruitment' : 'contact'
  );

  useEffect(() => {
    if (location.pathname.includes('recrutement')) {
      setActiveTab('recruitment');
    } else {
      setActiveTab('contact');
    }
  }, [location.pathname]);

  // État du formulaire de contact
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Partenariat & Sponsoring',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/contact', contactForm);
      if (res.data?.success) {
        setSuccessMsg(res.data.message || 'Votre message a bien été transmis au staff Dark Wolf Team !');
        setContactForm({
          name: '',
          email: '',
          subject: 'Partenariat & Sponsoring',
          message: ''
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de l\'envoi du message au staff.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', padding: '60px 20px 100px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* En-tête de la page */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(230, 0, 0, 0.1)', 
            border: '1px solid rgba(230, 0, 0, 0.3)',
            color: 'var(--red-primary)', 
            padding: '6px 16px', 
            borderRadius: '20px', 
            fontSize: '13px', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px'
          }}>
            <WolfLogo size={18} />
            <span>Dark Wolf Team • Staff & Roster</span>
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#fff', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ENTRER EN <span style={{ color: 'var(--red-primary)', textShadow: '0 0 20px rgba(230,0,0,0.4)' }}>COMMUNICATION</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Une proposition de partenariat, une question pour le staff ou l'envie de rejoindre nos rangs compétitifs ? Choisissez votre canal ci-dessous.
          </p>
        </div>

        {/* Boutons sélecteurs d'onglets */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '40px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: activeTab === 'contact' ? '1px solid var(--red-primary)' : '1px solid #1e2638',
              background: activeTab === 'contact' ? 'linear-gradient(135deg, rgba(230,0,0,0.2) 0%, rgba(20,24,36,0.9) 100%)' : '#0e121d',
              color: activeTab === 'contact' ? '#fff' : '#64748b',
              boxShadow: activeTab === 'contact' ? '0 0 18px rgba(230,0,0,0.25)' : 'none'
            }}
          >
            <Mail size={18} color={activeTab === 'contact' ? 'var(--red-primary)' : '#64748b'} />
            <span>Formulaire de Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recruitment')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: activeTab === 'recruitment' ? '1px solid var(--red-primary)' : '1px solid #1e2638',
              background: activeTab === 'recruitment' ? 'linear-gradient(135deg, rgba(230,0,0,0.2) 0%, rgba(20,24,36,0.9) 100%)' : '#0e121d',
              color: activeTab === 'recruitment' ? '#fff' : '#64748b',
              boxShadow: activeTab === 'recruitment' ? '0 0 18px rgba(230,0,0,0.25)' : 'none'
            }}
          >
            <Users size={18} color={activeTab === 'recruitment' ? 'var(--red-primary)' : '#64748b'} />
            <span>Rejoindre la Meute (Recrutement)</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : FORMULAIRE DE CONTACT */}
        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Formulaire */}
            <div style={{
              background: '#0d111a',
              border: '1px solid #1c2436',
              borderRadius: '12px',
              padding: '36px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '20px', color: '#fff', fontWeight: '800' }}>
                  Envoyer un Message Direct au Staff
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                  Votre message apparaîtra directement dans l'espace Messages de l'administration Dark Wolf Team.
                </p>
              </div>

              {successMsg && (
                <div style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid #22c55e',
                  color: '#4ade80',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px'
                }}>
                  <CheckCircle2 size={20} />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(230, 0, 0, 0.12)',
                  border: '1px solid var(--red-primary)',
                  color: '#ff6666',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px'
                }}>
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label className="auth-input-label">Votre Nom / Pseudo *</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Ex: Alexandre Moreau"
                      className="auth-text-input"
                      style={{ paddingLeft: '14px' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="auth-input-label">Votre Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="Ex: contact@exemple.com"
                      className="auth-text-input"
                      style={{ paddingLeft: '14px' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label className="auth-input-label">Sujet du Message *</label>
                  <select
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    className="auth-text-input"
                    style={{ paddingLeft: '14px', background: '#0b0d14' }}
                    required
                  >
                    <option value="Partenariat & Sponsoring">Partenariat & Sponsoring</option>
                    <option value="Question Générale au Staff">Question Générale au Staff</option>
                    <option value="Scrim & Match Amical">Demande de Scrim / Match Amical</option>
                    <option value="Support Boutique & Commandes">Support Boutique & Commandes</option>
                    <option value="Presse & Média">Presse & Média</option>
                    <option value="Autre Demande">Autre Demande</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="auth-input-label">Votre Message *</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Écrivez votre message avec le plus de précisions possibles..."
                    className="auth-text-input"
                    style={{ paddingLeft: '14px', resize: 'vertical' }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="auth-submit-btn" 
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  <Send size={18} />
                  <span>{loading ? 'Transmission en cours...' : 'Envoyer le message au Staff'}</span>
                </button>
              </form>
            </div>

            {/* Carte latérale d'infos rapides */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{
                background: '#0d111a',
                border: '1px solid #1c2436',
                borderRadius: '12px',
                padding: '28px'
              }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '17px', color: '#fff', fontWeight: '800' }}>
                  Canaux Officiels
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(230,0,0,0.1)', color: 'var(--red-primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Email Direction & Staff</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>contact@darkwolfteam.gg</div>
                    </div>
                  </div>

                  <a 
                    href={SOCIAL_LINKS.discord} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      textDecoration: 'none', 
                      padding: '8px', 
                      borderRadius: '8px', 
                      background: 'rgba(88, 101, 242, 0.08)', 
                      border: '1px solid rgba(88, 101, 242, 0.2)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5865F2'; e.currentTarget.style.background = 'rgba(88, 101, 242, 0.18)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(88, 101, 242, 0.2)'; e.currentTarget.style.background = 'rgba(88, 101, 242, 0.08)'; }}
                  >
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(88, 101, 242, 0.2)', color: '#5865F2' }}>
                      <MessageSquare size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>Discord Officiel DWT</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Rejoindre le Discord DWT 🐺</div>
                    </div>
                    <ExternalLink size={14} color="#818cf8" style={{ marginRight: '6px' }} />
                  </a>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Disponibilité du Staff</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>7j/7 • Réponse sous 24h</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box Info Roster */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(230,0,0,0.1) 0%, rgba(13,17,26,0.9) 100%)',
                border: '1px solid rgba(230,0,0,0.3)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: 'var(--red-primary)' }}>
                  <Sparkles size={20} />
                  <span style={{ fontWeight: '800', fontSize: '15px' }}>Tu souhaites jouer avec nous ?</span>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                  Nos équipes Valorant, CS2, League of Legends et FC26 recrutent régulièrement de nouveaux talents.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('recruitment')}
                  style={{
                    background: 'var(--red-primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Remplir une Candidature <ExternalLink size={14} />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* CONTENU ONGLET 2 : RECRUTEMENT JOUEUR */}
        {activeTab === 'recruitment' && (
          <div>
            <RecruitmentSection />
          </div>
        )}

      </div>
    </div>
  );
};

export default ContactPage;
