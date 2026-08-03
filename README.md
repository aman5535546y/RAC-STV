# Rotaract Club of STV (Skill Tech Visionaries) Website

A modern, responsive, dark-themed web application built for the **Rotaract Club of STV** featuring a public showcase home page, an interactive member portal & point leaderboard, and a password-protected admin roster controller.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation Commands

1. **Clone or navigate to the repository directory**:
   ```bash
   cd scratch/rotaract-stv
   ```

2. **Install node dependencies**:
   ```bash
   npm install
   ```

3. **Launch local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## Key Features & Authentication Flow

### 1. Public Showcase (`/`)
- **Hero Section**: Rotaract tagline badge (`SERVICE ABOVE SELF`), Oswald title typography, and CTA linking to Member Portal.
- **About Section**: Club vision statement and interactive performance statistics (`50+ Active Members`, `25+ Projects`, `1,200+ Lives Impacted`).
- **Executive Board Grid**: Cards for 7 board roles (`President`, `Vice President`, `Secretary`, `Joint Secretary`, `Treasurer`, `Event Head`, `PR Head`).
- **Projects & Activities**: 6 project showcase cards with category tags, dates, and volunteer metrics.
- **Contact Form**: Interactive contact UI with email/phone/Instagram info cards.

### 2. Member Portal (`/members`)
- **Passwordless Name-Chip Login**: Tap any seeded member profile chip (e.g. *Alex Rivera*, *Samantha Chen*, *Rohan Sharma*) or type a member's full name.
- **Personal Dashboard**: View your total earned points, dynamically calculated leaderboard rank (`#1`, `#2`, etc.), and detailed activity breakdown log.
- **Official Leaderboard Table**: Ranked member list with Gold/Silver/Bronze medal indicators (`🥇`, `🥈`, `🥉`) and active row highlighting.

### 3. Admin Roster Control (`/admin`)
- **Passcode Protection**: Security gate requiring the admin passcode (`stv2026`).
- **Club Health Metrics**: Real-time stats for Total Roster Members, Avg Points per Member, Top Active Leader, and Upcoming Events.
- **Live Roster Manager**: Award (+50 PTS) or deduct (-25 PTS) points, apply custom adjustments, or remove members from the roster.
- **Onboard New Member Form**: Instantly add new members to the shared roster with custom starting points.

---

## Data Storage & Persistence

> [!NOTE]
> **v1 Browser Storage**: This application stores all member rosters, point histories, and admin edits in the browser's **`localStorage`** (`rotaract_stv_members`).
> 
> - **Per-Device Scope**: Roster updates persist on your local device across browser reloads.
> - **Session Scope**: Member login sessions are maintained in React state for clean memory management.

---

## Next Steps & Future Roadmap

Here are the planned features for the v2 production release:

1. **Real Authentication**: Upgrade simple passcode and name matching to secure OAuth 2.0 / JWT authentication (Google Sign-In, magic email links).
2. **Real Backend & Database Integration**: Connect to a cloud database (such as **Supabase** or **Firebase Firestore**) for real-time multi-device sync, secure row-level security (RLS), and persistent cloud storage.
3. **Automated Event Attendance Marking**: Implement QR code check-ins at Rotaract events that automatically calculate and credit member points upon scanning.
4. **Announcements Feed & Notifications**: Add a live club newsfeed, project updates bulletin, and push notifications for upcoming drives.
