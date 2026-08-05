import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMembers } from '../context/MembersContext';
import { useSiteContent } from '../context/SiteContentContext';
import './Admin.css';

// 4 PRIVILEGED ACCOUNTS (2 ADMIMS & 2 MANAGERS)
const AUTHORIZED_ADMINS = [
  { id: 'a1', name: 'Aman Yadav', role: 'PRESIDENT', userRole: 'admin', passcode: 'aman2026', icon: 'ti-crown' },
  { id: 'a2', name: 'Falgun Bodele', role: 'PRESIDENT ELECT', userRole: 'admin', passcode: 'falgun2026', icon: 'ti-star' },
];

const MASTER_PASSCODE = 'stv2026';

export default function Admin() {
  const { members, updateMemberPoints, addMember, updateMember, updateMemberRole, updateMemberAttendance, toggleMemberStatus, removeMember, authenticatedAdmin, adminLogin, adminLogout, adminActiveSection, setAdminActiveSection, openLoginModal } = useMembers();
  const {
    content,
    updateTheme,
    updateHero,
    addHeroMedia,
    updateHeroMedia,
    deleteHeroMedia,
    updateAbout,
    updateStat,
    updateBoardMember,
    addBoardMember,
    deleteBoardMember,
    updateBentoProject,
    toggleFeaturedProject,
    addBentoProject,
    deleteBentoProject,
    addPartnerClub,
    updatePartnerClub,
    togglePartnerClub,
    deletePartnerClub,
    movePartnerClubOrder,
    addEvent,
    updateEvent,
    deleteEvent,
    togglePinEvent,
    updateContact,
    updateMemberBannerBg,
    resetToDefaults
  } = useSiteContent();

  // Admin auth state
  const [selectedAdmin, setSelectedAdmin] = useState(AUTHORIZED_ADMINS[0]);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Active Admin Tab: 'roster' | 'cms' | 'theme'
  const [activeTab, setActiveTab] = useState('roster');

  // Add member form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPoints, setNewPoints] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('password123');

  // Accordion Expand/Collapse state for CMS items
  const [expandedBentoIds, setExpandedBentoIds] = useState({});
  const [expandedHeroIds, setExpandedHeroIds] = useState({});
  const [expandedBoardIds, setExpandedBoardIds] = useState({});
  const [expandedEventIds, setExpandedEventIds] = useState({});
  const [adminMemberError, setAdminMemberError] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionKey = location.hash.replace('#', '');
      const targetId = `admin-section-${sectionKey}`;
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  // Roster custom points edit map (memberId -> amount)
  const [customPointsMap, setCustomPointsMap] = useState({});

  // CMS Add Hero Media Direct Upload State (2K Images & 1080p Full HD Videos)
  const [newMediaType, setNewMediaType] = useState('image');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [uploadingHeroMedia, setUploadingHeroMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [previewMediaModal, setPreviewMediaModal] = useState(null);
  const [replaceTargetId, setReplaceTargetId] = useState(null);

  const heroFileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);

  const handleHeroFileUpload = (file, targetSlideId = null) => {
    if (!file) return;

    setUploadingHeroMedia(true);
    setUploadProgress(15);
    setUploadSuccessMsg('');

    const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm)$/i);
    const fileType = isVideo ? 'video' : 'image';
    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 80);
        setUploadProgress(percent);
      }
    };

    reader.onload = (e) => {
      const mediaDataUrl = e.target.result;
      setUploadProgress(90);

      let resolutionStr = isVideo ? '1080p Full HD' : '2K Resolution (2560×1440)';

      if (!isVideo) {
        const img = new Image();
        img.onload = () => {
          resolutionStr = `${img.naturalWidth} × ${img.naturalHeight}`;
          finishHeroMediaUpload(mediaDataUrl, file.name, fileType, resolutionStr, fileSizeFormatted, targetSlideId);
        };
        img.onerror = () => {
          finishHeroMediaUpload(mediaDataUrl, file.name, fileType, resolutionStr, fileSizeFormatted, targetSlideId);
        };
        img.src = mediaDataUrl;
      } else {
        finishHeroMediaUpload(mediaDataUrl, file.name, fileType, resolutionStr, fileSizeFormatted, targetSlideId);
      }
    };

    reader.readAsDataURL(file);
  };

  const finishHeroMediaUpload = (url, fileName, type, resolution, size, targetSlideId) => {
    setTimeout(() => {
      setUploadProgress(100);
      setUploadingHeroMedia(false);
      const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setUploadSuccessMsg(`✓ ${fileName} uploaded successfully! (${resolution}, ${size})`);

      if (targetSlideId) {
        updateHeroMedia(targetSlideId, { url, type, title: cleanTitle, resolution, size });
      } else {
        addHeroMedia({ type, url, title: cleanTitle, resolution, size });
      }
    }, 450);
  };

  const triggerReplaceSlide = (slideId) => {
    setReplaceTargetId(slideId);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.click();
    }
  };

  // CMS Add Board Member Form State
  const [newBoardRole, setNewBoardRole] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardPhoto, setNewBoardPhoto] = useState('');
  const [newBoardVision, setNewBoardVision] = useState('');
  const [newBoardMessage, setNewBoardMessage] = useState('');

  // CMS Add Bento Project Form State
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTag, setNewProjTag] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjStory, setNewProjStory] = useState('');
  const [newProjDate, setNewProjDate] = useState('AUG 2026');
  const [newProjIcon, setNewProjIcon] = useState('ti-flame');
  const [newProjSize, setNewProjSize] = useState('bento-short');
  const [newProjMediaType, setNewProjMediaType] = useState('image');
  const [newProjMediaUrl, setNewProjMediaUrl] = useState('');
  const [newProjEventUrl, setNewProjEventUrl] = useState('');

  // Compute roster metrics
  const totalMembers = members.length;
  const totalPointsSum = members.reduce((sum, m) => sum + m.points, 0);
  const avgPoints = totalMembers > 0 ? Math.round(totalPointsSum / totalMembers) : 0;
  const topMember = totalMembers > 0 ? [...members].sort((a, b) => b.points - a.points)[0] : null;

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    if (passcodeInput === selectedAdmin.passcode || passcodeInput === MASTER_PASSCODE) {
      adminLogin(selectedAdmin);
      setPasscodeError('');
      setPasscodeInput('');
    } else {
      setPasscodeError(`Incorrect passcode for ${selectedAdmin.name}. (Passcode: ${selectedAdmin.passcode})`);
    }
  };

  const handleAdminLogout = () => {
    adminLogout();
  };

  const handleCustomPointChange = (id, val) => {
    setCustomPointsMap(prev => ({ ...prev, [id]: val }));
  };

  const handleApplyCustomPoints = (id, isAdd) => {
    const amount = Number(customPointsMap[id]);
    if (!isNaN(amount) && amount !== 0) {
      const delta = isAdd ? Math.abs(amount) : -Math.abs(amount);
      updateMemberPoints(id, delta, `Admin Manual ${delta >= 0 ? 'Award' : 'Deduction'}`);
      setCustomPointsMap(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdminMemberError('');
    try {
      addMember(
        newName,
        newRole || 'MEMBER',
        newPoints || 0,
        newRegNo,
        newMemberEmail,
        newMemberPassword
      );
      setNewName('');
      setNewRole('');
      setNewPoints('');
      setNewRegNo('');
      setNewMemberEmail('');
      setNewMemberPassword('password123');
    } catch (err) {
      setAdminMemberError(err.message);
    }
  };

  const handleSaveEditMember = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMember(editingMember.id, {
      name: editingMember.name,
      role: editingMember.role,
      userRole: editingMember.userRole || 'member',
      regNo: editingMember.regNo,
      email: editingMember.email,
      password: editingMember.password,
      attendedEvents: editingMember.attendedEvents ?? 8,
      totalEvents: editingMember.totalEvents ?? 10
    });
    updateMemberRole(editingMember.id, editingMember.role, editingMember.userRole || 'member');
    setEditingMember(null);
  };

  const handleRemoveMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the official roster?`)) {
      removeMember(id);
    }
  };

  const handleAddHeroMediaSubmit = (e) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;
    addHeroMedia(newMediaType, newMediaTitle || 'Hero Media', newMediaUrl);
    setNewMediaTitle('');
    setNewMediaUrl('');
  };

  const handleBoardPhotoFileUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateBoardMember(id, { photo: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleNewBoardPhotoFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewBoardPhoto(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBoardMemberSubmit = (e) => {
    e.preventDefault();
    if (!newBoardName.trim() || !newBoardRole.trim()) return;
    addBoardMember({
      role: newBoardRole,
      name: newBoardName,
      photo: newBoardPhoto || '/hero_team_1.jpg',
      vision: newBoardVision || 'Empowering youth through leadership and innovation.',
      message: newBoardMessage || 'Together, we create lasting positive community impact.'
    });
    setNewBoardRole('');
    setNewBoardName('');
    setNewBoardPhoto('');
    setNewBoardVision('');
    setNewBoardMessage('');
  };

  const handleBentoMediaFileUpload = (id, file) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (e) => {
      updateBentoProject(id, { 
        mediaUrl: e.target.result,
        mediaType: isVideo ? 'video' : 'image'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNewBentoMediaFileUpload = (file) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewProjMediaUrl(e.target.result);
      setNewProjMediaType(isVideo ? 'video' : 'image');
    };
    reader.readAsDataURL(file);
  };

  const handleAddBentoProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    addBentoProject({
      title: newProjTitle,
      tag: newProjTag || 'PROJECT',
      desc: newProjDesc,
      fullStory: newProjStory,
      date: newProjDate,
      icon: newProjIcon,
      sizeClass: newProjSize,
      mediaType: newProjMediaType || 'image',
      mediaUrl: newProjMediaUrl || '/hero_team_1.jpg',
      eventUrl: newProjEventUrl || 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    });
    setNewProjTitle('');
    setNewProjTag('');
    setNewProjDesc('');
    setNewProjStory('');
    setNewProjMediaUrl('');
    setNewProjEventUrl('');
  };

  // Partner logo state & upload handlers
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLogoUrl, setNewPartnerLogoUrl] = useState('');

  const handlePartnerLogoFileUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (id === 'new') {
        setNewPartnerLogoUrl(e.target.result);
      } else {
        updatePartnerClub(id, { logoUrl: e.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPartnerClubSubmit = (e) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerLogoUrl.trim()) return;
    addPartnerClub({
      name: newPartnerName,
      logoUrl: newPartnerLogoUrl
    });
    setNewPartnerName('');
    setNewPartnerLogoUrl('');
  };

  // CMS Add Event / Meeting Form State
  const [newEvtCategory, setNewEvtCategory] = useState('Upcoming Event');
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDate, setNewEvtDate] = useState('AUG 2026');
  const [newEvtTime, setNewEvtTime] = useState('10:00 AM - 01:00 PM');
  const [newEvtVenue, setNewEvtVenue] = useState('STV Auditorium');
  const [newEvtShortDesc, setNewEvtShortDesc] = useState('');
  const [newEvtFullDesc, setNewEvtFullDesc] = useState('');
  const [newEvtRegUrl, setNewEvtRegUrl] = useState('https://www.instagram.com/rotaractclubstv');
  const [newEvtCoverImage, setNewEvtCoverImage] = useState('/hero_team_1.jpg');

  const handleEventImageFileUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (id === 'new') {
        setNewEvtCoverImage(e.target.result);
      } else {
        updateEvent(id, { coverImage: e.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEvtTitle.trim()) return;
    addEvent({
      category: newEvtCategory,
      title: newEvtTitle,
      date: newEvtDate,
      time: newEvtTime,
      venue: newEvtVenue,
      shortDesc: newEvtShortDesc,
      fullDesc: newEvtFullDesc,
      registrationUrl: newEvtRegUrl,
      coverImage: newEvtCoverImage
    });
    setNewEvtTitle('');
    setNewEvtShortDesc('');
    setNewEvtFullDesc('');
  };

  const applyPresetTheme = (presetType) => {
    if (presetType === 'magenta') {
      updateTheme({
        accentColor: '#d32b69',
        accentHover: '#b82358',
        accentGlow: 'rgba(211, 43, 105, 0.4)',
        bgColor: '#0A0A0C',
        bgSurface: '#121216',
        bgCard: 'rgba(22, 22, 28, 0.75)',
        fontHeading: "'Oswald', sans-serif",
        fontBody: "'Inter', sans-serif"
      });
    } else if (presetType === 'blue') {
      updateTheme({
        accentColor: '#3B82F6',
        accentHover: '#60A5FA',
        accentGlow: 'rgba(59, 130, 246, 0.4)',
        bgColor: '#0B0F17',
        bgSurface: '#111827',
        bgCard: 'rgba(17, 24, 39, 0.75)',
        fontHeading: "'Outfit', sans-serif",
        fontBody: "'Inter', sans-serif"
      });
    } else if (presetType === 'emerald') {
      updateTheme({
        accentColor: '#10B981',
        accentHover: '#34D399',
        accentGlow: 'rgba(16, 185, 129, 0.4)',
        bgColor: '#061612',
        bgSurface: '#0D241F',
        bgCard: 'rgba(13, 36, 31, 0.75)',
        fontHeading: "'Montserrat', sans-serif",
        fontBody: "'Inter', sans-serif"
      });
    } else if (presetType === 'gold') {
      updateTheme({
        accentColor: '#F59E0B',
        accentHover: '#FBBF24',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        bgColor: '#140D05',
        bgSurface: '#1E150B',
        bgCard: 'rgba(30, 21, 11, 0.75)',
        fontHeading: "'Oswald', sans-serif",
        fontBody: "'Inter', sans-serif"
      });
    } else if (presetType === 'purple') {
      updateTheme({
        accentColor: '#8B5CF6',
        accentHover: '#A78BFA',
        accentGlow: 'rgba(139, 92, 246, 0.4)',
        bgColor: '#0F0B18',
        bgSurface: '#171226',
        bgCard: 'rgba(23, 18, 38, 0.75)',
        fontHeading: "'Outfit', sans-serif",
        fontBody: "'Inter', sans-serif"
      });
    }
  };

  const currentRole = (authenticatedAdmin?.userRole || (authenticatedAdmin?.role === 'OVERALL MANAGER' || authenticatedAdmin?.role === 'TECHNICAL HEAD' ? 'manager' : 'admin')).toLowerCase();
  const isManagerMode = currentRole === 'manager';
  const isAdminMode = currentRole === 'admin';

  const sec = (adminActiveSection || 'dashboard').toLowerCase();
  const isDashboard = sec === 'dashboard';
  const isMembers = sec === 'member-management' || sec === 'members' || sec === 'roster';
  const isHero = sec === 'hero';
  const isAbout = sec === 'about';
  const isBoard = sec === 'executive-board' || sec === 'board';
  const isBento = sec === 'bento-grid' || sec === 'bento';
  const isProjects = sec === 'projects' || sec === 'events';
  const isLogos = sec === 'logos' || sec === 'theme';

  const isForbiddenForManager = isManagerMode && (isHero || isAbout || isBoard || isLogos);

  return (
    <div className="admin-page">
      <div className="container">

        {/* UNAUTHENTICATED GATE (LAUNCHES LOGIN MODAL) */}
        {!authenticatedAdmin ? (
          <div className="login-container" style={{ margin: '3rem auto', maxWidth: '500px', width: '100%', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              AUTHENTICATION REQUIRED
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Please log in as an Administrator or Manager to access the CMS Dashboard.
            </p>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => openLoginModal('admin')}
            >
              <i className="ti ti-key"></i> Open Login Modal →
            </button>
          </div>
        ) : (
          /* 2. AUTHENTICATED SINGLE PAGE APPLICATION (SPA) ADMIN DASHBOARD */
          <div className="admin-spa-container">
            {/* Admin Header */}
            <div 
              className="dashboard-header" 
              style={{ 
                backgroundImage: `url(${content.memberBannerBg || '/member_banner_bg.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                marginBottom: '1.5rem' 
              }}
            >
              <div className="user-welcome-info">
                <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
                  <i className={`ti ${authenticatedAdmin?.icon || 'ti-crown'}`}></i>
                </div>
                <div className="user-title-box">
                  <span className="badge-mono" style={{ borderColor: isManagerMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(90, 15, 45, 0.4)', color: isManagerMode ? '#60A5FA' : '#E4E4E7', background: isManagerMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(90, 15, 45, 0.15)' }}>
                    ROLE: {isManagerMode ? 'MANAGER (LIMITED ACCESS)' : 'ADMINISTRATOR (FULL ACCESS)'}
                  </span>
                  <h2>WELCOME, {(authenticatedAdmin?.name || 'USER').toUpperCase()}!</h2>
                  <p>{authenticatedAdmin?.role} &bull; {isManagerMode ? 'Manager Dashboard' : 'System Administration Portal'}</p>
                </div>
              </div>

              <button onClick={handleAdminLogout} className="btn btn-outline">
                <i className="ti ti-lock"></i> Lock Session
              </button>
            </div>

            {/* SPA 2-COLUMN GRID LAYOUT */}
            <div className="admin-spa-layout">
              {/* FIXED LEFT SIDEBAR MENU */}
              <aside className="admin-spa-sidebar">
                <div className="admin-sidebar-header">
                  <div className="admin-sidebar-title">{isManagerMode ? 'Manager Menu' : 'Admin Dashboard Menu'}</div>
                </div>

                <button 
                  type="button" 
                  className={`admin-spa-nav-btn ${isDashboard ? 'active' : ''}`}
                  onClick={() => setAdminActiveSection('dashboard')}
                >
                  <span className="icon">📊</span> Dashboard
                </button>

                <button 
                  type="button" 
                  className={`admin-spa-nav-btn ${isMembers ? 'active' : ''}`}
                  onClick={() => setAdminActiveSection('member-management')}
                >
                  <span className="icon">👥</span> Member Management
                </button>

                <button 
                  type="button" 
                  className={`admin-spa-nav-btn ${isProjects ? 'active' : ''}`}
                  onClick={() => setAdminActiveSection('projects')}
                >
                  <span className="icon">📅</span> Upcoming Events & Meetings
                </button>

                <button 
                  type="button" 
                  className={`admin-spa-nav-btn ${isBento ? 'active' : ''}`}
                  onClick={() => setAdminActiveSection('bento-grid')}
                >
                  <span className="icon">🧩</span> Edit Bento Grid
                </button>

                {isAdminMode && (
                  <>
                    <button 
                      type="button" 
                      className={`admin-spa-nav-btn ${isHero ? 'active' : ''}`}
                      onClick={() => setAdminActiveSection('hero')}
                    >
                      <span className="icon">📝</span> Edit Hero Section
                    </button>

                    <button 
                      type="button" 
                      className={`admin-spa-nav-btn ${isAbout ? 'active' : ''}`}
                      onClick={() => setAdminActiveSection('about')}
                    >
                      <span className="icon">ℹ️</span> Edit About
                    </button>

                    <button 
                      type="button" 
                      className={`admin-spa-nav-btn ${isBoard ? 'active' : ''}`}
                      onClick={() => setAdminActiveSection('executive-board')}
                    >
                      <span className="icon">👨💼</span> Edit Executive Board
                    </button>

                    <button 
                      type="button" 
                      className={`admin-spa-nav-btn ${isLogos ? 'active' : ''}`}
                      onClick={() => setAdminActiveSection('logos')}
                    >
                      <span className="icon">🖼️</span> Edit Logos
                    </button>
                  </>
                )}

                <div style={{ margin: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}></div>

                <button 
                  type="button" 
                  className="admin-spa-nav-btn"
                  onClick={handleAdminLogout}
                  style={{ color: '#FF4D4D' }}
                >
                  <span className="icon">🚪</span> Logout
                </button>
              </aside>

              {/* MAIN CONTENT AREA ON RIGHT */}
              <main className="admin-spa-content">
                {/* 🔒 ACCESS DENIED SECURITY GUARD FOR MANAGERS */}
                {isForbiddenForManager && (
                  <div className="cms-editor-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#EF4444' }}>🔒</div>
                    <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>ACCESS DENIED</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                      You are logged in as a <strong>MANAGER</strong> ({authenticatedAdmin?.name}). Manager accounts do not have permission to edit theme settings, hero section, about text, or executive board assemblies.
                    </p>
                    <button className="btn btn-primary" onClick={() => setAdminActiveSection('dashboard')}>
                      <i className="ti ti-arrow-left"></i> Return to Manager Dashboard
                    </button>
                  </div>
                )}

                {/* 📊 1. DASHBOARD OVERVIEW METRICS */}
                {isDashboard && !isForbiddenForManager && (
                  <div className="admin-metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon"><i className="ti ti-users"></i></div>
                      <div>
                        <div className="metric-val">{totalMembers}</div>
                        <div className="metric-lbl">Total Roster Members</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon"><i className="ti ti-chart-bar"></i></div>
                      <div>
                        <div className="metric-val">{avgPoints}</div>
                        <div className="metric-lbl">Average PTS / Member</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon"><i className="ti ti-trophy"></i></div>
                      <div>
                        <div className="metric-val" style={{ fontSize: '1.3rem' }}>{topMember ? topMember.name : 'N/A'}</div>
                        <div className="metric-lbl">Top Active Leader ({topMember ? topMember.points : 0} PTS)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🖼️ WELCOME BANNER BACKGROUND CMS PANEL */}
                {isDashboard && !isForbiddenForManager && (
                  <div className="cms-editor-card" style={{ marginTop: '1.5rem' }}>
                    <div className="card-title-bar" style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <i className="ti ti-photo" style={{ color: 'var(--accent-primary)', fontSize: '1.4rem' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>MEMBER & ADMIN WELCOME BANNER BACKGROUND CMS</h3>
                      </div>
                      <span className="badge-mono" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
                        LIVE HEADER BACKDROP
                      </span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                      Upload or custom-select the background photo for the Welcome Header Card rendered across both the <strong>Member Portal Dashboard</strong> and <strong>Admin Dashboard</strong>.
                    </p>

                    {/* LIVE BANNER PREVIEW BOX */}
                    <div 
                      style={{
                        width: '100%',
                        minHeight: '130px',
                        borderRadius: '12px',
                        backgroundImage: `url(${content.memberBannerBg || '/member_banner_bg.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        marginBottom: '1.25rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(135deg, #d32b69 0%, #b82358 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 'bold', fontSize: '1.3rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                          AY
                        </div>
                        <div>
                          <span className="badge-mono" style={{ fontSize: '0.75rem', background: 'rgba(90,15,45,0.25)', borderColor: 'rgba(90,15,45,0.4)', color: '#FFF' }}>PRESIDENT</span>
                          <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', color: '#FFF', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>WELCOME BACK, AMAN YADAV!</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>Rotaract STV Verified Official Member</p>
                        </div>
                      </div>
                      <span className="badge-mono" style={{ background: 'rgba(0,0,0,0.5)', color: '#FFF', backdropFilter: 'blur(4px)' }}>
                        LIVE PREVIEW
                      </span>
                    </div>

                    {/* UPLOAD & CONTROLS GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                          <i className="ti ti-upload"></i> Upload Custom Banner Photo:
                        </label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="form-input" 
                          style={{ padding: '0.45rem' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                updateMemberBannerBg(evt.target.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                          <i className="ti ti-link"></i> Or Paste Image URL:
                        </label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="/member_banner_bg.png or https://..."
                          value={content.memberBannerBg || ''}
                          onChange={(e) => updateMemberBannerBg(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          type="button" 
                          className="btn btn-outline" 
                          style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
                          onClick={() => updateMemberBannerBg('/member_banner_bg.png')}
                          title="Reset to default Photo 2 paint-splatter art"
                        >
                          <i className="ti ti-rotate"></i> Reset Photo-2
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 👥 2. MEMBER MANAGEMENT */}
                {isMembers && (
                  <div>
                <div className="roster-card">
                  <div className="card-title-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="ti ti-shield-check" style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}></i>
                      <h3 style={{ margin: 0 }}>AUTHORIZED MEMBER ACCESS & CREDENTIALS CMS</h3>
                    </div>
                    <span className="badge-mono" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
                      <i className="ti ti-lock"></i> ADMIN CONTROLLED
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="leaderboard-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>Sr. No.</th>
                          <th>Member & Credentials</th>
                          <th>Role</th>
                          <th>Attendance (Events)</th>
                          <th>Access Status</th>
                          <th>Points</th>
                          <th>Point Adjust</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, index) => {
                          const isActive = member.status !== 'deactivated';
                          const attended = member.attendedEvents ?? 8;
                          const total = member.totalEvents ?? 10;
                          const rate = Math.round((attended / total) * 100);

                          return (
                            <tr key={member.id} className="leaderboard-row" style={{ opacity: isActive ? 1 : 0.65 }}>
                              <td>
                                <span className="badge-mono" style={{ fontSize: '0.75rem', opacity: 0.8, padding: '0.15rem 0.45rem' }}>
                                  {index + 1}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.92rem' }}>{member.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block', marginTop: '0.1rem' }}>
                                  {member.email || `${member.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`}
                                </span>
                                {isAdminMode && (
                                  <div style={{ fontSize: '0.7rem', color: '#A78BFA', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span>🔑 Password:</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.7)' }}>
                                      {member.password || 'password123'}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td><span className="badge-mono" style={{ fontSize: '0.7rem' }}>{member.role}</span></td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ fontSize: '0.82rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>
                                    {attended} / {total} ({rate}%)
                                  </span>
                                  <div className="action-btn-group" style={{ marginLeft: '0.2rem' }}>
                                    <button 
                                      className="btn-xs btn-xs-add" 
                                      onClick={() => updateMemberAttendance(member.id, attended + 1, total)}
                                      title="Add attended event (+1)"
                                    >+</button>
                                    <button 
                                      className="btn-xs btn-xs-sub" 
                                      onClick={() => updateMemberAttendance(member.id, Math.max(0, attended - 1), total)}
                                      title="Subtract attended event (-1)"
                                    >-</button>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-xs"
                                  onClick={() => toggleMemberStatus(member.id)}
                                  style={{
                                    background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    color: isActive ? '#10B981' : '#EF4444',
                                    border: `1px solid ${isActive ? '#10B981' : '#EF4444'}`,
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                  }}
                                  title="Click to toggle member active/deactivated status"
                                >
                                  {isActive ? '🟢 Active' : '🔴 Deactivated'}
                                </button>
                              </td>
                              <td><span className="points-pill">{member.points} PTS</span></td>
                              <td>
                                <div className="action-btn-group">
                                  <button className="btn-xs btn-xs-add" onClick={() => updateMemberPoints(member.id, 50, 'Admin Award (+50 PTS)')}>+50</button>
                                  <button className="btn-xs btn-xs-sub" onClick={() => updateMemberPoints(member.id, -25, 'Admin Deduction (-25 PTS)')}>-25</button>
                                </div>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                  {isAdminMode ? (
                                    <>
                                      <button 
                                        className="btn-xs" 
                                        style={{ background: 'var(--bg-surface-light)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                        onClick={() => setEditingMember(member)}
                                        title="Edit member details, role & credentials"
                                      >
                                        ✏ Edit
                                      </button>
                                      <button 
                                        className="btn-xs btn-xs-del" 
                                        onClick={() => handleRemoveMember(member.id, member.name)}
                                        title="Revoke access & remove from roster"
                                      >
                                        🗑
                                      </button>
                                    </>
                                  ) : (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Read Only</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Authorized Member Form (ADMIN ONLY) */}
                {isAdminMode && (
                  <div className="add-member-card">
                  <div className="card-title-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="ti ti-user-plus" style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}></i>
                      <h3 style={{ margin: 0 }}>AUTHORIZE & ONBOARD NEW CLUB MEMBER</h3>
                    </div>
                  </div>

                  {adminMemberError && (
                    <div className="error-banner" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                      <i className="ti ti-alert-circle"></i> {adminMemberError}
                    </div>
                  )}

                  <form onSubmit={handleAddMemberSubmit} className="cms-form-grid" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Member Name *</label>
                      <input type="text" className="form-input" placeholder="e.g. Rahul Sharma" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role / Title *</label>
                      <input type="text" className="form-input" placeholder="e.g. MEMBER / SECRETARY" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Registered Gmail Address *</label>
                      <input type="email" className="form-input" placeholder="e.g. rahul@gmail.com" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Member Password *</label>
                      <input type="text" className="form-input" placeholder="e.g. password123" value={newMemberPassword} onChange={(e) => setNewMemberPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Starting Points</label>
                      <input type="number" className="form-input" placeholder="0" value={newPoints} onChange={(e) => setNewPoints(e.target.value)} />
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                        <i className="ti ti-shield-check"></i> Authorize & Add To Roster
                      </button>
                    </div>
                  </form>
                </div>
                )}
              </div>
            )}

              {/* WEBSITE LIVE CONTENT & CMS EDITORS */}

                {/* 📝 3. HERO CMS & ANIMATED 2S MEDIA REEL */}
                {isHero && (
                  <div id="admin-section-hero" className="cms-editor-card" style={{ scrollMarginTop: '100px' }}>
                    <div className="cms-section-title">
                      <i className="ti ti-writing-sign"></i> EDIT HERO SECTION TEXT & 2S MEDIA REEL
                    </div>

                  <div className="cms-form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Hero Tagline</label>
                      <input type="text" className="form-input" value={content.hero.tagline} onChange={(e) => updateHero({ tagline: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Main Title Prefix</label>
                      <input type="text" className="form-input" value={content.hero.titlePrefix} onChange={(e) => updateHero({ titlePrefix: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Title Accent Word</label>
                      <input type="text" className="form-input" value={content.hero.titleAccent} onChange={(e) => updateHero({ titleAccent: e.target.value })} />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Hero Subtitle / Intro Copy</label>
                      <textarea className="form-textarea" value={content.hero.intro} onChange={(e) => updateHero({ intro: e.target.value })}></textarea>
                    </div>
                  </div>

                  {/* HERO MEDIA SLIDES & DIRECT FILE UPLOADER */}
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="ti ti-movie"></i> Hero Photo & Video Slides Manager
                  </h4>

                  {/* Hidden File Inputs for Main Upload and Slide Replacement */}
                  <input 
                    type="file" 
                    ref={heroFileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime,video/webm"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleHeroFileUpload(e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />

                  <input 
                    type="file" 
                    ref={replaceFileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime,video/webm"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && replaceTargetId) {
                        handleHeroFileUpload(e.target.files[0], replaceTargetId);
                        e.target.value = '';
                      }
                    }}
                  />

                  {/* Existing Hero Slides Grid with Live Thumbnail, Preview, Replace, Delete */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {(content.hero.heroMedia || []).map((m) => (
                      <div key={m.id} className="cms-item-card" style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {/* Live Media Thumbnail Preview */}
                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#000' }}>
                          {m.type === 'video' ? (
                            <video src={m.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <img src={m.url} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          <span className="badge-mono" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)' }}>
                            {m.type === 'video' ? '🎬 VIDEO (1080P)' : '🖼️ IMAGE (2K)'}
                          </span>
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={m.title || ''} 
                            onChange={(e) => updateHeroMedia(m.id, { title: e.target.value })}
                            style={{ fontSize: '0.88rem', fontWeight: '600', padding: '0.35rem 0.6rem' }}
                            placeholder="Slide Title"
                          />
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{m.resolution || (m.type === 'video' ? '1080p Full HD' : '2K Resolution')}</span>
                            <span>{m.size || 'Auto Stored'}</span>
                          </div>
                        </div>

                        {/* Action Buttons: 👁 Preview, ✏ Replace, 🗑 Delete */}
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                          <button 
                            type="button" 
                            className="btn-xs" 
                            style={{ flex: 1, background: 'var(--bg-surface-light)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', justifyContent: 'center' }} 
                            onClick={() => setPreviewMediaModal(m)}
                          >
                            👁 Preview
                          </button>
                          <button 
                            type="button" 
                            className="btn-xs" 
                            style={{ flex: 1, background: 'var(--bg-surface-light)', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)', justifyContent: 'center' }} 
                            onClick={() => triggerReplaceSlide(m.id)}
                          >
                            ✏ Replace
                          </button>
                          <button 
                            type="button" 
                            className="btn-xs btn-xs-del" 
                            onClick={() => deleteHeroMedia(m.id)}
                            style={{ justifyContent: 'center' }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Direct File Upload Zone (Replaces URL Text Input) */}
                  <div className="add-member-card" style={{ background: 'var(--bg-surface-light)', padding: '1.25rem' }}>
                    <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                      Upload New Hero Image or Video Slide
                    </h5>
                    
                    <div 
                      className="hero-upload-dropzone"
                      onClick={() => heroFileInputRef.current && heroFileInputRef.current.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleHeroFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <div className="upload-dropzone-icon">
                        <i className="ti ti-cloud-upload"></i>
                      </div>
                      <div className="upload-dropzone-title">
                        📁 Click or Drag & Drop Image / Video File Here
                      </div>
                      <div className="upload-dropzone-sub">
                        • <strong>Images:</strong> JPG, JPEG, PNG, WebP, AVIF (Up to 2K/4K Resolution)<br/>
                        • <strong>Videos:</strong> MP4, MOV, WebM (1080p Full HD)
                      </div>
                    </div>

                    {/* Progress Bar during upload */}
                    {uploadingHeroMedia && (
                      <div className="upload-progress-card" style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                          <span><i className="ti ti-loader-3 spin"></i> Processing & Optimizing Media...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>
                    )}

                    {/* Upload Success Message */}
                    {uploadSuccessMsg && (
                      <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '6px', color: '#10B981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="ti ti-circle-check"></i> {uploadSuccessMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}

                {/* ℹ️ 4. ABOUT & STATS CMS */}
                {isAbout && (
                  <div id="admin-section-about" className="cms-editor-card" style={{ scrollMarginTop: '100px' }}>
                    <div className="cms-section-title">
                      <i className="ti ti-info-circle"></i> EDIT ABOUT & IMPACT STATS
                    </div>
                  <div className="cms-form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Section Subtitle</label>
                      <input type="text" className="form-input" value={content.about.subtitle} onChange={(e) => updateAbout({ subtitle: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Section Heading</label>
                      <input type="text" className="form-input" value={content.about.title} onChange={(e) => updateAbout({ title: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Paragraph 1</label>
                      <textarea className="form-textarea" value={content.about.p1} onChange={(e) => updateAbout({ p1: e.target.value })}></textarea>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Paragraph 2</label>
                      <textarea className="form-textarea" value={content.about.p2} onChange={(e) => updateAbout({ p2: e.target.value })}></textarea>
                    </div>
                  </div>

                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Impact Stat Cards</h4>
                  <div className="cms-form-grid">
                    {content.about.stats.map((st) => (
                      <div key={st.id} className="cms-item-card">
                        <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                          <label className="form-label">Number</label>
                          <input type="text" className="form-input" value={st.number} onChange={(e) => updateStat(st.id, e.target.value, st.label)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Label</label>
                          <input type="text" className="form-input" value={st.label} onChange={(e) => updateStat(st.id, st.number, e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                {/* 👨💼 5. BOARD MEMBERS CMS */}
                {isBoard && (
                  <div id="admin-section-board" className="cms-editor-card" style={{ scrollMarginTop: '100px' }}>
                    <div className="cms-section-title">
                      <i className="ti ti-users"></i> EDIT EXECUTIVE BOARD MEMBERS
                    </div>

                    {/* Global Expand / Collapse Control for Board Leaders (Photo 2 Reference) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        TOTAL LEADERS: {content.board.length}
                      </span>
                      <button 
                        type="button" 
                        className="btn-xs btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                        onClick={() => {
                          const allExpanded = Object.keys(expandedBoardIds).length === content.board.length;
                          if (allExpanded) {
                            setExpandedBoardIds({});
                          } else {
                            const newMap = {};
                            content.board.forEach(b => newMap[b.id] = true);
                            setExpandedBoardIds(newMap);
                          }
                        }}
                      >
                        {Object.keys(expandedBoardIds).length === content.board.length ? 'Collapse All' : 'Expand All'}
                      </button>
                    </div>

                    {/* ACCORDION CARDS FOR BOARD MEMBERS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {content.board.map((b, idx) => {
                        const isExpanded = !!expandedBoardIds[b.id];

                        return (
                          <div key={b.id} className="cms-item-card" style={{ padding: '0.75rem 0.9rem' }}>
                            {/* ACCORDION HEADER (PHOTO 2 DESIGN) */}
                            <div 
                              className="cms-item-header"
                              onClick={() => setExpandedBoardIds(prev => ({ ...prev, [b.id]: !prev[b.id] }))}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                                {/* Sequential Number Badge */}
                                <span className="cms-seq-badge">
                                  #{idx + 1}
                                </span>

                                {/* Mini Leader Photo Preview */}
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: '#000', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                                  {b.photo ? (
                                    <img src={b.photo} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.85rem', color: 'var(--text-muted)' }}>👤</div>
                                  )}
                                </div>

                                <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  <span style={{ fontWeight: 650, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {b.name || 'Unnamed Leader'}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                    {b.role || 'MEMBER'}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons: v Details + Delete */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                                <button 
                                  type="button" 
                                  className="btn-xs btn-outline"
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                                >
                                  <i className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`} style={{ fontSize: '0.85rem' }}></i>
                                  <span>{isExpanded ? 'Close' : 'v Details'}</span>
                                </button>
                                <button 
                                  type="button"
                                  className="btn-xs btn-xs-del" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                                  onClick={(e) => { e.stopPropagation(); deleteBoardMember(b.id); }}
                                  title="Delete Board Member"
                                >
                                  <i className="ti ti-trash"></i>
                                </button>
                              </div>
                            </div>

                            {/* EXPANDABLE ACCORDION FORM PANEL */}
                            {isExpanded && (
                              <div className="cms-form-grid" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <div className="form-group">
                                  <label className="form-label">Position Title (CAPITAL)</label>
                                  <input type="text" className="form-input" value={b.role} onChange={(e) => updateBoardMember(b.id, { role: e.target.value.toUpperCase() })} />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Leader Name</label>
                                  <input type="text" className="form-input" value={b.name} onChange={(e) => updateBoardMember(b.id, { name: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label">Leader Photo Image (Upload File or Enter URL)</label>
                                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent-primary)', flexShrink: 0, background: '#000' }}>
                                      <img src={b.photo || '/hero_team_1.jpg'} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="e.g. /hero_team_1.jpg or https://..." 
                                        value={b.photo || ''} 
                                        onChange={(e) => updateBoardMember(b.id, { photo: e.target.value })} 
                                      />
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <label className="btn btn-outline" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer', background: 'var(--accent-soft)' }}>
                                          <i className="ti ti-upload"></i> Upload Photo File
                                          <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }} 
                                            onChange={(e) => handleBoardPhotoFileUpload(b.id, e.target.files[0])} 
                                          />
                                        </label>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Select image file from computer</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label">Individual Vision Statement</label>
                                  <textarea className="form-textarea" style={{ height: '60px' }} value={b.vision || ''} onChange={(e) => updateBoardMember(b.id, { vision: e.target.value })}></textarea>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label">Short Personal Message</label>
                                  <textarea className="form-textarea" style={{ height: '60px' }} value={b.message || ''} onChange={(e) => updateBoardMember(b.id, { message: e.target.value })}></textarea>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  {/* Add New Board Member Form */}
                  <form onSubmit={handleAddBoardMemberSubmit} className="add-member-form" style={{ background: 'var(--bg-surface-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Add New Leader Card</h5>
                    <div className="cms-form-grid" style={{ marginBottom: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Position Title</label>
                        <input type="text" className="form-input" placeholder="e.g. TREASURER" value={newBoardRole} onChange={(e) => setNewBoardRole(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Leader Name</label>
                        <input type="text" className="form-input" placeholder="e.g. John Doe" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} required />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Photo Image (Upload File or Enter URL)</label>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          {newBoardPhoto && (
                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent-primary)', flexShrink: 0 }}>
                              <img src={newBoardPhoto} alt="New Leader Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <input type="text" className="form-input" placeholder="e.g. /hero_team_1.jpg or https://..." value={newBoardPhoto} onChange={(e) => setNewBoardPhoto(e.target.value)} />
                            <label className="btn btn-outline" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                              <i className="ti ti-upload"></i> Upload Image File
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleNewBoardPhotoFileUpload(e.target.files[0])} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Vision Statement</label>
                        <textarea className="form-textarea" style={{ height: '55px' }} placeholder="Vision statement for Rotaract STV..." value={newBoardVision} onChange={(e) => setNewBoardVision(e.target.value)}></textarea>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Short Personal Message</label>
                        <textarea className="form-textarea" style={{ height: '55px' }} placeholder="Message to members and viewers..." value={newBoardMessage} onChange={(e) => setNewBoardMessage(e.target.value)}></textarea>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <i className="ti ti-plus"></i> Add Board Leader Card
                    </button>
                  </form>
                </div>
              )}

                {/* 🧩 6. BENTO GRID PHOTOS & PROJECTS CMS */}
                {isBento && (
                  <div id="admin-section-bento" className="cms-editor-card" style={{ scrollMarginTop: '100px' }}>
                    <div className="cms-section-title">
                      <i className="ti ti-photo"></i> EDIT BENTO GRID PHOTOS & PROJECTS
                    </div>
                    <div style={{ background: 'var(--bg-surface-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <i className="ti ti-star" style={{ color: 'var(--accent-primary)' }}></i> Home Page → Featured Highlights Manager
                        </h4>
                      <span className="badge-mono" style={{ fontSize: '0.7rem' }}>
                        {content.bentoProjects.filter(p => p.isFeatured !== false).length} FEATURED CARDS ON HOME PAGE
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Select which projects are featured on the Home page preview. All projects remain in the full gallery on the dedicated <strong>Projects</strong> page.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {content.bentoProjects.map((p) => {
                        const isFeat = p.isFeatured !== false;
                        return (
                          <div key={`feat_${p.id}`} style={{ background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${isFeat ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{p.title}</div>
                              <div style={{ fontSize: '0.68rem', color: isFeat ? 'var(--accent-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {isFeat ? '⭐ Featured on Home' : '📂 Projects Page Only'}
                              </div>
                            </div>
                            <button 
                              type="button" 
                              className={`btn-xs ${isFeat ? 'btn-primary' : 'btn-outline'}`} 
                              style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', flexShrink: 0 }}
                              onClick={() => toggleFeaturedProject(p.id)}
                            >
                              {isFeat ? 'Featured ✓' : '+ Feature'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Global Expand / Collapse Control for Bento Items */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      TOTAL PROJECTS: {content.bentoProjects.length}
                    </span>
                    <button 
                      type="button" 
                      className="btn-xs btn-outline"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => {
                        const allExpanded = Object.keys(expandedBentoIds).length === content.bentoProjects.length;
                        if (allExpanded) {
                          setExpandedBentoIds({});
                        } else {
                          const newMap = {};
                          content.bentoProjects.forEach(p => newMap[p.id] = true);
                          setExpandedBentoIds(newMap);
                        }
                      }}
                    >
                      {Object.keys(expandedBentoIds).length === content.bentoProjects.length ? 'Collapse All' : 'Expand All'}
                    </button>
                  </div>

                  {content.bentoProjects.map((p, idx) => {
                    const isExpanded = !!expandedBentoIds[p.id];
                    const isVid = p.mediaType === 'video' || (p.mediaUrl && (p.mediaUrl.startsWith('data:video/') || p.mediaUrl.endsWith('.mp4') || p.mediaUrl.endsWith('.webm')));

                    return (
                      <div key={p.id} className="cms-item-card" style={{ marginBottom: '0.75rem', padding: '0.75rem 0.9rem' }}>
                        {/* SLEEK COMPACT HEADER WITH SEQUENTIAL NUMBER BADGE & EXPAND TOGGLE */}
                        <div 
                          className="cms-item-header"
                          onClick={() => setExpandedBentoIds(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                            {/* Sequential Number Badge */}
                            <span className="cms-seq-badge">
                              #{idx + 1}
                            </span>

                            {/* Mini Media Preview */}
                            <div style={{ width: '42px', height: '30px', borderRadius: '4px', overflow: 'hidden', background: '#000', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                              {isVid ? (
                                <video src={p.mediaUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : p.mediaUrl ? (
                                <img src={p.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>📷</div>
                              )}
                            </div>

                            <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <span style={{ fontWeight: 650, fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {p.title || 'Untitled Project'}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                                {p.tag || 'NO TAG'} • {p.sizeClass || 'bento-medium'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <button 
                              type="button" 
                              className="cms-expand-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedBentoIds(prev => ({ ...prev, [p.id]: !prev[p.id] }));
                              }}
                            >
                              <i className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
                              <span>{isExpanded ? 'Close' : 'v Details'}</span>
                            </button>
                            <button 
                              type="button"
                              className="btn-xs btn-xs-del" 
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                              onClick={(e) => { e.stopPropagation(); deleteBentoProject(p.id); }}
                              title="Delete Project"
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE ACCORDION CONTENT */}
                        {isExpanded && (
                          <div className="cms-form-grid" style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <div className="form-group">
                              <label className="form-label">Project Title</label>
                              <input type="text" className="form-input" value={p.title} onChange={(e) => updateBentoProject(p.id, { title: e.target.value })} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Tag Category</label>
                              <input type="text" className="form-input" value={p.tag} onChange={(e) => updateBentoProject(p.id, { tag: e.target.value.toUpperCase() })} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Card Size Class</label>
                              <select className="form-input" value={p.sizeClass || 'bento-medium'} onChange={(e) => updateBentoProject(p.id, { sizeClass: e.target.value })}>
                                <option value="bento-large">bento-large (Tall 9:16)</option>
                                <option value="bento-medium">bento-medium (Medium 4:5)</option>
                                <option value="bento-small">bento-small (Small 3:2)</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Tabler Icon Class</label>
                              <input type="text" className="form-input" value={p.icon || 'ti-flame'} onChange={(e) => updateBentoProject(p.id, { icon: e.target.value })} />
                            </div>

                            {/* Media Type & Upload Section */}
                            <div className="form-group">
                              <label className="form-label">Card Media Type</label>
                              <select className="form-input" value={p.mediaType || 'image'} onChange={(e) => updateBentoProject(p.id, { mediaType: e.target.value })}>
                                <option value="image">Photo Image</option>
                                <option value="video">4-Second Video Loop (MP4/WebM)</option>
                              </select>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                              <label className="form-label">Project Media (Image or Video)</label>
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ width: '75px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '2px solid var(--accent-primary)', flexShrink: 0, background: '#000' }}>
                                  {isVid ? (
                                    <video src={p.mediaUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : p.mediaUrl ? (
                                    <img src={p.mediaUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent-primary)' }}>
                                      <i className="ti ti-photo"></i>
                                    </div>
                                  )}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Media URL (e.g. /hero_team_1.jpg, .mp4, or https://...)" 
                                    value={p.mediaUrl || ''} 
                                    onChange={(e) => {
                                      const url = e.target.value;
                                      const checkVid = url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video/upload/');
                                      updateBentoProject(p.id, { 
                                        mediaUrl: url,
                                        mediaType: checkVid ? 'video' : (p.mediaType || 'image')
                                      });
                                    }} 
                                  />
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <label className="btn btn-outline" style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem', cursor: 'pointer', background: 'var(--accent-soft)' }}>
                                      <i className="ti ti-upload"></i> Upload Image/Video
                                      <input 
                                        type="file" 
                                        accept="image/*,video/mp4,video/webm,video/quicktime" 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleBentoMediaFileUpload(p.id, e.target.files[0])} 
                                      />
                                    </label>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Supports JPG, PNG, WebP photo or MP4/WebM video</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Event URL for View More Button */}
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                              <label className="form-label">Event Link URL (Powers "VIEW MORE" Button)</label>
                              <input 
                                type="url" 
                                className="form-input" 
                                placeholder="https://www.instagram.com/rotaractclubstv or event registration page link" 
                                value={p.eventUrl || ''} 
                                onChange={(e) => updateBentoProject(p.id, { eventUrl: e.target.value })} 
                              />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                              <label className="form-label">Short Summary</label>
                              <input type="text" className="form-input" value={p.desc} onChange={(e) => updateBentoProject(p.id, { desc: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                              <label className="form-label">Full Lightbox Story</label>
                              <textarea className="form-textarea" style={{ minHeight: '65px' }} value={p.fullStory} onChange={(e) => updateBentoProject(p.id, { fullStory: e.target.value })}></textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <form onSubmit={handleAddBentoProjectSubmit} className="add-member-card" style={{ background: 'var(--bg-surface-light)', marginTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Add New Bento Gallery Item</h4>
                    <div className="cms-form-grid" style={{ marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-input" placeholder="e.g. Annual Charity Drive" value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category Tag</label>
                        <input type="text" className="form-input" placeholder="CHARITY" value={newProjTag} onChange={(e) => setNewProjTag(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Grid Size</label>
                        <select className="form-input" value={newProjSize} onChange={(e) => setNewProjSize(e.target.value)}>
                          <option value="bento-short">bento-short (Short ~180px)</option>
                          <option value="bento-tall">bento-tall (Tall ~340px)</option>
                          <option value="bento-medium">bento-medium (Medium ~320px)</option>
                          <option value="bento-extra-tall">bento-extra-tall (Extra-Tall ~420px)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Media Type</label>
                        <select className="form-input" value={newProjMediaType} onChange={(e) => setNewProjMediaType(e.target.value)}>
                          <option value="image">Photo Image</option>
                          <option value="video">3s Video Loop</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Event Link URL (Powers "VIEW MORE" Button)</label>
                        <input type="url" className="form-input" placeholder="https://..." value={newProjEventUrl} onChange={(e) => setNewProjEventUrl(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <i className="ti ti-plus"></i> Add Gallery Item
                    </button>
                  </form>
                </div>
              )}

                {/* 📅 8. EDIT PROJECT LIST & FEATURED HIGHLIGHTS MANAGER */}
                {isProjects && (
                  <div id="admin-section-projects" className="cms-editor-card" style={{ scrollMarginTop: '100px' }}>
                    <div className="cms-section-title">
                      <i className="ti ti-star"></i> HOME PAGE FEATURED HIGHLIGHTS & PROJECT LIST MANAGER
                    </div>

                    <div style={{ background: 'var(--bg-surface-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <i className="ti ti-star" style={{ color: 'var(--accent-primary)' }}></i> Home Page → Featured Highlights Manager
                        </h4>
                        <span className="badge-mono" style={{ fontSize: '0.7rem' }}>
                          {content.bentoProjects.filter(p => p.isFeatured !== false).length} FEATURED CARDS ON HOME PAGE
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Select which projects are featured on the Home page preview. All projects remain in the full gallery on the dedicated <strong>Projects</strong> page.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                        {content.bentoProjects.map((p) => {
                          const isFeat = p.isFeatured !== false;
                          return (
                            <div key={`feat_${p.id}`} style={{ background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${isFeat ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{p.title}</div>
                                <div style={{ fontSize: '0.68rem', color: isFeat ? 'var(--accent-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                  {isFeat ? '⭐ Featured on Home' : '📂 Projects Page Only'}
                                </div>
                              </div>
                              <button 
                                type="button" 
                                className={`btn-xs ${isFeat ? 'btn-primary' : 'btn-outline'}`} 
                                style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', flexShrink: 0 }}
                                onClick={() => toggleFeaturedProject(p.id)}
                              >
                                {isFeat ? 'Featured ✓' : '+ Feature'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* UPCOMING EVENTS & MEETINGS CMS MANAGER */}
                    <div className="cms-editor-card" style={{ marginTop: '2rem' }}>
                      <div className="cms-section-title">
                        <i className="ti ti-calendar-event"></i> UPCOMING EVENTS & MEETINGS CMS MANAGER
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Manage interactive 4:5 event cards, cover photo uploads, meeting schedules, venue details, expanded descriptions, registration links, and pin featured events.
                      </p>

                      {/* LIST OF EXISTING EVENTS & MEETINGS */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                        {(content.events || []).map((evt) => (
                          <div key={evt.id} className="cms-item-card" style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '8px', border: `1px solid ${evt.isFeatured ? 'var(--accent-primary)' : 'var(--border-subtle)'}` }}>
                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                              {/* Cover Image Preview & File Upload */}
                              <div style={{ width: '140px', height: '105px', borderRadius: '6px', overflow: 'hidden', background: '#000', position: 'relative', flexShrink: 0 }}>
                                <img src={evt.coverImage || '/hero_team_1.jpg'} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <label className="btn btn-outline" style={{ position: 'absolute', bottom: '6px', left: '6px', right: '6px', padding: '0.2rem 0.4rem', fontSize: '0.65rem', background: 'rgba(0,0,0,0.75)', cursor: 'pointer', textAlign: 'center', color: '#FFF' }}>
                                  📷 Upload Cover
                                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleEventImageFileUpload(evt.id, e.target.files[0])} />
                                </label>
                              </div>

                              {/* Form Controls for Existing Event */}
                              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                <div className="form-group">
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Category Type</label>
                                  <select 
                                    className="form-input" 
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                                    value={evt.category || 'Upcoming Event'}
                                    onChange={(e) => updateEvent(evt.id, { category: e.target.value })}
                                  >
                                    <option value="Upcoming Event">Upcoming Event</option>
                                    <option value="Upcoming Meeting">Upcoming Meeting</option>
                                  </select>
                                </div>

                                <div className="form-group">
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Event / Meeting Title</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                                    value={evt.title} 
                                    onChange={(e) => updateEvent(evt.id, { title: e.target.value })} 
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Date & Time</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                                    value={evt.date} 
                                    onChange={(e) => updateEvent(evt.id, { date: e.target.value })} 
                                  />
                                </div>

                                <div className="form-group">
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Venue Location</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                                    value={evt.venue} 
                                    onChange={(e) => updateEvent(evt.id, { venue: e.target.value })} 
                                  />
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Short & Detailed Description</label>
                                  <textarea 
                                    className="form-input" 
                                    rows="2"
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                                    value={evt.fullDesc || evt.shortDesc || ''} 
                                    onChange={(e) => updateEvent(evt.id, { fullDesc: e.target.value, shortDesc: e.target.value.substring(0, 100) })} 
                                  />
                                </div>

                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                  <label className="form-label" style={{ fontSize: '0.75rem' }}>RSVP / Registration Link</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem' }}
                                    value={evt.registrationUrl || ''} 
                                    onChange={(e) => updateEvent(evt.id, { registrationUrl: e.target.value })} 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Toolbar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                              <button 
                                type="button" 
                                className={`btn-xs ${evt.isFeatured ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => togglePinEvent(evt.id)}
                              >
                                {evt.isFeatured ? '⭐ Featured Event ✓' : 'Pin as Featured'}
                              </button>

                              <button 
                                type="button" 
                                className="btn-xs btn-xs-del"
                                onClick={() => deleteEvent(evt.id)}
                              >
                                🗑 Delete Event
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* FORM TO CREATE NEW EVENT OR MEETING */}
                      <form onSubmit={handleAddEventSubmit} className="add-member-card" style={{ background: 'var(--bg-surface-light)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                          <i className="ti ti-plus"></i> Add New Event or Meeting
                        </h4>
                        
                        <div className="cms-form-grid" style={{ marginBottom: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-input" value={newEvtCategory} onChange={(e) => setNewEvtCategory(e.target.value)}>
                              <option value="Upcoming Event">Upcoming Event</option>
                              <option value="Upcoming Meeting">Upcoming Meeting</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Event / Meeting Title *</label>
                            <input type="text" className="form-input" placeholder="e.g. STV Tech Conference" value={newEvtTitle} onChange={(e) => setNewEvtTitle(e.target.value)} required />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Date & Time *</label>
                            <input type="text" className="form-input" placeholder="e.g. SEP 10, 2026 • 10 AM" value={newEvtDate} onChange={(e) => setNewEvtDate(e.target.value)} required />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Venue Location *</label>
                            <input type="text" className="form-input" placeholder="e.g. Campus Auditorium" value={newEvtVenue} onChange={(e) => setNewEvtVenue(e.target.value)} required />
                          </div>

                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Cover Image File or URL</label>
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                              <input type="text" className="form-input" placeholder="/hero_team_1.jpg or https://..." value={newEvtCoverImage} onChange={(e) => setNewEvtCoverImage(e.target.value)} />
                              <label className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}>
                                <i className="ti ti-upload"></i> Upload Image
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleEventImageFileUpload('new', e.target.files[0])} />
                              </label>
                            </div>
                          </div>

                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Event Description</label>
                            <textarea className="form-input" rows="3" placeholder="Briefing details for members..." value={newEvtFullDesc} onChange={(e) => setNewEvtFullDesc(e.target.value)} />
                          </div>

                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Registration / RSVP Link</label>
                            <input type="text" className="form-input" placeholder="https://..." value={newEvtRegUrl} onChange={(e) => setNewEvtRegUrl(e.target.value)} />
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                          <i className="ti ti-plus"></i> Publish New Event / Meeting
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 🖼️ 7. EDIT LOGOS, PARTNERS & THEME CMS */}
                {isLogos && (
                  <>
                    {/* PARTNER CLUBS LOGO MARQUEE CMS */}
                    <div className="cms-editor-card">
                      <div className="cms-section-title">
                        <i className="ti ti-link"></i> PARTNER CLUBS LOGO MARQUEE MANAGER
                      </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Upload PNG club logos (transparent background preferred), enable/disable marquee items, re-order display sequence, and delete partner club logos.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {(content.partnerClubs || []).map((club, index) => (
                      <div key={club.id} className="cms-item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                          <div style={{ width: '80px', height: '48px', background: '#121216', border: '1px solid var(--border-subtle)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.35rem', overflow: 'hidden' }}>
                            <img src={club.logoUrl} alt={club.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{club.name}</div>
                            <div style={{ fontSize: '0.72rem', color: club.active !== false ? 'var(--accent-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {club.active !== false ? '🟢 Active in Marquee' : '🔴 Disabled'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <label className="btn btn-outline" style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', cursor: 'pointer' }}>
                            <i className="ti ti-upload"></i> Change Logo PNG
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePartnerLogoFileUpload(club.id, e.target.files[0])} />
                          </label>

                          <button 
                            type="button" 
                            className={`btn-xs ${club.active !== false ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '0.72rem' }}
                            onClick={() => togglePartnerClub(club.id)}
                          >
                            {club.active !== false ? 'Enabled ✓' : 'Disabled'}
                          </button>

                          <button 
                            type="button" 
                            className="btn-xs btn-outline" 
                            style={{ fontSize: '0.72rem' }}
                            disabled={index === 0}
                            onClick={() => movePartnerClubOrder(club.id, 'up')}
                          >
                            <i className="ti ti-arrow-up"></i>
                          </button>

                          <button 
                            type="button" 
                            className="btn-xs btn-outline" 
                            style={{ fontSize: '0.72rem' }}
                            disabled={index === (content.partnerClubs || []).length - 1}
                            onClick={() => movePartnerClubOrder(club.id, 'down')}
                          >
                            <i className="ti ti-arrow-down"></i>
                          </button>

                          <button 
                            type="button" 
                            className="btn-xs btn-xs-del" 
                            style={{ fontSize: '0.72rem' }}
                            onClick={() => deletePartnerClub(club.id)}
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddPartnerClubSubmit} className="add-member-card" style={{ background: 'var(--bg-surface-light)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Upload New Partner Club Logo</h4>
                    <div className="cms-form-grid" style={{ marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Club Title/Name</label>
                        <input type="text" className="form-input" placeholder="e.g. RAC NAGPUR MAIN" value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Upload PNG Logo File or Enter URL</label>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <input type="text" className="form-input" placeholder="/partner_logos/logo.png or https://..." value={newPartnerLogoUrl} onChange={(e) => setNewPartnerLogoUrl(e.target.value)} required />
                          <label className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}>
                            <i className="ti ti-upload"></i> Upload PNG
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePartnerLogoFileUpload('new', e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <i className="ti ti-plus"></i> Add Partner Logo to Marquee
                    </button>
                  </form>
                </div>

                {/* CONTACT DETAILS CMS */}
                <div className="cms-editor-card">
                  <div className="cms-section-title">
                    <i className="ti ti-phone"></i> EDIT CONTACT DETAILS
                  </div>
                  <div className="cms-form-grid">
                    <div className="form-group">
                      <label className="form-label">Official Gmail Address</label>
                      <input type="email" className="form-input" value={content.contact.email} onChange={(e) => updateContact({ email: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Instagram Username/Handle</label>
                      <input type="text" className="form-input" value={content.contact.instagram} onChange={(e) => updateContact({ instagram: e.target.value })} />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Instagram Direct Profile URL</label>
                      <input type="url" className="form-input" value={content.contact.instagramUrl} onChange={(e) => updateContact({ instagramUrl: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Helpline</label>
                      <input type="text" className="form-input" value={content.contact.phone} onChange={(e) => updateContact({ phone: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Theme Presets */}
                <div id="admin-section-logos" className="cms-editor-card" style={{ marginTop: '2rem' }}>
                  <div className="cms-section-title">
                    <i className="ti ti-color-swatch"></i> EDIT LOGOS & ONE-CLICK THEME PRESETS
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <button className="btn btn-outline" style={{ borderColor: '#d32b69', color: '#FFF' }} onClick={() => applyPresetTheme('magenta')}>
                      💖 Rotaract Cranberry
                    </button>
                    <button className="btn btn-outline" style={{ borderColor: '#3B82F6', color: '#FFF' }} onClick={() => applyPresetTheme('blue')}>
                      ⚡ Electric Cyber Blue
                    </button>
                    <button className="btn btn-outline" style={{ borderColor: '#10B981', color: '#FFF' }} onClick={() => applyPresetTheme('emerald')}>
                      🌿 Emerald Tech
                    </button>
                    <button className="btn btn-outline" style={{ borderColor: '#F59E0B', color: '#FFF' }} onClick={() => applyPresetTheme('gold')}>
                      ☀️ Sunset Gold
                    </button>
                    <button className="btn btn-outline" style={{ borderColor: '#8B5CF6', color: '#FFF' }} onClick={() => applyPresetTheme('purple')}>
                      💜 Neon Purple
                    </button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    )}

      {/* ✏ EDIT AUTHORIZED MEMBER CREDENTIALS MODAL */}
      {editingMember && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setEditingMember(null)}
        >
          <div 
            style={{ maxWidth: '520px', width: '100%', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="ti ti-edit" style={{ color: '#d32b69' }}></i> Edit Credentials — {editingMember.name}
              </div>
              <button className="btn-xs btn-xs-del" onClick={() => setEditingMember(null)}>
                <i className="ti ti-x"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="cms-form-grid" style={{ gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Member Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingMember.name} 
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role / Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingMember.role} 
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })} 
                />
              </div>

              {isAdminMode && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Access Permission Role</label>
                  <select 
                    className="form-input" 
                    value={editingMember.userRole || 'member'} 
                    onChange={(e) => setEditingMember({ ...editingMember, userRole: e.target.value })}
                  >
                    <option value="member">🟢 MEMBER (Standard Member Portal Access)</option>
                    <option value="manager">🔵 MANAGER (Limited Access: Events, Bento, Projects, Attendance & Points)</option>
                    <option value="admin">🟣 ADMIN (Full Unrestricted Access & System Settings)</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Registered Gmail Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={editingMember.email || ''} 
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })} 
                  required 
                />
              </div>

              {isAdminMode && (
                <div className="form-group">
                  <label className="form-label">Account Password</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingMember.password || ''} 
                    onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })} 
                    required 
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Attended Events Count</label>
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  value={editingMember.attendedEvents ?? 8} 
                  onChange={(e) => setEditingMember({ ...editingMember, attendedEvents: Math.max(0, parseInt(e.target.value) || 0) })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Events Held</label>
                <input 
                  type="number" 
                  min="1"
                  className="form-input" 
                  value={editingMember.totalEvents ?? 10} 
                  onChange={(e) => setEditingMember({ ...editingMember, totalEvents: Math.max(1, parseInt(e.target.value) || 1) })} 
                  required 
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#d32b69', borderColor: '#d32b69' }}>
                  <i className="ti ti-check"></i> Save Credentials Changes
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingMember(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👁 LIVE MEDIA PREVIEW MODAL */}
      {previewMediaModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setPreviewMediaModal(null)}
        >
          <div 
            style={{ maxWidth: '900px', width: '100%', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                👁 Hero Media Preview — {previewMediaModal.title}
              </div>
              <button className="btn-xs btn-xs-del" onClick={() => setPreviewMediaModal(null)}>
                <i className="ti ti-x"></i> Close
              </button>
            </div>
            <div style={{ width: '100%', maxHeight: '70vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {previewMediaModal.type === 'video' ? (
                <video src={previewMediaModal.url} autoPlay loop controls style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
              ) : (
                <img src={previewMediaModal.url} alt={previewMediaModal.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
              )}
            </div>
            <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Format: <strong>{previewMediaModal.type.toUpperCase()}</strong></span>
              <span>Resolution: <strong>{previewMediaModal.resolution || (previewMediaModal.type === 'video' ? '1080p Full HD' : '2K Resolution')}</strong></span>
              <span>File Size: <strong>{previewMediaModal.size || 'Optimized'}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
