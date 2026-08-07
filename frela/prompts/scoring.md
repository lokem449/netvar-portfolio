# Prompt de Qualificação (scoring) — v2, multi-nicho

> **v1 era errado.** Pontuava "encaixa no stack de n8n/automação dele". Isso cortava trabalho
> que ele entrega bem (webdesign — ele construiu e publicou o netvarstudio.de + 4 sites) e
> limitava o volume a ~4 alertas/dia.
>
> **v2 pontua a pergunta certa: o entregável é um ARTEFATO ou é PRESENÇA?**
>
> Artefato = site, repo, script, sistema configurado, planilha, documento, campanha montada.
> Claude Code produz, Hugo revisa e entrega. → **elegível, qualquer nicho.**
>
> Presença = ser o atendente, estar online no horário deles, plantão, reunião recorrente,
> "20h/semana de disponibilidade". → **inelegível, não importa quanto pague.**
>
> Essa é a linha real. "Construir o sistema de atendimento ao cliente" é artefato.
> "Ser o atendente de suporte" é presença. Mesma palavra no título, decisões opostas.
>
> A rubrica também protege orçamento: no Upwork cada candidatura custa $0,60–2,40 em Connects.
> Em plataforma de proposta grátis (PeoplePerHour) o custo é zero — daí o `limiar` ser
> parâmetro de entrada, não constante.

```
Você avalia uma vaga de freelancer. Quem vai executar é um desenvolvedor que trabalha com
assistência de IA para código: ele produz o trabalho rápido, mas precisa entregar um
ARTEFATO — não pode vender presença nem disponibilidade de horário.

## A pergunta central
O que o cliente recebe no final é uma COISA (site, repositório, script, sistema configurado,
planilha, documento, campanha montada, integração funcionando)?
→ elegível, qualquer área.

Ou o que ele está comprando é ALGUÉM DISPONÍVEL (atendente, assistente virtual, plantão,
moderador, "20h por semana", presença em reuniões recorrentes, turno)?
→ inelegível, mesmo que pague bem.

Atenção à pegadinha: "construir um sistema de atendimento ao cliente" é artefato (elegível).
"Ser o atendente de suporte" é presença (inelegível). O título engana; leia o entregável.

## O que ele consegue entregar (amplo de propósito)
Sites e landing pages, front-end, HTML/CSS/JS, WordPress; scripts e ferramentas em Python ou
JavaScript; integração entre sistemas via API; automação de processo (n8n, Make, Zapier);
scraping e pipeline de dados; agentes de IA e integração de LLM; bots; limpeza e transformação
de dados; planilhas e dashboards; documentação técnica; configuração de campanha e de
ferramenta de marketing; migração de dados entre plataformas.

Prova pública que ele pode citar: site próprio publicado com 4 projetos de exemplo, e 7
automações rodando em produção (prospecção B2B ponta a ponta, classificação de email por LLM,
webhooks de pagamento com verificação de assinatura HMAC testada, digest diário, vigia de uptime).

## O que ele NÃO entrega
Design gráfico original (logo, ilustração, identidade visual), edição de vídeo, locução,
tradução humana certificada, app mobile nativo, e qualquer coisa que exija credencial
profissional (contábil, jurídica, médica).

## Restrição rígida
Ele não faz webcam, screen share, gravação da própria tela, nem call com vídeo.

## Como pontuar (score 1–10) — comece em 5

SOMA
+2  o entregável é claramente um artefato definido, com critério de "pronto" verificável
+2  o escopo está descrito com precisão suficiente pra estimar o trabalho sem perguntar
+1  o orçamento paga bem as horas estimadas (use ~$40/h como referência de valor do tempo dele)
+1  está no núcleo comprovado dele (automação, integração de API, site, scraping, LLM)
+1  o cliente tem histórico de pagamento na plataforma (já gastou, tem review)
+1  poucas propostas ainda (ele ainda é lido)

SUBTRAI
-4  o que se compra é presença/disponibilidade e não artefato
-3  exige webcam, screen share, gravação de tela, ou call com vídeo
-3  sugere pagamento fora da plataforma, ou pede trabalho de teste não pago
-3  precisa de credencial profissional, ou é design gráfico original / vídeo / app nativo
-2  a descrição é vaga ao ponto de não dar pra saber o que a pessoa quer
-2  orçamento irrealista pro escopo pedido
-2  muitas propostas já enviadas (chegou tarde, cliente já fez shortlist)
-1  exige domínio profundo de plataforma com ecossistema próprio de especialistas
    (Shopify/Liquid, GoHighLevel, Salesforce, HubSpot nativo) — ele entrega, mas entra
    como candidato mais fraco contra quem tem 20 projetos naquela plataforma

## Regras rígidas (sobrepõem o score)
- Exigência de webcam/screen share/vídeo → recommendation = "skip".
- Pagamento fora da plataforma → recommendation = "skip" e red flag explícita.
- Entregável é presença e não artefato → recommendation = "skip".
- recommendation = "apply" exige score >= {{limiar}}.
  ({{limiar}} é 7 onde candidatura custa dinheiro, 5 onde a proposta é grátis.)

## Vaga
{{vaga}}

Responda SOMENTE com JSON válido, sem markdown, sem texto antes ou depois:

{
  "score": <int 1-10>,
  "recommendation": "apply" | "skip",
  "entregavel": "<o que o cliente recebe, em 6 palavras>",
  "tipo": "artefato" | "presenca",
  "area": "<site | automacao | integracao | dados | llm | script | marketing | outro>",
  "complexity": "low" | "medium" | "high",
  "estimated_hours": <int>,
  "budget_realistic": <bool>,
  "red_flags": [<string>],
  "why": "<uma frase, máx 20 palavras, em português>",
  "angle": "<se apply: a observação concreta sobre O PROBLEMA DELE que a proposta deve abrir. Se skip: string vazia>"
}
```

## Notas de implementação
- `{{limiar}}` entra por parâmetro: 7 no Upwork (Connects custam), 5 no PeoplePerHour
  (proposta grátis, então tentar é de graça e o único custo é o tempo de colar).
- `tipo` e `area` existem pra calibração: depois de ~50 vagas com desfecho conhecido, dá pra
  ver em qual área a taxa de resposta dele é real e **aí sim nichar com dado**, em vez de
  chutar o nicho antes de começar.
- `max_tokens` mínimo 2500 — com 900 o JSON truncava silenciosamente (13 falhas em 20).
- Não usar `temperature` (rejeitado por `claude-sonnet-5`).
- Sempre `content.find(c => c.type === 'text')`, e checar que existe antes de parsear.
