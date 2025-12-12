import React from 'react';
import { ComparativeAnalysis } from '../types';
import { Scale, CheckCircle2, XCircle } from 'lucide-react';

interface SynthesisProps {
  data: ComparativeAnalysis['synthesis'];
}

export const Synthesis: React.FC<SynthesisProps> = ({ data }) => {
  return (
    <div className="bg-brand-paper rounded-xl border border-stone-200 shadow-sm p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="text-stone-600" size={24} />
        <h2 className="text-2xl font-serif font-bold text-stone-800">Síntesis Comparativa</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="flex items-center gap-2 text-emerald-700 font-bold mb-4 uppercase text-sm tracking-wide">
            <CheckCircle2 size={16} />
            Convergencias
          </h3>
          <ul className="space-y-2">
            {data.similarities.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-stone-700 text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-amber-700 font-bold mb-4 uppercase text-sm tracking-wide">
            <XCircle size={16} />
            Divergencias
          </h3>
          <ul className="space-y-2">
            {data.differences.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-stone-700 text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-stone-200">
        <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-3">Conclusión Analítica</h3>
        <p className="text-stone-800 font-serif leading-relaxed text-lg">
          {data.conclusion}
        </p>
      </div>
    </div>
  );
};