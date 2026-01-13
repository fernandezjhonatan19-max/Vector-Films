import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Mission } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Wand2, Target } from 'lucide-react';

export function Missions() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [newMission, setNewMission] = useState({ title: '', points: 5, type: 'positive' as 'positive' | 'negative', target_title: '' });

    const fetchMissions = async () => {
        if (!import.meta.env.VITE_SUPABASE_URL) {
            // Mock
            setMissions([
                { id: 'm1', title: 'Excelente Video', points: 10, type: 'positive', target_title: null, is_active: true, created_at: '' },
                { id: 'm2', title: 'Retraso Grave', points: -10, type: 'negative', target_title: null, is_active: true, created_at: '' }
            ]);
            return;
        }
        const { data } = await supabase.from('missions').select('*').eq('is_active', true).order('created_at');
        if (data) setMissions(data);
    };

    useEffect(() => { fetchMissions(); }, []);

    const handleCreate = async () => {
        if (!newMission.title) return;
        if (import.meta.env.VITE_SUPABASE_URL) {
            const pointsValue = Number(newMission.points);
            const finalPoints = newMission.type === 'negative' ? -Math.abs(pointsValue) : Math.abs(pointsValue);

            const { error } = await supabase.from('missions').insert({
                title: newMission.title,
                points: finalPoints,
                type: newMission.type,
                target_title: newMission.target_title || null
            });
            if (error) {
                alert("Error al guardar misión: " + error.message);
            } else {
                fetchMissions();
            }
        } else {
            alert("Demo Mode: Mission Created locally (refresh will reset)");
            setMissions([...missions, { ...newMission, id: Math.random().toString(), is_active: true, created_at: '' }]);
        }
        setNewMission({ title: '', points: 5, type: 'positive', target_title: '' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar esta misión?')) return;

        if (import.meta.env.VITE_SUPABASE_URL) {
            await supabase.from('missions').update({ is_active: false }).eq('id', id);
            fetchMissions();
        } else {
            setMissions(missions.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Control de Misiones</h1>
                    <p className="text-muted text-sm mt-1">Configura las reglas del juego y puntajes.</p>
                </div>
                <Button variant="secondary" className="gap-2 text-primary border-primary/20 bg-primary/10 hover:bg-primary/20 w-full md:w-auto">
                    <Wand2 className="h-4 w-4" /> Asistente IA
                </Button>
            </div>

            {/* Create Form */}
            <Card className="p-6 border-primary/20 bg-surface-2/50">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Crear Nueva Misión
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6 space-y-2">
                        <label className="text-xs text-muted">Título de la misión</label>
                        <Input
                            placeholder="Ej: Entregar reporte a tiempo..."
                            value={newMission.title}
                            onChange={e => setNewMission({ ...newMission, title: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs text-muted">Puntos</label>
                        <Input
                            type="number"
                            value={newMission.points}
                            onChange={e => setNewMission({ ...newMission, points: Number(e.target.value) })}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs text-muted">Tipo</label>
                        <select
                            className="flex h-10 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={newMission.type}
                            onChange={e => setNewMission({ ...newMission, type: e.target.value as any })}
                        >
                            <option value="positive">Bonificación</option>
                            <option value="negative">Penalización</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs text-muted">Cargo</label>
                        <select
                            className="flex h-10 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={newMission.target_title}
                            onChange={e => setNewMission({ ...newMission, target_title: e.target.value })}
                        >
                            <option value="">General</option>
                            <option value="Editor">Editor</option>
                            <option value="Community">Community Manager</option>
                            <option value="Diseñador">Diseñador</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <Button className="w-full" onClick={handleCreate}>Guardar</Button>
                    </div>
                </div>
            </Card>

            {/* Missions List */}
            <div className="space-y-2">
                {missions.map(mission => (
                    <div key={mission.id} className="flex items-center justify-between p-4 bg-surface border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${mission.type === 'positive' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{mission.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted">Creada el {new Date().toLocaleDateString()}</span>
                                    {mission.target_title && (
                                        <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 border-primary/30 text-primary/80">
                                            {mission.target_title}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <Badge variant={mission.type === 'positive' ? 'success' : 'danger'}>
                                {mission.points} pts
                            </Badge>
                            <button className="text-muted hover:text-danger transition-colors" onClick={() => handleDelete(mission.id)}>
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
