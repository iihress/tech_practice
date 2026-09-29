import { useState } from 'react';
import { Users, Plus, Shield, ArrowRight, Building2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export function WorkspaceGateway() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'SELECT' | 'CREATE'>('SELECT');
  const [loading, setLoading] = useState(false);
  
  const { user, token, setAuth, clearAuth } = useAuthStore();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/teams/join', { code: code.trim() });
      toast.success('Успішно приєднано до команди!');
      if (user && token) {
        setAuth({ ...user, teamId: res.data._id }, token);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Не вдалося приєднатися до команди');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/teams', { name: name.trim() });
      toast.success('Команду успішно створено!');
      if (user && token) {
        setAuth({ ...user, teamId: res.data._id, role: 'COORDINATOR' }, token);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Не вдалося створити команду');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-800">
      {/* Top Bar / Logo */}
      <div className="w-full py-8 flex justify-center items-center relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">VolunteerHub</span>
        </div>
        <button 
          onClick={() => clearAuth()}
          className="absolute right-8 text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Вийти
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {mode === 'SELECT' && (
            <>
              {/* Header */}
              <div className="p-8 pb-6 text-center border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Вітаємо у VolunteerHub</h1>
                <p className="text-sm text-gray-500 mt-2">
                  Щоб почати, вам потрібно приєднатися до існуючого робочого простору команди або створити новий для вашої організації.
                </p>
              </div>

              {/* Join Section */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Приєднатися до команди</h2>
                    <p className="text-sm text-gray-500">Введіть інвайт-код від вашого координатора.</p>
                  </div>
                </div>

                <form onSubmit={handleJoin} className="flex gap-3 mt-4">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="напр., V-HUB-7X9P"
                    className="flex-1 h-12 px-4 text-lg font-mono uppercase bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:normal-case placeholder:text-gray-400 text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Вступити
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Divider */}
              <div className="relative flex items-center px-8">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">або</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Create Section */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Створити команду</h2>
                    <p className="text-sm text-gray-500">Ви координатор? Створіть новий робочий простір для вашої організації.</p>
                  </div>
                </div>

                <button
                  onClick={() => setMode('CREATE')}
                  className="w-full h-12 mt-2 bg-white border-2 border-gray-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Створити команду
                </button>
              </div>
            </>
          )}

          {mode === 'CREATE' && (
            <div className="p-8">
              <button 
                onClick={() => setMode('SELECT')}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 flex items-center gap-1 transition-colors"
              >
                &larr; Назад
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Назвіть вашу команду</h1>
                  <p className="text-sm text-gray-500">Це буде простір для місій вашої команди.</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Назва команди</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="напр., Save The World NGO"
                    className="w-full h-12 px-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400 text-gray-900"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Створення...' : 'Створити команду'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
