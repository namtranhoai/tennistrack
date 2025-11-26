import { PlayerInfo } from '@/hooks/useMatchComparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface PlayerComparisonCardProps {
    player: PlayerInfo;
    isWinner?: boolean;
}

export default function PlayerComparisonCard({ player, isWinner }: PlayerComparisonCardProps) {
    const hasStats = !!player.stats;

    const getRoleColor = () => {
        switch (player.role) {
            case 'player':
                return 'bg-indigo-100 text-indigo-800';
            case 'partner':
                return 'bg-blue-100 text-blue-800';
            case 'opponent':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = () => {
        switch (player.role) {
            case 'player':
                return 'You';
            case 'partner':
                return 'Partner';
            case 'opponent':
                return 'Opponent';
            default:
                return '';
        }
    };

    return (
        <Card className={`${isWinner ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{player.name}</CardTitle>
                    </div>
                    {isWinner && <Award className="h-5 w-5 text-green-600" />}
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor()} w-fit`}>
                    {getRoleLabel()}
                </span>
            </CardHeader>

            <CardContent>
                {!hasStats || !player.stats ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <p>Detailed statistics not available</p>
                        <p className="text-xs mt-1">Only tracked for main player</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Serve Performance */}
                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-indigo-600">Serve</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Aces</span>
                                    <span className="font-medium flex items-center">
                                        {player.stats.aces}
                                        <TrendingUp className="h-3 w-3 ml-1 text-green-600" />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Double Faults</span>
                                    <span className="font-medium flex items-center">
                                        {player.stats.doubleFaults}
                                        <TrendingDown className="h-3 w-3 ml-1 text-red-600" />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">1st Serve %</span>
                                    <span className="font-medium">{player.stats.firstServePercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${player.stats.firstServePercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Groundstrokes */}
                        <div className="pt-3 border-t">
                            <h4 className="text-sm font-semibold mb-2 text-indigo-600">Groundstrokes</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Forehand</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-600 text-xs">W: {player.stats.forehandWinners}</span>
                                        <span className="text-red-600 text-xs">E: {player.stats.forehandErrors}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Backhand</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-600 text-xs">W: {player.stats.backhandWinners}</span>
                                        <span className="text-red-600 text-xs">E: {player.stats.backhandErrors}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net & Return */}
                        <div className="pt-3 border-t">
                            <h4 className="text-sm font-semibold mb-2 text-indigo-600">Net & Return</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Net Points Won</span>
                                    <span className="font-medium">{player.stats.netPointsWon}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Return Winners</span>
                                    <span className="font-medium">{player.stats.returnWinners}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Break Points</span>
                                    <span className="font-medium">
                                        {player.stats.breakPointsWon}/{player.stats.breakPointsTotal}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Physical/Mental */}
                        <div className="pt-3 border-t">
                            <h4 className="text-sm font-semibold mb-2 text-indigo-600">Performance Ratings</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-muted-foreground">Speed</span>
                                    <div className="flex items-center mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full"
                                                style={{ width: `${player.stats.speedRating * 10}%` }}
                                            />
                                        </div>
                                        <span className="font-medium">{player.stats.speedRating}/10</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Recovery</span>
                                    <div className="flex items-center mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                            <div
                                                className="bg-green-600 h-1.5 rounded-full"
                                                style={{ width: `${player.stats.recoveryRating * 10}%` }}
                                            />
                                        </div>
                                        <span className="font-medium">{player.stats.recoveryRating}/10</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Confidence</span>
                                    <div className="flex items-center mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                            <div
                                                className="bg-purple-600 h-1.5 rounded-full"
                                                style={{ width: `${player.stats.confidenceRating * 10}%` }}
                                            />
                                        </div>
                                        <span className="font-medium">{player.stats.confidenceRating}/10</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Focus</span>
                                    <div className="flex items-center mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                            <div
                                                className="bg-orange-600 h-1.5 rounded-full"
                                                style={{ width: `${player.stats.focusRating * 10}%` }}
                                            />
                                        </div>
                                        <span className="font-medium">{player.stats.focusRating}/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
