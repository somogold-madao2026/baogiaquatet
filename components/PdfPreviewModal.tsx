
import React, { useState } from 'react';
import { PrintTemplate } from './PrintTemplate';
import { ConfiguredItem } from '../types';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConfiguredItem[];
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
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
    
    // @ts-ignore
    const opt = {
      margin: 0,
      filename: `Bao-Gia-SomoGold-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false)).catch(() => {
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
        <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0">
          <h3 className="font-bold text-slate-800 text-lg">Xem trước Báo Giá (PDF)</h3>
          <div className="flex gap-3">
             <button onClick={onClose} disabled={isGenerating} className="px-4 py-2 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">Đóng</button>
            <button onClick={handleExportPdf} disabled={isGenerating} className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 flex items-center gap-2">
              {isGenerating ? 'Đang tạo PDF...' : 'Lưu file PDF'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-500/10 custom-scrollbar flex justify-center">
            <div className="shadow-2xl print:shadow-none bg-white">
                <PrintTemplate items={items} subTotal={subTotal} discountAmount={discountAmount} finalTotal={finalTotal} />
            </div>
        </div>
      </div>
    </div>
  );
};
