import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-text font-body selection:bg-primary/30">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="md:pl-64 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-surface-2 sticky top-0 z-50">
                    <div>
                        <h1 className="font-bold text-sm uppercase tracking-wide text-white">Vector Films</h1>
                        <p className="text-[10px] text-primary font-bold tracking-widest">TEAM PULSE</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-muted hover:text-white transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in zoom-in-95 duration-500 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
