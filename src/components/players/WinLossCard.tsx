import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target } from 'lucide-react';

interface WinLossCardProps {
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
    singleStats: { wins: number; losses: number; total: number };
    doublesStats: { wins: number; losses: number; total: number };
}

export function WinLossCard({ wins, losses, totalMatches, winRate, singleStats, doublesStats }: WinLossCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Win/Loss Record
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Overall Stats */}
                <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                        <span className="text-green-600">{wins}</span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-red-600">{losses}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Matches: {totalMatches}</p>
                </div>

                {/* Win Rate Circle */}
                <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 56}`}
                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - winRate / 100)}`}
                                className="text-green-500 transition-all duration-1000"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                                <div className="text-xs text-muted-foreground">Win Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breakdown by Type */}
                <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Singles</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium">{singleStats.wins}</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-red-600 font-medium">{singleStats.losses}</span>
                            {singleStats.total > 0 && (
                                <span className="text-muted-foreground ml-2">
                                    ({((singleStats.wins / singleStats.total) * 100).toFixed(0)}%)
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">Doubles</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium">{doublesStats.wins}</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-red-600 font-medium">{doublesStats.losses}</span>
                            {doublesStats.total > 0 && (
                                <span className="text-muted-foreground ml-2">
                                    ({((doublesStats.wins / doublesStats.total) * 100).toFixed(0)}%)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
