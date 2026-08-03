import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import './Home.css';

export default function Projects() {
  const { content } = useSiteContent();
  const { bentoProjects } = content;

  const [selectedProject, setSelectedProject] = useState(null);
  // Default to Latest Order (Recent -> Early)
  const [sortOrder, setSortOrder] = useState('desc');
  // Default view mode: 'list' (Timeline List Format based on Photo 2)
  const [viewMode, setViewMode] = useState('list');

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

  // Extract day and month/year for list format date callout
  const parseDateCallout = (dateStr) => {
    if (!dateStr) return { day: '15', monthYear: 'OCT 2025' };
    const tokens = dateStr.trim().split(/\s+/);
    if (tokens.length === 3) {
      // e.g. "15 OCT 2025"
      return { day: tokens[0], monthYear: `${tokens[1]} ${tokens[2]}` };
    } else if (tokens.length === 2) {
      // e.g. "OCT 2025" -> default day or month focus
      return { day: tokens[0].substring(0, 3), monthYear: tokens[1] };
    }
    return { day: '15', monthYear: dateStr };
  };

  // Sort events strictly according to event date
  const sortedProjects = [...bentoProjects].sort((a, b) => {
    const timeA = getEventDateTimestamp(a.date);
    const timeB = getEventDateTimestamp(b.date);
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="projects-page" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div className="container">
        
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="photos-pill-badge">
            <i className="ti ti-list-details"></i> ROTARACT STV ARCHIVE & DIRECTORY
          </div>
          <h2>ALL PROJECTS & ACTIVITIES</h2>
          <p style={{ marginTop: '0.5rem' }}>
            Official timeline & record of sustainable community initiatives & youth leadership
          </p>
        </div>

        {/* Controls Bar: View Mode & Sort Order Selector */}
        <div style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          marginBottom: '2rem',
          background: 'var(--bg-card)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Left: View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Layout:</span>
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-surface-light)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
              <button 
                type="button"
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('list')}
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
              >
                <i className="ti ti-list-details"></i> Timeline List
              </button>
              <button 
                type="button"
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('grid')}
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
              >
                <i className="ti ti-grid-dots"></i> Bento Grid
              </button>
            </div>
          </div>

          {/* Right: Sort Order Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Sort Order:
            </span>
            <select 
              className="form-input" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ 
                padding: '0.45rem 1rem', 
                fontSize: '0.85rem', 
                borderRadius: 'var(--radius-pill)', 
                background: 'var(--bg-surface-light)',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              <option value="desc">📅 Latest Order (Recent → Early)</option>
              <option value="asc">📅 Chronological Order (Early → Recent)</option>
            </select>
          </div>
        </div>

        {/* VIEW MODE 1: TIMELINE LIST FORMAT (PHOTO 2 REFERENCE) */}
        {viewMode === 'list' ? (
          <div className="project-list-container">
            {sortedProjects.map((item) => {
              const { day, monthYear } = parseDateCallout(item.date);
              return (
                <div 
                  key={item.id} 
                  className="project-list-row"
                  onClick={() => setSelectedProject(item)}
                >
                  {/* Left Column: Date Callout */}
                  <div className="project-list-date-col">
                    <span className="project-list-day">{day}</span>
                    <span className="project-list-month">{monthYear}</span>
                  </div>

                  {/* Middle Column: Event Title, Metadata, Summary */}
                  <div className="project-list-main-col">
                    <h3 className="project-list-title">{item.title}</h3>
                    <div className="project-list-meta">
                      <span><i className="ti ti-calendar" style={{ color: 'var(--accent-primary)' }}></i> {item.date}</span>
                      <span><i className="ti ti-users" style={{ color: 'var(--accent-primary)' }}></i> {item.volunteers}</span>
                      <span><i className="ti ti-chart-dots" style={{ color: 'var(--accent-primary)' }}></i> {item.impact}</span>
                    </div>
                    <p className="project-list-desc">
                      {item.desc || item.fullStory}
                    </p>
                  </div>

                  {/* Right Column: Media Avatar / Thumbnail */}
                  <div className="project-list-thumb-col">
                    {item.mediaType === 'video' && item.mediaUrl ? (
                      <video 
                        src={item.mediaUrl} 
                        className="project-list-thumb" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                      />
                    ) : item.mediaUrl ? (
                      <img 
                        src={item.mediaUrl} 
                        alt={item.title} 
                        className="project-list-thumb" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="project-list-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="ti ti-photo" style={{ color: 'var(--accent-primary)' }}></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW MODE 2: BENTO GRID FORMAT */
          <div className="bento-photos-grid">
            {sortedProjects.map((item) => (
              <div 
                key={item.id} 
                className={`bento-card ${item.sizeClass || 'bento-short'}`}
                onClick={() => setSelectedProject(item)}
              >
                <div className="bento-card-bg">
                  {item.mediaType === 'video' && item.mediaUrl ? (
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
                      background: '#0A0A0C'
                    }}></div>
                  )}
                </div>
                <div className="bento-card-gradient"></div>
                
                <div className="bento-card-body">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#FFF', background: 'rgba(0,0,0,0.65)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-pill)' }}>
                      <i className="ti ti-calendar"></i> {item.date}
                    </span>
                  </div>
                  <div className="bento-card-bottom">
                    <h3 className="bento-title">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

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

            <h2 className="hero-title" style={{ fontSize: '1.8rem', textAlign: 'left', margin: '1rem 0 0.5rem 0' }}>
              {selectedProject.title}
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <span><i className="ti ti-calendar"></i> {selectedProject.date}</span>
              <span><i className="ti ti-users"></i> {selectedProject.volunteers}</span>
              <span><i className="ti ti-chart-dots"></i> {selectedProject.impact}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {selectedProject.fullStory || selectedProject.desc}
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <a 
                href={selectedProject.eventUrl || 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.4rem' }}
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
    </div>
  );
}
