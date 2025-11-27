import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MatchWithPlayer } from '@/types/extended';
import { Users, User } from 'lucide-react';

interface MatchListProps {
    matches: MatchWithPlayer[] | undefined;
    isLoading: boolean;
}

export function MatchList({ matches, isLoading }: MatchListProps) {
    // Helper to get tracked players (side A)
    const getTrackedPlayers = (matchPlayers: MatchWithPlayer['match_players']) => {
        return matchPlayers.filter(mp => mp.is_tracked && mp.side === 'A');
    };

    // Helper to get opponents (side B or non-tracked)
    const getOpponents = (matchPlayers: MatchWithPlayer['match_players']) => {
        return matchPlayers.filter(mp => mp.side === 'B' || !mp.is_tracked);
    };

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Player / Partner</TableHead>
                        <TableHead>Opponent(s)</TableHead>
                        <TableHead>Surface</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center h-24">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : matches?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center h-24">
                                No matches found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        matches?.map((match) => {
                            const trackedPlayers = getTrackedPlayers(match.match_players);
                            const opponents = getOpponents(match.match_players);
                            const isDoubles = match.format === 'doubles' || trackedPlayers.length > 1;

                            return (
                                <TableRow key={match.match_id}>
                                    <TableCell>
                                        {match.match_date ? new Date(match.match_date).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2" title={isDoubles ? "Doubles" : "Singles"}>
                                            {isDoubles ? <Users className="h-4 w-4 text-blue-500" /> : <User className="h-4 w-4 text-gray-500" />}
                                            <span className="capitalize text-xs text-muted-foreground">{match.format || 'singles'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {trackedPlayers.length > 0 ? (
                                            trackedPlayers.map((player, idx) => (
                                                <div key={player.match_player_id}>
                                                    {player.players?.full_name || player.display_name}
                                                    {idx < trackedPlayers.length - 1 && <span className="text-xs text-muted-foreground"> + </span>}
                                                </div>
                                            ))
                                        ) : (
                                            <div>Unknown</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {opponents.length > 0 ? (
                                            opponents.map((opp, idx) => (
                                                <span key={opp.match_player_id}>
                                                    {opp.players?.full_name || opp.display_name}
                                                    {idx < opponents.length - 1 && ' + '}
                                                </span>
                                            ))
                                        ) : (
                                            'Unknown'
                                        )}
                                    </TableCell>
                                    <TableCell className="capitalize">{match.surface || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${match.final_result === 'win'
                                            ? 'bg-green-100 text-green-800'
                                            : match.final_result === 'loss'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {match.final_result?.toUpperCase() || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{match.score_line || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/dashboard/matches/${match.match_id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
