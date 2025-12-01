# Tennis Tracking App

A comprehensive React application for tracking tennis match statistics, player performance, and team management. Built with Vite, TypeScript, Tailwind CSS, and Supabase.

## 🎾 Features

### Team Management
- **Multi-Team Support**: Create or join teams with approval-based membership
- **Team Admin Dashboard**: Manage team members and approve/reject join requests
- **Data Isolation**: Each team's data is completely isolated and secure
- **Single Team Per User**: Users can only belong to one team at a time

### Player Management
- **Player Profiles**: Comprehensive player information including gender, birth date, dominant hand, backhand type, and skill level
- **Custom Avatars**: Upload and manage player profile pictures
- **Player Statistics**: Track detailed performance metrics across all matches
- **Player Comparison**: Compare two players head-to-head with visual charts

### Match Management
- **Singles & Doubles Support**: Full support for both match formats
- **Match Status Tracking**: Track matches through `scheduled`, `in_progress`, and `completed` states
- **Timestamp Tracking**: Record `started_at` and `completed_at` times for matches
- **Enhanced Opponent Selection**: Select opponents from your player database or enter manual names
- **Individual Player Tracking**: Track each participant individually in doubles matches
- **Set-by-Set Scoring**: Record detailed scores for each set including tiebreaks

### Live Match Tracking
- **Real-Time Event Recording**: Track match events as they happen during live matches
- **Event Tap Bar**: Quick-tap interface for recording:
  - Forehand/Backhand Winners
  - Forehand/Backhand Unforced Errors
  - Aces & Double Faults
  - Net Errors
  - Long Rallies Won/Lost
  - Volley Winners/Errors
- **Player Context Display**: Shows player avatar, name, and current set number
- **Auto-Save**: Automatically saves stats when switching between players
- **Live Indicator**: Visual "LIVE" badge with animation
- **Summary Totals**: Real-time display of total winners and errors

### Detailed Statistics
- **Technical Stats**: Serve percentages, aces, double faults, winners, errors, net play
- **Tactical Stats**: Break points, deuce games, shot placement, court positioning
- **Physical & Mental Stats**: Speed, recovery, fatigue, confidence, focus, tactical adjustment
- **Set-Level Granularity**: All statistics tracked per set for detailed analysis

### Dashboard & Analytics
- **Activity Feed**: Recent matches and player activities
- **Performance Charts**: Visual representation of player statistics using Recharts
- **Head-to-Head Records**: Compare player matchups and historical performance
- **Match History**: Complete match records with filtering and search

### Authentication & Security
- **Supabase Auth**: Secure user authentication with email/password
- **Protected Routes**: Role-based access control
- **Team-Based Data Access**: Users can only access their team's data
- **Approval Workflow**: Team admins control who can join their team

## 🎨 Design & Branding

- **Custom Color Scheme**: Green-based palette (`#132d24`, `#a3cf08`, `#fbfbfb`)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Mobile-Friendly**: Touch-optimized controls for live tracking
- **Custom Logo**: Branded logo and favicon
- **Lucide Icons**: Modern icon set throughout the application

## 📋 Prerequisites

- Node.js (v18 or later)
- Supabase project with the provided schema
- Modern web browser

## 🚀 Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Locally**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## 📦 Deployment (Vercel)

1. Push this repository to GitHub
2. Import the project in Vercel
3. Select **Vite** as the framework
4. Add the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings
5. Deploy!

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── live/           # Live match tracking components
│   │   ├── EventTapBar.tsx
│   │   ├── PlayerTrackingTab.tsx
│   │   ├── SPInputPanel.tsx
│   │   ├── SetManagementTab.tsx
│   │   └── ...
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # Shared UI components
├── hooks/              # Custom React hooks
│   ├── usePlayers.ts
│   ├── useMatches.ts
│   ├── useLiveMatch.ts
│   ├── useTeamId.ts
│   └── ...
├── pages/              # Application pages
│   ├── DashboardPage.tsx
│   ├── PlayersListPage.tsx
│   ├── MatchesListPage.tsx
│   ├── LiveMatchControlPage.tsx
│   ├── TeamAdminPage.tsx
│   └── ...
├── services/           # API services
│   └── teamService.ts
├── lib/                # Utilities and configuration
│   └── supabase.ts
├── types/              # TypeScript type definitions
│   ├── db.ts           # Database types
│   ├── app.ts          # Application types
│   └── live.ts         # Live tracking types
└── contexts/           # React contexts
    └── AuthContext.tsx
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth)
- **Date Handling**: date-fns

## 🔑 Key Database Tables

- `teams`: Team information and ownership
- `team_members`: Team membership with approval status
- `profiles`: User profiles
- `players`: Player information and profiles
- `matches`: Match records with status and timestamps
- `match_players`: Player participation in matches (supports singles/doubles)
- `sets`: Set-level scores and information
- `set_player_tech_stats`: Technical statistics per set per player
- `set_player_tactical_stats`: Tactical statistics per set per player
- `set_player_physical_mental_stats`: Physical and mental ratings per set per player

## 📝 Recent Updates

### Version 0.0.1 (Current)

- ✅ **Team Management System**: Multi-team support with approval workflow
- ✅ **Live Match Tracking**: Real-time event recording with touch-optimized UI
- ✅ **Match Status Tracking**: Track match lifecycle (scheduled → in_progress → completed)
- ✅ **Enhanced Opponent Selection**: Select from player database or manual entry
- ✅ **Doubles Match Support**: Individual tracking for all players in doubles
- ✅ **Player Context in Live Tracking**: Display player info and set number during live tracking
- ✅ **Data Isolation**: Team-based data filtering across all hooks and services
- ✅ **UI/UX Improvements**: New branding, responsive design, mobile optimization
- ✅ **Bug Fixes**: Resolved TypeScript errors, fixed routing issues, improved error handling

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.
