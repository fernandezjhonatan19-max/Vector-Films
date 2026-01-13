import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    Users,
    Target,
    Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
    { to: '/inicio', label: 'Inicio', icon: LayoutDashboard },
    { to: '/acciones', label: 'Acciones', icon: Activity },
    { to: '/equipo', label: 'Equipo', icon: Users },
    { to: '/misiones', label: 'Misiones', icon: Target },
    { to: '/ajustes', label: 'Ajustes', icon: Settings },
];

export function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-full w-64 border-r border-border bg-surface-2 p-6 flex flex-col">
            <div className="mb-10 px-2">
                <div>
                    <h1 className="font-bold text-lg leading-tight uppercase tracking-wide text-white">Vector Films</h1>
                    <p className="text-xs text-muted font-medium tracking-widest text-[#F5C542]">TEAM PULSE</p>
                </div>
            </div>

            <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group',
                                isActive
                                    ? 'bg-primary text-surface-2 shadow-[0_0_15px_rgba(245,197,66,0.3)]'
                                    : 'text-muted hover:bg-white/5 hover:text-text'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>


        </div>
    );
}
