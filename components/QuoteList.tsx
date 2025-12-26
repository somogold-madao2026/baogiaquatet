
import React from 'react';
import { ConfiguredItem } from '../types';

interface QuoteListProps {
  items: ConfiguredItem[];
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onExport: () => void;
  grandTotal: number;
}

export const QuoteList: React.FC<QuoteListProps> = ({ items, onRemove, onEdit, onUpdateQuantity, onExport, grandTotal }) => {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
      <div className="p-6 bg-slate-800/50 border-b border-slate-700">
        <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center justify-between">
          <span>Danh Sách Báo Giá</span>
          <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full">{items.length} mục</span>
        </h3>
      </div>

      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <div key={item.instanceId} className="bg-slate-800 rounded-xl p-4 border border-slate-700 group relative">
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => onEdit(item.instanceId)}
                title="Chỉnh sửa phần quà"
                className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button 
                onClick={() => onRemove(item.instanceId)}
                title="Xóa phần quà"
                className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="mb-3">
              <h4 className="text-red-400 font-bold text-sm leading-tight">{item.packageName}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 italic">
                Cấu hình: {item.details.length} thành phần
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Số lượng</p>
                <div className="flex items-center gap-2">
                   <input 
                    type="number" 
                    value={item.quantity === 0 ? '' : item.quantity}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateQuantity(item.instanceId, val === '' ? 0 : Math.max(0, parseInt(val) || 0));
                    }}
                    onBlur={() => {
                      if (item.quantity < 1) onUpdateQuantity(item.instanceId, 1);
                    }}
                    className="w-14 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-sm font-bold text-center text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Phần</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-medium">Thành tiền</p>
                <p className="text-base font-black text-white">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50 hidden group-hover:block animate-in fade-in duration-300">
               <ul className="text-[9px] text-slate-400 space-y-1">
                 {item.details.map((d, i) => (
                   <li key={i} className="flex justify-between">
                     <span>• {d.product.name}</span>
                     <span className="text-slate-500">x{d.quantity}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="py-12 text-center space-y-4">
            <div className="text-4xl opacity-20 grayscale">🛒</div>
            <p className="text-slate-500 text-xs italic">Chưa có phần quà nào được thêm vào báo giá</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-800/80 border-t border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tổng giá trị:</span>
          <span className="text-2xl font-black text-red-500 tracking-tighter">{grandTotal.toLocaleString('vi-VN')}đ</span>
        </div>
        
        <button 
          onClick={onExport}
          disabled={items.length === 0 || items.some(i => i.quantity < 1)}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
            (items.length > 0 && !items.some(i => i.quantity < 1))
            ? 'bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-900/40 active:scale-95' 
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Xuất báo giá chuyên nghiệp (PDF)
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
