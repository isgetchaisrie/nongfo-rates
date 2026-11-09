export const ADMIN_COOKIE_NAME = "nk_admin_session";

export function createAdminToken(): string {
  throw new Error("Not implemented");
}

export function verifyAdminToken(_token: string | undefined): boolean {
  throw new Error("Not implemented");
}

export function verifyAdminPassword(_password: string): boolean {
  throw new Error("Not implemented");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  throw new Error("Not implemented");
}
