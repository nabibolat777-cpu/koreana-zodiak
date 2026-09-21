/**
 * Authentication-ready role model (see PRD #50-51).
 * Prototype signs everyone in as a mock CUSTOMER — no real auth yet.
 */
export type UserRole = "customer" | "staff" | "admin";

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}
