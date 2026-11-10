export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName?: string;
}

export interface StoreSettings {
  // Payment Account Settings
  accountName: string;
  kbankNumber: string; // Retained for backwards compatibility / fallback
  bankAccounts?: BankAccountItem[]; // Multi-bank support (editable bank name, account number & holder)
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

export const COMMON_THAI_BANKS = [
  "กสิกรไทย (KBANK / K-Plus)",
  "ไทยพาณิชย์ (SCB)",
  "กรุงเทพ (BBL)",
  "กรุงไทย (KTB)",
  "กรุงศรีอยุธยา (BAY)",
  "ทหารไทยธนชาต (ttb)",
  "ออมสิน (GSB)",
  "พร้อมเพย์ (PromptPay)",
  "ยูโอบี (UOB)",
  "เกียรตินาคินภัทร (KKP)",
  "ซีไอเอ็มบี ไทย (CIMB)",
  "แลนด์ แอนด์ เฮ้าส์ (LH Bank)",
] as const;

export const DEFAULT_BANK_ACCOUNTS: BankAccountItem[] = [
  {
    id: "bank-kbank-default",
    bankName: "กสิกรไทย (K-Plus)",
    accountNumber: "151-8-83098-4",
    accountName: "ภัทรธิดา",
  },
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  accountName: "ภัทรธิดา",
  kbankNumber: "151-8-83098-4",
  bankAccounts: DEFAULT_BANK_ACCOUNTS,
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

export function resolveBankAccounts(
  settings?: Partial<StoreSettings> | null
): BankAccountItem[] {
  if (Array.isArray(settings?.bankAccounts) && settings.bankAccounts.length > 0) {
    return settings.bankAccounts;
  }
  if (settings?.kbankNumber) {
    return [
      {
        id: "bank-legacy",
        bankName: "กสิกรไทย (K-Plus)",
        accountNumber: settings.kbankNumber,
        accountName: settings.accountName || DEFAULT_STORE_SETTINGS.accountName,
      },
    ];
  }
  return DEFAULT_BANK_ACCOUNTS;
}
