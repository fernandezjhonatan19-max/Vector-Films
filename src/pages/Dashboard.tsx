import { Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useDashboard } from '../hooks/useDashboard';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { formatCurrency, cn } from '../lib/utils';

export function Dashboard() {
    const { agents, recentActivity, stats, loading } = useDashboard();
    const VALOR_PUNTO = 1000;

    const QUOTES = [
        { q: "La creatividad es la inteligencia divirtiéndose.", a: "Albert Einstein" },
        { q: "El único modo de hacer un gran trabajo es amar lo que haces.", a: "Steve Jobs" },
        { q: "La excelencia no es un acto, es un hábito.", a: "Aristóteles" },
        { q: "Si puedes soñarlo, puedes hacerlo.", a: "Walt Disney" },
        { q: "El éxito es ir de fracaso en fracaso sin perder el entusiasmo.", a: "Winston Churchill" },
        { q: "No cuentes los días, haz que los días cuenten.", a: "Muhammad Ali" },
        { q: "La mejor forma de predecir el futuro es crearlo.", a: "Peter Drucker" }
    ];

    const { q: quote, a: author } = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

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
                <div className="text-sm font-medium bg-surface-2 px-4 py-2 rounded-full border border-border text-primary/80">
                    {new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Quote Section */}
            <Card className="bg-gradient-to-br from-surface to-surface-2 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-9xl font-serif text-primary">"</span>
                </div>
                <CardContent className="p-10 text-center relative z-10">
                    <p className="text-2xl font-light italic text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
                        "{quote}"
                    </p>
                    <p className="text-xs text-primary font-bold tracking-[0.2em] uppercase">— {author}</p>
                </CardContent>
            </Card>

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
