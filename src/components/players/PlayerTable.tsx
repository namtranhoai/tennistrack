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
import { Database } from '@/types/db';
import { PlayerAvatar } from './PlayerAvatar';

type Player = Database['public']['Tables']['players']['Row'];

interface PlayerTableProps {
    players: Player[] | undefined;
    isLoading: boolean;
    onEdit: (player: Player) => void;
}

export function PlayerTable({ players, isLoading, onEdit }: PlayerTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Dominant Hand</TableHead>
                        <TableHead>Backhand</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : players?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                                No players found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        players?.map((player) => (
                            <TableRow key={player.player_id}>
                                <TableCell>
                                    <PlayerAvatar
                                        url={player.avatar_url}
                                        alt={player.full_name}
                                        size="sm"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{player.full_name}</TableCell>
                                <TableCell className="capitalize">{player.gender || '-'}</TableCell>
                                <TableCell>{player.level || '-'}</TableCell>
                                <TableCell className="capitalize">{player.dominant_hand || '-'}</TableCell>
                                <TableCell className="capitalize">{player.backhand_type || '-'}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(player)}
                                    >
                                        Edit
                                    </Button>
                                    <Link to={`/dashboard/players/${player.player_id}`}>
                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
