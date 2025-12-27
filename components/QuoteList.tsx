
import React from 'react';
import { ConfiguredItem } from '../types';

interface QuoteListProps {
  items: ConfiguredItem[];
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onExport: () => void;
  
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
  
  maxDiscount?: number;
  discountRate?: number;
  discountInput?: string;
  onDiscountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({ 
  items, 
  onRemove, 
  onEdit, 
  onUpdateQuantity, 
  onExport, 
  subTotal,
  discountAmount,
  finalTotal
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[calc(100vh-8rem)] sticky top-24">
      
      <div className="p-6 bg-slate-800 border-b border-slate-700 shrink-0">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center justify-between">
          <span>Danh Sách Báo Giá</span>
          <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full">{items.length} mục</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/50">
        {items.map((item) => {
          const itemTotalRaw = item.unitPrice * item.quantity;
          
          // THÊM Math.round ĐỂ HIỂN THỊ ĐÚNG SỐ NGUYÊN
          const itemDiscount = Math.round(itemTotalRaw * (item.discountRate / 100));
          
          const itemTotalFinal = itemTotalRaw - itemDiscount;

          return (
            <div key={item.instanceId} className="bg-slate-800 rounded-xl p-4 border border-slate-700 group relative hover:border-slate-600 transition-colors">
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => onEdit(item.instanceId)} title="Sửa" className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                <button onClick={() => onRemove(item.instanceId)} title="Xóa" className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              
              <div className="mb-3">
                <h4 className="text-red-400 font-bold text-sm leading-tight">{item.packageName}</h4>
                <div className="flex justify-between items-start mt-1">
                   <p className="text-[10px] text-slate-400 italic">{item.details.length} thành phần</p>
                   {item.discountRate > 0 && (
                     <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                       Giảm {item.discountRate}%
                     </span>
                   )}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Số lượng</p>
                  <div className="flex items-center gap-2">
                      <button onClick={() => onUpdateQuantity(item.instanceId, item.quantity - 1)} className="w-6 h-6 bg-slate-700 text-slate-400 hover:text-white rounded">-</button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.instanceId, item.quantity + 1)} className="w-6 h-6 bg-slate-700 text-slate-400 hover:text-white rounded">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Thành tiền</p>
                  {item.discountRate > 0 && (
                    <p className="text-xs text-slate-500 line-through decoration-slate-500/50">
                      {itemTotalRaw.toLocaleString('vi-VN')}đ
                    </p>
                  )}
                  <p className="text-base font-black text-white">{itemTotalFinal.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60 min-h-[200px]">
            <div className="text-4xl mb-3 grayscale">🛒</div>
            <p className="text-xs italic">Chưa có phần quà nào</p>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-5 bg-slate-800 border-t border-slate-700 space-y-4 shadow-lg z-20 shrink-0">
          
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Tổng giá gốc:</span>
            <span>{subTotal.toLocaleString('vi-VN')}đ</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-xs font-bold text-green-400">
              <span>Tổng được giảm:</span>
              <span>- {discountAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          )}

          <div className="h-px bg-slate-700"></div>

          <div className="flex justify-between items-end">
             <span className="text-xs font-bold text-slate-300 uppercase mb-1">Cần thanh toán:</span>
             <span className="text-2xl font-black text-white tracking-tight">{finalTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          
          <button 
            onClick={onExport}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-900/40 uppercase tracking-wider text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Xuất Báo Giá (PDF)
          </button>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
      `}</style>
    </div>
  );
};
