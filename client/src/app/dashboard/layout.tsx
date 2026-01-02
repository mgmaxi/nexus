import Sidebar from '@/src/components/dashboard/Sidebar'; // Asegúrate de ajustar la ruta si usas src
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Barra Lateral Fija */}
      <aside className="hidden w-64 md:block shadow-xl z-10">
        <Sidebar />
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Header Superior Móvil o Info Usuario */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="text-sm text-slate-500">
            Bienvenido, <span className="font-semibold text-slate-800">{session.user?.name || 'Usuario'}</span>
          </div>
          {/* Aquí podrías poner notificaciones o avatar */}
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {session.user?.name?.charAt(0) || 'U'}
          </div>
        </header>

        {/* El contenido de cada página (page.tsx) se renderiza aquí */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}