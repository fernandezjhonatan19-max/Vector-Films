import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save } from 'lucide-react';

export function Settings() {
    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Ajustes</h1>
                <p className="text-muted mt-1">Configuración global del sistema Team Pulse.</p>
            </div>

            <Card>
                <CardContent className="p-8 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-white/5 pb-2">Valores y Reglas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted">Valor por Punto (COP)</label>
                                <Input type="number" defaultValue={1000} />
                                <p className="text-xs text-muted/60">Monto monetario equivalente a 1 punto.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted">Tope Mensual de Puntos</label>
                                <Input type="number" defaultValue={5000} />
                                <p className="text-xs text-muted/60">Límite máximo de puntos canjeables por mes.</p>
                            </div>
                        </div>
                    </section>


                    <section className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg border border-white/5">
                            <div>
                                <h4 className="font-medium text-white">Modo Estricto de Penalizaciones</h4>
                                <p className="text-xs text-muted">Requiere una nota obligatoria al registrar penalizaciones.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </section>

                    <div className="pt-4 flex justify-end">
                        <Button className="gap-2 px-8">
                            <Save className="h-4 w-4" /> Guardar Cambios
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
