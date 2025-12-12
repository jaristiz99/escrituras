import React, { useMemo } from 'react';
import { BarChart3, Clock, X, TrendingUp } from 'lucide-react';

interface SearchRecord {
  topic: string;
  timestamp: number;
}

interface TrendsReportProps {
  history: SearchRecord[];
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
}

export const TrendsReport: React.FC<TrendsReportProps> = ({ history, onClose, onSelectTopic }) => {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(item => {
      // Normalize topic to lowercase for counting
      const norm = item.topic.trim().toLowerCase();
      // Capitalize for display
      const display = norm.charAt(0).toUpperCase() + norm.slice(1);
      counts[display] = (counts[display] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
      
    const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

    return { sorted, maxCount, total: history.length };
  }, [history]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <BarChart3 size={24} className="text-brand-gold" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">Informe de Tendencias</h2>
              <p className="text-white/60 text-xs uppercase tracking-wider">Análisis de Consultas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Aún no hay datos suficientes para generar un informe.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-paper p-4 rounded-xl border border-stone-200">
                  <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Consultas</p>
                  <p className="text-3xl font-serif font-bold text-brand-dark">{stats.total}</p>
                </div>
                <div className="bg-brand-paper p-4 rounded-xl border border-stone-200">
                  <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tema Principal</p>
                  <p className="text-xl font-serif font-bold text-brand-dark truncate">
                    {stats.sorted[0]?.[0] || "-"}
                  </p>
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-6">
                  <TrendingUp size={18} className="text-emerald-600" />
                  Temas Más Consultados
                </h3>
                <div className="space-y-4">
                  {stats.sorted.map(([topic, count], idx) => (
                    <div key={topic} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{idx + 1}. {topic}</span>
                        <span className="text-gray-500 font-mono text-xs">{count} consultas</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(count / stats.maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent History */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                  <Clock size={18} className="text-blue-500" />
                  Actividad Reciente
                </h3>
                <div className="flex flex-wrap gap-2">
                  {history.slice(0, 8).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectTopic(item.topic);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-600 transition-colors"
                    >
                      {item.topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 text-center">
          <p className="text-xs text-gray-400">Informe generado automáticamente basado en su historial local.</p>
        </div>
      </div>
    </div>
  );
};