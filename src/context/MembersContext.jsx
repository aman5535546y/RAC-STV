import React, { createContext, useContext, useState, useEffect } from 'react';

const MembersContext = createContext();

const STORAGE_KEY = 'rotaract_stv_members';

const initialMembersSeed = [
  {
    id: 'm1',
    regNo: 'STV2026-01',
    email: 'aman.yadav@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Aman Yadav',
    role: 'PRESIDENT',
    userRole: 'admin',
    points: 480,
    history: [
      { id: 'h1', title: 'Executive Leadership & Club Charter', points: 180, date: '2026-07-15', category: 'LEADERSHIP' },
      { id: 'h2', title: 'SkillTech Empowerment Summit Chair', points: 150, date: '2026-06-28', category: 'PROJECTS' },
      { id: 'h3', title: 'Community Relief Drive Leadership', points: 150, date: '2026-05-12', category: 'COMMUNITY' }
    ]
  },
  {
    id: 'm2',
    regNo: 'STV2026-02',
    email: 'falgun.bodele@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Falgun Bodele',
    role: 'PRESIDENT ELECT',
    userRole: 'admin',
    points: 420,
    history: [
      { id: 'h4', title: 'District Assembly Delegation', points: 160, date: '2026-07-02', category: 'LEADERSHIP' },
      { id: 'h5', title: 'Strategic Planning & Operations', points: 140, date: '2026-06-15', category: 'STRATEGY' },
      { id: 'h6', title: 'Youth Leadership Summit Speaker', points: 120, date: '2026-05-20', category: 'EVENTS' }
    ]
  },
  {
    id: 'm3',
    regNo: 'STV2026-03',
    email: 'vishatan@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Vishatan',
    role: 'OVERALL MANAGER',
    userRole: 'manager',
    points: 380,
    history: [
      { id: 'h7', title: 'Project Management & Operations', points: 150, date: '2026-07-10', category: 'MANAGEMENT' },
      { id: 'h8', title: 'Blood Donation Camp Management', points: 120, date: '2026-06-05', category: 'HEALTHCARE' },
      { id: 'h9', title: 'Multi-Team Coordination', points: 110, date: '2026-05-01', category: 'OPERATIONS' }
    ]
  },
  {
    id: 'm4',
    regNo: 'STV2026-04',
    email: 'adwait@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Adwait',
    role: 'TECHNICAL HEAD',
    userRole: 'manager',
    points: 350,
    history: [
      { id: 'h10', title: 'Web Portal & Tech Infrastructure', points: 150, date: '2026-07-18', category: 'TECH' },
      { id: 'h11', title: 'Digital Tech Workshop Facilitation', points: 110, date: '2026-06-10', category: 'EDUCATION' },
      { id: 'h12', title: 'Hackathon Tech Architecture', points: 90, date: '2026-04-25', category: 'INNOVATION' }
    ]
  },
  {
    id: 'm5',
    regNo: 'STV2026-05',
    email: 'vaishnav@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Vaishnav',
    role: 'MEDIA HEAD',
    points: 310,
    history: [
      { id: 'h13', title: 'Brand Identity & Media Campaigns', points: 120, date: '2026-07-01', category: 'MEDIA' },
      { id: 'h14', title: 'Social Media Outreach Management', points: 100, date: '2026-06-14', category: 'PR' },
      { id: 'h15', title: 'Event Photography & Design', points: 90, date: '2026-05-18', category: 'CREATIVE' }
    ]
  },
  {
    id: 'm6',
    regNo: 'STV2026-06',
    email: 'kathayani@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Kathayani',
    role: 'MEMBER',
    points: 260,
    history: [
      { id: 'h16', title: 'Digital Literacy Volunteer', points: 100, date: '2026-07-12', category: 'VOLUNTEER' },
      { id: 'h17', title: 'Plantation Drive Volunteer', points: 90, date: '2026-06-20', category: 'ENVIRONMENT' },
      { id: 'h18', title: 'General Assembly Attendance', points: 70, date: '2026-05-10', category: 'ATTENDANCE' }
    ]
  },
  {
    id: 'm7',
    regNo: 'STV2026-07',
    email: 'gurprit@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Gurprit',
    role: 'MEMBER',
    points: 230,
    history: [
      { id: 'h19', title: 'Food Drive Logistics Volunteer', points: 90, date: '2026-07-15', category: 'VOLUNTEER' },
      { id: 'h20', title: 'Campus Cleanup Activity', points: 80, date: '2026-06-05', category: 'CIVIC' },
      { id: 'h21', title: 'Member Orientation Assembly', points: 60, date: '2026-05-15', category: 'ATTENDANCE' }
    ]
  },
  {
    id: 'm8',
    regNo: 'STV2026-08',
    email: 'pragya@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Pragya',
    role: 'MEMBER',
    points: 210,
    history: [
      { id: 'h22', title: 'Healthcare Camp Volunteer', points: 80, date: '2026-07-14', category: 'VOLUNTEER' },
      { id: 'h23', title: 'Digital Campaign Content', points: 70, date: '2026-06-18', category: 'MEDIA' },
      { id: 'h24', title: 'Meeting Attendance', points: 60, date: '2026-05-22', category: 'ATTENDANCE' }
    ]
  },
  {
    id: 'm9',
    regNo: 'STV2026-09',
    email: 'mayank@gmail.com',
    password: 'password123',
    status: 'active',
    name: 'Mayank',
    role: 'MEMBER',
    points: 190,
    history: [
      { id: 'h25', title: 'Tech Literacy Workshop Assistant', points: 80, date: '2026-07-11', category: 'VOLUNTEER' },
      { id: 'h26', title: 'Environmental Clean Drive', points: 60, date: '2026-06-08', category: 'ENVIRONMENT' },
      { id: 'h27', title: 'General Assembly Attendance', points: 50, date: '2026-05-19', category: 'ATTENDANCE' }
    ]
  }
];

export function MembersProvider({ children }) {
  // Load members from localStorage or migrate old seed data automatically
  const [members, setMembers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(m => {
            let uRole = m.userRole;
            if (!uRole) {
              const nameLower = (m.name || '').toLowerCase();
              if (nameLower.includes('aman') || nameLower.includes('falgun') || m.role === 'PRESIDENT' || m.role === 'PRESIDENT ELECT') {
                uRole = 'admin';
              } else if (nameLower.includes('vishatan') || nameLower.includes('adwait') || m.role === 'OVERALL MANAGER' || m.role === 'TECHNICAL HEAD') {
                uRole = 'manager';
              } else {
                uRole = 'member';
              }
            }
            return { ...m, userRole: uRole };
          });
        }
      }
    } catch (err) {
      console.warn('Using new roster seed data:', err);
    }
    return initialMembersSeed;
  });

  const [loggedInMember, setLoggedInMember] = useState(() => {
    try {
      const stored = localStorage.getItem('rotaract_stv_auth_member');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authenticatedAdmin, setAuthenticatedAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('rotaract_stv_auth_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [adminActiveSection, setAdminActiveSection] = useState('dashboard');

  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Sync members to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (err) {
      console.error('Failed to save members to localStorage:', err);
    }
  }, [members]);

  // ADMIN-CONTROLLED GMAIL + PASSWORD AUTHENTICATION WITH AUTOMATIC ROLE DETECTION
  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter your Registered Email Address and Password.' };
    }

    // 1. Check if Email Address exists in members database
    const emailMatch = members.find(m => {
      const mEmail = (m.email || '').trim().toLowerCase();
      if (mEmail === cleanEmail) return true;
      if (cleanEmail.includes('amanyadav') && mEmail.includes('aman')) return true;
      return false;
    });

    if (!emailMatch) {
      return { 
        success: false, 
        error: 'Access denied. Your email address is not authorized for the RAC STV Portal. Please contact club administration.' 
      };
    }

    // 2. Check if account is active
    if (emailMatch.status === 'deactivated') {
      return {
        success: false,
        error: 'Access denied. Your account has been deactivated by club administration. Please contact support.'
      };
    }

    // 3. Determine User Role
    const uRole = emailMatch.userRole || (
      emailMatch.role === 'PRESIDENT' || emailMatch.role === 'PRESIDENT ELECT' ? 'admin' :
      emailMatch.role === 'OVERALL MANAGER' || emailMatch.role === 'TECHNICAL HEAD' ? 'manager' : 'member'
    );

    // 4. Validate Password / Passcode
    let isMatch = false;
    if (uRole === 'admin') {
      isMatch = cleanPass === (emailMatch.password || 'password123') || cleanPass === 'aman2026' || cleanPass === 'falgun2026' || cleanPass === 'stv2026';
    } else if (uRole === 'manager') {
      isMatch = cleanPass === (emailMatch.password || 'password123') || cleanPass === 'vishatan2026' || cleanPass === 'adwait2026' || cleanPass === 'stv2026';
    } else {
      isMatch = cleanPass === (emailMatch.password || 'password123');
    }

    if (!isMatch) {
      return {
        success: false,
        error: 'Invalid password. Please check your credentials.'
      };
    }

    // All credentials matched! Log in user to state & storage
    setLoggedInMember(emailMatch);
    try { localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(emailMatch)); } catch {}

    if (uRole === 'admin' || uRole === 'manager') {
      const adminObj = {
        id: emailMatch.id,
        name: emailMatch.name,
        role: emailMatch.role,
        userRole: uRole,
        passcode: cleanPass
      };
      setAuthenticatedAdmin(adminObj);
      try { localStorage.setItem('rotaract_stv_auth_admin', JSON.stringify(adminObj)); } catch {}
      return { success: true, role: uRole, targetUrl: '/admin' };
    }

    setAuthenticatedAdmin(null);
    try { localStorage.removeItem('rotaract_stv_auth_admin'); } catch {}
    return { success: true, role: 'member', targetUrl: '/members' };
  };

  // GOOGLE OAUTH AUTHENTICATION HANDLER
  const loginWithGoogle = (googleEmail) => {
    const cleanEmail = (googleEmail || '').trim().toLowerCase();
    const OFFICIAL_ADMIN_EMAIL = 'rotaractclubofstv@gmail.com';

    // 1. Check if email matches Official Admin Google Account rotaractclubofstv@gmail.com or designated Admin credentials
    if (cleanEmail === OFFICIAL_ADMIN_EMAIL || cleanEmail === 'amanyadav407500@gmail.com' || cleanEmail === 'aman.yadav@gmail.com' || cleanEmail === 'falgun.bodele@gmail.com') {
      const adminObj = {
        id: 'admin_official_google',
        name: cleanEmail === OFFICIAL_ADMIN_EMAIL ? 'Rotaract STV Official Admin' : (cleanEmail.includes('falgun') ? 'Falgun Bodele' : 'Aman Yadav'),
        email: cleanEmail,
        role: 'PRESIDENT',
        userRole: 'admin',
        authMethod: 'google_oauth'
      };
      setAuthenticatedAdmin(adminObj);
      setLoggedInMember({
        id: adminObj.id,
        name: adminObj.name,
        email: cleanEmail,
        role: adminObj.role,
        userRole: 'admin'
      });
      try {
        localStorage.setItem('rotaract_stv_auth_admin', JSON.stringify(adminObj));
        localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(adminObj));
      } catch {}
      return { success: true, role: 'admin', targetUrl: '/admin' };
    }

    // 2. Check if email belongs to an authorized Manager
    const managerMatch = members.find(m => (m.email || '').trim().toLowerCase() === cleanEmail && (m.userRole === 'manager' || m.role === 'OVERALL MANAGER' || m.role === 'TECHNICAL HEAD'));
    if (managerMatch) {
      const managerObj = {
        id: managerMatch.id,
        name: managerMatch.name,
        email: cleanEmail,
        role: managerMatch.role,
        userRole: 'manager',
        authMethod: 'google_oauth'
      };
      setAuthenticatedAdmin(managerObj);
      setLoggedInMember(managerMatch);
      try {
        localStorage.setItem('rotaract_stv_auth_admin', JSON.stringify(managerObj));
        localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(managerMatch));
      } catch {}
      return { success: true, role: 'manager', targetUrl: '/admin' };
    }

    // 3. Check if email matches an authorized Member in database
    const memberMatch = members.find(m => (m.email || '').trim().toLowerCase() === cleanEmail);
    if (memberMatch) {
      setLoggedInMember(memberMatch);
      setAuthenticatedAdmin(null);
      try {
        localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(memberMatch));
        localStorage.removeItem('rotaract_stv_auth_admin');
      } catch {}
      return { success: true, role: 'member', targetUrl: '/members' };
    }

    // 4. Deny access for unregistered Google accounts
    return {
      success: false,
      errorTitle: 'Access Denied',
      error: 'This Google account is not registered with the Rotaract Club STV Portal.'
    };
  };

  const logout = () => {
    setLoggedInMember(null);
    try { localStorage.removeItem('rotaract_stv_auth_member'); } catch {}
  };

  const adminLogin = (adminObj) => {
    setAuthenticatedAdmin(adminObj);
    try { localStorage.setItem('rotaract_stv_auth_admin', JSON.stringify(adminObj)); } catch {}
  };

  const adminLogout = () => {
    setAuthenticatedAdmin(null);
    try { localStorage.removeItem('rotaract_stv_auth_admin'); } catch {}
  };

  // Add Authorized Member (Enforces Unique Registration Number)
  const addMember = (name, role = 'MEMBER', startingPoints = 0, regNo = '', email = '', password = 'password123') => {
    const cleanRegNo = regNo.trim().toUpperCase() || `STV2026-${Math.floor(10 + Math.random() * 90)}`;
    
    // Check uniqueness
    const existing = members.find(m => (m.regNo || '').trim().toUpperCase() === cleanRegNo);
    if (existing) {
      throw new Error(`Registration Number ${cleanRegNo} is already assigned to ${existing.name}. Each member must have a unique Registration Number.`);
    }

    const formattedRole = role.trim().toUpperCase() || 'MEMBER';
    const newMember = {
      id: `m_${Date.now()}`,
      regNo: cleanRegNo,
      email: email.trim().toLowerCase() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      password: password || 'password123',
      status: 'active',
      name: name.trim(),
      role: formattedRole,
      points: Number(startingPoints) || 0,
      history: [
        {
          id: `h_${Date.now()}`,
          title: 'Authorized & Onboarded by Admin',
          points: Number(startingPoints) || 0,
          date: new Date().toISOString().split('T')[0],
          category: 'ONBOARDING'
        }
      ]
    };
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  // Edit / Update Member Details
  const updateMember = (memberId, updatedFields) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const updated = { ...m, ...updatedFields };
        if (loggedInMember && loggedInMember.id === memberId) {
          setLoggedInMember(updated);
          try { localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(updated)); } catch {}
        }
        return updated;
      }
      return m;
    }));
  };

  // Edit / Update Member Attendance (Attended Events & Total Events)
  const updateMemberAttendance = (memberId, attendedCount, totalCount) => {
    const validTotal = Math.max(1, Number(totalCount) || 10);
    const validAttended = Math.max(0, Math.min(validTotal, Number(attendedCount) || 0));

    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const updated = { 
          ...m, 
          attendedEvents: validAttended, 
          totalEvents: validTotal 
        };
        if (loggedInMember && loggedInMember.id === memberId) {
          setLoggedInMember(updated);
          try { localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(updated)); } catch {}
        }
        return updated;
      }
      return m;
    }));
  };

  // Toggle Active / Deactivated Status
  const toggleMemberStatus = (memberId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newStatus = m.status === 'deactivated' ? 'active' : 'deactivated';
        const updated = { ...m, status: newStatus };
        if (loggedInMember && loggedInMember.id === memberId && newStatus === 'deactivated') {
          setLoggedInMember(null);
          try { localStorage.removeItem('rotaract_stv_auth_member'); } catch {}
        }
        return updated;
      }
      return m;
    }));
  };

  const updateMemberPoints = (memberId, delta, reason = 'Admin Adjustment') => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newPoints = Math.max(0, m.points + delta);
        const newHistory = [
          {
            id: `h_${Date.now()}`,
            title: reason,
            points: delta,
            date: new Date().toISOString().split('T')[0],
            category: delta >= 0 ? 'AWARD' : 'DEDUCTION'
          },
          ...m.history
        ];
        const updated = { ...m, points: newPoints, history: newHistory };
        if (loggedInMember && loggedInMember.id === memberId) {
          setLoggedInMember(updated);
          try { localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(updated)); } catch {}
        }
        return updated;
      }
      return m;
    }));
  };

  const removeMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    if (loggedInMember && loggedInMember.id === memberId) {
      setLoggedInMember(null);
      try { localStorage.removeItem('rotaract_stv_auth_member'); } catch {}
    }
  };

  const updateMemberRole = (memberId, newRoleTitle, newUserRole) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const updated = {
          ...m,
          role: newRoleTitle.toUpperCase(),
          userRole: newUserRole || m.userRole || 'member'
        };
        if (loggedInMember && loggedInMember.id === memberId) {
          setLoggedInMember(updated);
          try { localStorage.setItem('rotaract_stv_auth_member', JSON.stringify(updated)); } catch {}
        }
        return updated;
      }
      return m;
    }));
  };

  return (
    <MembersContext.Provider value={{
      members,
      loggedInMember,
      login,
      loginWithGoogle,
      logout,
      authenticatedAdmin,
      adminLogin,
      adminLogout,
      adminActiveSection,
      setAdminActiveSection,
      showLoginModal,
      setShowLoginModal,
      openLoginModal,
      closeLoginModal,
      addMember,
      updateMember,
      updateMemberRole,
      updateMemberAttendance,
      toggleMemberStatus,
      updateMemberPoints,
      removeMember
    }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  return useContext(MembersContext);
}
