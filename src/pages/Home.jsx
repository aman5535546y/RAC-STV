import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent, isMediaVideo } from '../context/SiteContentContext';
import './Home.css';

export default function Home() {
  const { content } = useSiteContent();
  const { hero, about, board, bentoProjects } = content;

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);

  // Animated 2-Second Fast Media Slideshow Logic (Clean, No Control Bar)
  const mediaList = hero.heroMedia && hero.heroMedia.length > 0 ? hero.heroMedia : [];
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    if (mediaList.length <= 1) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((curr) => (curr + 1) % mediaList.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [mediaList.length]);

  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [eventSortOrder, setEventSortOrder] = useState('asc'); // 'asc' for chronological date order, 'desc' for newest first

  const monthOrder = {
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
    JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
  };

  const getEventDateTimestamp = (dateStr) => {
    if (!dateStr) return 0;
    const tokens = dateStr.trim().toUpperCase().split(/\s+/);
    if (tokens.length >= 2) {
      const month = monthOrder[tokens[0].substring(0, 3)] || 1;
      const year = parseInt(tokens[1], 10) || 2026;
      return year * 100 + month;
    }
    return 0;
  };

  // Sort events strictly in order according to event date
  const sortedBentoProjects = [...bentoProjects].sort((a, b) => {
    const timeA = getEventDateTimestamp(a.date);
    const timeB = getEventDateTimestamp(b.date);
    return eventSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        
        {/* Media Reel Backdrop Layer */}
        <div className="hero-media-backdrop">
          {mediaList.map((item, idx) => (
            <div 
              key={item.id || idx} 
              className={`hero-media-slide ${idx === activeSlideIndex ? 'active' : ''}`}
            >
              {item.type === 'video' ? (
                <video 
                  className="hero-media-element"
                  src={item.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  preload="auto"
                />
              ) : (
                <img 
                  className="hero-media-element" 
                  src={item.url} 
                  alt={item.title || 'Hero Background'} 
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          ))}
          <div className="hero-media-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="container hero-content-container">
          <div className="hero-content">
            <h1 className="hero-title">
              {hero.titlePrefix} {hero.titleAccent}
            </h1>

            <p className="hero-intro">
              {hero.intro}
            </p>
          </div>
        </div>

        {/* Carousel Indicators */}
        {mediaList.length > 1 && (
          <div className="hero-carousel-indicators" aria-label="Hero slide navigation">
            {mediaList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`carousel-dot-base ${idx === activeSlideIndex ? 'active' : ''}`}
                onClick={() => setActiveSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
            <div 
              className="carousel-active-glider"
              style={{
                transform: `translateX(${activeSlideIndex * 18}px)`
              }}
            />
          </div>
        )}
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-subtitle">{about.subtitle}</div>
              <h2>{about.title}</h2>
              <p>{about.p1}</p>
              <p>{about.p2}</p>
            </div>

            <div className="stats-grid">
              {about.stats.map((st) => (
                <div key={st.id} className="stat-card">
                  <div className="stat-number">{st.number}</div>
                  <div className="stat-label">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. BOARD MEMBERS SECTION */}
      <section id="board" className="board-section">
        <div className="container">
          <div className="section-header">
            <div className="section-subtitle">LEADERSHIP</div>
            <h2>EXECUTIVE BOARD MEMBERS</h2>
            <p style={{ marginTop: '0.5rem' }}>Click any leader card to view their vision & personal message</p>
          </div>

          <div className="board-grid">
            {board.map((member) => {
              const isFlipped = flippedCardId === member.id;
              return (
                <div 
                  key={member.id} 
                  className={`board-card-container ${isFlipped ? 'is-flipped' : ''}`}
                  onClick={() => setFlippedCardId(prev => prev === member.id ? null : member.id)}
                  title="Click to turn card"
                >
                  <div className="board-card-inner">
                    <div className="board-card-front">
                      <div className="board-card-photo-frame">
                        <img 
                          src={member.photo || '/hero_team_1.jpg'} 
                          alt={member.name} 
                          className="board-card-photo"
                          style={{
                            objectFit: 'cover',
                            objectPosition: member.photoPosition || 'center top'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/hero_team_1.jpg';
                          }}
                        />
                        <div className="board-photo-gradient"></div>
                      </div>

                      <div className="board-card-bottom-info">
                        <span className="board-role">{member.role}</span>
                        <h3 className="board-name">{member.name}</h3>
                        <div className="flip-hint">
                          <i className="ti ti-rotate-3d"></i> Click to turn
                        </div>
                      </div>
                    </div>

                    <div className="board-card-back">
                      <div className="card-back-content">
                        <div className="vision-box">
                          <span className="vision-label"><i className="ti ti-eye"></i> VISION</span>
                          <p className="vision-text">{member.vision || 'Empowering youth through leadership, innovation, and community service.'}</p>
                        </div>

                        <div className="message-box">
                          <span className="message-label"><i className="ti ti-quote"></i> MESSAGE</span>
                          <p className="message-text">"{member.message || 'Together, we create lasting positive community impact.'}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOME FEATURED HIGHLIGHTS SECTION */}
      <section className="projects-section">
        <div className="container">
          <div className="section-header">
            <div className="photos-pill-badge">
              <i className="ti ti-star"></i> HIGHLIGHTS
            </div>
            <h2>PROJECTS & ACTIVITIES</h2>
            <p style={{ marginTop: '0.35rem' }}>Creating sustainable community change through action</p>
          </div>

          <div className="bento-photos-grid">
            {sortedBentoProjects
              .filter(item => item.isFeatured !== false)
              .slice(0, 12)
              .map((item, idx) => {
                const isVid = isMediaVideo(item);
                // Clean 3-Size Pattern: Large (9:16), Medium (4:5), Small (3:2)
                const sizePattern = ['bento-large', 'bento-medium', 'bento-small', 'bento-large', 'bento-medium', 'bento-small'];
                const cardSize = (item.sizeClass && ['bento-large', 'bento-medium', 'bento-small'].includes(item.sizeClass))
                  ? item.sizeClass
                  : sizePattern[idx % sizePattern.length];

                return (
                  <div 
                    key={item.id} 
                    className={`bento-card ${cardSize}`}
                    onClick={() => setSelectedProject(item)}
                  >
                    <div className="bento-card-bg">
                      {isVid && item.mediaUrl ? (
                        <video 
                          src={item.mediaUrl} 
                          className="bento-card-media" 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                        />
                      ) : item.mediaUrl ? (
                        <img 
                          src={item.mediaUrl} 
                          alt={item.title} 
                          className="bento-card-media" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: 'radial-gradient(circle at center, rgba(90,15,45,0.3) 0%, rgba(10,10,12,0.9) 100%)'
                        }}></div>
                      )}
                    </div>
                    <div className="bento-card-gradient"></div>
                    
                    <div className="bento-card-body">
                      <div className="bento-card-bottom">
                        <h3 className="bento-title" style={{ fontSize: cardSize === 'bento-small' ? '0.78rem' : '0.92rem' }}>
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Centered CTA button at bottom redirecting to /projects page */}
          <div className="bento-cta-wrapper">
            <Link 
              to="/projects" 
              className="btn btn-primary bento-cta-btn"
            >
              <i className="ti ti-arrow-right"></i> MORE PROJECTS
            </Link>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedProject && (
        <div className="bento-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="bento-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="bento-modal-close" onClick={() => setSelectedProject(null)}>
              <i className="ti ti-x"></i>
            </button>

            <div className="bento-modal-banner">
              {selectedProject.mediaType === 'video' && selectedProject.mediaUrl ? (
                <video 
                  src={selectedProject.mediaUrl} 
                  className="bento-modal-media" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                />
              ) : selectedProject.mediaUrl ? (
                <img 
                  src={selectedProject.mediaUrl} 
                  alt={selectedProject.title} 
                  className="bento-modal-media" 
                />
              ) : (
                <div className="bento-modal-fallback-banner">
                  <i className={`ti ${selectedProject.icon || 'ti-flame'}`} style={{ fontSize: '4rem', marginBottom: '0.5rem' }}></i>
                </div>
              )}
            </div>

            <h2 className="hero-title" style={{ fontSize: '1.8rem', textAlign: 'left', margin: '1rem 0 0.5rem 0', color: 'var(--text-primary)' }}>
              {selectedProject.title}
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <span><i className="ti ti-calendar"></i> {selectedProject.date}</span>
              <span><i className="ti ti-users"></i> {selectedProject.volunteers}</span>
              <span><i className="ti ti-chart-dots"></i> {selectedProject.impact}</span>
            </div>

            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              {selectedProject.fullStory}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <a 
                href={selectedProject.eventUrl || 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ background: 'var(--accent-gradient)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <i className="ti ti-external-link"></i> VIEW MORE (EVENT LINK)
              </a>

              <button className="btn btn-outline" onClick={() => setSelectedProject(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PARTNER CLUBS INFINITE LOGO MARQUEE SECTION */}
      <section className="partner-clubs-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2>Partner Clubs</h2>
            <p style={{ marginTop: '0.4rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
              Collaborating with dynamic Rotaract clubs across the Nation for impactful service.
            </p>
          </div>
        </div>

        {/* Dynamic 4-Row Full-Width Infinite Logo Marquee */}
        {(() => {
          const activeClubs = (content.partnerClubs || [])
            .filter(c => c.active !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          if (activeClubs.length === 0) return null;

          // Divide clubs across 4 rows with staggered offsets
          const len = activeClubs.length;
          const q = Math.max(1, Math.ceil(len / 4));
          
          const r1 = activeClubs.slice(0, q);
          const r2 = activeClubs.slice(q, q * 2);
          const r3 = activeClubs.slice(q * 2, q * 3);
          const r4 = activeClubs.slice(q * 3);

          const row1Clubs = r1.length > 0 ? r1 : activeClubs;
          const row2Clubs = r2.length > 0 ? r2 : activeClubs;
          const row3Clubs = r3.length > 0 ? r3 : activeClubs;
          const row4Clubs = r4.length > 0 ? r4 : activeClubs;

          // Dynamic repeat helper: ensures at least 32 logo items per row regardless of uploaded logo count
          const repeatToMin = (arr, minCount = 32) => {
            if (!arr || arr.length === 0) return [];
            let result = [...arr];
            while (result.length < minCount) {
              result = [...result, ...arr];
            }
            return result;
          };

          const row1Repeated = repeatToMin(row1Clubs);
          const row2Repeated = repeatToMin(row2Clubs);
          const row3Repeated = repeatToMin(row3Clubs);
          const row4Repeated = repeatToMin(row4Clubs);

          return (
            <div className="partner-marquee-container">
              {/* Row 1: Left (Right-to-Left) */}
              <div className="partner-marquee-track marquee-track-left">
                {row1Repeated.map((club, idx) => (
                  <div key={`r1_${club.id}_${idx}`} className="partner-logo-item" title={club.name}>
                    <img 
                      src={club.logoUrl} 
                      alt={club.name} 
                      className="partner-logo-img" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>

              {/* Row 2: Right (Left-to-Right) */}
              <div className="partner-marquee-track marquee-track-right">
                {row2Repeated.map((club, idx) => (
                  <div key={`r2_${club.id}_${idx}`} className="partner-logo-item" title={club.name}>
                    <img 
                      src={club.logoUrl} 
                      alt={club.name} 
                      className="partner-logo-img" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>

              {/* Row 3: Left (Right-to-Left) */}
              <div className="partner-marquee-track marquee-track-left">
                {row3Repeated.map((club, idx) => (
                  <div key={`r3_${club.id}_${idx}`} className="partner-logo-item" title={club.name}>
                    <img 
                      src={club.logoUrl} 
                      alt={club.name} 
                      className="partner-logo-img" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>

              {/* Row 4: Right (Left-to-Right) */}
              <div className="partner-marquee-track marquee-track-right">
                {row4Repeated.map((club, idx) => (
                  <div key={`r4_${club.id}_${idx}`} className="partner-logo-item" title={club.name}>
                    <img 
                      src={club.logoUrl} 
                      alt={club.name} 
                      className="partner-logo-img" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* 6. ELEGANT OVERSIZED ROTARACT STV WORDMARK SECTION */}
      <section className="rac-stv-wordmark-section">
        <div className="rac-stv-wordmark-container">
          <h2 className="rac-stv-wordmark-text">ROTARACT STV</h2>
        </div>
      </section>
    </div>
  );
}
