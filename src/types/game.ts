export type PlatformType = "both" | "ios" | "android";
export type CategoryType = "game" | "app";

export interface GameRate {
  id: string;
  name: string;
  image: string;
  category: CategoryType;
  platform: PlatformType;
  priceIos: number | null;
  priceAndroid: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameRateInput {
  name: string;
  image: string;
  category: CategoryType;
  platform: PlatformType;
  priceIos: number | null;
  priceAndroid: number | null;
}
