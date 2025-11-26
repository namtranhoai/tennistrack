import { useState, useMemo } from 'react';
import { usePlayers, useCreatePlayer, useUpdatePlayer } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { PlayerTable } from '@/components/players/PlayerTable';
import { PlayerForm } from '@/components/players/PlayerForm';
import { Pagination } from '@/components/ui/Pagination';

type SortField = 'name' | 'ranking' | 'date';
type SortOrder = 'asc' | 'desc';

export default function PlayersListPage() {
    const { data: players, isLoading } = usePlayers();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<any>(null);
    const [sortBy, setSortBy] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Filter and sort players
    const processedPlayers = useMemo(() => {
        if (!players) return [];

        // Filter by search term
        let filtered = players.filter(player =>
            player.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'name':
                    comparison = a.full_name.localeCompare(b.full_name);
                    break;
                default:
                    comparison = a.full_name.localeCompare(b.full_name);
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [players, searchTerm, sortBy, sortOrder]);

    // Paginate
    const totalPages = Math.ceil(processedPlayers.length / itemsPerPage);
    const paginatedPlayers = processedPlayers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (count: number) => {
        setItemsPerPage(count);
        setCurrentPage(1);
    };

    const handleAdd = () => {
        setEditingPlayer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (player: any) => {
        setEditingPlayer(player);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingPlayer(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Players</h2>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Player
                </Button>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search players..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2 min-w-[180px]">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-');
                            setSortBy(field as SortField);
                            setSortOrder(order as SortOrder);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                    </select>
                </div>
            </div>

            <PlayerTable
                players={paginatedPlayers}
                isLoading={isLoading}
                onEdit={handleEdit}
            />

            {!isLoading && processedPlayers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={processedPlayers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}

            {!isLoading && processedPlayers.length === 0 && players && players.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No players found matching your search.
                </div>
            )}

            {isModalOpen && (
                <PlayerModal
                    onClose={handleClose}
                    initialData={editingPlayer}
                />
            )}
        </div>
    );
}

function PlayerModal({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
    const createPlayer = useCreatePlayer();
    const updatePlayer = useUpdatePlayer();
    const isEditing = !!initialData;

    const onSubmit = (data: any) => {
        if (isEditing) {
            updatePlayer.mutate({ id: initialData.player_id, updates: data }, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            createPlayer.mutate(data, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
                <h3 className="text-lg font-bold">{isEditing ? 'Edit Player' : 'Add New Player'}</h3>
                <PlayerForm
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    isSubmitting={createPlayer.isPending || updatePlayer.isPending}
                    initialData={initialData}
                />
            </div>
        </div>
    );
}
