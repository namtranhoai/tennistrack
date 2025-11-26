import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '@/hooks/useMatches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Search, ArrowUpDown } from 'lucide-react';
import { MatchList } from '@/components/matches/MatchList';
import { Pagination } from '@/components/ui/Pagination';

type SortField = 'date' | 'result' | 'surface';
type SortOrder = 'asc' | 'desc';

export default function MatchesListPage() {
    const { data: matches, isLoading } = useMatches();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSurface, setFilterSurface] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Filter and sort matches
    const processedMatches = useMemo(() => {
        if (!matches) return [];

        // Filter
        let filtered = matches.filter(match => {
            // Surface filter
            if (filterSurface !== 'all' && match.surface !== filterSurface) return false;

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();

                // Search in player names
                const playerNames = match.match_players
                    ?.map(mp => mp.players?.full_name || mp.display_name)
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase() || '';

                // Search in location and tournament
                const location = (match.location || '').toLowerCase();
                const tournament = (match.tournament_name || '').toLowerCase();

                if (!playerNames.includes(searchLower) &&
                    !location.includes(searchLower) &&
                    !tournament.includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.match_date).getTime() - new Date(b.match_date).getTime();
                    break;
                case 'result':
                    const resultOrder = { 'win': 1, 'loss': 2, 'retired': 3 };
                    comparison = (resultOrder[a.final_result as keyof typeof resultOrder] || 99) -
                        (resultOrder[b.final_result as keyof typeof resultOrder] || 99);
                    break;
                case 'surface':
                    comparison = (a.surface || '').localeCompare(b.surface || '');
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [matches, searchTerm, filterSurface, sortBy, sortOrder]);

    // Paginate
    const totalPages = Math.ceil(processedMatches.length / itemsPerPage);
    const paginatedMatches = processedMatches.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSurfaceChange = (value: string) => {
        setFilterSurface(value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (count: number) => {
        setItemsPerPage(count);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Matches</h2>
                <Link to="/matches/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Match
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by player name, location, or tournament..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                {/* Surface Filter */}
                <div className="flex items-center space-x-2 min-w-[180px]">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={filterSurface}
                        onChange={(e) => handleSurfaceChange(e.target.value)}
                    >
                        <option value="all">All Surfaces</option>
                        <option value="hard">Hard</option>
                        <option value="clay">Clay</option>
                        <option value="grass">Grass</option>
                        <option value="carpet">Carpet</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2 min-w-[150px]">
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
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="result-asc">Wins First</option>
                        <option value="result-desc">Losses First</option>
                        <option value="surface-asc">Surface A-Z</option>
                        <option value="surface-desc">Surface Z-A</option>
                    </select>
                </div>
            </div>

            <MatchList matches={paginatedMatches} isLoading={isLoading} />

            {!isLoading && processedMatches.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={processedMatches.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}

            {!isLoading && processedMatches.length === 0 && matches && matches.length > 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No matches found matching your filters.
                </div>
            )}
        </div>
    );
}
