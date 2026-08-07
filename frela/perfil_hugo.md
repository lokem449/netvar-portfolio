# Perfil — Hugo (Netvar Studio)

> Usado como `{{perfil_hugo}}` nos prompts de proposta. **Somente fatos verificáveis** — nada inventado.

## Stack que ele realmente opera em produção
- **n8n** (self-hosted em Docker/Sliplane, região Alemanha) — 7 workflows em produção, não protótipos
- **Claude API** (Anthropic) para classificação, geração de texto e roteamento de decisão dentro de workflows
- **Apify** — scraping de Google Places e extração estruturada
- **Notion API** como CRM (databases com relations, views, escrita programática)
- **Gmail API / OAuth2** — trigger de email lendo e classificando caixa de entrada
- **Brevo** — envio transacional com autenticação de domínio (SPF/DKIM)
- **Stripe + PayPal webhooks** com verificação real de assinatura (HMAC-SHA256 no Stripe, OAuth + verify-webhook-signature no PayPal), testada contra payload forjado e genuíno
- **Google PageSpeed Insights API**, **Hunter.io**
- JavaScript (Code nodes), Python, Git/GitHub, Vercel

## Coisas concretas que ele construiu (usáveis como prova em propostas)
1. **Pipeline de prospecção B2B ponta a ponta**: cron diário → scraping de negócios locais → auditoria técnica automática do site (PageSpeed) → descoberta de email → LLM classifica o tipo de problema e escreve o email de abordagem no idioma do mercado → envio transacional → registro em CRM, com deduplicação contra a base pra nunca contatar duas vezes e ramp de aquecimento de domínio (5→10→15→20/dia ao longo de 4 semanas).
2. **Workflow de gestão de respostas**: Gmail trigger → casa o remetente contra o CRM → LLM classifica a resposta (positiva/negativa/ambígua) → ramifica: gera rascunho de proposta com faixa de preço e notifica o humano, ou atualiza status, ou escala pra tratamento manual.
3. **Onboarding pós-pagamento**: webhook de pagamento com verificação de assinatura → marca cliente ativo → email de boas-vindas → espera 48h → verifica se os assets chegaram → dispara lembrete se não.
4. **Follow-up automático por tempo**: varre o CRM por leads sem resposta há 7+ dias, gera follow-up curto contextual, envia, atualiza status.
5. **Digest diário** consolidando o que o pipeline processou + a fila que precisa de ação humana.
6. **Vigia de uptime** que checa o serviço a cada 30min e alerta por email na queda.

## Diferenciais reais (não marketing)
- Trabalha em mercado com regulação pesada (GDPR/UWG na Alemanha) — sabe desenhar automação que **não** viola lei de comunicação, e sabe onde a automação precisa parar e passar pro humano.
- Verificação de assinatura de webhook feita de verdade e testada com payload forjado — a maioria dos freelancers de automação não faz isso.
- Deploy real em servidor fixo com monitoramento, não "funciona na minha máquina".

## Restrições operacionais
- Entrega por repositório GitHub, arquivo ou documento
- Comunicação por texto na plataforma; call só por áudio, sem câmera e sem screen share
- Prazo típico de entrega: 2–6 dias por projeto pequeno/médio
