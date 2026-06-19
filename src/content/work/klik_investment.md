---
company: "Klik Investment PLC"
companyWebsite: "https://klik.et"
role: "Backend Engineer"
dateStart: "Feb 2026"
dateEnd: "Present"
---

Following the transition from Vistec Technologies, I now build and maintain the entire backend for [klik.et](https://klik.et) — a delivery platform serving **100,000+ customers** across Addis Ababa through 5+ mobile apps and 3+ web portals.

**Architecture & Scale:**

- Designed a monorepo with Express API, Hasura (GraphQL), and pg-boss workers
- Built the PostgreSQL database schema from scratch
- Implemented RBAC with **16+ user roles** (customers, drivers, vendors, fleet managers, etc.)
- Deployed across multiple Docker Compose environments (dev, staging, beta, prod)

**Key Systems Built:**

- Automated driver dispatch system using pg-boss for async job processing — assigns nearest available drivers in real time with race-condition guards and atomic promotion
- Real-time delivery tracking with heartbeat-based location updates
- Payment integration (Telebirr USSD) with unit tests using Vitest
- Financial dashboards for invoicing, revenue tracking, and entity-level analytics
- Firebase Admin SDK for push notifications
- Prometheus (prom-client) for metrics and monitoring

**Impact:**

- Built the entire backend from zero to production in ~11 months
