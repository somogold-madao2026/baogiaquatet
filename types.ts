
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
  category: Category;
  price: number;
  unit: string;
}

export interface PackageRule {
  category: Category;
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
  maxDiscount?: number; // QUAN TRỌNG: Dòng này giúp App.tsx không bị lỗi
}

export interface ConfiguredItem {
  instanceId: string;
  packageId: string;
  packageName: string;
  items: Record<string, string[]>;
  quantity: number;
  unitPrice: number;
  details: { product: Product; quantity: number }[];
}

export interface ActiveDraft {
  packageId: string | null;
  items: Record<string, string[]>;
  quantity: number;
}
