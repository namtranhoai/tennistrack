import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ChooseTeamPage from './pages/ChooseTeamPage';
import WaitingForApprovalPage from './pages/WaitingForApprovalPage';
import TeamAdminPage from './pages/TeamAdminPage';
import DashboardPage from './pages/DashboardPage';
import PlayersListPage from './pages/PlayersListPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import MatchesListPage from './pages/MatchesListPage';
import MatchNewPage from './pages/MatchNewPage';
import MatchEditPage from './pages/MatchEditPage';
import MatchDetailPage from './pages/MatchDetailPage';
import MatchComparisonPage from './pages/MatchComparisonPage';
import PlayerComparisonPage from './pages/PlayerComparisonPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/choose-team" element={<ChooseTeamPage />} />
                    <Route path="/waiting-for-approval" element={<WaitingForApprovalPage />} />

                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                        <Route index element={<DashboardPage />} />
                        <Route path="players" element={<PlayersListPage />} />
                        <Route path="players/:id" element={<PlayerDetailPage />} />
                        <Route path="compare" element={<PlayerComparisonPage />} />
                        <Route path="matches" element={<MatchesListPage />} />
                        <Route path="matches/new" element={<MatchNewPage />} />
                        <Route path="matches/:id/edit" element={<MatchEditPage />} />
                        <Route path="matches/:id" element={<MatchDetailPage />} />
                        <Route path="matches/:id/compare" element={<MatchComparisonPage />} />
                        <Route path="team/admin" element={<TeamAdminPage />} />
                    </Route>

                    {/* Redirect unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
