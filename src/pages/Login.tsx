import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Zap } from 'lucide-react';

export function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

            <Card className="w-full max-w-md border-white/10 shadow-2xl relative z-10 backdrop-blur-xl bg-surface/80">
                <CardHeader className="text-center space-y-4 pb-8">
                    <div className="mx-auto h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
                        <Zap className="h-7 w-7 text-primary" fill="currentColor" />
                    </div>
                    <CardTitle className="text-2xl">Team Pulse Login</CardTitle>
                    <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input type="email" placeholder="correo@vectorfilms.com" />
                    </div>
                    <div className="space-y-2">
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button className="w-full mt-4" size="lg">Iniciar Sesión</Button>
                </CardContent>
            </Card>
        </div>
    );
}
