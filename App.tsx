
import React, { useState, useMemo, useRef, useEffect } from 'react';
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

  // --- STATE CHIẾT KHẤU MỚI ---
  const [discountRate, setDiscountRate] = useState(0);

  const [draft, setDraft] = useState<ActiveDraft>({
    packageId: null,
    items: {},
    quantity: 1,
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
    setDraft({ packageId: pkg.id, items: initialItems, quantity: 1 });
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

    const isComplete = selectedPackage.rules.every(rule => 
      draft.items[rule.category]?.every(id => id !== '')
    );

    return { unitPrice, details, isComplete };
  }, [draft, selectedPackage]);

  const saveToQuote = () => {
    if (!selectedPackage || !draftCalculation?.isComplete || draft.quantity < 1) return;

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
          }
        : item
      ));
      setEditingId(null);
    } else {
      const newItem: ConfiguredItem = {
        instanceId: crypto.randomUUID(),
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        items: { ...draft.items },
        quantity: draft.quantity,
        unitPrice: draftCalculation.unitPrice,
        details: [...draftCalculation.details],
      };
      setQuoteItems(prev => [...prev, newItem]);
    }

    setDraft({ packageId: null, items: {}, quantity: 1 });
  };

  const handleEdit = (id: string) => {
    const itemToEdit = quoteItems.find(i => i.instanceId === id);
    if (itemToEdit) {
      setDraft({
        packageId: itemToEdit.packageId,
        items: { ...itemToEdit.items },
        quantity: itemToEdit.quantity,
      });
      setEditingId(id);
      scrollToConfig();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ packageId: null, items: {}, quantity: 1 });
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

  // --- LOGIC TÍNH TỔNG & CHIẾT KHẤU ---
  const grandTotal = quoteItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  // Tính toán mức chiết khấu tối đa cho phép dựa trên các gói trong giỏ hàng
  const maxAllowedDiscount = useMemo(() => {
    if (quoteItems.length === 0) return 0;
    
    // Tìm mức chiết khấu thấp nhất trong các gói đang chọn (An toàn cho người bán)
    // Nếu có bất kỳ gói nào chỉ cho phép 15%, thì cả đơn chỉ được max 15%.
    // Chỉ khi TOÀN BỘ là gói 20% (Tấn Lộc) thì mới được max 20%.
    const hasRestrictedPackage = quoteItems.some(item => {
      const pkg = GIFT_PACKAGES.find(p => p.id === item.packageId);
      return (pkg?.maxDiscount || 0) < 20;
    });

    return hasRestrictedPackage ? 15 : 20;
  }, [quoteItems]);

  // Tự động điều chỉnh nếu nhập quá giới hạn
  useEffect(() => {
    if (discountRate > maxAllowedDiscount) {
      setDiscountRate(maxAllowedDiscount);
    }
  }, [maxAllowedDiscount, discountRate]);

  const discountAmount = grandTotal * (discountRate / 100);
  const finalTotal = grandTotal - discountAmount;

  return (
    <>
      <div className="min-h-screen bg-red-700 font-sans transition-colors duration-500 flex flex-col print:hidden">
        <header className="bg-white text-slate-900 border-b border-slate-200 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="h-10 sm:h-12 w-auto flex items-center">
                <img src="https://i.ibb.co/scLt3dT/logo-Somo-Gold.jpg" alt="Somo Gold Logo" className="h-full object-contain" />
              </div>
              <div className="h-6 sm:h-8 w-px bg-slate-200"></div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-black uppercase tracking-tight text-red-700 truncate">Somo Gold</h1>
                <p className="text-slate-400 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest leading-none truncate">Mã Đáo 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6 text-right">
              <div className="flex flex-col items-end">
                <p className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Thanh toán</p>
                <p className="text-sm sm:text-xl font-black tracking-tighter text-slate-900 leading-none">{finalTotal.toLocaleString('vi-VN')}đ</p>
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
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 w-full sm:w-auto justify-center">
                      <span className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-tight">Số lượng:</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setDraft(d => ({...d, quantity: Math.max(1, d.quantity - 1)}))}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm text-slate-600 active:scale-90"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"></path></svg>
                        </button>
                        
                        <input 
                          type="number" 
                          value={draft.quantity === 0 ? '' : draft.quantity}
                          placeholder="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft(d => ({...d, quantity: val === '' ? 0 : Math.max(0, parseInt(val) || 0)}));
                          }}
                          onBlur={() => {
                            if (draft.quantity < 1) setDraft(d => ({...d, quantity: 1}));
                          }}
                          className="w-16 sm:w-20 h-8 sm:h-10 text-center font-black text-lg sm:text-xl bg-white border border-slate-300 rounded-lg outline-none focus:border-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />

                        <button 
                          onClick={() => setDraft(d => ({...d, quantity: d.quantity + 1}))}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm text-slate-600 active:scale-90"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 w-full
