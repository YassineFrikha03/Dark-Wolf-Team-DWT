import React, { useState, useRef, useEffect } from 'react';

const chatResponses = {
  shop: '🛒 You can browse our latest drops in the Shop section! We have Pro Kit, New Collection, Collabs, and Accessories. Click any product to see full details, sizes, and colors.',
  jersey: '🎽 The Wolf Jersey Pro is our most popular piece — TND 89, championship-grade fabric, DWT embroidered crest. Available in XS to 2XL.',
  hoodie: '🖤 The DWT Hoodie Black (TND 120) is a beast — 400g fleece, wolf graphic on back, hidden kangaroo pocket. Very limited stock!',
  museum: '🏛️ The Museum is our archive — past drops that sold out and will never be reprinted. Click Shop in the nav, then Museum to explore.',
  team: '🐺 Dark Wolf Team competes in Valorant, FC 25, Call of Duty, PUBG Mobile, Fortnite, Rocket League, and EA Sports FC. Click DWT Teams → Our Teams to see the full roster!',
  members: '👥 We have 20+ active players across 7 game titles. You can filter by game in the Our Teams modal. Open it from the nav under DWT Teams.',
  matches: '⚔️ Check the News & Matches section for live and upcoming matches. DWT Valorant is LIVE right now!',
  contact: '📧 You can reach us at contact@darkwolfteam.gg or use the Contact section at the bottom of the page.',
  social: '📱 Follow us on Twitch twitch.tv/darkw0lfteam, Instagram @dark_wolf_team_officiel, Discord, Twitter @DARKWOLFTEAM2, Facebook Dark Wolf Team, and YouTube Dark Wolf Team TV. Scroll to Follow the Pack section!',
  countdown: '⏳ The countdown is for our DWT Summer Championship 2026 on August 15! Big things incoming 🐺',
  join: '💪 To join DWT, scroll to the Join Us section and enter your email. For player tryouts, contact esports@darkwolfteam.gg',
  order: '📦 Add products to your order using the cart button. You can adjust quantities in the order panel. Confirm with the Confirm Order button!',
  default: "🐺 Hmm, I'm not sure about that one. Try asking about our shop, team, matches, museum, or contact info!",
};

const suggestions = [
  'What games does DWT play?',
  'Show me the shop',
  'Who are the team members?',
  'When is the next match?',
  'How to join DWT?',
  'What is the museum?',
  'How to contact DWT?',
];

const WolfChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: "🐺 Yo! I'm Wolf Bot — your DWT guide. Ask me anything about the team, shop, matches, or drops!",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const processResponse = (userText) => {
    const t = userText.toLowerCase();
    let resp = chatResponses.default;
    if (t.includes('shop') || t.includes('buy') || t.includes('product')) resp = chatResponses.shop;
    else if (t.includes('jersey')) resp = chatResponses.jersey;
    else if (t.includes('hoodie')) resp = chatResponses.hoodie;
    else if (t.includes('museum') || t.includes('archive') || t.includes('old')) resp = chatResponses.museum;
    else if (t.includes('game') || t.includes('play') || t.includes('valorant') || t.includes('cod') || t.includes('fifa') || t.includes('fc')) resp = chatResponses.team;
    else if (t.includes('member') || t.includes('player') || t.includes('roster') || t.includes('team')) resp = chatResponses.members;
    else if (t.includes('match') || t.includes('live') || t.includes('tournament')) resp = chatResponses.matches;
    else if (t.includes('contact') || t.includes('email') || t.includes('message')) resp = chatResponses.contact;
    else if (t.includes('social') || t.includes('instagram') || t.includes('twitch') || t.includes('discord') || t.includes('follow')) resp = chatResponses.social;
    else if (t.includes('count') || t.includes('timer') || t.includes('event') || t.includes('championship')) resp = chatResponses.countdown;
    else if (t.includes('join') || t.includes('tryout') || t.includes('apply')) resp = chatResponses.join;
    else if (t.includes('order') || t.includes('cart') || t.includes('confirm')) resp = chatResponses.order;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'bot', text: resp }]);
    }, 700);
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInputText('');
    processResponse(text);
  };

  return (
    <>
      <button id="chatBtn" onClick={() => setIsOpen(!isOpen)} aria-label="Open Wolf Bot Chat" style={{ padding: '8px' }}>
        <img
          src="/logo-dwt.png"
          alt="Wolf Bot"
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
        />
      </button>

      <div id="chatWindow" className={isOpen ? 'open' : ''}>
        <div className="chatHdr">
          <div className="chatWolfIcon">
            <img
              src="/logo-dwt.png"
              alt="Wolf Bot"
              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div className="chatName">Wolf Bot</div>
            <div className="chatStatus">Online — Ready to help</div>
          </div>
          <button className="chatClose" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chatBody" id="chatBody" ref={chatBodyRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chatMsg ${m.sender}`}>
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className="chatMsg bot typing">
              <div className="chatDot"></div>
              <div className="chatDot"></div>
              <div className="chatDot"></div>
            </div>
          )}
        </div>

        <div className="chatSuggestions">
          <div className="chatSugLabel">Quick questions</div>
          <div className="chatSugBtns" id="chatSugBtns">
            {suggestions.map((s, i) => (
              <button key={i} className="chatSug" onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="chatInputRow">
          <input
            type="text"
            className="chatInput"
            id="chatInput"
            placeholder="Ask the wolf..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button className="chatSend" onClick={() => handleSend()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default WolfChatbot;
