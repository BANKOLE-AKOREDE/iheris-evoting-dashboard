# IHERIS E-Voting Dashboard (Vue 3 + TypeScript)

Administrative dashboard for managing institutional elections at IHERIS.

## Current Scope (v0.1 - Admin Phase)

- Election creation (positions + candidates)
- Role-based access control
- Live results simulator
- Soft delete (archive lifecycle)
- Permanent delete (SUPER_ADMIN only)
- Active / Archived toggle with badge counters
- Search filtering
- State persistence via Pinia

## Architecture

- Vue 3 (Composition API)
- TypeScript
- Pinia (modular store architecture)
- Vue Router (role-based guards)
- Tailwind CSS
- Local state persistence (pinia-plugin-persistedstate)

## Planned Production Upgrades

- Backend integration (Node/Nest)
- OTP-based voter authentication
- WebSocket live result streaming
- Immutable vote storage
- Full audit export
- Deployment for institutional use

---

This repository represents Phase 1 (Admin Control Layer).