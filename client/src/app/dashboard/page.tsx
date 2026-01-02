import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">
        Bienvenido a Nexus, {session?.user?.name}
      </h1>
      <p className="text-slate-600 mb-8">
        Estás conectado como: <span className="font-mono bg-slate-100 p-1 rounded">{session?.user?.email}</span>
      </p>

      {/* Aquí irá tu Gantt próximamente */}
      <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center h-64 text-slate-400">
        El Módulo de Gantt se cargará aquí...
      </div>
      
      <form
        action={async () => {
          "use server";
          const { signOut } = await import("@/src/lib/auth");
          await signOut();
        }}
        className="mt-8"
      >
        <button className="text-red-600 hover:underline text-sm">
          Cerrar Sesión
        </button>
      </form>
    </div>
  );
}