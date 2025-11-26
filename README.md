# Tennis Tracking App

A React application for tracking tennis match statistics, built with Vite, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Dashboard**: Overview of players and match statistics.
- **Players**: Manage player profiles and view match history.
- **Matches**: Record match details, set scores, and technical statistics.
- **Stats**: Track serve percentages, winners, errors, and more.

## Prerequisites

- Node.js (v18 or later)
- Supabase project with the provided schema.

## Setup

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

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Select **Vite** as the framework.
4. Add the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
5. Deploy!

## Project Structure

- `src/components`: Reusable UI components and layout.
- `src/hooks`: Custom React hooks for data fetching (Supabase + React Query).
- `src/pages`: Application pages (Dashboard, Players, Matches).
- `src/lib`: Supabase client and utilities.
- `src/types`: TypeScript definitions for Database and App types.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State/Data**: React Query (@tanstack/react-query)
- **Backend**: Supabase (PostgreSQL)
