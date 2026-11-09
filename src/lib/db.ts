import type { GameRate, GameRateInput, PlatformType } from "@/types/game";

export function listGames(_filter?: {
  query?: string;
  platform?: "all" | PlatformType;
}): GameRate[] {
  throw new Error("Not implemented");
}

export function getGameById(_id: string): GameRate | null {
  throw new Error("Not implemented");
}

export function createGame(_input: GameRateInput): GameRate {
  throw new Error("Not implemented");
}

export function updateGame(_id: string, _input: GameRateInput): GameRate | null {
  throw new Error("Not implemented");
}

export function deleteGame(_id: string): boolean {
  throw new Error("Not implemented");
}

export function resetDbForTests(): void {
  throw new Error("Not implemented");
}
