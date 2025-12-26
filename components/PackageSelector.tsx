
import React from 'react';
import { GiftPackage } from '../types';

interface PackageSelectorProps {
  pkg: GiftPackage;
  isSelected: boolean;
  onSelect: () => void;
  onNext?: () => void;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({ pkg, isSelected, onSelect, onNext }) => {
  const tierColor = {
    'Cao cấp': 'bg-amber-100 text-amber-700 border-amber-200',
    'Trung cấp': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Tiêu chuẩn': 'bg-blue-100 text-blue-700 border-blue-200'
  }[pkg.tier];

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNext) onNext();
  };

  return (
    <div 
      onClick={onSelect}
      className={`relative cursor-pointer group flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg overflow-hidden ${
        isSelected 
        ? 'border-red-600 bg-red-50 ring-2 ring-red-100' 
        : 'border-slate-200 bg-white hover:border-red-200'
      }`}
    >
      {/* Detail Tooltip/Overlay on Hover (Desktop) */}
      {!isSelected && (
        <div className="absolute inset-0 bg-slate-900/95 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 flex flex-col justify-center hidden sm:flex">
          <h4 className="font-bold text-red-400 text-sm mb-2 border-b border-slate-700 pb-1 uppercase tracking-wider">Cấu tạo chi tiết:</h4>
          <ul className="text-[10px] space-y-1.5 font-medium">
            {pkg.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{rule.quantity}x {rule.category}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[9px] text-slate-400 italic font-normal">Nhấn để chọn mẫu này</p>
        </div>
      )}

      {/* Next Step Arrow Button - Only visible when selected */}
      {isSelected && (
        <button 
          onClick={handleNextClick}
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in duration-300 group/btn"
          title="Tiếp tục tùy chỉnh"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      )}

      <div className="w-full sm:w-24 aspect-square sm:aspect-auto sm:h-24 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
        <img 
          src={pkg.imageUrl} 
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-1 right-1 sm:hidden">
          <div className="bg-white/90 rounded-full p-1 shadow-sm">
             <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 pr-8 sm:pr-12">
        <div className="flex justify-between items-start mb-0.5 sm:mb-1">
          <span className={`text-[7px] sm:text-[9px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${tierColor} truncate`}>
            {pkg.tier}
          </span>
          {isSelected && (
            <div className="bg-red-600 text-white rounded-full p-0.5">
              <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          )}
        </div>
        <h3 className={`font-bold text-xs sm:text-base mb-0.5 transition-colors leading-tight ${isSelected ? 'text-red-800' : 'text-slate-800'} truncate`}>
          {pkg.name}
        </h3>
        <p className="text-slate-500 text-[8px] sm:text-[11px] leading-tight mb-1 sm:mb-2 line-clamp-2">
          {pkg.description}
        </p>
        
        <div className="flex flex-wrap gap-0.5 sm:gap-1">
          {pkg.rules.slice(0, 3).map(rule => (
            <span key={rule.category} className="text-[7px] sm:text-[9px] bg-slate-100 text-slate-600 px-1 sm:px-1.5 py-0.5 rounded truncate max-w-full font-medium">
              {rule.quantity}x {rule.category.split('(')[0]}
            </span>
          ))}
          {pkg.rules.length > 3 && <span className="text-[7px] sm:text-[9px] text-slate-400">...</span>}
        </div>
      </div>
    </div>
  );
};
