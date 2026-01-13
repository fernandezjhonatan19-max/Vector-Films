import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function AppLayout() {
    return (
        <div className="min-h-screen bg-background text-text font-body selection:bg-primary/30">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="container mx-auto p-8 max-w-7xl animate-in fade-in zoom-in-95 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
