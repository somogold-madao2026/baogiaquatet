
import React from 'react';
import { ConfiguredItem } from '../types';

interface PrintTemplateProps {
  items: ConfiguredItem[];
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ 
  items, 
  subTotal, 
  discountAmount, 
  finalTotal 
}) => {
  return (
    <div id="print-section" className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-[10mm] md:p-[15mm] mx-auto relative flex flex-col">
      <div className="flex justify-between items-start border-b-2 border-red-700 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <img src="https://i.ibb.co/scLt3dT/logo-Somo-Gold.jpg" alt="Somo Gold" className="h-20 w-auto object-contain" />
          <div>
            <h1 className="text-3xl font-black text-red-700 uppercase tracking-tighter leading-none mb-1">Somo Gold</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cộng hưởng cùng thịnh vượng</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-slate-800 mb-2">Báo Giá Tết 2026</h2>
          <p className="text-sm text-slate-500">Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      <div className="flex-grow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-red-700 text-white uppercase text-xs">
              <th className="py-3 px-4 text-left rounded-tl-lg">STT</th>
              <th className="py-3 px-4 text-left">Tên Phần Quà & Chi Tiết</th>
              <th className="py-3 px-4 text-center">SL</th>
              <th className="py-3 px-4 text-right">Đơn giá</th>
              <th className="py-3 px-4 text-right rounded-tr-lg">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, index) => (
              <tr key={item.instanceId} className="group">
                <td className="py-4 px-4 text-center font-bold text-slate-400 align-top">{index + 1}</td>
                <td className="py-4 px-4 align-top">
                  <p className="font-bold text-red-700 text-base mb-1">{item.packageName}</p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-2 rounded">
                    {item.details.map((detail, idx) => (
                      <li key={idx}>
                        {detail.product.name} <span className="text-slate-400">x{detail.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-4 text-center font-bold align-top">{item.quantity}</td>
                <td className="py-4 px-4 text-right font-medium align-top">
                  {item.unitPrice.toLocaleString('vi-VN')}đ
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-900 align-top">
                  {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t-2 border-slate-200 pt-6">
        <div className="flex flex-col items-end gap-2 w-full max-w-xs ml-auto">
          <div className="flex justify-between w-full text-slate-600 text-sm">
            <span>Tạm tính:</span>
            <span className="font-medium">{subTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between w-full text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
              <span>Chiết khấu:</span>
              <span>- {discountAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          <div className="flex justify-between w-full text-red-700 text-xl font-black mt-2 pt-2 border-t border-slate-200">
            <span>TỔNG CỘNG:</span>
            <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
