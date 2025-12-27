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
    <div id="print-section" className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-[10mm] md:p-[15mm] mx-auto relative">
      
      {/* CẤU TRÚC BẢNG TỔNG */}
      <table className="w-full border-collapse">
        
        {/* 1. THEAD: Header (Lặp lại mỗi trang) */}
        <thead className="table-header-group">
          <tr>
            <td>
              {/* items-center: Giúp Logo và Chữ bên phải CĂN GIỮA theo trục dọc */}
              <div className="flex justify-between items-center border-b-2 border-red-700 pb-4 mb-6">
                
                {/* Logo bên trái */}
                <div className="flex items-center gap-4">
                  <img src="https://i.ibb.co/MyS3gW1Y/logo.png" alt="Somo Gold" className="h-24 w-auto object-contain" />
                </div>
                
                {/* Text bên phải (Đã sửa theo yêu cầu) */}
                <div className="text-right">
                  {/* Dòng 1: Báo Giá Quà Tết */}
                  <p className="text-xl font-bold uppercase text-slate-800 leading-none">
                    Báo Giá Quà Tết
                  </p>
                  
                  {/* Dòng 2: Mã Đáo 2026 (To, Đỏ, Đậm) */}
                  <h2 className="text-4xl font-black uppercase text-red-700 tracking-tighter my-1">
                    Mã Đáo 2026
                  </h2>
                  
                  {/* Dòng 3: Ngày lập bảng */}
                  <p className="text-sm text-slate-500 italic">
                    Ngày lập bảng: {new Date().toLocaleDateString('vi-VN')}
                  </p>
                </div>

              </div>
              
              {/* Khoảng đệm dưới header */}
              <div className="h-4"></div>
            </td>
          </tr>
        </thead>

        {/* 2. TBODY: Nội dung chính */}
        <tbody>
          <tr>
            <td className="align-top">
              
              {/* Thông tin khách hàng */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block font-bold text-slate-500 uppercase text-xs mb-1">Đơn vị gửi báo giá:</span>
                    <p className="font-bold text-slate-900">CÔNG TY CỔ PHẦN SOMO GOLD</p>
                    <p className="text-slate-600">29 Nguyễn Khắc Nhu, P. Cô Giang, Q.1, TP.HCM</p>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-500 uppercase text-xs mb-1">Kính gửi:</span>
                    <p className="font-bold text-slate-900">Quý Khách Hàng / Đối Tác</p>
                    <p className="text-slate-600">...........................................................................</p>
                  </div>
                </div>
              </div>

              {/* Bảng sản phẩm */}
              <div className="mb-4">
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
                      <tr key={item.instanceId} className="group break-inside-avoid">
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

              {/* Tổng tiền */}
              <div className="mt-2 border-t-2 border-slate-200 pt-4 break-inside-avoid">
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

              {/* Chữ ký */}
              <div className="mt-12 grid grid-cols-2 gap-8 text-left text-sm pb-8 break-inside-avoid">
                <div>
                  <p className="font-bold uppercase text-slate-500 mb-16">Người lập phiếu</p>
                  <p className="font-bold">Võ Quốc Khách</p>
                </div>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
