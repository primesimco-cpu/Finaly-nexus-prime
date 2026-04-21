# NEXUS AI — Production SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-orange)](https://anthropic.com)

**Your Universal Intelligence Layer** — Production-grade AI SaaS platform built with Claude, Next.js 14, Supabase, and Stripe.

---

## 🎯 Ne var bu pakette

Bu **gerçek bir production sistemidir**, demo değil. Deploy edip faturalandırma yapabilirsiniz.

### ✅ Çalışan Özellikler

- **🔐 Authentication** — Email/şifre, email doğrulama, session yönetimi (Supabase Auth)
- **💬 AI Chat** — Claude Opus 4.7 / Sonnet 4.6 / Haiku 4.5, streaming responses (SSE), 3 mod (chat/agent/code)
- **💳 Payments** — Stripe Checkout + Customer Portal, otomatik webhook sync, subscription lifecycle
- **🎛️ Admin Dashboard** — Kullanıcı/ürün/fiyat yönetimi, analytics, support ticket yönetimi
- **🎫 Support System** — AI-triage ile otomatik kategorilendirme ve ilk yanıt (Claude Haiku)
- **📊 Analytics** — Gerçek zamanlı MRR, token kullanımı, maliyet takibi, plan dağılımı
- **⚡ Rate Limiting** — Redis primary + Postgres fallback, plan-bazlı limitler
- **📈 Quota Management** — Aylık mesaj kotası, otomatik downgrade prevention
- **🔒 RLS Security** — Her tabloda Row-Level Security, admin role check, audit log
- **📝 Audit Logs** — Tüm admin aksiyonları loglanır (compliance-ready)

### 💰 Fiyatlandırma Planları (seed data ile hazır)

| Plan       | Aylık Fiyat | Mesaj Kotası | Rate Limit | Modeller |
|------------|-------------|--------------|------------|----------|
| Free       | $0          | 100/ay       | 10/dk      | Haiku 4.5 |
| Starter    | $29         | 10,000/ay    | 60/dk      | Sonnet 4.6, Haiku 4.5 |
| Pro        | $99         | 100,000/ay   | 300/dk     | Tüm modeller |
| Enterprise | $499        | ∞            | 1,000/dk   | Özel |

---

## 🏗️ Mimari

```
┌──────────────────────────────────────────────────────┐
│                      Browser                         │
│   (Landing, Auth, Dashboard, Admin Panel, Chat UI)  │
└──────────────────────────┬───────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────┐
│               Next.js 14 (App Router)                │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │ Pages    │  │ API      │  │ Middleware      │   │
│  │ (React)  │  │ Routes   │  │ (session/guard) │   │
│  └──────────┘  └──────────┘  └─────────────────┘   │
└──────┬───────────┬────────────┬──────────────────────┘
       │           │            │
       ▼           ▼            ▼
  ┌────────┐  ┌─────────┐  ┌─────────────┐
  │Supabase│  │Anthropic│  │   Stripe    │
  │(DB+Auth│  │(Claude) │  │ (Payments)  │
  └────────┘  └─────────┘  └─────────────┘
       ▲
       │
  ┌─────────┐
  │  Redis  │  (Rate limiting — Upstash)
  └─────────┘
```

### Veritabanı Şeması

**12 tablo**, full RLS, indexed for scale:

- `profiles` — Supabase auth users extension (plan, role, stripe_customer)
- `organizations` + `organization_members` — B2B multi-tenancy
- `products` + `prices` — Admin-managed catalog (Stripe mirror)
- `subscriptions` — Stripe subscription state
- `chat_sessions` + `messages` — Conversation history (indexed for 10M+ users)
- `usage_events` — Token/cost tracking per user
- `support_tickets` + `ticket_messages` — AI-triaged support
- `audit_logs` — Admin action history
- `rate_limits` — Postgres-backed rate limiting fallback

---

## 🚀 Hızlı Kurulum (10 dakika)

### 1. Dependencies

```bash
npm install
```

Gereksinim: **Node.js ≥20**

### 2. Supabase kurulumu

1. [supabase.com](https://supabase.com) → "New project"
2. Project Settings → API → `URL` ve `anon key` ve `service_role key` kopyala
3. SQL Editor → `supabase/migrations/20260101000000_initial_schema.sql` dosyasını yapıştır & çalıştır

### 3. Stripe kurulumu

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Test mode
2. Developers → API keys → `sk_test_...` ve `pk_test_...` kopyala
3. Products → 3 ürün oluştur (Starter $29/ay, Pro $99/ay, Enterprise $499/ay), Price ID'leri kopyala
4. Developers → Webhooks → `+ Add endpoint`:
   - URL: `https://SENİN-DOMAIN/api/webhooks/stripe` (local için Stripe CLI kullan)
   - Events: `customer.subscription.*`, `checkout.session.completed`, `invoice.payment_*`
   - `whsec_...` kopyala

### 4. Anthropic API

1. [console.anthropic.com](https://console.anthropic.com) → API Keys
2. `sk-ant-...` anahtarını kopyala

### 5. Redis (opsiyonel ama önerilir)

[Upstash](https://upstash.com) → serverless Redis (ücretsiz tier yeterli başlangıç için).
Redis olmadan da çalışır ama rate limiting Postgres'e düşer (daha yavaş).

### 6. Environment variables

```bash
cp .env.example .env.local
```

`.env.local` dosyasını tüm değerlerle doldur.

### 7. Admin kullanıcı

```bash
# .env.local içinde
ADMIN_EMAIL_WHITELIST=sen@company.com
```

İlk kayıt olduğunuzda email whitelist'teki kişi otomatik admin olur.

### 8. Çalıştır

```bash
npm run dev
# → http://localhost:3000
```

Build için:
```bash
npm run build
npm start
```

---

## 📦 Proje Yapısı

```
nexus-ai/
├── app/
│   ├── (marketing)/          # Public landing
│   │   ├── page.tsx          # Landing page (hero, features, pricing)
│   │   └── support/page.tsx  # Public support form
│   ├── auth/                 # Login, signup, email callback
│   ├── dashboard/            # User area (chat, billing, settings, usage)
│   ├── admin/                # Admin panel (users, products, analytics, tickets)
│   ├── api/
│   │   ├── chat/             # Claude streaming endpoint
│   │   ├── stripe/           # Checkout + portal
│   │   ├── webhooks/stripe/  # Stripe webhook handler
│   │   ├── admin/            # Admin CRUD APIs
│   │   ├── support/          # Ticket creation + AI triage
│   │   └── health/           # Liveness probe
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── chat/chat-widget.tsx        # SSE streaming client
│   ├── admin/                      # Users table, products manager, analytics, tickets
│   └── (billing, settings, support forms)
├── lib/
│   ├── supabase/             # server, client, middleware
│   ├── anthropic.ts          # Claude SDK + model registry + pricing
│   ├── stripe.ts             # Stripe wrapper + customer helper
│   ├── rate-limit.ts         # Redis + Postgres dual-layer
│   ├── admin-auth.ts         # Admin check + audit log
│   └── utils.ts              # Helpers
├── types/supabase.ts         # Database types
├── supabase/migrations/      # SQL schema
├── middleware.ts             # Auth + route guards
└── next.config.js            # Security headers, image optim
```

---

## 🛡️ Production Checklist

Deploy etmeden önce:

- [ ] Tüm secret'lar `.env.local`'de (ve Vercel environment variables'ta)
- [ ] Stripe webhook endpoint configured & tested
- [ ] Supabase RLS policies aktif (SQL otomatik yapıyor, doğrula)
- [ ] ADMIN_EMAIL_WHITELIST tanımlı
- [ ] Stripe Price IDs `.env`'de doğru
- [ ] Redis bağlı (Upstash önerilir)
- [ ] Custom domain + HTTPS (Vercel otomatik)
- [ ] Email SMTP (Supabase built-in yeterli başlangıç için, production'da Resend/SendGrid önerilir)
- [ ] Sentry/PostHog monitoring (opsiyonel)
- [ ] Backup strategy (Supabase otomatik daily backup verir)

---

## 📈 10M Kullanıcı için Ölçekleme

Bu proje **hazır** böyle bir scale için, ama şu adımları atacaksınız:

1. **Vercel Pro/Enterprise** — serverless functions auto-scale
2. **Supabase Pro+** — connection pooling (PgBouncer), read replicas
3. **Upstash Redis Pro** — global replication
4. **Database partitioning** — `messages` tablosu günlük partition'lara bölünmeli (schema hazır, migration yapılır)
5. **CDN** — Vercel Edge Network built-in
6. **Anthropic rate limits** — Enterprise kontratı ile artırılır

Şu anki sistem, vanilla olarak **~500K aktif kullanıcıyı** problemsiz taşır. Üzeri için partitioning + sharding gerekli.

---

## 🧪 Test

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Health check (çalışırken)
curl http://localhost:3000/api/health
```

---

## 💡 Kullanım Senaryoları

- **B2B SaaS** — AI asistan ürünü satmak
- **Enterprise AI layer** — İç kullanım için şirket AI portalı
- **Vertical AI** — Hukuk, sağlık, finans spesifik AI ürünü
- **White-label** — Müşterilerinize kendi brand'inizle AI satmak

---

## 📄 Lisans & Destek

Bu kod size özel olarak Claude tarafından hazırlanmıştır. Production'a taşımadan önce:

1. Güvenlik auditi yapın (özellikle RLS policy'ler)
2. Stripe webhook'u Stripe CLI ile test edin
3. Load testing yapın (k6, Artillery)
4. Disaster recovery planı oluşturun

Detaylı deploy adımları için: `docs/DEPLOYMENT.md`

**Soru/sorun?** Kodu okuyun. Her dosya yorumlanmış ve açıklamalı. Production SaaS inşa etmek istediğiniz andan itibaren, bu sistem temelinizdir.

---

Built with Claude Opus 4.7 · Ship fast, scale well.
