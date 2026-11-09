export interface StoreSettings {
  // Payment Account Settings
  accountName: string;
  kbankNumber: string;
  trueNumber: string;
  slipNote: string;
  qrImage: string;

  // Contact Admin Settings
  adminName: string;
  adminAvatar: string;
  facebookName: string;
  facebookUrl: string;
  lineName: string;
  lineUrl: string;
  lineId: string;

  updatedAt?: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  accountName: "ภัทรธิดา",
  kbankNumber: "151-8-83098-4",
  trueNumber: "096-018-0967",
  slipNote: "ยินยอมซื้อขายFb Pat Pattida",
  qrImage: "/payment-qr.jpg",

  adminName: "Nongfo",
  adminAvatar: "/admin-profile.jpg",
  facebookName: "Thitima Nongfo",
  facebookUrl: "https://www.facebook.com/share/1BmFBDETNn/",
  lineName: "Add LINE friend (@709qwuff)",
  lineUrl: "https://lin.ee/T8apadZU",
  lineId: "@709qwuff",
};
