import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users } from 'lucide-react';

interface MatchTypeDistributionProps {
    singles: number;
    doubles: number;
}

export function MatchTypeDistribution({ singles, doubles }: MatchTypeDistributionProps) {
    const data = [
        { name: 'Singles', value: singles, color: '#3b82f6' }, // blue
        { name: 'Doubles', value: doubles, color: '#8b5cf6' }, // purple
    ];

    const total = singles + doubles;

    if (total === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Match Type Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No matches recorded yet
                    </p>
                </CardContent>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / total) * 100).toFixed(1);
            return (
                <div className="bg-card border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {data.value} matches ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Match Type Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value, entry: any) => {
                                const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                                return `${value}: ${entry.payload.value} (${percentage}%)`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
