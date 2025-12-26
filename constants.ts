
import { Category, Product, GiftPackage } from './types';

export const PRODUCTS: Product[] = [
  // Packaging
  { id: 'box-tl', name: 'Hộp giấy Mã đáo Tấn Lộc', category: Category.BOX, price: 275000, unit: 'Hộp' },
  { id: 'box-tc', name: 'Hộp giấy Mã Đáo Thành Công', category: Category.BOX, price: 140000, unit: 'Hộp' },
  { id: 'box-thuyen', name: 'Đế thuyền Mã Đáo Bình An', category: Category.BOX, price: 100000, unit: 'Đế' },
  { id: 'box-tui', name: 'Túi nhựa Mã Đáo Bình An', category: Category.BOX, price: 25000, unit: 'Túi' },

  // Accessories
  { id: 'glass', name: 'Ly thủy tinh', category: Category.ACCESSORY, price: 27500, unit: 'Ly' },

  // Wine Premium
  { id: 'wine-hh', name: 'Hoàng Hoa Tửu (500ml)', category: Category.WINE_PREMIUM, price: 605000, unit: 'Chai' },
  { id: 'wine-mm-p', name: 'Minh Mạng Tửu (500ml)', category: Category.WINE_PREMIUM, price: 605000, unit: 'Chai' },
  { id: 'wine-tds', name: 'Tây Dương Sâm Tửu (500ml)', category: Category.WINE_PREMIUM, price: 770000, unit: 'Chai' },

  // Wine SG
  { id: 'wine-bk-sg', name: 'Rượu Ba Kích (SG 500ml)', category: Category.WINE_SG, price: 275000, unit: 'Chai' },
  { id: 'wine-mm-sg', name: 'Rượu Minh Mạng (SG 500ml)', category: Category.WINE_SG, price: 275000, unit: 'Chai' },
  { id: 'wine-hc-sg', name: 'Rượu Hoa Cúc (SG 500ml)', category: Category.WINE_SG, price: 275000, unit: 'Chai' },

  // Wine AK
  { id: 'wine-bk-ak', name: 'Rượu Ba Kích (AK 500ml)', category: Category.WINE_AK, price: 220000, unit: 'Chai' },
  { id: 'wine-mm-ak', name: 'Rượu Minh Mạng (AK 500ml)', category: Category.WINE_AK, price: 220000, unit: 'Chai' },
  { id: 'wine-hc-ak', name: 'Rượu Hoa Cúc (AK 500ml)', category: Category.WINE_AK, price: 220000, unit: 'Chai' },

  // Jams
  { id: 'jam-kl', name: 'Khoai lang sấy miếng', category: Category.JAM, price: 42000, unit: 'Hộp' },
  { id: 'jam-tg', name: 'Trà gừng đen', category: Category.JAM, price: 70000, unit: 'Hộp' },
  { id: 'jam-kc', name: 'Kẹo chuối', category: Category.JAM, price: 60000, unit: 'Hộp' },
  { id: 'jam-ms', name: 'Mít sấy', category: Category.JAM, price: 65000, unit: 'Hộp' },

  // Snacks Zip
  { id: 'snack-cu-zip', name: 'Khô cá đù ớt (115g)', category: Category.SNACK_ZIP, price: 93000, unit: 'Túi Zip' },
  { id: 'snack-cm-zip', name: 'Khô cá đù mè (115g)', category: Category.SNACK_ZIP, price: 93000, unit: 'Túi Zip' },
  { id: 'snack-lt-bo-zip', name: 'Khô cá lòng tong bơ ớt (115g)', category: Category.SNACK_ZIP, price: 145000, unit: 'Túi Zip' },
  { id: 'snack-lt-bm-zip', name: 'Khô cá lòng tong bơ mè (115g)', category: Category.SNACK_ZIP, price: 145000, unit: 'Túi Zip' },
  { id: 'snack-bc-zip', name: 'Khô cá bống cán bung (100g)', category: Category.SNACK_ZIP, price: 70000, unit: 'Túi Zip' },
  { id: 'snack-tk-zip', name: 'Tôm khô loại 1 (115g)', category: Category.SNACK_ZIP, price: 167000, unit: 'Túi Zip' },

  // Snacks Hộp
  { id: 'snack-cu-hop', name: 'Khô cá đù ớt (115g)', category: Category.SNACK_BOX, price: 95000, unit: 'Hộp' },
  { id: 'snack-cm-hop', name: 'Khô cá đù mè (115g)', category: Category.SNACK_BOX, price: 95000, unit: 'Hộp' },
  { id: 'snack-lt-bo-hop', name: 'Khô cá lòng tong bơ ớt (115g)', category: Category.SNACK_BOX, price: 147000, unit: 'Hộp' },
  { id: 'snack-lt-bm-hop', name: 'Khô cá lòng tong bơ mè (115g)', category: Category.SNACK_BOX, price: 147000, unit: 'Hộp' },
  { id: 'snack-bc-hop', name: 'Khô cá bống cán bung (100g)', category: Category.SNACK_BOX, price: 72000, unit: 'Hộp' },
  { id: 'snack-tk-hop', name: 'Tôm khô loại 1 (115g)', category: Category.SNACK_BOX, price: 169000, unit: 'Hộp' },
];

export const GIFT_PACKAGES: GiftPackage[] = [
  {
    id: 'tan-loc',
    name: 'Mã Đáo Tấn Lộc',
    tier: 'Cao cấp',
    description: 'Thiết kế cao cấp với hộp giấy và bộ ly thủy tinh.',
    imageUrl: 'https://i.ibb.co/ZzCNTkv8/M-O-T-N-L-C.jpg',
    maxDiscount: 20, // Đã thêm: Tối đa 20%
    rules: [
      { category: Category.BOX, quantity: 1, isFixed: true, fixedProductId: 'box-tl' },
      { category: Category.WINE_PREMIUM, quantity: 2, isFixed: false },
      { category: Category.ACCESSORY, quantity: 6, isFixed: true, fixedProductId: 'glass' },
    ]
  },
  {
    id: 'thanh-cong',
    name: 'Mã Đáo Thành Công',
    tier: 'Trung cấp',
    description: 'Thiết kế trung cấp sang trọng, cân đối giữa rượu và khô mứt.',
    imageUrl: 'https://i.ibb.co/7JPc5g4f/M-O-TH-NH-C-NG.jpg',
    maxDiscount: 15, // Đã thêm: Tối đa 15%
    rules: [
      { category: Category.BOX, quantity: 1, isFixed: true, fixedProductId: 'box-tc' },
      { category: Category.WINE_SG, quantity: 1, isFixed: false },
      { category: Category.SNACK_BOX, quantity: 2, isFixed: false },
      { category: Category.JAM, quantity: 2, isFixed: false },
    ]
  },
  {
    id: 'binh-an-thuyen',
    name: 'Mã Đáo Bình An (Đế Thuyền)',
    tier: 'Tiêu chuẩn',
    description: 'Mô hình đế thuyền độc đáo, nhiều loại mứt đa dạng.',
    imageUrl: 'https://i.ibb.co/SXJPYdBD/M-O-B-NH-AN-THUY-N.jpg',
    maxDiscount: 15, // Đã thêm: Tối đa 15%
    rules: [
      { category: Category.BOX, quantity: 1, isFixed: true, fixedProductId: 'box-thuyen' },
      { category: Category.WINE_AK, quantity: 1, isFixed: false },
      { category: Category.SNACK_BOX, quantity: 2, isFixed: false },
      { category: Category.JAM, quantity: 4, isFixed: false },
    ]
  },
  {
    id: 'binh-an-tui',
    name: 'Mã Đáo Bình An (Túi)',
    tier: 'Tiêu chuẩn',
    description: 'Tiết kiệm và thực tế với túi nhựa bền đẹp.',
    imageUrl: 'https://i.ibb.co/Q3NzCYd4/M-O-B-NH-AN-T-I-NH-A.jpg',
    maxDiscount: 15, // Đã thêm: Tối đa 15%
    rules: [
      { category: Category.BOX, quantity: 1, isFixed: true, fixedProductId: 'box-tui' },
      { category: Category.WINE_AK, quantity: 1, isFixed: false },
      { category: Category.SNACK_ZIP, quantity: 2, isFixed: false },
      { category: Category.JAM, quantity: 2, isFixed: false },
    ]
  }
];
