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

  // --- STATE CHIẾT KHẤU ---
  const [discountRate, setDiscountRate] = useState<number>(0);
  // Thêm state phụ để xử lý hiển thị input mượt mà (cho phép xóa rỗng)
  const [discountInput, setDiscountInput] = useState<string>("0");

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
  
  const maxAllowedDiscount = useMemo(() => {
    if (quoteItems.length === 0) return 0;
    const hasRestrictedPackage = quoteItems.some(item => {
      const pkg = GIFT_PACKAGES.find(p => p.id === item.packageId);
      return (pkg?.maxDiscount || 0) < 20;
    });
    return hasRestrictedPackage ? 15 : 20;
  }, [quoteItems]);

  // Đồng bộ hóa khi maxAllowedDiscount thay đổi hoặc discountRate vượt mức
  useEffect(() => {
    if (discountRate > maxAllowedDiscount) {
      setDiscountRate(maxAllowedDiscount);
      setDiscountInput(maxAllowedDiscount.toString());
    }
  }, [maxAllowedDiscount, discountRate]);

  const discountAmount = grandTotal * (discountRate / 100);
  const finalTotal = grandTotal - discountAmount;

  // Xử lý khi nhập input chiết khấu
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // 1. Nếu xóa hết -> cho phép hiển thị rỗng, nhưng giá trị tính toán là 0
    if (val === '') {
      setDiscountInput('');
      setDiscountRate(0);
      return;
    }

    // 2. Chặn nhập ký tự không phải số
    const numVal = parseInt(val, 10);
    if (isNaN(numVal)) return;

    // 3. Giới hạn max
    let finalVal = numVal;
    if (finalVal > maxAllowedDiscount) finalVal = maxAllowedDiscount;
    if (finalVal < 0) finalVal = 0;

    setDiscountInput(finalVal.toString());
    setDiscountRate(finalVal);
  };

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
          {/* LEFT COLUMN: SELECTION */}
          <div className="xl:col-span-8 space-y-6 sm:space-
