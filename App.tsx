import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Book, Scroll, Moon, BarChart3, History } from 'lucide-react';
import { analyzeTopic } from './services/geminiService';
import { ComparativeAnalysis, LoadingState } from './types';
import { ReligionCard } from './components/ReligionCard';
import { Synthesis } from './components/Synthesis';
import { TrendsReport } from './components/TrendsReport';

interface SearchRecord {
  topic: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [data, setData] = useState<ComparativeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<SearchRecord[]>(() => {
    try {
      const saved = localStorage.getItem('interfaith_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [showReport, setShowReport] = useState(false);

  // Derive popular topics for chips
  const popularTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(h => {
      const t = h.topic.toLowerCase().trim();
      const display = t.charAt(0).toUpperCase() + t.slice(1);
      counts[display] = (counts[display] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by count desc
      .slice(0, 4) // Top 4
      .map(entry => entry[0]);
  }, [history]);

  const addToHistory = (searchTopic: string) => {
    const newRecord = { topic: searchTopic, timestamp: Date.now() };
    const newHistory = [newRecord, ...history];
    setHistory(newHistory);
    localStorage.setItem('interfaith_history', JSON.stringify(newHistory));
  };

  const handleSearch = async (e?: React.FormEvent, overrideTopic?: string) => {
    if (e) e.preventDefault();
    const query = overrideTopic || topic;
    
    if (!query.trim()) return;

    if (overrideTopic) setTopic(overrideTopic);

    setStatus(LoadingState.LOADING);
    setError(null);
    setData(null);

    try {
      const result = await analyzeTopic(query);
      setData(result);
      addToHistory(query);
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      setError("No se pudo completar el análisis. Por favor, verifica tu conexión o intenta con otro tema.");
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-lg">
              <Book size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">InterFaith Analyst</h1>
              <p className="text-xs text-gray-500 font-medium">Comparativa Teológica Objetiva</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-stone-900 transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200"
          >
            <BarChart3 size={18} />
            <span className="hidden sm:inline">Ver Informe</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Explora las Escrituras
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Introduce un tema ético, teológico o social para comparar las visiones de la Biblia, la Torá y el Corán.
          </p>
          
          <form onSubmit={(e) => handleSearch(e)} className="relative group mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: Caridad, El Más Allá, Justicia, Perdón..."
              className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-full shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-lg"
            />
            <button
              type="submit"
              disabled={status === LoadingState.LOADING || !topic.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === LoadingState.LOADING ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Analizar"
              )}
            </button>
          </form>

          {/* Popular Chips */}
          {popularTopics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center mr-2">
                <History size={12} className="mr-1" /> Tendencias:
              </span>
              {popularTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => handleSearch(undefined, t)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm hover:shadow"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {status === LoadingState.ERROR && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mb-10">
            {error}
          </div>
        )}

        {/* Results */}
        {status === LoadingState.SUCCESS && data && (
          <div className="animate-fade-in-up">
            <div className="mb-8 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide uppercase mb-2">
                Análisis Completado
              </span>
              <h3 className="text-3xl font-serif font-bold text-gray-900 capitalize">
                {data.topic}
              </h3>
            </div>

            {/* Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <ReligionCard 
                religion="Judaísmo (Torá)" 
                data={data.judaism} 
                icon={<Scroll size={20} />}
                colorClass="text-blue-600"
                bgClass="bg-blue-50/50"
              />
              <ReligionCard 
                religion="Cristianismo (Biblia)" 
                data={data.christianity} 
                icon={<Book size={20} />}
                colorClass="text-indigo-600"
                bgClass="bg-indigo-50/50"
              />
              <ReligionCard 
                religion="Islam (Corán)" 
                data={data.islam} 
                icon={<Moon size={20} />}
                colorClass="text-emerald-600"
                bgClass="bg-emerald-50/50"
              />
            </div>

            {/* Synthesis Section */}
            <Synthesis data={data.synthesis} />
          </div>
        )}
        
        {/* Empty State / Intro */}
        {status === LoadingState.IDLE && (
          <div className="grid md:grid-cols-3 gap-8 mt-16 opacity-50 pointer-events-none grayscale select-none" aria-hidden="true">
             {/* Decorative placeholder cards to show structure */}
             <div className="h-64 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 font-serif">Torá</span>
             </div>
             <div className="h-64 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 font-serif">Biblia</span>
             </div>
             <div className="h-64 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 font-serif">Corán</span>
             </div>
          </div>
        )}

      </main>

      {/* Reports Modal */}
      {showReport && (
        <TrendsReport 
          history={history} 
          onClose={() => setShowReport(false)} 
          onSelectTopic={(t) => handleSearch(undefined, t)}
        />
      )}

      <footer className="text-center py-8 text-gray-400 text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} InterFaith Analyst. Desarrollado con Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;