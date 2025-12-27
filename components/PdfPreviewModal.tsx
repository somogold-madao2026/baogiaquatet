
import React from 'react';
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
  if (!isOpen) return null;

  // --- HÀM XỬ LÝ IN ẤN MỚI (Hỗ trợ lặp lại Header) ---
  const handlePrint = () => {
    // 1. Lấy nội dung tờ báo giá từ màn hình xem trước
    const printContent = document.getElementById('print-section');
    if (!printContent) return;

    // 2. Tạo một cửa sổ mới (Popup) để chứa nội dung in
    const printWindow = window.open('', '', 'height=1000,width=1000');
    if (!printWindow) {
      alert('Vui lòng cho phép mở Pop-up để tải file PDF');
      return;
    }

    // 3. Chuẩn bị nội dung HTML cho cửa sổ in
    printWindow.document.write('<html><head><title>Báo Giá Somo Gold</title>');

    // 4. QUAN TRỌNG: Copy toàn bộ Style (Tailwind) từ trang chính sang trang in
    // Việc này đảm bảo báo giá in ra đẹp y hệt như trên web
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach(node => {
      printWindow.document.head.appendChild(node.cloneNode(true));
    });

    // 5. Thêm CSS bổ sung để ép trình duyệt lặp lại Header
    printWindow.document.write(`
      <style>
        @media print {
          @page { margin: 10mm; size: A4; } /* Căn lề giấy in */
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } /* In đúng màu nền */
          
          /* Lệnh ép Header lặp lại ở mọi trang */
          thead { display: table-header-group !important; }
          tbody { display: table-row-group !important; }
          tr { page-break-inside: avoid !important; }
        }
      </style>
    `);

    printWindow.document.write('</head><body class="bg-white">');
    printWindow.document.write(printContent.innerHTML); // Dán nội dung báo giá vào
    printWindow.document.write('</body></html>');
    
    printWindow.document.close(); // Kết thúc quá trình ghi

    // 6. Đợi 1 chút cho Style load xong thì mới bật hộp thoại In
    setTimeout(() => {
      printWindow.focus();
      printWindow.print(); // Bật cửa sổ chọn máy in/Lưu PDF
      printWindow.close(); // Tự đóng cửa sổ tạm sau khi in xong
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative border border-slate-700">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0 z-10">
          <div>
            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Xem trước Báo Giá</h3>
            <p className="text-xs text-slate-500">Kiểm tra thông tin trước khi xuất file</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-100 custom-scrollbar flex justify-center">
            {/* Thu nhỏ bản xem trước trên màn hình nhỏ để dễ nhìn */}
            <div className="shadow-2xl print:shadow-none bg-white origin-top scale-[0.6] sm:scale-[0.8] lg:scale-100 transition-transform">
                <PrintTemplate items={items} subTotal={subTotal} discountAmount={discountAmount} finalTotal={finalTotal} />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex justify-end gap-3 z-10">
           <button 
             onClick={onClose} 
             className="px-6 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors uppercase"
           >
             Đóng
           </button>
           
           <button 
             onClick={handlePrint} 
             className="px-8 py-3 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-700 shadow-lg shadow-red-200 flex items-center gap-2 uppercase tracking-wider active:scale-95 transition-all"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
             Lưu File PDF (Có Header)
           </button>
        </div>

      </div>
    </div>
  );
};
