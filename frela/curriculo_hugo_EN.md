# HUGO LUIZ

**Automation & Integration Engineer — n8n, AI Agents, APIs & Web**

Pernambuco, Brazil (UTC−3) · info@netvarstudio.de · netvarstudio.de · [LinkedIn — CONFIRMAR URL]

---

## SUMMARY

I build and ship working systems: automation pipelines, API integrations between tools that
were never meant to talk to each other, and fast, SEO-clean web front ends. Seven automation
workflows currently running in production on self-hosted infrastructure, handling lead
generation, LLM-based email classification, payment webhooks with real signature verification,
and uptime monitoring.

Background in animation design and 3D means I also handle the visual layer — useful when a
project needs both the engine and the interface, and you would rather not hire twice.

---

## CORE SKILLS

**Automation & AI** — n8n (self-hosted, Docker), workflow orchestration, AI agents, LLM
integration (Claude API, prompt engineering), OpenClaw, Zapier/Make equivalents, webhooks,
scheduled jobs, error handling and retries

**Integrations & Data** — REST APIs, OAuth2, Notion API, Gmail API, Stripe & PayPal webhooks,
HMAC signature verification, web scraping (Apify), data pipelines, ETL, deduplication logic

**Web & Front End** — HTML5, CSS3, JavaScript/TypeScript, React, responsive front end,
technical SEO, on-page SEO, Core Web Vitals / PageSpeed optimization, WordPress

**Backend & Ops** — Python, Node.js, Docker, self-hosted deployment, uptime monitoring,
GDPR-compliant system design

**Design** — UI/UX, high-conversion web design, 3D modelling, motion graphics

---

## SELECTED WORK

**Netvar Studio — end-to-end B2B prospecting pipeline** · netvarstudio.de
Designed and shipped a fully automated outbound system, running daily in production:
scheduled scraping of local businesses → automatic technical audit of each prospect's site
(PageSpeed API) → email discovery and verification → LLM classifies the specific problem found
and writes the outreach copy in the prospect's language → transactional send → CRM record.
Includes deduplication against the CRM so no prospect is ever contacted twice, and a domain
warm-up ramp (5→10→15→20/day over four weeks) to protect deliverability. Built to comply with
GDPR and German UWG restrictions on unsolicited business contact — the automation deliberately
stops and hands off to a human where the law requires it.

**Inbound reply management with LLM routing**
Gmail OAuth2 trigger matches each incoming sender against the CRM, an LLM classifies the reply
as positive / negative / ambiguous, and the flow branches: generate a priced proposal draft and
notify the owner for review, update CRM status, or escalate to manual handling. Non-customer
mail is filtered out before any processing, so the pipeline never acts on noise.

**Payment webhooks with verified signatures**
Stripe (HMAC-SHA256) and PayPal (OAuth + verify-webhook-signature) endpoints implemented and
validated in production against both forged and genuine payloads — forged correctly rejected,
genuine correctly accepted. Triggers post-payment onboarding: activate customer, send welcome
email, wait 48h, check whether assets arrived, send reminder if not.

**Time-based follow-up and daily reporting**
Scans the CRM for leads with no reply after 7+ days, generates contextual follow-up copy,
sends, updates status. Separate daily digest consolidates what the pipeline processed plus the
queue that needs human action. Uptime watchdog checks the service every 30 minutes and alerts
on failure.

**Competitive ad intelligence pipeline (Meta Ads)**
n8n + Apify + LLM flow that sweeps competitor creatives in the Meta Ad Library, extracts
parameters, and automatically categorizes copy patterns and sales angles into strategic reports.

**Web platform with interactive 3D and full on-page SEO**
Sales page with interactive 3D elements and complete technical SEO, reaching a top score on
Google PageSpeed Insights.

---

## EXPERIENCE

**AI Automation Specialist & Web Developer** — Automation & AI Sales Agency · 2024 – Present
Commercial automation engineering: advanced n8n and OpenClaw flows for automatic lead
qualification, CRM integration, and 24/7 AI-assisted response. Automated scrapers for
competitive market intelligence with LLM-generated strategic reporting. High-conversion,
SEO-optimized site development with modern front-end architecture and load-speed focus.

**3D Designer, Web Designer & Front-End Developer** — Independent projects, Tech & Media · 2023 – Present
3D asset creation, dynamic advertising pieces, and animation applying composition and visual
storytelling fundamentals. UI/UX prototyping and interface styling centred on user experience
and conversion. Translating complex layouts into clean, semantic, responsive code.

---

## EDUCATION

**BA, Animation Design** — UnP, Universidade Potiguar · in progress

---

## CERTIFICATIONS

**In progress — expected 2026**
- n8n Academy, Level 1 Certification — *in progress, expected August 2026*
- EF SET English Certificate (CEFR-aligned) — *in progress, expected August 2026*
- Anthropic — Claude API & Claude Code developer course — *in progress, expected September 2026*
- Google Analytics 4 Certification — *in progress, expected September 2026*

---

## LANGUAGES

Portuguese — native · English — advanced / fluent · German — learning (A2/B1)

---

## HOW I WORK

Delivery by GitHub repository, file, or document, with written handover documentation so the
system can be run and maintained without me. Communication in writing. Fixed-scope projects
include two revision rounds.
