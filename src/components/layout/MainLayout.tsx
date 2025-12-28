import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Menu, X, GitCompare, LogOut, Settings, Radio } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile, teamMembership, signOut } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Players', href: '/dashboard/players', icon: Users },
        { name: 'Matches', href: '/dashboard/matches', icon: Trophy },
        { name: 'Live Tracking', href: '/dashboard/live', icon: Radio },
        { name: 'Compare Players', href: '/dashboard/compare', icon: GitCompare },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 relative">
                    <img src="/logo.png" alt="TennisCoach" className="h-12" />
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100 absolute right-4"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-indigo-700" : "text-gray-400")} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Team Admin Link (only for admins) */}
                    {teamMembership?.role === 'admin' && (
                        <Link
                            to="/dashboard/team/admin"
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                location.pathname === '/dashboard/team/admin'
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Settings className={cn("w-5 h-5 mr-3", location.pathname === '/dashboard/team/admin' ? "text-indigo-700" : "text-gray-400")} />
                            Team Admin
                        </Link>
                    )}
                </nav>

                {/* User Profile Section */}
                <div className="border-t border-gray-200 p-4">
                    <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Team</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {teamMembership?.teams?.name || 'No Team'}
                        </p>
                    </div>
                    <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">User</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {profile?.full_name || user?.email || 'User'}
                        </p>
                        {teamMembership?.role === 'admin' && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#a3cf08] text-[#132d24] rounded">
                                Admin
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <img src="/logo.png" alt="TennisCoach" className="h-8" />
                        <div className="w-6" /> {/* Spacer for centering if needed */}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
