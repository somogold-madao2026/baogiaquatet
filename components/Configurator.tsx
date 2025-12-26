
import React from 'react';
import { PackageRule, Category } from '../types';
import { PRODUCTS } from '../constants';

interface ConfiguratorProps {
  rule: PackageRule;
  selections: string[];
  onSelect: (index: number, productId: string) => void;
}

export const Configurator: React.FC<ConfiguratorProps> = ({ rule, selections, onSelect }) => {
  const availableProducts = PRODUCTS.filter(p => p.category === rule.category);

  // Nếu là thành phần cố định, chúng ta chỉ cần hiển thị thông tin tóm tắt
  if (rule.isFixed) {
    const fixedProduct = PRODUCTS.find(p => p.id === rule.fixedProductId);
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-end border-b border-slate-100 pb-2">
          <h4 className="font-semibold text-slate-700 flex items-center gap-2 text-sm md:text-base">
            {rule.category}
          </h4>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">Cố định</span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 flex justify-between items-center group hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm md:text-base">{fixedProduct?.name}</p>
              <p className="text-xs text-slate-500 italic">Quy cách: {rule.quantity} {fixedProduct?.unit}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
              x{rule.quantity}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Đối với các thành phần cho phép lựa chọn, giữ nguyên hiển thị dạng lưới
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end border-b border-slate-100 pb-2">
        <h4 className="font-semibold text-slate-700 flex items-center gap-2 text-sm md:text-base">
          {rule.category}
          <span className="text-xs font-normal text-slate-400 hidden sm:inline">(Số lượng: {rule.quantity})</span>
        </h4>
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase font-bold">Tự chọn</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selections.map((selectedId, idx) => (
          <div key={`${rule.category}-${idx}`} className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-focus-within:text-red-500 transition-colors">
              Thành phần #{idx + 1}
            </label>
            <div className="relative">
              <select 
                value={selectedId}
                onChange={(e) => onSelect(idx, e.target.value)}
                className={`w-full p-3 bg-white border rounded-xl text-sm appearance-none transition-all outline-none focus:ring-4 focus:ring-red-50 pr-10 ${
                  selectedId ? 'border-red-200 text-slate-800' : 'border-slate-200 text-slate-400 italic'
                }`}
              >
                <option value="">-- Chọn một thành phần --</option>
                {availableProducts.map(p => (
                  <option key={p.id} value={p.id} className="text-slate-800 not-italic font-medium">
                    {p.name} - {p.price.toLocaleString('vi-VN')}đ
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
