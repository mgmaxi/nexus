'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Settings, 
  LogOut, 
  ShoppingCart,
  Users
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmap / Gantt', href: '/dashboard/roadmap', icon: Map },
  { name: 'Comparador ML', href: '/dashboard/market', icon: ShoppingCart },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
  { name: 'Equipo y Accesos', href: '/dashboard/team', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider">NEXUS</h1>
      </div>

      {/* Menú */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Botón Salir */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}