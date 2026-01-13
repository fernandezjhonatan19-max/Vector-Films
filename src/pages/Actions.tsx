import { useState } from 'react';
import { useActions } from '../hooks/useActions';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { Check, User, Search } from 'lucide-react';

export function Actions() {
    const { agents, missions, submitting, recentActions, registerAction, deleteAction } = useActions();
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');

    const handleRegister = async () => {
        if (!selectedAgentId || !selectedMissionId) return;
        const mission = missions.find(m => m.id === selectedMissionId);
        if (!mission) return;

        const success = await registerAction(selectedAgentId, mission);
        if (success) {
            setSelectedMissionId(null);
            setSelectedAgentId(null);
            // We don't need alert if it's appearing in the list below, or maybe keep it
        } else {
            alert("Error al registrar acción. Verifica tu conexión.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este registro de puntos?")) return;
        await deleteAction(id);
    };

    const filteredMissions = missions.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || m.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Centro de Acciones</h1>
                <p className="text-muted mt-1">Registra logros y penalizaciones para el equipo.</p>
            </div>

            {/* Step 1: Select Agent */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white/80 uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className="bg-primary text-black rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
                    Selecciona Agente
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {agents.map(agent => (
                        <button
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={cn(
                                "relative group p-4 rounded-xl border transition-all text-left hover:border-primary/50 flex flex-col items-center gap-3",
                                selectedAgentId === agent.id
                                    ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                                    : "bg-surface border-white/5 hover:bg-surface-2"
                            )}
                        >
                            <div className="h-16 w-16 rounded-full bg-surface-2 overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                                {agent.avatar_url ? (
                                    <img src={agent.avatar_url} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-full w-full p-4 text-muted" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className={cn("font-medium text-sm", selectedAgentId === agent.id ? "text-primary" : "text-white")}>
                                    {agent.full_name}
                                </p>
                                <p className="text-xs text-muted">{agent.title}</p>
                            </div>
                            {selectedAgentId === agent.id && (
                                <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-0.5">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Step 2: Select Mission */}
            {selectedAgentId && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white/80 uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="bg-primary text-black rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
                            Selecciona Misión
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                                <Input
                                    className="pl-9 h-9 w-[200px]"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-1 bg-surface-2 p-1 rounded-lg border border-border">
                                {(['all', 'positive', 'negative'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilterType(t)}
                                        className={cn(
                                            "px-3 py-1 text-xs rounded-md capitalize transition-colors",
                                            filterType === t ? "bg-white/10 text-white font-medium" : "text-muted hover:text-white"
                                        )}
                                    >
                                        {t === 'all' ? 'Todas' : t === 'positive' ? 'Bonos' : 'Penal.'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredMissions.map(mission => (
                            <div
                                key={mission.id}
                                onClick={() => setSelectedMissionId(mission.id)}
                                className={cn(
                                    "cursor-pointer p-4 rounded-xl border transition-all hover:-translate-y-0.5",
                                    selectedMissionId === mission.id
                                        ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(245,197,66,0.1)]"
                                        : "bg-surface border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={mission.type === 'positive' ? 'success' : 'danger'}>
                                        {mission.points > 0 ? '+' : ''}{mission.points} pts
                                    </Badge>
                                    {selectedMissionId === mission.id && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <h3 className="font-medium text-white mb-1">{mission.title}</h3>
                                <p className="text-xs text-muted">
                                    {mission.type === 'positive' ? 'Bonificación por buen rendimiento.' : 'Penalización por incumplimiento.'}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Step 3: Recent History & Deletion */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <h2 className="text-lg font-semibold text-white/80 uppercase tracking-wider text-xs flex items-center gap-2">
                    Historial Reciente (Correcciones)
                </h2>
                <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="text-left py-3 px-4 font-medium text-muted">Agente</th>
                                <th className="text-left py-3 px-4 font-medium text-muted">Misión</th>
                                <th className="text-center py-3 px-4 font-medium text-muted">Puntos</th>
                                <th className="text-right py-3 px-4 font-medium text-muted">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentActions.map(action => (
                                <tr key={action.id} className="hover:bg-white/5">
                                    <td className="py-3 px-4 text-white font-medium">{action.profiles?.full_name}</td>
                                    <td className="py-3 px-4 text-muted">{action.mission_title_snapshot}</td>
                                    <td className="py-3 px-4 text-center">
                                        <Badge variant={action.points >= 0 ? 'success' : 'danger'}>
                                            {action.points > 0 ? '+' : ''}{action.points}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleDelete(action.id)}
                                            className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {recentActions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-muted italic">
                                        No hay acciones recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-surface/80 backdrop-blur-md border-t border-white/10 flex justify-end items-center gap-4 z-50">
                <div className="mr-auto text-sm text-muted">
                    {selectedAgentId && selectedMissionId ? (
                        <span>
                            Registrando para <strong className="text-white">{agents.find(a => a.id === selectedAgentId)?.full_name}</strong>:
                            <span className="ml-1 text-primary">{missions.find(m => m.id === selectedMissionId)?.title}</span>
                        </span>
                    ) : (
                        <span>Selecciona agente y misión para continuar</span>
                    )}
                </div>
                <Button
                    size="lg"
                    disabled={!selectedAgentId || !selectedMissionId || submitting}
                    onClick={handleRegister}
                    isLoading={submitting}
                >
                    Confirmar Registro
                </Button>
            </div>
        </div>
    );
}
