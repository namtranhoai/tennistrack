import { Link } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, Trophy } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#132d24] via-[#1a3d32] to-[#132d24]">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#a3cf08] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a3cf08] rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    {/* Logo */}
                    <div className="text-center mb-12 animate-fade-in">
                        <img src="/logo.png" alt="TenniTrack" className="h-32 mx-auto mb-8" />
                    </div>

                    {/* Hero Content */}
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Track Your Tennis Journey
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
                            Professional match tracking, player statistics, and team management
                            all in one powerful platform
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/signup"
                                className="group relative px-8 py-4 bg-[#a3cf08] text-[#132d24] font-bold text-lg rounded-lg hover:bg-[#8fb507] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                            >
                                <span className="relative z-10">Get Started Free</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity"></div>
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 w-full sm:w-auto"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative bg-white/5 backdrop-blur-sm py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-300">
                            Powerful features to elevate your tennis game
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-[#a3cf08]/50 hover:shadow-2xl hover:shadow-[#a3cf08]/20 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#a3cf08] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="w-8 h-8 text-[#132d24]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Match Tracking</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Record detailed match statistics including scores, sets, and performance metrics
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-[#a3cf08]/50 hover:shadow-2xl hover:shadow-[#a3cf08]/20 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#a3cf08] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="w-8 h-8 text-[#132d24]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Player Analytics</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Track player progress with comprehensive statistics and performance insights
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-[#a3cf08]/50 hover:shadow-2xl hover:shadow-[#a3cf08]/20 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#a3cf08] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-8 h-8 text-[#132d24]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Team Management</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Organize your team, manage members, and collaborate seamlessly
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-[#a3cf08]/50 hover:shadow-2xl hover:shadow-[#a3cf08]/20 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#a3cf08] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Trophy className="w-8 h-8 text-[#132d24]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Performance Comparison</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Compare players and matches to identify strengths and areas for improvement
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Tracking?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Join teams already using TenniTrack to improve their game
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-5 bg-[#a3cf08] text-[#132d24] font-bold text-xl rounded-lg hover:bg-[#8fb507] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                    >
                        Create Your Free Account
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-400">
                        © 2025 TenniTrack. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
