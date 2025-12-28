
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
  // Cho phép cả Enum và string để tránh lỗi type
  category: Category | string;
  price: number; // Giá hiển thị (đã chia 1.1)
  originalPrice: number; // GIÁ GỐC ĐỂ TÍNH TOÁN (Đã bao gồm VAT)
  unit: string;
}

export interface PackageRule {
  category: Category | string;
  quantity: number;
  isFixed: boolean;
  fixedProductId?: string;
}

export interface GiftPackage {
  id: string;
  name: string;
  tier: 'Cao cấp' | 'Trung cấp' | 'Tiêu chuẩn';
  description: string;
  rules: PackageRule[];
  imageUrl: string;
  maxDiscount?: number;
}

export interface ConfiguredItem {
  instanceId: string;
  packageId: string;
  packageName: string;
  items: Record<string, string[]>;
  quantity: number;
  unitPrice: number;
  details: { product: Product; quantity: number }[];
  discountRate: number; 
}

export interface ActiveDraft {
  packageId: string | null;
  items: Record<string, string[]>;
  quantity: number;
  discountRate: number; 
}
