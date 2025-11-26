import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, TrendingUp, Zap } from 'lucide-react';

interface PlayerStats {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    bySurface: {
        [surface: string]: {
            wins: number;
            losses: number;
            total: number;
            winRate: number;
        };
    };
    byType: {
        singles: { wins: number; losses: number; total: number; winRate: number };
        doubles: { wins: number; losses: number; total: number; winRate: number };
    };
    technicalStats: {
        avgFirstServePercentage: number;
        avgAcesPerMatch: number;
        avgDoubleFaultsPerMatch: number;
        avgWinnersPerMatch: number;
        avgUnforcedErrorsPerMatch: number;
        avgNetSuccessRate: number;
    };
}

interface ComparisonStatsGridProps {
    player1Stats: PlayerStats | null;
    player2Stats: PlayerStats | null;
    player1Name: string;
    player2Name: string;
}

function StatRow({
    label,
    value1,
    value2,
    format = 'number',
    higherIsBetter = true,
}: {
    label: string;
    value1: number;
    value2: number;
    format?: 'number' | 'percentage' | 'decimal';
    higherIsBetter?: boolean;
}) {
    const isBetter1 = higherIsBetter ? value1 > value2 : value1 < value2;
    const isBetter2 = higherIsBetter ? value2 > value1 : value2 < value1;

    const formatValue = (val: number) => {
        if (format === 'percentage') return `${val.toFixed(1)}%`;
        if (format === 'decimal') return val.toFixed(1);
        return val.toString();
    };

    return (
        <div className="grid grid-cols-7 gap-4 py-3 border-b last:border-0">
            <div
                className={`col-span-2 text-right font-medium ${isBetter1 ? 'text-green-600' : ''
                    }`}
            >
                {formatValue(value1)}
            </div>
            <div className="col-span-3 text-center text-sm text-muted-foreground">
                {label}
            </div>
            <div
                className={`col-span-2 text-left font-medium ${isBetter2 ? 'text-green-600' : ''
                    }`}
            >
                {formatValue(value2)}
            </div>
        </div>
    );
}

export function ComparisonStatsGrid({
    player1Stats,
    player2Stats,
    player1Name,
    player2Name,
}: ComparisonStatsGridProps) {
    if (!player1Stats || !player2Stats) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    Select both players to see comparison
                </CardContent>
            </Card>
        );
    }

    const surfaces = Array.from(
        new Set([
            ...Object.keys(player1Stats.bySurface),
            ...Object.keys(player2Stats.bySurface),
        ])
    );

    return (
        <div className="space-y-6">
            {/* Overall Record */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Overall Record
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Player Names Header */}
                    <div className="grid grid-cols-7 gap-4 pb-3 border-b-2 mb-3">
                        <div className="col-span-2 text-right font-bold text-blue-600">
                            {player1Name}
                        </div>
                        <div className="col-span-3 text-center font-bold"></div>
                        <div className="col-span-2 text-left font-bold text-purple-600">
                            {player2Name}
                        </div>
                    </div>

                    <StatRow
                        label="Total Matches"
                        value1={player1Stats.totalMatches}
                        value2={player2Stats.totalMatches}
                    />
                    <StatRow
                        label="Wins"
                        value1={player1Stats.wins}
                        value2={player2Stats.wins}
                    />
                    <StatRow
                        label="Losses"
                        value1={player1Stats.losses}
                        value2={player2Stats.losses}
                        higherIsBetter={false}
                    />
                    <StatRow
                        label="Win Rate"
                        value1={player1Stats.winRate}
                        value2={player2Stats.winRate}
                        format="percentage"
                    />
                </CardContent>
            </Card>

            {/* Surface Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-500" />
                        Surface Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {surfaces.map((surface) => {
                        const p1Surface = player1Stats.bySurface[surface] || {
                            winRate: 0,
                            wins: 0,
                            total: 0,
                        };
                        const p2Surface = player2Stats.bySurface[surface] || {
                            winRate: 0,
                            wins: 0,
                            total: 0,
                        };

                        return (
                            <div key={surface} className="mb-4 last:mb-0">
                                <h4 className="text-sm font-semibold mb-2 capitalize">
                                    {surface}
                                </h4>
                                <StatRow
                                    label="Win Rate"
                                    value1={p1Surface.winRate}
                                    value2={p2Surface.winRate}
                                    format="percentage"
                                />
                                <StatRow
                                    label="Wins / Total"
                                    value1={p1Surface.wins}
                                    value2={p2Surface.wins}
                                />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Match Type */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        By Match Type
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Singles</h4>
                        <StatRow
                            label="Win Rate"
                            value1={player1Stats.byType.singles.winRate}
                            value2={player2Stats.byType.singles.winRate}
                            format="percentage"
                        />
                        <StatRow
                            label="Matches Played"
                            value1={player1Stats.byType.singles.total}
                            value2={player2Stats.byType.singles.total}
                        />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Doubles</h4>
                        <StatRow
                            label="Win Rate"
                            value1={player1Stats.byType.doubles.winRate}
                            value2={player2Stats.byType.doubles.winRate}
                            format="percentage"
                        />
                        <StatRow
                            label="Matches Played"
                            value1={player1Stats.byType.doubles.total}
                            value2={player2Stats.byType.doubles.total}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Technical Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-green-500" />
                        Technical Averages
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <StatRow
                        label="1st Serve %"
                        value1={player1Stats.technicalStats.avgFirstServePercentage}
                        value2={player2Stats.technicalStats.avgFirstServePercentage}
                        format="percentage"
                    />
                    <StatRow
                        label="Aces / Match"
                        value1={player1Stats.technicalStats.avgAcesPerMatch}
                        value2={player2Stats.technicalStats.avgAcesPerMatch}
                        format="decimal"
                    />
                    <StatRow
                        label="Double Faults / Match"
                        value1={player1Stats.technicalStats.avgDoubleFaultsPerMatch}
                        value2={player2Stats.technicalStats.avgDoubleFaultsPerMatch}
                        format="decimal"
                        higherIsBetter={false}
                    />
                    <StatRow
                        label="Winners / Match"
                        value1={player1Stats.technicalStats.avgWinnersPerMatch}
                        value2={player2Stats.technicalStats.avgWinnersPerMatch}
                        format="decimal"
                    />
                    <StatRow
                        label="Unforced Errors / Match"
                        value1={player1Stats.technicalStats.avgUnforcedErrorsPerMatch}
                        value2={player2Stats.technicalStats.avgUnforcedErrorsPerMatch}
                        format="decimal"
                        higherIsBetter={false}
                    />
                    <StatRow
                        label="Net Success %"
                        value1={player1Stats.technicalStats.avgNetSuccessRate}
                        value2={player2Stats.technicalStats.avgNetSuccessRate}
                        format="percentage"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
