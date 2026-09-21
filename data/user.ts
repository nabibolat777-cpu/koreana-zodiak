/**
 * Prototype auth stand-in (see PRD #50). There is no real authentication
 * yet — every visitor is signed in as this mock customer so the
 * "My Booking" / camera-access flows can be demonstrated end-to-end.
 * Swap this for a real session/user provider when auth is implemented.
 */
import type { AppUser } from "@/types";

export const MOCK_CURRENT_USER: AppUser = {
  id: "u-demo",
  name: "Гость",
  phone: "+7 700 123 45 67",
  role: "customer",
};
