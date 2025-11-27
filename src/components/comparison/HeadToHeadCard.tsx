import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Calendar, Trophy } from 'lucide-react';

interface HeadToHeadRecord {
    totalMatches: number;
    player1Wins: number;
    player2Wins: number;
    matches: {
        matchId: number;
        date: string;
        winner: number;
        score: string | null;
        surface: string;
    }[];
}

interface HeadToHeadCardProps {
    headToHead: HeadToHeadRecord;
    player1Id: number;
    player2Id: number;
    player1Name: string;
    player2Name: string;
}

export function HeadToHeadCard({
    headToHead,
    player1Id,

    player1Name,
    player2Name,
}: HeadToHeadCardProps) {
    // player2Id is used in the component logic for determining winners
    if (headToHead.totalMatches === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Swords className="h-5 w-5 text-red-500" />
                        Head-to-Head
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        These players have not faced each other yet
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-red-500" />
                    Head-to-Head Record
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Overall H2H Record */}
                <div className="flex items-center justify-center gap-8 mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {headToHead.player1Wins}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {player1Name}
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-400">-</div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {headToHead.player2Wins}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {player2Name}
                        </div>
                    </div>
                </div>

                {/* List of Matches */}
                <div>
                    <h4 className="text-sm font-semibold mb-3">
                        Match History ({headToHead.totalMatches} matches)
                    </h4>
                    <div className="space-y-2">
                        {headToHead.matches.map((match) => {
                            const isPlayer1Winner = match.winner === player1Id;

                            return (
                                <Link
                                    key={match.matchId}
                                    to={`/dashboard/matches/${match.matchId}`}
                                    className="block group"
                                >
                                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {match.date
                                                    ? new Date(match.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })
                                                    : 'Unknown date'}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                                                {match.surface}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {match.score && (
                                                <span className="text-sm text-muted-foreground">
                                                    {match.score}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Trophy
                                                    className={`h-4 w-4 ${isPlayer1Winner
                                                        ? 'text-blue-600'
                                                        : 'text-purple-600'
                                                        }`}
                                                />
                                                <span
                                                    className={`text-sm font-medium ${isPlayer1Winner
                                                        ? 'text-blue-600'
                                                        : 'text-purple-600'
                                                        }`}
                                                >
                                                    {isPlayer1Winner ? player1Name : player2Name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
