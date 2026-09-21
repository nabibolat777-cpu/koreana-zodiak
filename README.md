# Koreana BBQ × Zodiak — Digital Platform (Prototype / MVP)

Restaurant + billiard-club digital platform for Koreana BBQ × Zodiak (Astana).
Built with Next.js (App Router), TypeScript and Tailwind CSS, per the product PRD.

> **Note on this build**: this code was written in a sandboxed environment with
> no access to the npm registry, so `npm install` / `npm run build` could not
> be executed or verified here. The code follows standard, stable Next.js 14 /
> React 18 / Tailwind 3 patterns throughout and was carefully cross-checked
> (every import resolved against its export, every referenced file/image
> confirmed to exist), but you should run a first `npm install && npm run dev`
> locally and treat this README's "Known follow-ups" section as the first
> checklist.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. To regenerate the placeholder imagery (see
below) after changing menu/restaurant categories:

```bash
npm run generate:placeholders
```

## What's implemented (MVP scope, PRD §76)

- **Restaurant**: home page, restaurant gallery + experience cards, interactive
  menu with category filters + search, Best Sellers, preparation time on every
  dish, restaurant table booking form with mock confirmation.
- **Billiard (Zodiak)**: hall map (grid "digital table" view) + mobile list
  view, live status per table (available/occupied/reserved/closed, always
  shown with both color *and* text/emoji), table detail page with
  Overview/Availability/Camera tabs, date + hourly-slot picker, full booking
  flow (duration → details → confirm → confirmation), **double-booking
  protection**.
- **My Booking**: tabs for active/upcoming/completed/cancelled, live
  second-by-second countdown, extend booking (+30/+60/+120 min, mock pricing,
  re-checks availability), cancel booking, 15-minute and 5-minute in-app
  reminders fired automatically off the shared clock. The signed-in mock
  user starts with **no bookings** — nothing is pre-booked for them; every
  booking shown here is one they created through the normal flow.
- **Camera**: mock live-stream UI per table, gated to the signed-in mock
  user's *active* booking on that table (public/staff/admin/no-access states
  all handled), offline/connecting states, "load only on request" behavior.
- **Cross-selling** between the restaurant and Zodiak on both flows.
- **Notifications**: in-app bell + toasts-in-list, built on a
  `NotificationService` abstraction so Push/SMS/WhatsApp/Telegram/Email
  providers can be registered later without touching booking logic.
- **Admin (read-only stub)**: `/admin` — active tables, camera status,
  today's bookings. Full CRUD admin is intentionally Post-MVP (PRD §77).
- Loading skeletons, empty states, and error states (`app/error.tsx`,
  `app/not-found.tsx`, per-route `loading.tsx`).
- Responsive, keyboard-accessible, dark/premium visual design (see
  `tailwind.config.ts` for the full palette).

## Architecture

```
app/            Routes (App Router): home, restaurant, menu, billiard,
                billiard/[tableId], account ("My Booking"), admin, contacts
components/     UI, grouped by feature (Navbar, Hero, Menu, BilliardHall,
                TableDetails, Camera, Booking, Countdown, Notifications, ...)
data/           Mock data only — REAL business facts (address) are called
                out explicitly and separated from DEMO data (see PRD §54, §78)
types/          Shared TypeScript models (MenuItem, BilliardTable, Booking,
                Camera, Notification, AppUser)
services/       Pure business logic: bookingService (conflict protection,
                extension rules, derived live status), cameraService (access
                control), notificationService (provider abstraction)
hooks/          useBooking, useCountdown, useNotifications, useNow
context/        AppStateContext — the prototype's in-memory "backend"
lib/            time/formatting helpers, shared constants, tiny clsx util
scripts/        generate-placeholders.mjs — regenerates public/images/*.svg
```

### Why a React Context instead of a real backend

PRD §49 explicitly allows "local state/mock services" for the prototype. All
booking mutations flow through `services/bookingService.ts`, so the exact
same conflict-protection and extension logic used here is what a real API
route / backend should re-implement — **the client must never be the source
of truth for booking validity in production** (PRD §69).

### Data → real backend swap points

| Concern | Prototype | Replace with |
|---|---|---|
| Tables/menu/cameras | `data/*.ts` | REST/GraphQL API or DB |
| Bookings | React state in `AppStateContext` | Backend + WebSockets/Supabase Realtime |
| Camera stream | Mock canvas in `CameraView.tsx`, `Camera.streamUrl` unused | RTSP/HLS/WebRTC provider URL dropped into `Camera.streamUrl` |
| Camera authorization | Client-side `cameraService.canAccessCamera` | Server-signed, short-lived stream token per booking |
| Notifications | `InAppNotificationService` only | Register Push/SMS/WhatsApp/Telegram/Email providers on `NotificationDispatcher` |
| Auth | `data/user.ts` mock user, `AppUser.role` | Real session/auth provider (CUSTOMER/STAFF/ADMIN roles already modeled) |

## Mock/demo data disclosure (PRD §54, §78)

Only the venue name, city and street address are treated as confirmed real
data (`data/restaurant.ts` → `REAL_BUSINESS_DATA`). Menu items, prices, prep
times, table count/names/layout, opening hours, and camera status are **mock
data** clearly marked in code comments — replace before launch.

## Known follow-ups

- Run `npm install && npm run build` and fix anything your local Next/React
  toolchain flags (this build could not be compiled in the authoring
  sandbox — see the note at the top of this file).
- `data/bookings.ts` seeds a single booking belonging to *another* customer
  (Table 03) so the hall map has a realistically occupied table and the
  conflict-protection / camera-access-denial paths are exercisable without
  first creating a conflicting booking by hand — the signed-in mock user
  has no bookings of their own until they book one through the UI.
- Hall map currently renders tables in a responsive grid rather than the
  literal floor-plan coordinates in `BilliardTable.position` — that field is
  reserved for a future real floor-plan SVG renderer.
- Full i18n routing (RU/KK/EN) isn't wired up yet; copy is centralized in
  `lib/constants.ts` / component-local strings as a first step (PRD §74).
