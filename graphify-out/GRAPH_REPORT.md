# Graph Report - C:\Users\lokem\AppData\Local\Temp\claude\C--Users-lokem-Claude-netvar-workflows\1af90299-e837-402f-9ee1-4eb9b3a09da9\scratchpad\netvar_docs  (2026-07-26)

## Corpus Check
- Corpus is ~5,526 words - fits in a single context window. You may not need a graph.

## Summary
- 41 nodes · 57 edges · 6 communities
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.83)
- Token cost: 103,419 input · 8,000 output

## Community Hubs (Navigation)
- Visto e Prova Documental
- Proposta e Fechamento
- Entrega e Modelo de Cobranca
- Pipeline de Prospeccao n8n
- Diretrizes de Engenharia
- Risco UWG e Canal de Contato

## God Nodes (most connected - your core abstractions)
1. `Workflow 1 — Prospecção` - 10 edges
2. `Angebot (Offer) Template` - 8 edges
3. `Consulta Jurídica UWG/DSGVO` - 6 edges
4. `Notion CRM: Leads Netvar Studio` - 6 edges
5. `n8n Workflow Build Guidelines` - 5 edges
6. `§7 Abs. 2 Nr. 2 UWG (Cold Email Consent)` - 5 edges
7. `Website-Abo €99/mês (Subscription Model)` - 5 edges
8. `Workflow 3 — Onboarding pós-pagamento` - 5 edges
9. `Absichtserklärung (Letter of Intent) Template` - 4 edges
10. `Notion Base: Netvar Entregas` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Partnerrabatt (Partnership Discount 5-15%)` --semantically_similar_to--> `Angebot (Offer) Template`  [INFERRED] [semantically similar]
  Netvar_Absichtserklaerung_Template.md → Netvar_Angebot_Template.md
- `Website-Abo €99/mês (Subscription Model)` --semantically_similar_to--> `Angebot (Offer) Template`  [INFERRED] [semantically similar]
  Netvar_Entrega_e_Assinatura.md → Netvar_Angebot_Template.md
- `Notion Base: Netvar Entregas` --semantically_similar_to--> `Notion CRM: Leads Netvar Studio`  [INFERRED] [semantically similar]
  Netvar_Entrega_e_Assinatura.md → STATUS_NETVAR_STUDIO.md
- `Classificação de Resposta por Claude` --semantically_similar_to--> `Workflow 2 — Follow-up`  [INFERRED] [semantically similar]
  Netvar_Processo_Resposta_Fechamento.md → STATUS_NETVAR_STUDIO.md
- `Art. 14 DSGVO Informationspflicht` --references--> `Notion CRM: Leads Netvar Studio`  [INFERRED]
  Netvar_Consulta_Advogado_UWG.md → STATUS_NETVAR_STUDIO.md

## Hyperedges (group relationships)
- **Netvar Cold-Outreach to Cash Pipeline** — status_netvar_studio_wf1_prospeccao, status_netvar_studio_wf2_followup, netvar_processo_resposta_fechamento_processo1, netvar_angebot_template_angebot, status_netvar_studio_wf3_onboarding, status_netvar_studio_crm_leads_notion [INFERRED 0.85]
- **German Legal Exposure Surface (UWG/DSGVO/DDG/Visa)** — netvar_consulta_advogado_uwg_par7_uwg, netvar_consulta_advogado_uwg_art14_dsgvo, netvar_consulta_advogado_uwg_par5_ddg_impressum, netvar_consulta_advogado_uwg_abmahnung, netvar_consulta_advogado_uwg_freiberufler_vs_gewerbe, netvar_absichtserklaerung_template_freiberufler_visum [EXTRACTED 1.00]
- **Delivery Capacity & Subscription Sustainability** — netvar_entrega_e_assinatura_uma_entrega_ativa, netvar_entrega_e_assinatura_promessa_48h, netvar_entrega_e_assinatura_konzeptentwuerfe, netvar_entrega_e_assinatura_website_abo, netvar_entrega_e_assinatura_einmalig_1190, netvar_entrega_e_assinatura_anti_lockin [EXTRACTED 1.00]

## Communities (6 total, 0 thin omitted)

### Community 0 - "Visto e Prova Documental"
Cohesion: 0.25
Nodes (9): Absichtserklärung (Letter of Intent) Template, §21 AufenthG Freiberufler Visum, Hierarquia da Prova (Evidence Hierarchy for Visa), Partnerrabatt (Partnership Discount 5-15%), Art. 14 DSGVO Informationspflicht, Consulta Jurídica UWG/DSGVO, Freiberufler vs Gewerbe (§18 EStG), OLG Hamm 18 U 154/22 (DMs as elektronische Post) (+1 more)

### Community 1 - "Proposta e Fechamento"
Cohesion: 0.25
Nodes (9): Angebot (Offer) Template, Categoria de Dor (Sem Site / Zumbi / Lento), §19 UStG Kleinunternehmerregelung, Zahlungsbedingungen 50/50 (Stripe/PayPal), Classificação de Resposta por Claude, Processo Resposta → Proposta → Fechamento, Revisão Humana Obrigatória do Angebot, Stripe/PayPal Webhook Signature Verification (+1 more)

### Community 2 - "Entrega e Modelo de Cobranca"
Cohesion: 0.25
Nodes (8): Anti-Lock-in Positioning (Monatlich kündbar, Domain do cliente), Einmalig ab €1.190 (One-off Anchor Price), Três Konzeptentwürfe por Nicho, Notion Base: Netvar Entregas, Promessa das 48h (48h após briefing completo), Uma Entrega Ativa por Vez (WIP=1 Capacity Rule), Website-Abo €99/mês (Subscription Model), Formulário de Assets (assets.html)

### Community 3 - "Pipeline de Prospeccao n8n"
Cohesion: 0.53
Nodes (6): WF - Resumo Diário, Notion CRM: Leads Netvar Studio, Sliplane n8n Hosting, Status do Projeto Netvar Studio, Workflow 1 — Prospecção, Workflow 2 — Follow-up

### Community 4 - "Diretrizes de Engenharia"
Cohesion: 0.50
Nodes (5): Multi-Level Node/Workflow Validation, n8n Workflow Build Guidelines, Never Trust Defaults, Surgical Changes Principle, Templates First Principle

### Community 5 - "Risco UWG e Canal de Contato"
Cohesion: 0.50
Nodes (4): Abmahnung Risk, §7 Abs. 2 Nr. 2 UWG (Cold Email Consent), Telefonische Kaltakquise (§7 Abs.2 Nr.1 UWG), Ramp de Aquecimento de Envio (5→20/dia)

## Knowledge Gaps
- **6 isolated node(s):** `§19 UStG Kleinunternehmerregelung`, `Abmahnung Risk`, `OLG Hamm 18 U 154/22 (DMs as elektronische Post)`, `Três Konzeptentwürfe por Nicho`, `Sliplane n8n Hosting` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Workflow 1 — Prospecção` connect `Pipeline de Prospeccao n8n` to `Proposta e Fechamento`, `Diretrizes de Engenharia`, `Risco UWG e Canal de Contato`?**
  _High betweenness centrality (0.443) - this node is a cross-community bridge._
- **Why does `Angebot (Offer) Template` connect `Proposta e Fechamento` to `Visto e Prova Documental`, `Entrega e Modelo de Cobranca`, `Pipeline de Prospeccao n8n`?**
  _High betweenness centrality (0.327) - this node is a cross-community bridge._
- **Why does `n8n Workflow Build Guidelines` connect `Diretrizes de Engenharia` to `Pipeline de Prospeccao n8n`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Angebot (Offer) Template` (e.g. with `Partnerrabatt (Partnership Discount 5-15%)` and `Website-Abo €99/mês (Subscription Model)`) actually correct?**
  _`Angebot (Offer) Template` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Notion CRM: Leads Netvar Studio` (e.g. with `Art. 14 DSGVO Informationspflicht` and `Notion Base: Netvar Entregas`) actually correct?**
  _`Notion CRM: Leads Netvar Studio` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `n8n Workflow Build Guidelines` (e.g. with `Workflow 1 — Prospecção` and `Surgical Changes Principle`) actually correct?**
  _`n8n Workflow Build Guidelines` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `§19 UStG Kleinunternehmerregelung`, `Abmahnung Risk`, `OLG Hamm 18 U 154/22 (DMs as elektronische Post)` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._