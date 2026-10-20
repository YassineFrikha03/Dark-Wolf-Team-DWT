import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import '../styles/wolfpack.css';
import {
  Shield,
  Trophy,
  Target,
  User,
  LogOut,
  Settings,
  Award,
  CheckCircle,
  Flame,
  Crown,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  Tv,
  Users,
  ShoppingBag,
  ExternalLink,
  Zap,
  Check
} from 'lucide-react';

const FanPortalModal = ({ isOpen, onClose, mode = 'PROFILE', defaultMatchId = null }) => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(mode || 'PROFILE');

  // Data states
  const [wolfProfile, setWolfProfile] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [missionsData, setMissionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Prediction Form State per Match
  const [predictionInputs, setPredictionInputs] = useState({});
  const [submittingPred, setSubmittingPred] = useState({});

  // MVP Vote Selection state for missions
  const [selectedMvpMatch, setSelectedMvpMatch] = useState('');
  const [selectedMvpPlayer, setSelectedMvpPlayer] = useState('');
  const [rosterPlayers, setRosterPlayers] = useState([]);

  // Sync mode prop with activeTab
  useEffect(() => {
    if (mode) {
      if (mode === 'FAN') setActiveTab('PROFILE');
      else if (mode === 'CRATES') setActiveTab('MISSIONS');
      else setActiveTab(mode);
    }
  }, [mode, isOpen]);

  // Load relevant data on tab change or open
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch Wolf Profile if logged in
        if (user) {
          try {
            const profRes = await API.get('/wolfpack/profile');
            if (profRes.data?.profile) {
              setWolfProfile(profRes.data.profile);
            }
          } catch {
            // fallback to user in auth context
          }
        }

        // Fetch Upcoming Matches for predictions
        const matchRes = await API.get('/matches?status=upcoming');
        if (matchRes.data?.matches) {
          setUpcomingMatches(matchRes.data.matches);
          // Initialize default prediction inputs
          const initial = {};
          matchRes.data.matches.forEach((m) => {
            initial[m._id] = {
              predictedWinner: 'DWT',
              scoreDWT: 2,
              scoreOpponent: 1,
              predictedMVP: 'ShadowFang'
            };
          });
          setPredictionInputs((prev) => ({ ...initial, ...prev }));
        }

        // Fetch Players for MVP selection
        const playRes = await API.get('/players');
        if (playRes.data?.players) {
          setRosterPlayers(playRes.data.players);
          if (playRes.data.players[0]) {
            setSelectedMvpPlayer(playRes.data.players[0].gamertag);
          }
        }

        // Fetch My Predictions if user logged in
        if (user) {
          try {
            const myPredRes = await API.get('/predictions/my');
            if (myPredRes.data?.predictions) {
              setMyPredictions(myPredRes.data.predictions);
            }
          } catch {
            // ignore
          }
        }

        // Fetch Leaderboard
        const leadRes = await API.get('/predictions/leaderboard');
        if (leadRes.data?.leaderboard) {
          setLeaderboard(leadRes.data.leaderboard);
        }

        // Fetch Weekly Missions
        const missRes = await API.get('/missions/weekly');
        if (missRes.data) {
          setMissionsData(missRes.data);
        }
      } catch (err) {
        console.error('Erreur chargement données Wolf Pack:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, activeTab, user]);

  const showFeedback = (text, type = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Handle Prediction Submit
  const handleSavePrediction = async (matchId) => {
    if (!user) {
      showFeedback('Veuillez vous connecter pour faire un pronostic !', 'error');
      return;
    }

    const input = predictionInputs[matchId] || {
      predictedWinner: 'DWT',
      scoreDWT: 2,
      scoreOpponent: 1,
      predictedMVP: 'ShadowFang'
    };

    setSubmittingPred((prev) => ({ ...prev, [matchId]: true }));
    try {
      const res = await API.post('/predictions', {
        matchId,
        predictedWinner: input.predictedWinner,
        predictedScore: {
          scoreDWT: Number(input.scoreDWT),
          scoreOpponent: Number(input.scoreOpponent)
        },
        predictedMVP: input.predictedMVP
      });

      if (res.data?.success) {
        showFeedback(res.data.message || 'Pronostic enregistré avec succès ! 🐺🎯');
        // Refresh my predictions and weekly missions
        const [myPredRes, missRes, profRes] = await Promise.all([
          API.get('/predictions/my'),
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (myPredRes.data?.predictions) setMyPredictions(myPredRes.data.predictions);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Erreur lors de l\'enregistrement du pronostic', 'error');
    } finally {
      setSubmittingPred((prev) => ({ ...prev, [matchId]: false }));
    }
  };

  // Handle Mission Completion Action
  const handleCompleteMission = async (code, actionType, actionUrl) => {
    if (!user) {
      showFeedback('Connectez-vous pour accomplir des missions !', 'error');
      return;
    }

    if (actionType === 'predict_match') {
      setActiveTab('PRED');
      return;
    }

    if (actionType === 'visit_shop') {
      onClose();
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const res = await API.post(`/missions/${code}/complete`);
      if (res.data?.success) {
        showFeedback(res.data.message || 'Mission accomplie !');
        // Refresh missions and profile
        const [missRes, profRes] = await Promise.all([
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Erreur de validation de mission', 'error');
    }
  };

  // Handle Claim Weekly Bonus
  const handleClaimBonus = async () => {
    if (!user) return;
    try {
      const res = await API.post('/missions/claim-bonus');
      if (res.data?.success) {
        showFeedback(res.data.message || 'Bonus réclamé avec succès ! 🐺👑');
        const [missRes, profRes] = await Promise.all([
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Erreur lors de la réclamation du bonus', 'error');
    }
  };

  // Handle Equipping Avatar Frame
  const handleEquipFrame = async (frameId) => {
    if (!user) return;
    try {
      const res = await API.put('/wolfpack/frame', { frameId });
      if (res.data?.success) {
        showFeedback(res.data.message || 'Nouveau cadre équipé !');
        setWolfProfile((prev) => (prev ? { ...prev, avatarFrame: frameId } : prev));
        if (updateUser) updateUser({ ...user, avatarFrame: frameId });
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Impossible d\'équiper ce cadre', 'error');
    }
  };

  // Handle MVP Vote
  const handleVoteMvp = async (e) => {
    e.preventDefault();
    if (!user) {
      showFeedback('Veuillez vous connecter pour voter', 'error');
      return;
    }
    const matchId = selectedMvpMatch || upcomingMatches[0]?._id;
    if (!matchId || !selectedMvpPlayer) {
      showFeedback('Veuillez sélectionner un match et un joueur', 'error');
      return;
    }

    try {
      const res = await API.post('/wolfpack/vote-mvp', {
        matchId,
        playerName: selectedMvpPlayer
      });
      if (res.data?.success) {
        showFeedback(res.data.message || 'Vote pris en compte !');
        const [missRes, profRes] = await Promise.all([
          API.get('/missions/weekly'),
          API.get('/wolfpack/profile').catch(() => null)
        ]);
        if (missRes.data) setMissionsData(missRes.data);
        if (profRes?.data?.profile) setWolfProfile(profRes.data.profile);
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Erreur lors du vote', 'error');
    }
  };

  if (!isOpen) return null;

  const currentRankName = wolfProfile?.rank?.currentRank || user?.wolfRank || 'Cub';
  const currentFrame = wolfProfile?.avatarFrame || user?.avatarFrame || 'default';
  const xp = wolfProfile?.wolfXP || user?.wolfXP || 150;
  const points = wolfProfile?.wolfPoints || user?.wolfPoints || 150;
  const progressPercent = wolfProfile?.rank?.progressPercent ?? 30;
  const nextRank = wolfProfile?.rank?.nextRank || 'Scout';
  const xpForNext = wolfProfile?.rank?.xpForNext || 150;

  return (
    <div
      className={`memov ${isOpen ? 'open' : ''}`}
      style={{ zIndex: 100005 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="meminner wp-scrollbar"
        style={{
          maxWidth: '820px',
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #0d0f17, #07080c)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(230, 0, 0, 0.15)',
          padding: '28px'
        }}
      >
        {/* Close Button */}
        <button className="mclose" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Action / Notification Alert Toast */}
        {actionMessage && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 18px',
              borderRadius: '8px',
              background:
                actionMessage.type === 'error'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(34, 197, 94, 0.2)',
              border:
                actionMessage.type === 'error'
                  ? '1px solid rgba(239, 68, 68, 0.5)'
                  : '1px solid rgba(34, 197, 94, 0.5)',
              color: actionMessage.type === 'error' ? '#fca5a5' : '#86efac',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 0.3s'
            }}
          >
            {actionMessage.type === 'error' ? '⚠️' : '🐺✨'} {actionMessage.text}
          </div>
        )}

        {/* Top Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
          <button
            className={`wp-tab-btn ${activeTab === 'PROFILE' ? 'active' : ''}`}
            onClick={() => setActiveTab('PROFILE')}
          >
            <User size={14} /> Wolf Pack Identity
          </button>
          <button
            className={`wp-tab-btn ${activeTab === 'PRED' ? 'active' : ''}`}
            onClick={() => setActiveTab('PRED')}
          >
            <Target size={14} /> Pronostics de Matchs
          </button>
          <button
            className={`wp-tab-btn ${activeTab === 'LEADERBOARD' ? 'active' : ''}`}
            onClick={() => setActiveTab('LEADERBOARD')}
          >
            <Trophy size={14} /> Classement de la Saison
          </button>
          <button
            className={`wp-tab-btn ${activeTab === 'MISSIONS' ? 'active' : ''}`}
            onClick={() => setActiveTab('MISSIONS')}
          >
            <Award size={14} /> Quêtes Hebdomadaires
            {missionsData && missionsData.completedCount < missionsData.totalMissions && (
              <span style={{ background: '#e60000', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '10px' }}>
                {missionsData.totalMissions - missionsData.completedCount}
              </span>
            )}
          </button>
        </div>

        {/* =========================================================================
            TAB 1: WOLF PACK IDENTITY (PROFIL & RANGS)
            ========================================================================= */}
        {activeTab === 'PROFILE' && (
          <div>
            <div className="slbl" style={{ color: '#94a3b8' }}>DWT Wolf Pack ID • Système de Rangs & Réputation</div>
            <h2 className="stitle" style={{ fontSize: '24px', marginBottom: '16px' }}>
              IDENTITÉ DE LA MEUTE 🐺
            </h2>

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Hero Profile Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.6))',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle Background Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-40px',
                      top: '-40px',
                      width: '180px',
                      height: '180px',
                      background: currentRankName === 'Alpha' ? 'radial-gradient(circle, rgba(230,0,0,0.3) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Avatar with dynamic glowing frame */}
                  <div className={`avatar-frame-wrapper avatar-frame-${currentFrame}`}>
                    <div
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        overflow: 'hidden'
                      }}
                    >
                      {user.avatar && user.avatar.startsWith('http') ? (
                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        '🐺'
                      )}
                    </div>
                  </div>

                  {/* User Details */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                        {user.gamertag || user.email?.split('@')[0]}
                      </span>
                      <span className={`rank-pill ${currentRankName}`}>
                        {currentRankName === 'Cub' && '🐾 Cub'}
                        {currentRankName === 'Scout' && '🏹 Scout'}
                        {currentRankName === 'Hunter' && '⚔️ Hunter'}
                        {currentRankName === 'Alpha' && '👑 Alpha'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                      {user.email} • Membre officiel Dark Wolf Team
                    </div>

                    {/* Progress Bar towards Next Rank */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
                        <span>Niveau de Réputation : {xp} XP</span>
                        {nextRank ? (
                          <span style={{ color: '#38bdf8' }}>
                            {progressPercent}% vers {nextRank} ({xpForNext} XP restants)
                          </span>
                        ) : (
                          <span style={{ color: '#ff4d4d' }}>RANG MAXIMUM ALPHA ATTEINT 👑</span>
                        )}
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            background:
                              currentRankName === 'Alpha'
                                ? 'linear-gradient(90deg, #ff4d4d, #e60000)'
                                : 'linear-gradient(90deg, #38bdf8, #818cf8)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Points Counter Box */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      textAlign: 'center',
                      minWidth: '130px'
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                      Points Wolf
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8', fontFamily: '"Orbitron", monospace', marginTop: '4px' }}>
                      {points}
                    </div>
                    <div style={{ fontSize: '10px', color: '#22c55e', marginTop: '2px' }}>
                      Prêt pour récompenses
                    </div>
                  </div>
                </div>

                {/* 4 Ranks Progression Ladder (Expliqué) */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={15} color="#38bdf8" /> Hiérarchie des Rangs de la Meute
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    <div style={{ background: currentRankName === 'Cub' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(255,255,255,0.02)', border: currentRankName === 'Cub' ? '1px solid #94a3b8' : '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: '800', color: '#94a3b8', fontSize: '13px' }}>🐾 CUB (شبل)</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>0 - 299 XP</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>5% sur le Shop + Accès aux pronostics</div>
                    </div>

                    <div style={{ background: currentRankName === 'Scout' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)', border: currentRankName === 'Scout' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: '800', color: '#38bdf8', fontSize: '13px' }}>🏹 SCOUT (كشّاف)</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>300 - 799 XP</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>Cadre Argent + 10% Shop + Badges exclusifs</div>
                    </div>

                    <div style={{ background: currentRankName === 'Hunter' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)', border: currentRankName === 'Hunter' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: '800', color: '#f59e0b', fontSize: '13px' }}>⚔️ HUNTER (صياد)</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>800 - 1799 XP</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>Cadre Or + 15% Shop + Tirages maillots signés</div>
                    </div>

                    <div style={{ background: currentRankName === 'Alpha' ? 'rgba(230, 0, 0, 0.15)' : 'rgba(255,255,255,0.02)', border: currentRankName === 'Alpha' ? '1px solid #e60000' : '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: '800', color: '#ff4d4d', fontSize: '13px' }}>👑 ALPHA (ألفا)</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>1800+ XP</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>Aura Feu Alpha + VIP Lounge Discord + Drops rares</div>
                    </div>
                  </div>
                </div>

                {/* Avatar Frames Customizer */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={15} color="#e60000" /> Cadres de Profil (Frames Débloqués)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    {(wolfProfile?.availableFrames || [
                      { id: 'default', name: 'Standard', unlocked: true, isEquipped: currentFrame === 'default' },
                      { id: 'cub_bronze', name: 'Cub Bronze', unlocked: true, isEquipped: currentFrame === 'cub_bronze' },
                      { id: 'scout_silver', name: 'Scout Argent', unlocked: xp >= 300, isEquipped: currentFrame === 'scout_silver' },
                      { id: 'hunter_gold', name: 'Hunter Or', unlocked: xp >= 800, isEquipped: currentFrame === 'hunter_gold' },
                      { id: 'alpha_fire', name: 'Aura Alpha', unlocked: xp >= 1800, isEquipped: currentFrame === 'alpha_fire' }
                    ]).map((f) => (
                      <div
                        key={f.id}
                        style={{
                          background: f.isEquipped ? 'rgba(230,0,0,0.1)' : 'rgba(255,255,255,0.03)',
                          border: f.isEquipped ? '1px solid #e60000' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '12px',
                          textAlign: 'center',
                          opacity: f.unlocked ? 1 : 0.4
                        }}
                      >
                        <div className={`avatar-frame-wrapper avatar-frame-${f.id}`} style={{ width: '42px', height: '42px', margin: '0 auto 8px' }}>
                          <span style={{ fontSize: '18px' }}>🐺</span>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>{f.name}</div>
                        {f.unlocked ? (
                          f.isEquipped ? (
                            <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: '800', marginTop: '6px', display: 'block' }}>
                              ÉQUIPÉ ✓
                            </span>
                          ) : (
                            <button
                              onClick={() => handleEquipFrame(f.id)}
                              style={{
                                marginTop: '6px',
                                padding: '3px 8px',
                                fontSize: '10px',
                                fontWeight: '700',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff',
                                cursor: 'pointer'
                              }}
                            >
                              Équiper
                            </button>
                          )
                        ) : (
                          <span style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                            Verrouillé 🔒
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges Collection */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={15} color="#f59e0b" /> Vitrine de Badges de la Meute
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {(wolfProfile?.badges?.length ? wolfProfile.badges : [
                      { id: 'welcome', title: 'Bienvenue dans la Meute', description: 'Nouveau loup certifié DWT.', icon: 'Shield' }
                    ]).map((b, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={16} color="#f59e0b" />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>{b.title}</div>
                          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{b.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions: Admin & Logout */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        onClose();
                        window.history.pushState(null, '', '/admin');
                        window.location.reload();
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Settings size={14} /> Dashboard Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#cbd5e1',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={14} /> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>🐺</span>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800' }}>Rejoignez la Meute Dark Wolf</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '420px', margin: '8px auto 20px' }}>
                  Connectez-vous pour débloquer votre profil de fan, accumuler des points Wolf, débloquer des cadres légendaires et grimper au classement.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    // Trigger auth modal
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab: 'login' } }));
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '24px',
                    background: '#e60000',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Se Connecter / S'inscrire
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRONOSTICS (PREDICTIONS)
            ========================================================================= */}
        {activeTab === 'PRED' && (
          <div>
            <div className="slbl" style={{ color: '#94a3b8' }}>Esports Predictor • 100% Points de Meute (Zéro Pari d'Argent)</div>
            <h2 className="stitle" style={{ fontSize: '24px', marginBottom: '8px' }}>
              PRONOSTICS DES MATCHS 🎯
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
              Votez pour le vainqueur (+50 pts), le score exact (+50 pts) et le MVP du match (+30 pts). Gagnez jusqu'à <strong>+130 Points & XP</strong> par match !
            </p>

            {/* Upcoming Matches Prediction Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {upcomingMatches.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Aucun match à venir pour le moment. Revenez bientôt pour la prochaine rencontre !
                </div>
              ) : (
                upcomingMatches.map((m) => {
                  const input = predictionInputs[m._id] || {
                    predictedWinner: 'DWT',
                    scoreDWT: 2,
                    scoreOpponent: 1,
                    predictedMVP: 'ShadowFang'
                  };
                  const isSubmitting = submittingPred[m._id];
                  const existingUserPred = myPredictions.find((p) => p.match?._id === m._id || p.match === m._id);

                  return (
                    <div
                      key={m._id}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: existingUserPred ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        padding: '20px',
                        position: 'relative'
                      }}
                    >
                      {/* Match Meta Top */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(230,0,0,0.2)', color: '#ff4d4d', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(230,0,0,0.4)' }}>
                            {m.game}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {m.tournamentName} • {m.format || 'BO3'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} color="#38bdf8" />
                          {new Date(m.matchDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Teams & Pick Winner */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '18px' }}>
                        {/* DWT Button */}
                        <button
                          type="button"
                          onClick={() => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, predictedWinner: 'DWT' } }))}
                          style={{
                            padding: '14px 10px',
                            borderRadius: '10px',
                            background: input.predictedWinner === 'DWT' ? 'linear-gradient(135deg, rgba(230,0,0,0.3), rgba(0,0,0,0.5))' : 'rgba(255,255,255,0.02)',
                            border: input.predictedWinner === 'DWT' ? '2px solid #e60000' : '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <img src="/logo-dwt.png" alt="DWT" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                          <span style={{ fontWeight: '800', fontSize: '13px' }}>DARK WOLF TEAM</span>
                          {input.predictedWinner === 'DWT' && (
                            <span style={{ fontSize: '10px', color: '#ff4d4d', fontWeight: '800' }}>MON CHOIX ✓</span>
                          )}
                        </button>

                        <span style={{ fontFamily: '"Orbitron", monospace', fontWeight: '800', color: '#64748b' }}>VS</span>

                        {/* Opponent Button */}
                        <button
                          type="button"
                          onClick={() => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, predictedWinner: m.opponent } }))}
                          style={{
                            padding: '14px 10px',
                            borderRadius: '10px',
                            background: input.predictedWinner === m.opponent ? 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(0,0,0,0.5))' : 'rgba(255,255,255,0.02)',
                            border: input.predictedWinner === m.opponent ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1f2430', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px' }}>
                            {m.opponent.slice(0, 3).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '800', fontSize: '13px' }}>{m.opponent}</span>
                          {input.predictedWinner === m.opponent && (
                            <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '800' }}>MON CHOIX ✓</span>
                          )}
                        </button>
                      </div>

                      {/* Score & MVP Selectors */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
                        {/* Score Inputs */}
                        <div>
                          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '700' }}>
                            Score Prédit (ex: 2 - 1)
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={input.scoreDWT}
                              onChange={(e) => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, scoreDWT: e.target.value } }))}
                              style={{ width: '50px', padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontWeight: '800' }}
                            />
                            <span style={{ color: '#64748b' }}>-</span>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={input.scoreOpponent}
                              onChange={(e) => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, scoreOpponent: e.target.value } }))}
                              style={{ width: '50px', padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontWeight: '800' }}
                            />
                          </div>
                        </div>

                        {/* MVP Select */}
                        <div>
                          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '700' }}>
                            MVP Prédit de la Rencontre (+30 pts)
                          </label>
                          <select
                            value={input.predictedMVP}
                            onChange={(e) => setPredictionInputs((prev) => ({ ...prev, [m._id]: { ...input, predictedMVP: e.target.value } }))}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              background: '#151a26',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '12px'
                            }}
                          >
                            {(rosterPlayers.filter((p) => p.game === m.game).length ? rosterPlayers.filter((p) => p.game === m.game) : rosterPlayers).map((p) => (
                              <option key={p._id || p.gamertag} value={p.gamertag}>
                                {p.gamertag} ({p.role || p.game})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Submit / Status Button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '700' }}>
                          ⚡ Gains max : +130 Points & XP
                        </div>
                        <button
                          onClick={() => handleSavePrediction(m._id)}
                          disabled={isSubmitting}
                          style={{
                            padding: '9px 20px',
                            borderRadius: '8px',
                            background: existingUserPred ? '#15803d' : '#e60000',
                            border: 'none',
                            color: '#fff',
                            fontWeight: '800',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isSubmitting ? 'Validation...' : existingUserPred ? 'Mettre à Jour Mon Prono ✓' : 'Valider Mon Pronostic 🎯'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* My Recent Predictions List */}
            {user && myPredictions.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#38bdf8" /> Mes Pronostics Enregistrés
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {myPredictions.map((p, idx) => (
                    <div
                      key={p._id || idx}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                          DWT vs {p.match?.opponent || 'Rival'} ({p.match?.game || 'Esport'})
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                          Choix : <strong>{p.predictedWinner}</strong> • Score : <strong>{p.predictedScore?.scoreDWT} - {p.predictedScore?.scoreOpponent}</strong> • MVP : <strong>{p.predictedMVP || 'N/A'}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {p.status === 'pending' && (
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.4)', fontWeight: '700' }}>
                            ⏳ En attente du match
                          </span>
                        )}
                        {p.status === 'won' && (
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)', fontWeight: '800' }}>
                            🏆 Victoire (+{p.pointsEarned} pts)
                          </span>
                        )}
                        {p.status === 'partial' && (
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: '800' }}>
                            🎯 Partiel (+{p.pointsEarned} pts)
                          </span>
                        )}
                        {p.status === 'lost' && (
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: '700' }}>
                            ❌ Non validé (0 pt)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: LEADERBOARD (CLASSEMENT DE LA SAISON)
            ========================================================================= */}
        {activeTab === 'LEADERBOARD' && (
          <div>
            <div className="slbl" style={{ color: '#94a3b8' }}>Hall of Fame • Les Meilleurs Stratèges de la Meute</div>
            <h2 className="stitle" style={{ fontSize: '24px', marginBottom: '8px' }}>
              CLASSEMENT DE LA SAISON 🏆
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>
              Accumulez des points en faisant des pronostics corrects et en validant vos quêtes hebdomadaires.
            </p>

            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', alignItems: 'flex-end' }}>
                {/* 2nd Place */}
                <div className="wp-podium-card wp-podium-2nd">
                  <div style={{ position: 'absolute', top: '-12px', background: '#94a3b8', color: '#000', fontWeight: '900', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                    #2 ARGENT 🥈
                  </div>
                  <div className={`avatar-frame-wrapper avatar-frame-${leaderboard[1]?.avatarFrame || 'scout_silver'}`} style={{ width: '54px', height: '54px', marginTop: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🐺</span>
                  </div>
                  <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px', marginTop: '8px' }}>
                    {leaderboard[1]?.gamertag}
                  </div>
                  <span className={`rank-pill ${leaderboard[1]?.wolfRank || 'Hunter'}`} style={{ marginTop: '4px', fontSize: '9px' }}>
                    {leaderboard[1]?.wolfRank}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8', marginTop: '8px', fontFamily: '"Orbitron", monospace' }}>
                    {leaderboard[1]?.wolfPoints} pts
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    {leaderboard[1]?.predictionsWon} pronos réussis
                  </div>
                </div>

                {/* 1st Place (Champion) */}
                <div className="wp-podium-card wp-podium-1st">
                  <div style={{ position: 'absolute', top: '-14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '900', padding: '3px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Crown size={13} /> #1 OR 🥇
                  </div>
                  <div className={`avatar-frame-wrapper avatar-frame-${leaderboard[0]?.avatarFrame || 'alpha_fire'}`} style={{ width: '66px', height: '66px', marginTop: '10px' }}>
                    <span style={{ fontSize: '30px' }}>👑</span>
                  </div>
                  <div style={{ fontWeight: '900', color: '#fff', fontSize: '16px', marginTop: '8px' }}>
                    {leaderboard[0]?.gamertag}
                  </div>
                  <span className={`rank-pill ${leaderboard[0]?.wolfRank || 'Alpha'}`} style={{ marginTop: '4px', fontSize: '10px' }}>
                    {leaderboard[0]?.wolfRank}
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', marginTop: '8px', fontFamily: '"Orbitron", monospace' }}>
                    {leaderboard[0]?.wolfPoints} pts
                  </div>
                  <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '700', marginTop: '2px' }}>
                    {leaderboard[0]?.predictionsWon} pronos réussis
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="wp-podium-card wp-podium-3rd">
                  <div style={{ position: 'absolute', top: '-12px', background: '#cd7f32', color: '#fff', fontWeight: '900', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                    #3 BRONZE 🥉
                  </div>
                  <div className={`avatar-frame-wrapper avatar-frame-${leaderboard[2]?.avatarFrame || 'cub_bronze'}`} style={{ width: '54px', height: '54px', marginTop: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🐺</span>
                  </div>
                  <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px', marginTop: '8px' }}>
                    {leaderboard[2]?.gamertag}
                  </div>
                  <span className={`rank-pill ${leaderboard[2]?.wolfRank || 'Scout'}`} style={{ marginTop: '4px', fontSize: '9px' }}>
                    {leaderboard[2]?.wolfRank}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#cd7f32', marginTop: '8px', fontFamily: '"Orbitron", monospace' }}>
                    {leaderboard[2]?.wolfPoints} pts
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    {leaderboard[2]?.predictionsWon} pronos réussis
                  </div>
                </div>
              </div>
            )}

            {/* Ranking Table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 120px 100px', padding: '12px 18px', background: 'rgba(255,255,255,0.04)', fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                <span>Rang</span>
                <span>Joueur</span>
                <span>Rang Meute</span>
                <span style={{ textAlign: 'right' }}>Points</span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }} className="wp-scrollbar">
                {leaderboard.map((item, idx) => {
                  const isCurrentUser = user && (user._id === item.id || user.gamertag === item.gamertag);
                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        padding: '12px 18px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        alignItems: 'center',
                        background: isCurrentUser ? 'rgba(230,0,0,0.1)' : 'transparent',
                        fontWeight: isCurrentUser ? '800' : '500'
                      }}
                    >
                      <span style={{ fontFamily: '"Orbitron", monospace', color: idx < 3 ? '#f59e0b' : '#94a3b8', fontSize: '13px' }}>
                        #{item.position || idx + 1}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🐺</span>
                        <span style={{ color: '#fff', fontSize: '13px' }}>{item.gamertag}</span>
                        {isCurrentUser && (
                          <span style={{ fontSize: '9px', background: '#e60000', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>MOI</span>
                        )}
                      </div>
                      <div>
                        <span className={`rank-pill ${item.wolfRank}`} style={{ fontSize: '9px' }}>
                          {item.wolfRank}
                        </span>
                      </div>
                      <span style={{ textAlign: 'right', fontFamily: '"Orbitron", monospace', color: '#38bdf8', fontWeight: '800', fontSize: '13px' }}>
                        {item.wolfPoints} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MISSIONS HEBDOMADAIRES (WEEKLY QUESTS)
            ========================================================================= */}
        {activeTab === 'MISSIONS' && (
          <div>
            <div className="slbl" style={{ color: '#94a3b8' }}>Weekly Pack Quests • Remise à zéro chaque Lundi 00:00</div>
            <h2 className="stitle" style={{ fontSize: '24px', marginBottom: '8px' }}>
              MISSIONS DE LA MEUTE 📋
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
              Complétez les missions hebdomadaires pour faire grimper votre rang et débloquer le <strong>Pack Bonus Alpha (+100 XP / Points)</strong>.
            </p>

            {/* Weekly Progress Bar */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>
                  Progression de la Semaine : {missionsData?.completedCount || 0} / {missionsData?.totalMissions || 5} Complétées
                </span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8' }}>
                  {missionsData?.progressPercent || 0}%
                </span>
              </div>

              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${missionsData?.progressPercent || 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #38bdf8, #22c55e)',
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              {/* Weekly Alpha Bonus Reward Card */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: missionsData?.canClaimBonus ? 'linear-gradient(135deg, rgba(230,0,0,0.25), rgba(245,158,11,0.15))' : 'rgba(255,255,255,0.02)',
                  border: missionsData?.canClaimBonus ? '1px solid #e60000' : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Crown size={22} color={missionsData?.bonusClaimed ? '#22c55e' : '#f59e0b'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>
                      Bonus Alpha de Fin de Semaine (+100 Points & XP)
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Débloqué en complétant toutes les 5 quêtes hebdomadaires.
                    </div>
                  </div>
                </div>

                {missionsData?.bonusClaimed ? (
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '6px 14px', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                    ✓ Bonus Réclamé cette semaine
                  </span>
                ) : missionsData?.canClaimBonus ? (
                  <button
                    onClick={handleClaimBonus}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      background: '#e60000',
                      border: 'none',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(230, 0, 0, 0.5)'
                    }}
                  >
                    Réclamer le Bonus (+100 XP) 🐺👑
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
                    Terminez les quêtes ci-dessous
                  </span>
                )}
              </div>
            </div>

            {/* Missions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(missionsData?.missions || [
                { code: 'vote_mvp', title: 'Vote MVP du Match', description: 'Votez pour le joueur le plus décisif de la dernière rencontre.', points: 30, xp: 30, actionType: 'vote_mvp', isCompleted: false },
                { code: 'predict_match', title: 'Pronostic de Match', description: 'Pronostiquez le score et le vainqueur du prochain match.', points: 40, xp: 40, actionType: 'predict_match', isCompleted: false },
                { code: 'watch_video', title: 'Visionner la Vidéo DWT', description: 'Regardez les derniers temps forts ou la vidéo officielle DWT.', points: 25, xp: 25, actionType: 'watch_video', isCompleted: false },
                { code: 'community_challenge', title: 'Défi Communautaire', description: 'Participez au challenge hebdomadaire des loups.', points: 35, xp: 35, actionType: 'community_challenge', isCompleted: false },
                { code: 'visit_shop', title: 'Explorer le Dark Lab', description: 'Visitez la collection officielle et les nouveaux maillots.', points: 15, xp: 15, actionType: 'visit_shop', isCompleted: false }
              ]).map((m) => (
                <div
                  key={m.code}
                  className={`wp-mission-card ${m.isCompleted ? 'completed' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: m.isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                        border: m.isCompleted ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {m.isCompleted ? (
                        <Check size={20} color="#22c55e" />
                      ) : m.actionType === 'vote_mvp' ? (
                        <Award size={18} color="#f59e0b" />
                      ) : m.actionType === 'predict_match' ? (
                        <Target size={18} color="#e60000" />
                      ) : m.actionType === 'watch_video' ? (
                        <Tv size={18} color="#38bdf8" />
                      ) : m.actionType === 'community_challenge' ? (
                        <Users size={18} color="#a855f7" />
                      ) : (
                        <ShoppingBag size={18} color="#f97316" />
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {m.description}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '10px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          +{m.points} Points
                        </span>
                        <span style={{ fontSize: '10px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          +{m.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action or Completed Badge */}
                  <div>
                    {m.isCompleted ? (
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '6px 12px', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                        Complétée ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCompleteMission(m.code, m.actionType, m.actionUrl)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e60000';
                          e.currentTarget.style.borderColor = '#e60000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }}
                      >
                        {m.actionType === 'predict_match' ? 'Pronostiquer →' : m.actionType === 'visit_shop' ? 'Visiter Shop →' : 'Participer & Valider'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick MVP Voting Form Modal Card inside Missions */}
            {missionsData?.missions?.find((m) => m.code === 'vote_mvp' && !m.isCompleted) && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>
                  🗳️ Vote Rapide pour le MVP du Match
                </div>
                <form onSubmit={handleVoteMvp} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={selectedMvpPlayer}
                    onChange={(e) => setSelectedMvpPlayer(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px' }}
                  >
                    {rosterPlayers.map((p) => (
                      <option key={p._id || p.gamertag} value={p.gamertag}>
                        {p.gamertag} ({p.game})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', borderRadius: '6px', background: '#f59e0b', border: 'none', color: '#000', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Voter & Valider Mission (+30 pts)
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FanPortalModal;
