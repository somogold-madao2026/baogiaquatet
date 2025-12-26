
import React from 'react';
import { ConfiguredItem } from '../types';

interface PrintTemplateProps {
  items: ConfiguredItem[];
  grandTotal: number;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ items, grandTotal }) => {
  const today = new Date().toLocaleDateString('vi-VN');
  const quoteNumber = `SG-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

  return (
    <div className="bg-white text-black leading-relaxed w-full h-full" id="print-section">
      {/* Container for A4 sizing - Visualized in Preview, Enforced in Print */}
      <div className="p-8 sm:p-10 max-w-[210mm] mx-auto min-h-[297mm] flex flex-col bg-white shadow-sm print:shadow-none print:p-0 print:m-0">
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-red-700 pb-6 mb-8">
          <div className="flex gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <img src="https://i.ibb.co/scLt3dT/logo-Somo-Gold.jpg" alt="Logo Somo Gold" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg sm:text-xl font-black uppercase text-red-700 tracking-tight mb-2">Công ty Cổ Phần Somo Gold</h1>
              <div className="text-[10px] sm:text-[11px] space-y-0.5 text-slate-700">
                <p><span className="font-bold">Địa chỉ:</span> 29 Nguyễn Khắc Nhu, phường Cầu Ông Lãnh, TP. Hồ Chí Minh</p>
                <p><span className="font-bold">Liên hệ:</span> 039.915.3674 (Mr. Quốc Khách)</p>
                <p><span className="font-bold">Email:</span> khachhq@somogold.vn</p>
                <p><span className="font-bold">Website:</span> somogold.vn</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 leading-none">Báo Giá Quà Tết</h2>
            <p className="text-red-600 font-bold text-xs sm:text-sm tracking-widest">MÃ ĐÁO 2026</p>
            <div className="mt-4 inline-block text-[10px] text-slate-500 font-mono">
              <p>Mã số: {quoteNumber}</p>
              <p>Ngày lập: {today}</p>
            </div>
          </div>
        </div>

        {/* Client Info Section */}
        <div className="mb-8 grid grid-cols-2 gap-8 text-[11px]">
          <div>
            <h3 className="font-bold uppercase text-slate-400 border-b border-slate-200 mb-2 pb-1 text-[9px]">Người gửi</h3>
            <p className="font-bold text-sm">Quốc Khách</p>
            <p className="text-slate-600 italic">Bộ phận Kinh doanh - Somo Gold</p>
          </div>
          <div>
            <h3 className="font-bold uppercase text-slate-400 border-b border-slate-200 mb-2 pb-1 text-[9px]">Ghi chú thanh toán</h3>
            <p className="text-slate-700 leading-relaxed italic">Giá báo dưới đây đã bao gồm thuế VAT.</p>
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-grow">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-700">
                <th className="p-2 sm:p-3 border border-slate-300 text-center w-10">STT</th>
                <th className="p-2 sm:p-3 border border-slate-300">Chi tiết sản phẩm & Thành phần</th>
                <th className="p-2 sm:p-3 border border-slate-300 text-center w-14">SL</th>
                <th className="p-2 sm:p-3 border border-slate-300 text-right w-24 sm:w-32">Đơn giá</th>
                <th className="p-2 sm:p-3 border border-slate-300 text-right w-24 sm:w-32">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-300 hover:bg-slate-50/50">
                  <td className="p-2 sm:p-3 border border-slate-300 text-center align-top font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-2 sm:p-3 border border-slate-300 align-top">
                    <p className="font-black text-slate-900 uppercase mb-1.5">{item.packageName}</p>
                    <div className="grid grid-cols-1 gap-1 pl-3 border-l-2 border-red-100">
                      {item.details.map((d, i) => (
                        <div key={i} className="flex justify-between text-[10px] text-slate-600 italic">
                          <span>• {d.product.name}</span>
                          <span className="text-slate-400 font-mono">x{d.quantity} {d.product.unit}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 border border-slate-300 text-center align-top font-bold text-slate-900">{item.quantity}</td>
                  <td className="p-2 sm:p-3 border border-slate-300 text-right align-top font-mono text-slate-700">{item.unitPrice.toLocaleString('vi-VN')}đ</td>
                  <td className="p-2 sm:p-3 border border-slate-300 text-right align-top font-bold text-red-700">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-8 pt-8 border-t-2 border-slate-100 flex justify-end">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Tổng giá trị hàng hóa:</span>
              <span className="font-mono">{grandTotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Thuế GTGT (VAT 10%):</span>
              <span className="italic text-[10px]">Đã bao gồm</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
              <span>Chiết khấu (nếu có):</span>
              <span className="font-mono">0đ</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-xs font-black uppercase text-slate-900">Tổng cộng thanh toán:</span>
              <div className="text-right">
                <span className="text-xl font-black text-red-700 leading-none">{grandTotal.toLocaleString('vi-VN')}đ</span>
                <p className="text-[9px] text-slate-400 italic mt-1">(Bằng chữ: {numberToWords(grandTotal)} đồng)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-[10px] text-slate-400 border-t border-dashed pt-4">
          <p className="font-bold text-slate-600 mb-1">CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG VÀ LỰA CHỌN SOMO GOLD</p>
          <p>Báo giá có giá trị trong vòng 15 ngày kể từ ngày ban hành. Mọi chi tiết xin liên hệ Hotline 039.915.3674.</p>
        </div>

      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
          /* Hide everything in body */
          body * {
            visibility: hidden;
          }
          /* Show print section */
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }
          /* Hide non-print elements inside the modal wrapper if any */
          .no-print {
            display: none !important;
          }
        }
        #print-section {
          font-family: "Times New Roman", Times, serif;
        }
      `}</style>
    </div>
  );
};

// Helper function
function numberToWords(num: number): string {
  if (num === 0) return 'Không';
  return num.toLocaleString('vi-VN'); 
}
