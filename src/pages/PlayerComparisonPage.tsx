import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePlayerComparison } from '@/hooks/usePlayerComparison';
import { PlayerSelector } from '@/components/comparison/PlayerSelector';
import { ComparisonStatsGrid } from '@/components/comparison/ComparisonStatsGrid';
import { HeadToHeadCard } from '@/components/comparison/HeadToHeadCard';
import { Card, CardContent } from '@/components/ui/card';
import { UserX, Users } from 'lucide-react';

export default function PlayerComparisonPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [player1Id, setPlayer1Id] = useState<number | undefined>(
        searchParams.get('player1') ? Number(searchParams.get('player1')) : undefined
    );
    const [player2Id, setPlayer2Id] = useState<number | undefined>(
        searchParams.get('player2') ? Number(searchParams.get('player2')) : undefined
    );

    const { data: comparison, isLoading } = usePlayerComparison(player1Id, player2Id);

    // Update URL when players change
    useEffect(() => {
        const params = new URLSearchParams();
        if (player1Id) params.set('player1', player1Id.toString());
        if (player2Id) params.set('player2', player2Id.toString());
        setSearchParams(params, { replace: true });
    }, [player1Id, player2Id, setSearchParams]);

    const handlePlayer1Select = (id: number | undefined) => {
        setPlayer1Id(id);
    };

    const handlePlayer2Select = (id: number | undefined) => {
        setPlayer2Id(id);
    };

    const showComparison = player1Id && player2Id && comparison?.player1 && comparison?.player2;
    const samePlayer = player1Id === player2Id && player1Id !== undefined;

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#132d24] via-[#1a4030] to-[#a3cf08] p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Users className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Player Comparison</h1>
                            <p className="text-[#a3cf08] mt-1 font-medium">
                                Compare performance between any 2 players
                            </p>
                        </div>
                    </div>
                    <p className="text-white/90 max-w-2xl">
                        Select two players to analyze their overall statistics, head-to-head record, and performance across different surfaces and match types.
                    </p>
                </div>
            </div>

            {/* Player Selectors */}
            <div className="grid md:grid-cols-2 gap-6">
                <PlayerSelector
                    selectedPlayerId={player1Id}
                    onSelect={handlePlayer1Select}
                    label="Player 1"
                    excludePlayerId={player2Id}
                />
                <PlayerSelector
                    selectedPlayerId={player2Id}
                    onSelect={handlePlayer2Select}
                    label="Player 2"
                    excludePlayerId={player1Id}
                />
            </div>

            {/* Same Player Error */}
            {samePlayer && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 flex items-center gap-3 text-red-800">
                        <UserX className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">
                            Please select two different players to compare
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {isLoading && player1Id && player2Id && !samePlayer && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                        <p className="text-muted-foreground">Loading comparison data...</p>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!player1Id && !player2Id && !isLoading && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">No Players Selected</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Select two players from the dropdowns above to start comparing their performance statistics
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Partial Selection */}
            {((player1Id && !player2Id) || (!player1Id && player2Id)) && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">Select Both Players</h3>
                        <p className="text-muted-foreground">
                            Please select a second player to see the comparison
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Comparison Display */}
            {showComparison && !samePlayer && (
                <div className="space-y-6">
                    {/* Head-to-Head */}
                    <HeadToHeadCard
                        headToHead={comparison.headToHead}
                        player1Id={player1Id!}
                        player2Id={player2Id!}
                        player1Name={comparison.player1.playerName}
                        player2Name={comparison.player2.playerName}
                    />

                    {/* Stats Comparison */}
                    <ComparisonStatsGrid
                        player1Stats={comparison.player1}
                        player2Stats={comparison.player2}
                        player1Name={comparison.player1.playerName}
                        player2Name={comparison.player2.playerName}
                    />

                    {/* Info Note */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                            <span className="font-semibold">Note:</span> Statistics are calculated
                            based on all recorded matches for each player. Technical stats are
                            averaged across all sets where data is available.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
