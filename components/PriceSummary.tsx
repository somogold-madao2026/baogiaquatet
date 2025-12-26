
import React from 'react';
import { Product } from '../types';

interface PriceSummaryProps {
  calculation: {
    unitPrice: number;
    totalPrice: number;
    details: { product: Product; quantity: number }[];
    isComplete: boolean;
  };
  quantity: number;
  packageName: string;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ calculation, quantity, packageName }) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800">
      <div className="bg-red-600 p-6 text-center">
        <h3 className="text-red-100 text-sm uppercase font-bold tracking-widest mb-1">Báo Giá Dự Kiến</h3>
        <p className="text-3xl font-black">{calculation.totalPrice.toLocaleString('vi-VN')}đ</p>
        <p className="text-red-200 text-xs mt-2 italic">
          (Cho {quantity} phần quà {packageName})
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1 h-3 bg-red-500 rounded"></span>
            Chi Tiết Thành Phần
          </h4>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {calculation.details.map(({ product, quantity: itemQty }) => (
              <div key={product.id} className="flex justify-between items-start gap-4 group">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight group-hover:text-red-400 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {product.price.toLocaleString('vi-VN')}đ × {itemQty}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="text-xs font-bold">{(product.price * itemQty).toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            ))}
            {calculation.details.length === 0 && (
              <p className="text-slate-500 text-sm italic py-4">Chưa có thành phần nào được chọn</p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Giá 1 phần quà:</span>
            <span className="font-bold">{calculation.unitPrice.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Số lượng:</span>
            <span className="font-bold">× {quantity}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-red-500 pt-2 border-t border-slate-800 border-dashed">
            <span>TỔNG CỘNG:</span>
            <span>{calculation.totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {!calculation.isComplete && (
           <div className="bg-amber-900/30 border border-amber-800 p-3 rounded-lg flex items-center gap-3 text-amber-200 text-xs">
              <span className="text-lg">⚠️</span>
              <p>Phần quà chưa đầy đủ. Hãy hoàn thiện cấu hình để xuất báo giá.</p>
           </div>
        )}

        <button 
          disabled={!calculation.isComplete}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg ${
            calculation.isComplete 
            ? 'bg-red-600 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] text-white shadow-red-900/20' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          XUẤT BÁO GIÁ (PDF)
        </button>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};
