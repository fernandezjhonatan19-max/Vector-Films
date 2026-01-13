import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Archive, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function History() {
    const handleCloseMonth = async () => {
        if (!confirm("¿Estás seguro de cerrar el mes actual? Esto archivará los puntajes y reiniciará el tablero.")) return;

        // Call RPC
        const currentMonth = new Date().toISOString().slice(0, 7);
        const { error } = await supabase.rpc('close_month', { p_month_tag: currentMonth });

        if (error) {
            alert("Error al cerrar mes: " + error.message);
        } else {
            alert("Mes cerrado correctamente.");
            // Reload or redirect
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Historial y Cierre</h1>
                    <p className="text-muted mt-1">Consulta rendimiento histórico y archiva periodos.</p>
                </div>
                <Button variant="danger" className="gap-2" onClick={handleCloseMonth}>
                    <AlertTriangle className="h-4 w-4" /> Cerrar Mes Actual
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px] text-muted space-y-4">
                            <Archive className="h-16 w-16 opacity-20" />
                            <p>Selecciona un mes archivado para ver el reporte detallado.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-white px-2">Archivos Mensuales</h3>
                    <div className="space-y-2">
                        {['2025-12', '2025-11', '2025-10'].map(month => (
                            <button key={month} className="w-full flex items-center justify-between p-4 bg-surface border border-white/5 rounded-xl hover:bg-surface-2 transition-colors group">
                                <span className="font-mono text-primary group-hover:text-white transition-colors">{month}</span>
                                <span className="text-xs text-muted">Cerrado por Admin</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
