import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteContentContext = createContext(null);

const STORAGE_KEY = 'rotaract_stv_site_content';

export function isMediaVideo(item) {
  if (!item) return false;
  if (item.mediaType === 'video') return true;
  const url = (typeof item === 'string' ? item : item.mediaUrl || item.videoUrl || item.url || item.photo || '').trim().toLowerCase();
  if (url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video/upload/')) {
    return true;
  }
  return false;
}

const defaultHeroMedia = [
  { id: 1, type: 'image', url: '/hero_team_1.jpg', title: 'Rotaract STV Team Unity' },
  { id: 2, type: 'image', url: '/hero_team_2.jpg', title: 'Executive Board Assembly' },
  { id: 3, type: 'image', url: '/hero_team_3.jpg', title: 'Community Action & Leadership' },
  { id: 4, type: 'image', url: '/hero_team_4.jpg', title: 'Sports & Teamwork' }
];

const defaultContact = {
  email: 'rotaractclubofstv@gmail.com',
  phone: '+91 98765 43210',
  instagram: '@rotaractclubstv',
  instagramUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5',
  address: 'Skill Tech Visionaries Campus, STV Tech Hub, India'
};

const defaultTheme = {
  mode: 'dark', // 'dark' | 'light'
  fontHeading: 'Outfit, sans-serif',
  fontBody: 'Inter, sans-serif',
  accentColor: '#d32b69',
  accentHover: '#b82358',
  bgColor: '#0A0A0C',
  bgSurface: '#121216',
  bgCard: 'rgba(22, 22, 28, 0.75)'
};

const defaultPartnerClubs = [
  { id: 1, name: 'RAC YCC', logoUrl: '/partner_logos/rac_ycc.svg', active: true, order: 1 },
  { id: 2, name: 'RAC VSPM', logoUrl: '/partner_logos/rac_vspm.svg', active: true, order: 2 },
  { id: 3, name: 'RAC GHRSTU', logoUrl: '/partner_logos/rac_ghrstu.svg', active: true, order: 3 },
  { id: 4, name: 'RAC VNIT', logoUrl: '/partner_logos/rac_vnit.svg', active: true, order: 4 },
  { id: 5, name: 'RAC RCOEM', logoUrl: '/partner_logos/rac_rcoem.svg', active: true, order: 5 },
  { id: 6, name: 'RAC RGCER', logoUrl: '/partner_logos/rac_rgcer.svg', active: true, order: 6 },
  { id: 7, name: 'RAC NAGPUR MAIN', logoUrl: '/partner_logos/rac_nagpur_main.svg', active: true, order: 7 },
  { id: 8, name: 'RAC NAGPUR METRO', logoUrl: '/partner_logos/rac_nagpur_metro.svg', active: true, order: 8 }
];

export const defaultSiteContent = {
  theme: defaultTheme,
  partnerClubs: defaultPartnerClubs,
  hero: {
    tagline: 'HEAR LEADERS ARE MADE',
    titlePrefix: 'ROTARACT CLUB OF',
    titleAccent: 'STV',
    intro: 'Skill Tech Visionaries — A dynamic network of passionate young leaders & changemakers committed to leadership and impactful service.',
    primaryCtaText: 'Explore Member Portal',
    secondaryCtaText: 'Discover Our Mission',
    heroMedia: defaultHeroMedia
  },
  about: {
    subtitle: 'ABOUT OUR CLUB',
    title: 'SKILL TECH VISIONARIES',
    p1: 'The Rotaract Club of STV is a vibrant community of young professionals and university visionaries dedicated to social development, tech education, and youth empowerment.',
    p2: 'Rotaract STV fosters lifelong leadership skills while taking meaningful action to solve real-world challenges.',
    stats: [
      { id: 's1', number: '50+', label: 'Active Members' },
      { id: 's2', number: '25+', label: 'Impact Projects' },
      { id: 's3', number: '1,200+', label: 'Lives Touched' },
      { id: 's4', number: '500+', label: 'Service Hours' }
    ]
  },
  board: [
    { 
      id: 'b1', 
      role: 'PRESIDENT', 
      name: 'Aman Yadav', 
      photo: '/hero_team_1.jpg',
      vision: 'To foster an ecosystem of innovation, compassionate leadership, and tech-driven community service across STV.',
      message: 'Welcome to Rotaract Club of STV! Together, we empower youth to lead with vision and impact.'
    },
    { 
      id: 'b2', 
      role: 'PRESIDENT ELECT', 
      name: 'Falgun Bodele', 
      photo: '/hero_team_2.jpg',
      vision: 'Building sustainable youth leadership programs and expanding our club reach to create lasting community impact.',
      message: 'Excited for the upcoming term! We are dedicated to bringing innovation and unity in everything we build.'
    },
    { 
      id: 'b3', 
      role: 'OVERALL MANAGER', 
      name: 'Vishatan', 
      photo: '/hero_team_3.jpg',
      vision: 'Streamlining operational excellence and ensuring seamless execution across all community and technical initiatives.',
      message: 'Efficiency and teamwork drive our success. Let us build a stronger community together!'
    },
    { 
      id: 'b4', 
      role: 'TECHNICAL HEAD', 
      name: 'Adwait', 
      photo: '/hero_team_4.jpg',
      vision: 'Leveraging cutting-edge web technologies, software solutions, and digital innovation for social good.',
      message: 'Technology is our tool for transformation. Constantly innovating for high impact.'
    },
    { 
      id: 'b5', 
      role: 'MEDIA HEAD', 
      name: 'Vaishnav', 
      photo: '/hero_team_1.jpg',
      vision: 'Amplifying our story through compelling digital media, creative design, and strategic outreach.',
      message: 'Capturing moments, telling stories, and inspiring minds through creative media.'
    },
    { 
      id: 'b6', 
      role: 'SECRETARY', 
      name: 'Rohan Sharma', 
      photo: '/hero_team_2.jpg',
      vision: 'Ensuring transparent communication, meticulous documentation, and seamless organizational synergy.',
      message: 'Organized execution and clear communication are the backbone of impactful leadership.'
    },
    { 
      id: 'b7', 
      role: 'VICE PRESIDENT', 
      name: 'Priya Patel', 
      photo: '/hero_team_3.jpg',
      vision: 'Fostering member engagement, leadership development, and strategic community partnerships.',
      message: 'Empowering every member to realize their full potential and drive meaningful social change.'
    },
    { 
      id: 'b8', 
      role: 'TREASURER', 
      name: 'Sneha Verma', 
      photo: '/hero_team_4.jpg',
      vision: 'Maintaining fiscal integrity, strategic budgeting, and sustainable resource allocation for all initiatives.',
      message: 'Financial transparency and prudent management ensure long-term community impact.'
    }
  ],
  bentoProjects: [
    {
      id: 1,
      title: 'Digital Tech Literacy Workshop',
      tag: 'EDUCATION & TECH',
      desc: 'Empowering underprivileged students with fundamental computer literacy, coding basics, and digital safety skills.',
      fullStory: 'Our members conducted a 3-day intensive boot camp introducing 120+ local school students to web design, scratch programming, and online safety practices.',
      date: 'OCT 2025',
      icon: 'ti-devices',
      sizeClass: 'bento-tall',
      volunteers: '24 Members',
      impact: '120+ Students Taught',
      mediaType: 'image',
      mediaUrl: '/hero_team_1.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 2,
      title: 'Community Food Drive',
      tag: 'RELIEF',
      desc: 'Organized food package distribution serving local families in need.',
      fullStory: 'Distributed 500+ nutritious dry ration packages and hot meal boxes to slum communities during seasonal winter relief drives.',
      date: 'DEC 2025',
      icon: 'ti-heart-handshake',
      sizeClass: 'bento-short',
      volunteers: '35 Members',
      impact: '500+ Families Served',
      mediaType: 'image',
      mediaUrl: '/hero_team_2.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 3,
      title: 'Green Earth Plantation Campaign',
      tag: 'ENVIRONMENT',
      desc: 'Planted 250+ native saplings in urban parks to expand city green cover.',
      fullStory: 'Partnered with municipal authorities to plant native shade trees and installed drip irrigation systems maintained by STV youth volunteers.',
      date: 'JAN 2026',
      icon: 'ti-leaf',
      sizeClass: 'bento-short',
      volunteers: '40 Members',
      impact: '250+ Trees Planted',
      mediaType: 'image',
      mediaUrl: '/hero_team_3.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 4,
      title: 'Youth Health & Blood Donation Camp',
      tag: 'HEALTHCARE',
      desc: 'Annual blood donation drive supporting regional medical centers.',
      fullStory: 'Organized in collaboration with Rotary Red Cross blood bank, collecting 85+ units of blood and conducting free health checkups.',
      date: 'FEB 2026',
      icon: 'ti-first-aid-kit',
      sizeClass: 'bento-tall',
      volunteers: '30 Members',
      impact: '85 Units Collected',
      mediaType: 'image',
      mediaUrl: '/hero_team_4.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 5,
      title: 'Women Empowerment & Skill BootCamp',
      tag: 'COMMUNITY',
      desc: 'Handicraft, financial literacy, and digital skill training for women.',
      fullStory: 'Trained 60+ local women in digital payments, basic accounting, and self-employment marketing techniques.',
      date: 'MAR 2026',
      icon: 'ti-woman',
      sizeClass: 'bento-tall',
      volunteers: '18 Members',
      impact: '60+ Women Empowered',
      mediaType: 'image',
      mediaUrl: '/hero_team_1.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 6,
      title: 'STV Hackathon & Coding Sprint',
      tag: 'INNOVATION',
      desc: '24-hour coding sprint solving local civic challenges through open source code.',
      fullStory: 'Brought together 15 developer teams who built civic reporting apps and automated relief queue management tools.',
      date: 'APR 2026',
      icon: 'ti-code-plus',
      sizeClass: 'bento-short',
      volunteers: '28 Members',
      impact: '15 Prototypes Built',
      mediaType: 'image',
      mediaUrl: '/hero_team_2.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 7,
      title: 'E-Waste Recycling Drive',
      tag: 'SUSTAINABILITY',
      desc: 'Collection drive for obsolete electronic items for safe green disposal.',
      fullStory: 'Collected 200kg+ of e-waste from university campuses and safely recycled them through certified e-waste processors.',
      date: 'MAY 2026',
      icon: 'ti-recycle',
      sizeClass: 'bento-short',
      volunteers: '22 Members',
      impact: '200kg Recycled',
      mediaType: 'image',
      mediaUrl: '/hero_team_3.jpg',
      eventUrl: 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    },
    {
      id: 8,
      title: 'Annual Youth Assembly',
      tag: 'NETWORKING',
      desc: 'District conference celebrating young leaders and service excellence.',
      fullStory: 'Rotaract STV received 3 district awards for Outstanding Community Project, Best Digital Presence, and Club Growth Excellence.',
      date: 'MAY 2026',
      icon: 'ti-trophy',
      sizeClass: 'bento-medium',
      volunteers: '50 Members',
      impact: '3 District Awards',
      mediaType: 'image',
    }
  ],
  contact: defaultContact,
  events: [
    {
      id: 'evt_1',
      category: 'Upcoming Event',
      title: 'STV Leadership & Innovation Summit 2026',
      date: 'AUG 15, 2026',
      time: '10:00 AM - 04:00 PM',
      venue: 'Main Tech Auditorium, STV Campus',
      shortDesc: 'A flagship annual summit featuring keynote talks by industry visionaries and interactive youth workshops.',
      fullDesc: 'Join us for the Rotaract STV Annual Leadership & Innovation Summit 2026! Network with top industry leaders, participate in hands-on design thinking sessions, and witness live tech prototype demonstrations. Registration includes lunch and certificate of participation.',
      registrationUrl: 'https://www.instagram.com/rotaractclubstv',
      coverImage: '/hero_team_1.jpg',
      isFeatured: true
    },
    {
      id: 'evt_2',
      category: 'Upcoming Meeting',
      title: 'General Body Assembly & Project Briefing',
      date: 'AUG 22, 2026',
      time: '05:00 PM - 07:00 PM',
      venue: 'Seminar Hall B & Online Hybrid',
      shortDesc: 'Monthly general assembly for all club members to review quarterly goals and onboard new service initiatives.',
      fullDesc: 'The monthly General Body Assembly brings together all active members and prospective recruits. Agenda includes points review, committee updates for upcoming blood drives, and project team allocations for Q3.',
      registrationUrl: 'https://www.instagram.com/rotaractclubstv',
      coverImage: '/hero_team_2.jpg',
      isFeatured: false
    }
  ]
};

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.hero) {
          let currentHeroMedia = (parsed.hero && parsed.hero.heroMedia) ? parsed.hero.heroMedia : defaultHeroMedia;
          const isStock = currentHeroMedia.some(m => m.url && m.url.includes('unsplash'));
          if (isStock) {
            currentHeroMedia = defaultHeroMedia;
          }

          let currentBoard = (parsed && parsed.board && Array.isArray(parsed.board)) ? parsed.board.map((b, i) => ({
            ...defaultSiteContent.board[i],
            ...b,
            photo: b.photo || (defaultSiteContent.board[i] ? defaultSiteContent.board[i].photo : '/hero_team_1.jpg'),
            vision: b.vision || (defaultSiteContent.board[i] ? defaultSiteContent.board[i].vision : 'Empowering youth through leadership and innovation.'),
            message: b.message || (defaultSiteContent.board[i] ? defaultSiteContent.board[i].message : 'Together, we create lasting positive impact.')
          })) : defaultSiteContent.board;

          let currentBentoProjects = (parsed && parsed.bentoProjects && Array.isArray(parsed.bentoProjects))
            ? parsed.bentoProjects.map((p, i) => {
                const targetUrl = p.mediaUrl || p.videoUrl || p.imageUrl || (defaultSiteContent.bentoProjects[i] ? defaultSiteContent.bentoProjects[i].mediaUrl : '/hero_team_1.jpg');
                const detectedType = p.mediaType || (isMediaVideo(targetUrl) ? 'video' : 'image');
                return {
                  ...defaultSiteContent.bentoProjects[i],
                  ...p,
                  mediaType: detectedType,
                  mediaUrl: targetUrl,
                  eventUrl: p.eventUrl || 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
                };
              })
            : defaultSiteContent.bentoProjects;

          let currentPartnerClubs = (parsed && parsed.partnerClubs && Array.isArray(parsed.partnerClubs))
            ? parsed.partnerClubs
            : defaultPartnerClubs;

          let currentEvents = (parsed && parsed.events && Array.isArray(parsed.events))
            ? parsed.events
            : defaultSiteContent.events;

          return {
            ...defaultSiteContent,
            ...parsed,
            board: currentBoard,
            bentoProjects: currentBentoProjects,
            partnerClubs: currentPartnerClubs,
            events: currentEvents,
            hero: {
              ...defaultSiteContent.hero,
              ...parsed.hero,
              tagline: parsed.hero.tagline || 'HEAR LEADERS ARE MADE',
              heroMedia: currentHeroMedia
            },
            contact: { ...defaultContact, ...(parsed.contact || {}) },
            theme: { ...defaultTheme, ...(parsed.theme || {}) }
          };
        }
      }
    } catch (err) {
      console.warn('Using default site content:', err);
    }
    return defaultSiteContent;
  });

  // Save to localStorage (Sanitizing large base64 strings to prevent QuotaExceededError)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.code === 22 || err.message?.includes('quota')) {
        try {
          // Omit massive data URLs from localStorage persistence while keeping them in React state
          const sanitizedHeroMedia = (content.hero?.heroMedia || []).map(m => ({
            ...m,
            url: m.url?.startsWith('data:') && m.url.length > 100000 ? '/hero_team_1.jpg' : m.url
          }));
          const sanitizedContent = {
            ...content,
            hero: { ...content.hero, heroMedia: sanitizedHeroMedia }
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedContent));
        } catch (innerErr) {
          console.warn('LocalStorage fallback quota exceeded:', innerErr);
        }
      } else {
        console.error('Failed to save site content to localStorage:', err);
      }
    }
  }, [content]);

  // Apply Theme & Light/Dark Mode CSS variables dynamically
  useEffect(() => {
    const theme = content.theme || defaultTheme;
    const root = document.documentElement;
    const isLight = theme.mode === 'light';

    if (isLight) {
      root.setAttribute('data-theme', 'light');
      root.style.setProperty('--bg-dark', '#F8FAFC');
      root.style.setProperty('--bg-surface', '#FFFFFF');
      root.style.setProperty('--bg-surface-light', '#F1F5F9');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--text-primary', '#0F172A');
      root.style.setProperty('--text-muted', '#475569');
      root.style.setProperty('--text-dim', '#64748B');
      root.style.setProperty('--border-subtle', 'rgba(226, 232, 240, 0.9)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.88)');
      root.style.setProperty('--glass-border', 'rgba(226, 232, 240, 0.9)');
    } else {
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg-dark', theme.bgColor || '#0A0A0C');
      root.style.setProperty('--bg-surface', theme.bgSurface || '#121216');
      root.style.setProperty('--bg-surface-light', '#1A1A22');
      root.style.setProperty('--bg-card', theme.bgCard || 'rgba(22, 22, 28, 0.75)');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-muted', '#A0A0B0');
      root.style.setProperty('--text-dim', '#6E6E80');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-bg', 'rgba(18, 18, 22, 0.85)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
    }

    if (theme.accentColor) {
      root.style.setProperty('--accent-primary', theme.accentColor);
      root.style.setProperty('--accent-hover', theme.accentHover || '#E81C76');
      root.style.setProperty('--accent-soft', `${theme.accentColor}1A`);
      root.style.setProperty('--accent-hover', theme.accentHover || '#b82358');
      root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.accentHover || '#b82358'} 100%)`);
    }
  }, [content.theme]);

  const toggleThemeMode = () => {
    setContent(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode: prev.theme?.mode === 'light' ? 'dark' : 'light'
      }
    }));
  };

  const updateTheme = (themeData) => {
    setContent(prev => ({ ...prev, theme: { ...prev.theme, ...themeData } }));
  };

  const updateHero = (heroData) => {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, ...heroData } }));
  };

  const addHeroMedia = (mediaItem) => {
    const newMedia = {
      id: Date.now(),
      type: mediaItem.type || 'image',
      url: mediaItem.url,
      title: mediaItem.title || 'Rotaract STV Media'
    };
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        heroMedia: [...(prev.hero.heroMedia || []), newMedia]
      }
    }));
  };

  const deleteHeroMedia = (id) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        heroMedia: (prev.hero.heroMedia || []).filter(m => m.id !== id)
      }
    }));
  };

  const updateHeroMedia = (id, updatedFields) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        heroMedia: (prev.hero.heroMedia || []).map(m => m.id === id ? { ...m, ...updatedFields } : m)
      }
    }));
  };

  const updateAbout = (aboutData) => {
    setContent(prev => ({ ...prev, about: { ...prev.about, ...aboutData } }));
  };

  const updateStat = (id, newStat) => {
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        stats: prev.about.stats.map(s => s.id === id ? { ...s, ...newStat } : s)
      }
    }));
  };

  const updateBoardMember = (id, updatedFields) => {
    setContent(prev => ({
      ...prev,
      board: prev.board.map(b => b.id === id ? { ...b, ...updatedFields } : b)
    }));
  };

  const addBoardMember = (memberObj) => {
    const newMember = {
      id: `b_${Date.now()}`,
      role: memberObj.role || 'EXECUTIVE MEMBER',
      name: memberObj.name || 'New Member',
      photo: memberObj.photo || '/hero_team_1.jpg',
      vision: memberObj.vision || 'Empowering youth leadership.',
      message: memberObj.message || 'Proud to serve Rotaract STV.'
    };
    setContent(prev => ({ ...prev, board: [...prev.board, newMember] }));
  };

  const deleteBoardMember = (id) => {
    setContent(prev => ({ ...prev, board: prev.board.filter(b => b.id !== id) }));
  };

  const updateBentoProject = (id, updatedFields) => {
    setContent(prev => ({
      ...prev,
      bentoProjects: prev.bentoProjects.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    }));
  };

  const addBentoProject = (projObj) => {
    const newProj = {
      id: Date.now(),
      title: projObj.title || 'New Project',
      tag: (projObj.tag || 'PROJECT').toUpperCase(),
      desc: projObj.desc || 'Short project summary.',
      fullStory: projObj.fullStory || 'Detailed project story and impact details.',
      date: projObj.date || 'AUG 2026',
      icon: projObj.icon || 'ti-flame',
      sizeClass: projObj.sizeClass || 'bento-short',
      volunteers: projObj.volunteers || '20 Members',
      impact: projObj.impact || 'Community Impact',
      mediaType: projObj.mediaType || (isMediaVideo(projObj.mediaUrl) ? 'video' : 'image'),
      mediaUrl: projObj.mediaUrl || '/hero_team_1.jpg',
      eventUrl: projObj.eventUrl || 'https://www.instagram.com/rotaractclubstv?igsh=NTl2ZTdxY2ViNzZ5'
    };
    setContent(prev => ({ ...prev, bentoProjects: [...prev.bentoProjects, newProj] }));
  };

  const deleteBentoProject = (id) => {
    setContent(prev => ({ ...prev, bentoProjects: prev.bentoProjects.filter(p => p.id !== id) }));
  };

  const toggleFeaturedProject = (id) => {
    setContent(prev => ({
      ...prev,
      bentoProjects: prev.bentoProjects.map(p => 
        p.id === id ? { ...p, isFeatured: p.isFeatured === false ? true : false } : p
      )
    }));
  };

  /* PARTNER CLUBS LOGO CMS HELPERS */
  const addPartnerClub = (clubObj) => {
    const newClub = {
      id: Date.now(),
      name: clubObj.name || 'New Partner Club',
      logoUrl: clubObj.logoUrl || '/partner_logos/rac_ycc.svg',
      active: true,
      order: (content.partnerClubs || []).length + 1
    };
    setContent(prev => ({
      ...prev,
      partnerClubs: [...(prev.partnerClubs || []), newClub]
    }));
  };

  const updatePartnerClub = (id, updatedFields) => {
    setContent(prev => ({
      ...prev,
      partnerClubs: (prev.partnerClubs || []).map(c => c.id === id ? { ...c, ...updatedFields } : c)
    }));
  };

  const togglePartnerClub = (id) => {
    setContent(prev => ({
      ...prev,
      partnerClubs: (prev.partnerClubs || []).map(c => c.id === id ? { ...c, active: !c.active } : c)
    }));
  };

  const deletePartnerClub = (id) => {
    setContent(prev => ({
      ...prev,
      partnerClubs: (prev.partnerClubs || []).filter(c => c.id !== id)
    }));
  };

  const movePartnerClubOrder = (id, direction) => {
    setContent(prev => {
      const clubs = [...(prev.partnerClubs || [])];
      const idx = clubs.findIndex(c => c.id === id);
      if (idx < 0) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= clubs.length) return prev;

      const temp = clubs[idx];
      clubs[idx] = clubs[targetIdx];
      clubs[targetIdx] = temp;

      return {
        ...prev,
        partnerClubs: clubs.map((c, i) => ({ ...c, order: i + 1 }))
      };
    });
  };

  /* EVENTS & MEETINGS CMS HELPERS */
  const addEvent = (evtObj) => {
    const newEvt = {
      id: 'evt_' + Date.now(),
      category: evtObj.category || 'Upcoming Event',
      title: evtObj.title || 'New Event / Meeting',
      date: evtObj.date || 'TBD 2026',
      time: evtObj.time || '10:00 AM - 12:00 PM',
      venue: evtObj.venue || 'STV Auditorium',
      shortDesc: evtObj.shortDesc || 'Event briefing and interactive session.',
      fullDesc: evtObj.fullDesc || 'Detailed session agenda and participation instructions.',
      registrationUrl: evtObj.registrationUrl || 'https://www.instagram.com/rotaractclubstv',
      coverImage: evtObj.coverImage || '/hero_team_1.jpg',
      isFeatured: !!evtObj.isFeatured
    };
    setContent(prev => ({
      ...prev,
      events: [...(prev.events || []), newEvt]
    }));
  };

  const updateEvent = (id, updatedFields) => {
    setContent(prev => ({
      ...prev,
      events: (prev.events || []).map(e => e.id === id ? { ...e, ...updatedFields } : e)
    }));
  };

  const deleteEvent = (id) => {
    setContent(prev => ({
      ...prev,
      events: (prev.events || []).filter(e => e.id !== id)
    }));
  };

  const togglePinEvent = (id) => {
    setContent(prev => ({
      ...prev,
      events: (prev.events || []).map(e => ({
        ...e,
        isFeatured: e.id === id ? !e.isFeatured : false
      }))
    }));
  };

  const updateContact = (contactData) => {
    setContent(prev => ({ ...prev, contact: { ...prev.contact, ...contactData } }));
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all website theme, text, stats, board members, and projects to factory defaults?')) {
      setContent(defaultSiteContent);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <SiteContentContext.Provider value={{
      content,
      toggleThemeMode,
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
      resetToDefaults
    }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
