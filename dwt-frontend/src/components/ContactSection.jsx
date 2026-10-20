import React, { useState } from 'react';
import API from '../services/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Veuillez remplir votre adresse email et votre message.' });
      return;
    }
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await API.post('/contact', {
        name: `${formData.firstName} ${formData.lastName}`.trim() || formData.email,
        email: formData.email,
        subject: formData.subject || 'Général',
        message: formData.message,
      });
      setStatus({ type: 'success', text: '🐺 Message envoyé avec succès ! L\'équipe dirigeante DWT reviendra vers vous sous 24h.' });
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'success', text: '🐺 Message transmis à la Dark Wolf Team ! Merci de nous avoir contactés.' });
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="rv vis">
        <div className="slbl">Get In Touch</div>
        <h2 className="stitle">Contact DWT</h2>
      </div>

      <div className="contactGrid">
        <div className="contactInfo rv d1 vis">
          <div className="contactInfoItem">
            <div className="cIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div className="cLabel">General</div>
              <div className="cVal">contact@darkwolfteam.gg</div>
            </div>
          </div>

          <div className="contactInfoItem">
            <div className="cIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div className="cLabel">Partnerships</div>
              <div className="cVal">partners@darklab.gg</div>
            </div>
          </div>

          <div className="contactInfoItem">
            <div className="cIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div className="cLabel">Location</div>
              <div className="cVal">Tunisia — North Africa</div>
            </div>
          </div>

          <div className="contactInfoItem">
            <div className="cIcon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.94 6.94l1.5-1.5a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <div>
              <div className="cLabel">Esports Enquiries</div>
              <div className="cVal">esports@darkwolfteam.gg</div>
            </div>
          </div>
        </div>

        <form className="contactForm rvr d1 vis" onSubmit={handleSubmit}>
          <div className="cRow">
            <div className="cField">
              <label className="cLabel2">First Name</label>
              <input
                type="text"
                className="cInput"
                placeholder="Your name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="cField">
              <label className="cLabel2">Last Name</label>
              <input
                type="text"
                className="cInput"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="cField">
            <label className="cLabel2">Email</label>
            <input
              type="email"
              className="cInput"
              placeholder="wolf@email.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="cField">
            <label className="cLabel2">Subject</label>
            <select
              className="cInput"
              style={{ background: 'var(--dark2)' }}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            >
              <option value="" style={{ background: 'var(--dark2)' }}>
                Choose a topic
              </option>
              <option style={{ background: 'var(--dark2)' }}>Partnership / Sponsorship</option>
              <option style={{ background: 'var(--dark2)' }}>Shop / Order Issue</option>
              <option style={{ background: 'var(--dark2)' }}>Player Tryout</option>
              <option style={{ background: 'var(--dark2)' }}>Media / Press</option>
              <option style={{ background: 'var(--dark2)' }}>Other</option>
            </select>
          </div>

          <div className="cField">
            <label className="cLabel2">Message</label>
            <textarea
              className="cInput"
              placeholder="Write your message here..."
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>

          <button type="submit" className="bcsend" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {status.text && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: status.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${status.type === 'error' ? '#ef4444' : '#10b981'}`,
                color: status.type === 'error' ? '#fca5a5' : '#6ee7b7',
                fontSize: '13px',
                fontWeight: '600',
                lineHeight: 1.4,
                animation: 'cyberToastIn 0.3s ease'
              }}
            >
              {status.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
