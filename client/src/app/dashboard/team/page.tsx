'use client';

import { useState } from 'react';
import { UserPlus, Mail, Shield, CheckCircle, Loader2 } from 'lucide-react';

export default function TeamPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setMessage('Usuario creado correctamente. Ya puede iniciar sesión.');
        setFormData({ name: '', email: '', password: '', role: 'client' }); // Limpiar
      } else {
        setMessage('Error: El usuario ya existe o hubo un fallo.');
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Equipo</h1>
        <p className="text-slate-500">Da de alta nuevos usuarios y asigna roles de acceso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Formulario de Alta */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Crear Nuevo Usuario</h2>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Ej: Juan Perez"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Rol</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="client">Cliente (Solo Ver)</option>
                  <option value="sales">Comercial</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="juan@empresa.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña Inicial</label>
              <input 
                type="text" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                placeholder="Generar clave segura..."
              />
            </div>

            {message && (
              <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {message.includes('Error') ? <Shield className="h-4 w-4"/> : <CheckCircle className="h-4 w-4"/>}
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4"/> : 'Crear Usuario'}
            </button>
          </form>
        </div>

        {/* Columna Derecha: Información / Lista Rápida (Placeholder) */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Roles Disponibles</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Administrador</p>
                <p className="text-slate-500 text-xs">Acceso total a configuración, usuarios y todos los proyectos.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="h-8 w-8 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Cliente</p>
                <p className="text-slate-500 text-xs">Solo lectura. Puede ver Roadmaps y Gantts asignados.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}