# Netvar Studio — Status do Projeto (atualizado em 23/07/2026)

> Contexto: este projeto começou como planejamento no Claude Chat e a execução técnica (código, automações, deploy) foi feita aqui no Claude Code. Este documento resume o que já foi feito, o estado atual, e pede pra você (no Claude Chat) listar o que tínhamos combinado como próximos passos que ainda não foram trazidos pra execução.

---

## 1. O que já foi feito

### Site (netvarstudio.de — repo `lokem449/netvarstudio` no GitHub)
- Portfólio com links funcionais pros 4 projetos de exemplo (`.vercel.app`)
- Meta tags de SEO (description, canonical, Open Graph, Twitter Card)
- Impressum com endereço real em Frankfurt (endereço de escritório virtual "Clevver")
- Datenschutzerklärung expandida pra conteúdo GDPR completo
- Formulário de coleta de assets do cliente (`assets.html`) — recebe logo/fotos/texto pós-pagamento

### Automação (n8n) — 3 workflows construídos, testados nó a nó, e ativos em produção
- **Workflow 1 — Prospecção**: Apify (Google Places) → PageSpeed → Hunter.io (busca email) → Claude (classifica dor: Sem Site / Zumbi / Lento + escreve email frio em alemão) → Brevo (envia) → Notion (registra lead). Roda diariamente às 05:00 (seg-sex, horário de Berlim), com ramp de aquecimento (5→10→15→20 leads/dia ao longo de 4 semanas), região Frankfurt am Main, com dedup contra o CRM pra não repetir contato.
- **Workflow 2 — Follow-up**: busca leads com status "Email Enviado" há 7+ dias sem resposta → Claude escreve follow-up curto → Brevo envia → atualiza status no Notion.
- **Workflow 3 — Onboarding pós-pagamento**: webhook Stripe/PayPal (com verificação real de assinatura HMAC, testada com payload forjado e genuíno) → marca "Cliente Ativo" no Notion → email de boas-vindas via Brevo → espera 48h → verifica se assets foram enviados → lembrete se não.

### CRM (Notion — base "Leads Netvar Studio")
- Schema completo: empresa, site, email, telefone, score PageSpeed, motivo de recusa, categoria de dor, canal de abordagem, nicho, status (8 estágios do funil), assets enviados.
- 6 views criadas: Novos Leads, Aguardando Resposta, Respostas Positivas, Clientes Ativos, Assets Pendentes, Pipeline por Status (kanban).

### Infraestrutura
- n8n migrado de uma instância local (frágil, dependia do PC ligado + tunnel temporário do Cloudflare) para hospedagem fixa na **Sliplane** (`https://n8n-f3xi.sliplane.app`), servidor na Alemanha.
- Vigia de uptime automático (checa a cada 30min, avisa por email se cair).
- Instância local desativada — sem risco de execução duplicada.
- Tunnel do Cloudflare encerrado (não é mais necessário).

### Segurança
- Verificação de assinatura Stripe (HMAC-SHA256) e PayPal (OAuth + verify-webhook-signature) implementadas e validadas em produção — testado com dados forjados (corretamente rejeitados) e genuínos (aceitos).

---

## 2. Estado atual (o que está rodando "sozinho" agora)

- Autonomia de envio: autorizado a rodar e mandar emails reais sem confirmação a cada vez, apenas registrando tudo e notificando quando relevante.
- WF1, WF2, WF3 ativos em produção na Sliplane.
- Stripe e PayPal ainda em **modo de teste/sandbox** — não estão configurados pra cobrar de verdade ainda.

---

## 3. O que falta (identificado até aqui, do lado técnico)

- [ ] Confirmar que o WF1 dispara corretamente no primeiro dia rodando 100% na Sliplane (migração terminou depois do horário de disparo de hoje).
- [ ] Trocar Stripe e PayPal de sandbox pra modo live (produção) — só quando estiver pronto pra receber pagamentos reais.

## 4. O que falta (fora do código — decisões/pendências pessoais e jurídicas)

- [ ] Telefone alemão pro Impressum — pendente do VideoIdent/PostIdent.
- [ ] Decisão sobre abrir MEI (adiado por você pra quando tiver tempo livre).
- [ ] Conversa com contador (BR e/ou DE) sobre como estruturar recebimento de clientes estrangeiros como pessoa física brasileira.

---

## 5. Pedido pra você (Claude Chat)

Este documento cobre o que foi **executado**. O que meu equivalente aqui (Claude Code) **não tem acesso** é ao histórico da nossa conversa original no Claude Chat, onde o projeto foi planejado. Por favor:

1. Revise o que combinamos lá que ainda não apareceu na lista de "o que falta" acima.
2. Liste quaisquer próximos passos, ideias, ou decisões que discutimos mas eu ainda não trouxe pra execução aqui.
3. Me devolva essa lista pra eu trazer de volta pro Claude Code e continuar a execução.
