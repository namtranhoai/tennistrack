import { PlayerStats } from '@/hooks/useMatchComparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ComparisonChartProps {
    playerStats?: PlayerStats;
    playerName: string;
}

export default function ComparisonChart({ playerStats, playerName }: ComparisonChartProps) {
    if (!playerStats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Performance Overview</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Statistics not available for comparison</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate key metrics
    const totalWinners = playerStats.forehandWinners + playerStats.backhandWinners +
        playerStats.volleyWinners + playerStats.returnWinners + playerStats.aces;
    const totalErrors = playerStats.forehandErrors + playerStats.backhandErrors + playerStats.doubleFaults;
    const winnerErrorRatio = totalErrors > 0 ? (totalWinners / totalErrors).toFixed(2) : totalWinners.toFixed(2);

    const breakPointConversion = playerStats.breakPointsTotal > 0
        ? Math.round((playerStats.breakPointsWon / playerStats.breakPointsTotal) * 100)
        : 0;

    // Performance categories for radar-like display
    const performanceMetrics = [
        { label: 'Serve', value: playerStats.firstServePercentage, max: 100, color: 'bg-blue-500' },
        { label: 'Groundstrokes', value: Math.min(100, (totalWinners / Math.max(totalErrors, 1)) * 20), max: 100, color: 'bg-green-500' },
        { label: 'Net Play', value: Math.min(100, playerStats.netPointsWon * 5), max: 100, color: 'bg-purple-500' },
        { label: 'Return', value: breakPointConversion, max: 100, color: 'bg-orange-500' },
        { label: 'Physical', value: (playerStats.speedRating + playerStats.recoveryRating) * 5, max: 100, color: 'bg-red-500' },
        { label: 'Mental', value: (playerStats.confidenceRating + playerStats.focusRating) * 5, max: 100, color: 'bg-indigo-500' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance Overview - {playerName}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Key Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{totalWinners}</p>
                        <p className="text-xs text-muted-foreground">Total Winners</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{totalErrors}</p>
                        <p className="text-xs text-muted-foreground">Total Errors</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{winnerErrorRatio}</p>
                        <p className="text-xs text-muted-foreground">Winner/Error Ratio</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{breakPointConversion}%</p>
                        <p className="text-xs text-muted-foreground">Break Point Conv.</p>
                    </div>
                </div>

                {/* Performance Bars */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700">Performance Categories</h4>
                    {performanceMetrics.map((metric) => (
                        <div key={metric.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">{metric.label}</span>
                                <span className="font-medium">{Math.round(metric.value)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`${metric.color} h-3 rounded-full transition-all duration-500`}
                                    style={{ width: `${Math.min(100, metric.value)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shot Distribution */}
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Shot Distribution</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">Aces</span>
                            <span className="font-medium text-green-600">{playerStats.aces}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">Double Faults</span>
                            <span className="font-medium text-red-600">{playerStats.doubleFaults}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">FH Winners</span>
                            <span className="font-medium text-green-600">{playerStats.forehandWinners}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">FH Errors</span>
                            <span className="font-medium text-red-600">{playerStats.forehandErrors}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">BH Winners</span>
                            <span className="font-medium text-green-600">{playerStats.backhandWinners}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">BH Errors</span>
                            <span className="font-medium text-red-600">{playerStats.backhandErrors}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">Volley Winners</span>
                            <span className="font-medium text-green-600">{playerStats.volleyWinners}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-muted-foreground">Net Points Won</span>
                            <span className="font-medium text-blue-600">{playerStats.netPointsWon}</span>
                        </div>
                    </div>
                </div>

                {/* Rally Stats */}
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Rally Performance</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xl font-bold text-gray-700">{playerStats.avgRallyLength}</p>
                            <p className="text-xs text-muted-foreground">Avg Rally Length</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                            <p className="text-xl font-bold text-green-600">{playerStats.longRalliesWon}</p>
                            <p className="text-xs text-muted-foreground">Long Rallies Won</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded">
                            <p className="text-xl font-bold text-red-600">{playerStats.longRalliesLost}</p>
                            <p className="text-xs text-muted-foreground">Long Rallies Lost</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
