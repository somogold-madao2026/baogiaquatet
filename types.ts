
// 1. Giữ nguyên Enum cũ để constants.ts không bị lỗi
export enum Category {
  BOX = 'Hộp/Bao bì',
  WINE_PREMIUM = 'Cửu Long Mỹ Tửu',
  WINE_SG = 'Rượu truyền thống (SG)',
  WINE_AK = 'Rượu truyền thống (AK)',
  SNACK_BOX = 'Khô ăn liền (Hộp)',
  SNACK_ZIP = 'Khô ăn liền (Túi Zip)',
  JAM = 'Mứt Somo Farm',
  ACCESSORY = 'Phụ kiện'
}

export interface Product {
  id: string;
  name: string;
  // Cho phép cả Enum và string để App.tsx dễ xử lý
  category: Category | string; 
  price: number;
  unit?: string;
}

// Đổi tên PackageRule thành GiftPackageRule hoặc giữ nguyên tùy ý
// Nhưng ở đây tôi dùng PackageRule cho khớp với code cũ của bạn
export interface PackageRule {
  category: Category | string;
  quantity: number;
  isFixed?: boolean;
  fixedProductId?: string;
  allowedCategories?: string[];
}

export interface GiftPackage {
  id: string;
  name: string;
  tier?: 'Cao cấp' | 'Trung cấp' | 'Tiêu chuẩn';
  description?: string;
  rules: PackageRule[]; // Sử dụng PackageRule
  imageUrl: string;
  
  // --- QUAN TRỌNG: Thêm dòng này để sửa lỗi App.tsx ---
  maxDiscount?: number; 
  basePrice?: number;
}

export interface ConfiguredItem {
  instanceId: string;
  packageId: string;
  packageName: string;
  items: Record<string, string[]>;
  quantity: number;
  unitPrice: number;
  details: { product: Product; quantity: number }[];
  
  // --- QUAN TRỌNG: Thêm dòng này ---
  discountRate: number; 
}

export interface ActiveDraft {
  packageId: string | null;
  items: Record<string, string[]>;
  quantity: number;
  
  // --- QUAN TRỌNG: Thêm dòng này ---
  discountRate: number; 
}
