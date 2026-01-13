import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { ActionLedger } from '../../types';
import { Badge } from '../ui/Badge';

interface ActivityLogProps {
    logs: ActionLedger[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
    return (
        <Card className="col-span-1 h-full">
            <CardHeader>
                <CardTitle>Bitácora de Vuelo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.length === 0 ? (
                        <p className="text-sm text-muted text-center py-8">Sin actividad reciente.</p>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="flex items-start justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-white">
                                        {log.target_user?.full_name || 'Agente'}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {log.mission_title_snapshot || 'Acción manual'}
                                    </p>
                                    <p className="text-[10px] text-muted/60">
                                        {format(new Date(log.created_at), 'dd MMM, HH:mm', { locale: es })}
                                    </p>
                                </div>
                                <Badge variant={log.points > 0 ? 'success' : 'danger'}>
                                    {log.points > 0 ? '+' : ''}{log.points} pts
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
