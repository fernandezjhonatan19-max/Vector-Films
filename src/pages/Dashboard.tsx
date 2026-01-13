import { Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useDashboard } from '../hooks/useDashboard';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { formatCurrency, cn } from '../lib/utils';
import { useState } from 'react';

export function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const { agents, recentActivity, stats, loading } = useDashboard(selectedMonth);
    const VALOR_PUNTO = 1000;

    // Merge stats into agents
    const agentsWithPoints = agents.map(agent => ({
        ...agent,
        points: stats.find(s => s.userId === agent.id)?.points || 0
    })).sort((a, b) => b.points - a.points);

    const chartData = agentsWithPoints.map(a => ({
        name: a.full_name?.split(' ')[0] || 'User',
        points: a.points
    }));

    if (loading) {
        return <div className="text-white p-10 animate-pulse">Cargando tablero...</div>;
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Tablero de Control</h1>
                    <p className="text-muted text-sm mt-1">Resumen de rendimiento del equipo</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-surface-2 px-4 py-2 rounded-full border border-border text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    />
                </div>
            </div>

            {/* Agents Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agentsWithPoints.map((agent, index) => {
                    const isFirst = index === 0;
                    const bonus = agent.points * VALOR_PUNTO;
                    return (
                        <Card key={agent.id} className={cn("relative overflow-hidden transition-all hover:-translate-y-1", isFirst && "shadow-[0_0_30px_rgba(245,197,66,0.2)]")}>
                            {isFirst && (
                                <div className="absolute top-0 right-0 p-3">
                                    <Trophy className="h-6 w-6 text-primary animate-bounce-slow" />
                                </div>
                            )}
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {agent.avatar_url ? (
                                            <img src={agent.avatar_url} alt={agent.full_name || ''} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-muted">{agent.full_name?.[0]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{agent.full_name}</CardTitle>
                                        <p className="text-xs text-muted font-medium">{agent.title || 'Agente'}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="bg-surface-2/50 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" /> Puntos
                                        </p>
                                        <p className={cn("text-2xl font-bold", agent.points >= 0 ? "text-white" : "text-danger")}>
                                            {agent.points}
                                        </p>
                                    </div>
                                    <div className="bg-surface-2/50 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" /> Bono
                                        </p>
                                        <p className="text-xl font-bold text-success truncate">
                                            {formatCurrency(bonus > 0 ? bonus : 0)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs text-muted/60">
                                    <span>Ranking Actual</span>
                                    <span className={cn("font-bold px-2 py-0.5 rounded-full", isFirst ? "bg-primary/20 text-primary" : "bg-white/5 text-muted")}>
                                        #{index + 1}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts & Logs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PerformanceChart data={chartData} />
                <ActivityLog logs={recentActivity} />
            </div>
        </div>
    );
}

