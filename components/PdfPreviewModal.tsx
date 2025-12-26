import React, { useState } from 'react';
import { PrintTemplate } from './PrintTemplate';
import { ConfiguredItem } from '../types';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConfiguredItem[];
  subTotal: number;       // Tổng tiền hàng (Chưa giảm)
  discountAmount: number; // Tiền được giảm
  finalTotal: number;     // Tiền khách phải trả
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  subTotal,
  discountAmount,
  finalTotal 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleExportPdf = () => {
    const element = document.getElementById('print-section');
    if (!element) return;

    setIsGenerating(true);

    const opt = {
      margin: 0,
      filename: `Bao-Gia-SomoGold-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsGenerating(false);
      }).catch((err: any) => {
        console.error("PDF generation failed", err);
        setIsGenerating(false);
        window.print();
      });
    } else {
      window.print();
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-100 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative border border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Xem trước Báo Giá (PDF)</h3>
            <p className="text-xs text-slate-500">Kiểm tra nội dung trước khi in hoặc lưu dưới dạng PDF</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Đóng
            </button>
            <button 
              onClick={handleExportPdf}
              disabled={isGenerating}
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 flex items-center gap-2 disabled:bg-slate-400 disabled:shadow-none transition-all"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo PDF...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Lưu file PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-500/10 custom-scrollbar flex justify-center">
            <div className="shadow-2xl print:shadow-none bg-white">
                {/* Truyền dữ liệu chi tiết xuống Template */}
                <PrintTemplate 
                  items={items} 
                  subTotal={subTotal}
                  discountAmount={discountAmount}
                  finalTotal={finalTotal} 
                />
            </div>
        </div>
      </div>
    </div>
  );
};
