export type PlatformType = "both" | "ios" | "android";

export interface GameRate {
  id: string;
  name: string;
  image: string;
  platform: PlatformType;
  priceIos: number | null;
  priceAndroid: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameRateInput {
  name: string;
  image: string;
  platform: PlatformType;
  priceIos: number | null;
  priceAndroid: number | null;
}
