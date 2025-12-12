import React from 'react';
import { ReligionAnalysis } from '../types';
import { BookOpen, Quote } from 'lucide-react';

interface ReligionCardProps {
  religion: string;
  data: ReligionAnalysis;
  icon?: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

export const ReligionCard: React.FC<ReligionCardProps> = ({ religion, data, icon, colorClass, bgClass }) => {
  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white flex flex-col h-full`}>
      <div className={`${bgClass} p-4 border-b border-gray-100 flex items-center gap-3`}>
        <div className={`p-2 rounded-full bg-white/80 ${colorClass}`}>
          {icon || <BookOpen size={20} />}
        </div>
        <h2 className="text-xl font-serif font-bold text-gray-800">{religion}</h2>
      </div>
      
      <div className="p-6 flex-grow flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Perspectiva General</h3>
          <p className="text-gray-700 leading-relaxed font-serif text-sm md:text-base">
            {data.perspective}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Creencias Centrales</h3>
          <p className="text-gray-600 text-sm italic border-l-2 border-gray-200 pl-3">
            {data.core_beliefs}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
             Referencias Clave
          </h3>
          <div className="space-y-4">
            {data.key_verses.map((verse, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative group">
                <Quote className="absolute top-2 right-2 text-gray-200 w-4 h-4" />
                <p className="text-gray-800 font-serif mb-2 text-sm">"{verse.text}"</p>
                <div className="flex justify-between items-end">
                    <span className={`text-xs font-bold ${colorClass.replace('text-', 'bg-').replace('600', '100')} ${colorClass} px-2 py-1 rounded`}>
                    {verse.citation}
                    </span>
                    {verse.context && (
                        <span className="text-xs text-gray-400 italic max-w-[60%] text-right">{verse.context}</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};