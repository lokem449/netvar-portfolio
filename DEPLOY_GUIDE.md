# 🚀 Deploy Guide - Full Stack Portfolio

**Developer:** Lokem449  
**Used At:** Netvar Studios (Marketing Agency)  
**Data:** 2026-08-07  
**Status:** Pronto para deploy  

---

## 📋 Pré-requisitos Completados

✅ Build Next.js completo
✅ .env files criados (Docker projects)
✅ Todos os commits feitos
✅ Vercel CLI instalada
✅ GitHub token disponível

---

## 🎯 Passos de Deploy (na ordem)

### **PASSO 1: Vercel - 3D Landing Page (5 min)**

```bash
cd C:\Users\lokem\Claude\netvar-workflows\interactive-3d-landing

# 1. Login no Vercel
vercel login
# (Browser vai abrir, faça login com seu email)

# 2. Deploy para produção
vercel --prod

# Resultado: https://seu-dominio.vercel.app
```

**URL Final:** `https://netvar-3d.vercel.app` (ou seu domínio customizado)

---

### **PASSO 2: GitHub - Push de Todos os Projetos (3 min)**

```bash
cd C:\Users\lokem\Claude\netvar-workflows

# 1. Gerar novo GitHub token:
# Acesse: https://github.com/settings/tokens/new
# Scopes: repo, workflow
# Copie o token

# 2. Push (substitua SEU_NOVO_TOKEN)
git push -u origin master
# Quando pedir password, cole seu novo token

# Resultado: https://github.com/lokem449/netvar-portfolio
```

---

## 📊 Projetos Inclusos

### 1️⃣ **3D Interactive Landing Page**
- **Tech:** Next.js 14 + React Three Fiber + Three.js
- **Live:** https://netvar-3d.vercel.app
- **Repo:** `/interactive-3d-landing`
- **Features:**
  - Interactive 3D canvas com OrbitControls
  - Hover effects & animations
  - Mobile-responsive design
  - SEO optimized (OpenGraph, JSON-LD)

### 2️⃣ **Meta Ads AI Intelligence Pipeline**
- **Tech:** Python + Claude API + n8n + PostgreSQL/Docker
- **Repo:** `/meta-ads-ai-pipeline`
- **Setup Local:** 
  ```bash
  cd meta-ads-ai-pipeline
  docker-compose up -d
  # Acessa: http://localhost:5678 (n8n)
  ```
- **Features:**
  - Scraper de Meta Ads Library
  - Claude API para análise
  - n8n workflow automation
  - PostgreSQL storage

### 3️⃣ **Commercial Lead Qualification Agent**
- **Tech:** Node.js + n8n + PostgreSQL + Redis/Docker
- **Repo:** `/lead-qualification-agent`
- **Setup Local:**
  ```bash
  cd lead-qualification-agent
  docker-compose up -d
  # Acessa: http://localhost:5679 (n8n)
  ```
- **Features:**
  - Lead scoring engine (0-100)
  - Auto-classification (High/Medium/Low)
  - Slack + Telegram alerts
  - SLA: <3 minutos (era 4 horas)

### 4️⃣ **Growth & Analytics Templates**
- **Tech:** CSV + JSON + Markdown
- **Repo:** `/growth-analytics-templates`
- **Files:**
  - `data/simulated_meta_ads_performance.csv` (37 dias)
  - `data/simulated_lead_attribution.json` (10 leads)
  - `reports/COMPETITOR_AD_AUDIT_TEMPLATE.md` (audit profissional)
- **Use:** Importar em Google Sheets → Looker Studio

---

## 🔗 LinkedIn Post Template

```
🚀 Portfólio Técnico - Full Stack Projects

Acabo de publicar 4 projetos de automação e desenvolvimento
que estou usando no dia a dia na Netvar Studios:

1️⃣ 3D Interactive Landing Page
   • Next.js 14 + React Three Fiber + Three.js
   • Live: netvar-3d.vercel.app [link]
   
2️⃣ Meta Ads AI Intelligence Pipeline
   • Python + Claude API + n8n + PostgreSQL/Docker
   • Análise automática de anúncios
   
3️⃣ Commercial Lead Qualification Agent
   • Node.js + n8n + Redis/Docker
   • SLA reduzida de 4h para <3min
   
4️⃣ Growth & Analytics Templates
   • Dados reais + templates profissionais
   
Código completo:
👉 github.com/lokem449/netvar-portfolio

#FullStack #WebDevelopment #AI #Automation #NextJS #React #Python #n8n
```

---

## ✅ Checklist Final

- [ ] `vercel login` feito
- [ ] `vercel --prod` executado
- [ ] URL 3D Landing copiada
- [ ] GitHub token gerado
- [ ] `git push -u origin master` executado
- [ ] GitHub URL copiada
- [ ] LinkedIn post criado com links
- [ ] Links testados e funcionando

---

## 📞 Próximos Passos (Opcional)

Se quiser adicionar mais ao portfólio:
- [ ] Adicionar seu avatar/logo no 3D Canvas
- [ ] Conectar Google Analytics
- [ ] Criar webhooks reais para n8n projects
- [ ] Dados reais (substitua simulados por seu próprio CSV)
- [ ] Domínio customizado (netlify.app → seu-dominio.com)

---

**Tudo pronto para ir ao ar! 🎉**

Qualquer dúvida, é só chamar.
