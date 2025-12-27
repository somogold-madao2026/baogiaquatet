
import React, { useState, useMemo, useRef } from 'react';
import { ActiveDraft, ConfiguredItem, GiftPackage, Product } from './types';
import { GIFT_PACKAGES, PRODUCTS } from './constants';
import { PackageSelector } from './components/PackageSelector';
import { Configurator } from './components/Configurator';
import { QuoteList } from './components/QuoteList';
import { PdfPreviewModal } from './components/PdfPreviewModal';

const App: React.FC = () => {
  const [quoteItems, setQuoteItems] = useState<ConfiguredItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const rulesContainerRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<ActiveDraft>({
    packageId: null,
    items: {},
    quantity: 1,
    discountRate: 0, 
  });

  const selectedPackage = useMemo(() => 
    GIFT_PACKAGES.find(p => p.id === draft.packageId) || null
  , [draft.packageId]);

  const handlePackageSelect = (pkg: GiftPackage) => {
    const initialItems: Record<string, string[]> = {};
    pkg.rules.forEach(rule => {
      if (rule.isFixed && rule.fixedProductId) {
        initialItems[rule.category] = Array(rule.quantity).fill(rule.fixedProductId);
      } else {
        initialItems[rule.category] = Array(rule.quantity).fill('');
      }
    });
    setDraft({ packageId: pkg.id, items: initialItems, quantity: 1, discountRate: 0 });
  };

  const scrollToConfig = () => {
    if (rulesContainerRef.current) {
      rulesContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      configuratorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemSelect = (category: string, index: number, productId: string) => {
    setDraft(prev => {
      const newItems = { ...prev.items };
      const categoryItems = [...(newItems[category] || [])];
      categoryItems[index] = productId;
      newItems[category] = categoryItems;
      return { ...prev, items: newItems };
    });
  };

  // --- TÍNH TOÁN DRAFT ---
  const draftCalculation = useMemo(() => {
    if (!selectedPackage) return null;
    let unitPrice = 0;
    const details: { product: Product; quantity: number }[] = [];

    (Object.entries(draft.items) as [string, string[]][]).forEach(([cat, ids]) => {
      ids.forEach(id => {
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
          unitPrice += product.price;
          const existing = details.find(d => d.product.id === product.id);
          if (existing) existing.quantity += 1;
          else details.push({ product, quantity: 1 });
        }
      });
    });

    const preDiscountTotal = unitPrice * draft.quantity; 
    const discountAmount = Math.round(preDiscountTotal * (draft.discountRate / 100)); 
    
    const taxableAmount = preDiscountTotal - discountAmount; 
    const vatAmount = Math.round(taxableAmount * 0.1); 
    const finalTotal = taxableAmount + vatAmount; 

    const isComplete = selectedPackage.rules.every(rule => 
      draft.items[rule.category]?.every(id => id !== '')
    );

    return { 
      unitPrice, 
      details, 
      isComplete,
      preDiscountTotal,
      discountAmount,
      taxableAmount, 
      vatAmount,     
      finalTotal
    };
  }, [draft, selectedPackage]);

  const handleDraftDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPackage) return;
    
    let val = parseInt(e.target.value) || 0;
    const max = selectedPackage.maxDiscount || 0;

    if (val < 0) val = 0;
    if (val > max) val = max;

    setDraft(prev => ({ ...prev, discountRate: val }));
  };

  const saveToQuote = () => {
    if (!selectedPackage || !draftCalculation?.isComplete || draft.quantity < 1) return;

    // --- [ĐÃ SỬA LỖI TRẮNG MÀN HÌNH TẠI ĐÂY] ---
    // Thay crypto.randomUUID() bằng timestamp để an toàn trên mọi trình duyệt
    const safeId = new Date().getTime().toString() + Math.random().toString(36).substr(2, 5);

    if (editingId) {
      setQuoteItems(prev => prev.map(item => 
        item.instanceId === editingId 
        ? {
            ...item,
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            items: { ...draft.items },
            quantity: draft.quantity,
            unitPrice: draftCalculation.unitPrice,
            details: [...draftCalculation.details],
            discountRate: draft.discountRate,
          }
        : item
      ));
      setEditingId(null);
    } else {
      const newItem: ConfiguredItem = {
        instanceId: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        items: { ...draft.items },
        quantity: draft.quantity,
        unitPrice: draftCalculation.unitPrice,
        details: [...draftCalculation.details],
        discountRate: draft.discountRate,
      };
      setQuoteItems(prev => [...prev, newItem]);
    }

    setDraft({ packageId: null, items: {}, quantity: 1, discountRate: 0 });
  };

  const handleEdit = (id: string) => {
    const itemToEdit = quoteItems.find(i => i.instanceId === id);
    if (itemToEdit) {
      setDraft({
        packageId: itemToEdit.packageId,
        items: { ...itemToEdit.items },
        quantity: itemToEdit.quantity,
        discountRate: itemToEdit.discountRate || 0,
      });
      setEditingId(id);
      scrollToConfig();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ packageId: null, items: {}, quantity: 1, discountRate: 0 });
  };

  const removeFromQuote = (id: string) => {
    if (editingId === id) cancelEdit();
    setQuoteItems(prev => prev.filter(item => item.instanceId !== id));
  };

  const updateQuoteItemQuantity = (id: string, q: number) => {
    setQuoteItems(prev => prev.map(item => 
      item.instanceId === id ? { ...item, quantity: Math.max(0, q) } : item
    ));
  };

  const handleExportPdf = () => {
    setShowPdfPreview(true);
  };

  // --- [ĐÃ SỬA LẠI LOGIC TÍNH TỔNG] ---
  // Tính tổng tiền trước thuế của tất cả các món -> Sau đó mới nhân VAT 10%
  const overallMetrics = useMemo(() => {
    // 1. Tính tổng giá trị các đơn hàng (Giá gốc & Tiền chiết khấu)
    const totals = quoteItems.reduce((acc, item) => {
      const itemGross = item.unitPrice * item.quantity;
      const itemDiscount = Math.round(itemGross * (item.discountRate / 100));
      
      return {
        gross: acc.gross + itemGross,
        discount: acc.discount + itemDiscount
      };
    }, { gross: 0, discount: 0 });

    // 2. Tính Tổng tiền trước thuế
    const preTaxTotal = totals.gross - totals.discount;

    // 3. Tính VAT 1 lần duy nhất trên tổng đơn (10%)
    const vatAmount = Math.round(preTaxTotal * 0.1);

    // 4. Tổng thanh toán cuối cùng
    const finalTotal = preTaxTotal + vatAmount;

    return {
      subTotal: totals.gross,       // Tổng giá trị hàng hóa
      discountAmount: totals.discount, // Tổng tiền giảm
      vatAmount,                    // VAT tổng
      finalTotal                    // Tổng thanh toán
    };
  }, [quoteItems]);

  return (
    <>
      <div className="min-h-screen bg-red-700 font-sans transition-colors duration-500 flex flex-col print:hidden">
        <header className="bg-white text-slate-900 border-b border-slate-200 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-3 py-1 sm:px-4 sm:py-1 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="h-16 sm:h-20 w-auto flex items-center">
                <img src="https://i.ibb.co/KHtjSTp/logosomogold.png" alt="Somo Gold" className="h-48 w-auto object-contain" />
              </div>
              <div className="h-6 sm:h-8 w-px bg-slate-200"></div>
              <div className="min-w-0">
                <p className="text-red-700 text-xl sm:text-3xl font-bold uppercase tracking-widest leading-none truncate">Mã Đáo 2026</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 sm:gap-6 text-right">
              <div className="flex flex-col items-end">
                <p className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Thanh toán</p>
                <p className="text-sm sm:text-xl font-black tracking-tighter text-slate-900 leading-none">
                  {overallMetrics.finalTotal.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 flex-grow">
          <div className="xl:col-span-8 space-y-6 sm:space-y-8">
            <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-800/20 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] sm:text-xs">1</span>
                  Chọn Mẫu Quà Tặng
                </h2>
              </div>
              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                  {GIFT_PACKAGES.map(pkg => (
                    <PackageSelector 
                      key={pkg.id} 
                      pkg={pkg} 
                      isSelected={draft.packageId === pkg.id}
                      onSelect={() => handlePackageSelect(pkg)}
                      onNext={scrollToConfig}
                    />
                  ))}
                </div>
              </div>
            </section>

            {selectedPackage && (
              <section ref={configuratorRef} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-800/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-24">
                <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] sm:text-xs">2</span>
                      {editingId ? 'Sửa Phần Quà' : 'Tùy Chỉnh'}
                    </h2>
                    {editingId && (
                      <span className="bg-indigo-100 text-indigo-700 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-200 uppercase">Sửa</span>
                    )}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase truncate max-w-[120px]">
                    {selectedPackage.name}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    <div className="lg:col-span-5">
                      <div className="sticky top-32 space-y-4">
                        <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-50 max-w-[300px] mx-auto lg:max-w-none">
                          <img 
                            src={selectedPackage.imageUrl} 
                            alt={selectedPackage.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 sm:p-4 bg-red-50 rounded-xl border border-red-100 transition-colors">
                          <p className="text-[10px] text-red-600 font-bold uppercase mb-1">Ghi chú quy cách</p>
                          <p className="text-[10px] sm:text-xs text-red-800 leading-relaxed italic">
                            Thành phần thay đổi theo lựa chọn nhưng vẫn đảm bảo quy cách bao bì mẫu.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div ref={rulesContainerRef} className="lg:col-span-7 space-y-6 sm:space-y-8 scroll-mt-28">
                      {selectedPackage.rules.map(rule => (
                        <Configurator 
                          key={rule.category}
                          rule={rule}
                          selections={draft.items[rule.category] || []}
                          onSelect={(idx, pid) => handleItemSelect(rule.category, idx, pid)}
                        />
                      ))}

                      <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200 space-y-4">
                        
                        <div className="flex flex-wrap items-end gap-6 sm:gap-12">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Số lượng</label>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setDraft(d => ({...d, quantity: Math.max(1, d.quantity - 1)}))}
                                className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 shadow-sm text-slate-600 active:scale-95 transition-transform"
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                value={draft.quantity === 0 ? '' : draft.quantity}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDraft(d => ({...d, quantity: val === '' ? 0 : Math.max(0, parseInt(val) || 0)}));
                                }}
                                onBlur={() => { if (draft.quantity < 1) setDraft(d => ({...d, quantity: 1})); }}
                                className="w-14 h-9 text-center font-black text-lg bg-white border border-slate-300 rounded-lg focus:border-red-500 outline-none"
                              />
                              <button 
                                onClick={() => setDraft(d => ({...d, quantity: d.quantity + 1}))}
                                className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 shadow-sm text-slate-600 active:scale-95 transition-transform"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              Chiết khấu
                              <span className="text-[9px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Max: {selectedPackage.maxDiscount}%</span>
                            </label>
                            <div className="relative w-28">
                              <input 
                                type="number" 
                                value={draft.discountRate === 0 ? '' : draft.discountRate}
                                placeholder="0"
                                onChange={handleDraftDiscountChange}
                                className="w-full h-9 pl-3 pr-8 font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-red-500 outline-none text-center"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex flex-col gap-2 text-sm">
                          <div className="flex justify-between text-slate-500">
                            <span>Đơn giá:</span>
                            <span>{(draftCalculation?.unitPrice || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                          
                          <div className="flex justify-between text-slate-500">
                            <span>Thành tiền ({draft.quantity} phần):</span>
                            <span>{(draftCalculation?.preDiscountTotal || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                          
                          {draft.discountRate > 0 && (
                            <div className="flex justify-between text-green-600 font-medium">
                              <span>Chiết khấu ({draft.discountRate}%):</span>
                              <span>- {(draftCalculation?.discountAmount || 0).toLocaleString('vi-VN')}đ</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-slate-700 font-bold border-t border-dashed border-slate-200 pt-2 mt-1">
                            <span>Tạm tính (Trước VAT):</span>
                            <span>{(draftCalculation?.taxableAmount || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                          
                          <div className="flex justify-between text-slate-500 italic">
                            <span>VAT (10%):</span>
                            <span>+ {(draftCalculation?.vatAmount || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                          
                          <div className="flex justify-between text-red-700 text-lg font-black pt-2 border-t border-slate-200 mt-1">
                            <span>TỔNG CỘNG:</span>
                            <span>{(draftCalculation?.finalTotal || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                        </div>
                        
                      </div>

                      <div className="flex gap-3 pt-2">
                        {editingId && (
                          <button 
                            onClick={cancelEdit}
                            className="flex-1 px-4 py-3 rounded-xl font-bold uppercase text-slate-500 border border-slate-200 hover:bg-slate-50 text-xs"
                          >
                            Hủy
                          </button>
                        )}
                        <button 
                          onClick={saveToQuote}
                          disabled={!draftCalculation?.isComplete || draft.quantity < 1}
                          className={`flex-[3] px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all ${
                            (draftCalculation?.isComplete && draft.quantity >= 1)
                            ? (editingId ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200')
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {editingId ? 'Lưu thay đổi' : 'Thêm vào báo giá'}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </section>
            )}

            {!selectedPackage && (
              <div className="h-48 sm:h-64 flex flex-col items-center justify-center border-2 border-dashed border-red-400/30 rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🧧</div>
                <p className="text-sm font-medium text-center px-4 opacity-80 tracking-wide">Vui lòng chọn một mẫu quà tặng để bắt đầu</p>
              </div>
            )}
          </div>

          <div className="xl:col-span-4">
            <div className="sticky top-20 sm:top-28 space-y-6">
             <QuoteList 
                items={quoteItems} 
                onRemove={removeFromQuote} 
                onEdit={handleEdit}
                onUpdateQuantity={updateQuoteItemQuantity}
                onExport={handleExportPdf}
                subTotal={overallMetrics.subTotal}
                discountAmount={overallMetrics.discountAmount}
                vatAmount={overallMetrics.vatAmount}
                finalTotal={overallMetrics.finalTotal}
                maxDiscount={0}
                discountRate={0}
                discountInput="0"
                onDiscountChange={() => {}}
              />
            </div>
          </div>
        </main>

        <footer className="bg-slate-900 text-white mt-auto border-t border-slate-800">
           <div className="max-w-7xl mx-auto px-4 py-3">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-500">© 2025 Somo Gold Corp. All rights reserved.</p>
                <p className="text-xs font-bold">Hotline: 039.915.3674</p>
             </div>
           </div>
        </footer>

        {quoteItems.length > 0 && (
          <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-2xl z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="text-[8px] uppercase text-slate-400 font-bold leading-none mb-1">Thanh toán</p>
                <p className="text-lg font-black text-red-600 leading-none">{overallMetrics.finalTotal.toLocaleString('vi-VN')}đ</p>
              </div>
              <button 
                onClick={handleExportPdf}
                className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase shadow-lg shadow-red-200 whitespace-nowrap"
              >
                Xuất báo giá
              </button>
            </div>
          </div>
        )}
      </div>

      <PdfPreviewModal 
        isOpen={showPdfPreview} 
        onClose={() => setShowPdfPreview(false)} 
        items={quoteItems} 
        subTotal={overallMetrics.subTotal}
        discountAmount={overallMetrics.discountAmount}
        finalTotal={overallMetrics.finalTotal} 
      />
    </>
  );
};

export default App;
