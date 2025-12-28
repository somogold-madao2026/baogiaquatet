
// Bạn vẫn có thể giữ Enum này để dùng cho việc hiển thị tên hiển thị (Label)
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
  // Đổi thành string để tránh lỗi xung đột kiểu khi import dữ liệu
  category: string; 
  price: number;
  unit?: string; // Để optional (?) để không bắt buộc phải có
}

export interface GiftPackageRule {
  // Đổi thành string để khớp với key trong Record<string, string[]> của App.tsx
  category: string; 
  quantity: number;
  isFixed?: boolean; // Optional
  fixedProductId?: string;
  allowedCategories?: string[];
}

export interface GiftPackage {
  id: string;
  name: string;
  // tier?: 'Cao cấp' | 'Trung cấp' | 'Tiêu chuẩn'; // Có thể giữ hoặc bỏ tùy nhu cầu
  description?: string;
  rules: GiftPackageRule[];
  imageUrl: string;
  maxDiscount?: number; // Bắt buộc có để App.tsx không lỗi logic chiết khấu
  basePrice?: number;
}

export interface ConfiguredItem {
  instanceId: string;
  packageId: string;
  packageName: string;
  // Quan trọng: Record này dùng string key để tương thích với Object.entries()
  items: Record<string, string[]>; 
  quantity: number;
  unitPrice: number;
  details: { product: Product; quantity: number }[];
  
  // Lưu % chiết khấu
  discountRate: number; 
}

export interface ActiveDraft {
  packageId: string | null;
  items: Record<string, string[]>;
  quantity: number;
  
  // Lưu % chiết khấu
  discountRate: number; 
}
