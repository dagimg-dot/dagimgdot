---
company: "Klik Investment PLC"
companyWebsite: "https://klik.et"
role: "Backend Engineer"
description: "Building and maintaining the backend infrastructure for a multi-platform delivery service serving Addis Ababa."
dateStart: "Feb 2026"
dateEnd: "Present"
---

Following the transition from Vistec Technologies, I now build and maintain the entire backend for [klik.et](https://klik.et) — a multi-platform delivery platform serving customers across Addis Ababa through mobile apps and web portals.

**Architecture & Scale:**

- Designed a monorepo architecture with Express, Hasura (GraphQL), and background job workers
- Implemented role-based access control with multiple user roles

**Key Systems Built:**

- Automated driver dispatch system using background job processing — assigns nearest available drivers in real time with race-condition guards and atomic promotion
- Real-time delivery tracking with heartbeat-based location updates
- Payment integration (Telebirr USSD) with unit tests using Vitest
- Financial dashboards for invoicing, revenue tracking, and entity-level analytics
- Firebase Admin SDK for push notifications
- Prometheus (prom-client) for metrics and monitoring

**Impact:**

- Core contributor to backend architecture and systems implementation
