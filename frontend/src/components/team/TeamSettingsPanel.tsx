import { Copy, RefreshCw, UserMinus, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function TeamSettingsPanel() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchTeam = async () => {
    try {
      const res = await api.get('/teams/my');
      setTeam(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCopy = () => {
    if (!team?.inviteCode) return;
    navigator.clipboard.writeText(team.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateCode = async () => {
    try {
      const res = await api.post('/teams/regenerate-code');
      setTeam(res.data);
      toast.success('Code regenerated');
    } catch (e) {
      toast.error('Failed to regenerate code');
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/teams/members/${id}`);
      setTeam({ ...team, members: team.members.filter((m: any) => m._id !== id) });
      toast.success('Member removed');
    } catch (e) {
      toast.error('Failed to remove member');
    }
  };

  const deleteTeam = async () => {
    if (!confirm('Ви впевнені, що хочете остаточно видалити команду та всіх учасників з неї?')) return;
    try {
      await api.delete(`/teams/${team._id}`);
      toast.success('Команду видалено');
      // Wait a moment for toast, then refresh/navigate
      setTimeout(() => {
        window.location.href = '/app';
      }, 1000);
    } catch (e) {
      toast.error('Помилка видалення команди');
    }
  };

  if (loading) return <div className="text-center p-8 text-slate-500">Loading team...</div>;
  if (!team) return <div className="text-center p-8 text-slate-500">No team found</div>;

  const isCoordinator = user?.role === 'COORDINATOR' || user?.role === 'ADMIN';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Invite Code Section - Only for Coordinators/Admins */}
      {isCoordinator && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Доступ та запрошення ({team.name})</h2>
          <p className="text-sm text-gray-500 mb-6">
            Поділіться цим кодом з волонтерами, щоб запросити їх до команди.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3 flex-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span className="font-mono text-gray-900 font-medium tracking-wide">{team.inviteCode}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:w-auto w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              {copied ? <span className="text-green-600 text-sm">Скопійовано!</span> : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Копіювати</span>
                </>
              )}
            </button>
          </div>
          
          <button onClick={regenerateCode} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <RefreshCw className="w-4 h-4" />
            Згенерувати новий код
          </button>
        </div>
      )}

      {/* Team Members Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Учасники команди</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {team.members?.filter((m: any) => m.role !== 'ADMIN').map((member: any) => {
            const isMemberCoordinator = team.coordinator === member._id || member.role === 'COORDINATOR' || member.role === 'ADMIN';
            const roleLabel = member.role === 'ADMIN' ? 'Admin' : (isMemberCoordinator ? 'Coordinator' : 'Volunteer');
            
            return (
              <li key={member._id} className="px-6 py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{member.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isMemberCoordinator && <Shield className="w-3 h-3 text-orange-500" />}
                      <p className="text-xs text-gray-500">{roleLabel}</p>
                    </div>
                  </div>
                </div>
                
                {isCoordinator && !isMemberCoordinator && (
                  <button 
                    onClick={() => removeMember(member._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Видалити учасника"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {isCoordinator && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm mt-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-900 mb-1">Небезпечна зона</h3>
            <p className="text-sm text-red-700">Видалити команду та всі її дані безповоротно.</p>
          </div>
          <button 
            onClick={deleteTeam}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Видалити команду
          </button>
        </div>
      )}
    </div>
  );
}
