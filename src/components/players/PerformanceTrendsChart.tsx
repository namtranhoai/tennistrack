import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceTrendsChartProps {
    monthlyTrends: {
        month: string;
        wins: number;
        losses: number;
        winRate: number;
        firstServePercentage: number;
        unforcedErrors: number;
    }[];
}

export function PerformanceTrendsChart({ monthlyTrends }: PerformanceTrendsChartProps) {
    if (monthlyTrends.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Performance Trends
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No data available for trends
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Format month labels (e.g., "2024-01" -> "Jan '24")
    const formattedData = monthlyTrends.map((item) => {
        const [year, month] = item.month.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthLabel = `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;

        return {
            ...item,
            monthLabel,
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Performance Trends
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="monthLabel"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="winRate"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Win Rate (%)"
                            dot={{ fill: '#10b981', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="firstServePercentage"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="1st Serve (%)"
                            dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="unforcedErrors"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="Avg UE/Match"
                            dot={{ fill: '#ef4444', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
