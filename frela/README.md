# Frela — estado da implementação

Atualizado em 24/07/2026. Projeto paralelo à Netvar Studio, reaproveitando a mesma
instância n8n (Sliplane), Notion e chave Anthropic.

Leia [ANALISE_CRITICA.md](ANALISE_CRITICA.md) antes de mexer em qualquer coisa — ele explica
por que a arquitetura difere do spec original, com os números que motivaram cada mudança.

## Pronto e validado

| Peça | Estado | Como foi validado |
|---|---|---|
| Actor de scraping | `blackfalcondata/upwork-scraper` escolhido | 3 runs reais, 46 vagas; confirmado que devolve `clientPaymentVerified`, `clientTotalSpent`, `clientRating`, `totalApplicants` e vagas de 0–5 min |
| CRM Notion | 3 databases criadas com relations | página `Frela - Pipeline Freelancer` |
| Prompt de scoring | rubrica escrita e testada | 11 chamadas reais contra vagas ao vivo; julgamento correto (pegou exigência de Loom, orçamento irreal, chegada tardia, stack fora do perfil) |
| Pré-filtro em código | corta 55–80% antes do LLM | dry-run contra as 20 vagas reais: 11 cortadas com motivo correto |
| Dedup por Job ID | filtro Notion testado | query real retornou 1 resultado para o Job ID de teste |
| Escrita no Notion | nomes de propriedade conferidos | página real criada e arquivada depois |
| WF-F1 no n8n | criado, **inativo** | `G5BKMdP1T2GgNeRn` — todos os Code nodes compilam (`new Function`) |

## Pendências que dependem de conta (Hugo)

1. **Bot do Telegram** — `@BotFather` → `/newbot` → token.
   A credencial `Ea5Xm0VGbDQ5u2nh` ("Telegram Bot Frela") já existe no n8n com placeholder;
   só trocar o valor. O `chat_id` sai do `@get_id_bot`.
2. **Conta Upwork** aprovada + perfil (título/overview/skills do spec §9).
3. **Freelancer Plus** ($14,99) — 100 connects + alerta de vaga como rede redundante.
4. **Apify** — conta está no plano FREE ($5/mês de crédito). O consumo projetado é ~$4/mês,
   ou seja: passa raspando. Se apertar, é o primeiro upgrade.

## Depois de colar o token do Telegram

O WF-F1 pode ser ativado. A ordem de teste é: rodar manualmente no navegador com todos os
nós desmarcados (gotcha #5), conferir o alerta que chega, e só então ativar o cron.

## Ainda não construído (ordem sugerida)

- **WF-F2** — registro pós-candidatura. O spec §5 propõe botão "Aplicar" no Telegram com
  callback; precisa do bot existindo primeiro.
- **WF-F3** — retenção pós-entrega (review request 24h, follow-up 3d, upsell). Independente
  de tudo acima, pode ser construído a qualquer momento.
- **Calibração da rubrica** — depois de ~30 vagas com desfecho conhecido, cruzar score dado
  contra resposta recebida e ajustar os pesos.

## Arquivos

- [ANALISE_CRITICA.md](ANALISE_CRITICA.md) — as 6 falhas encontradas no spec, com números
- [perfil_hugo.md](perfil_hugo.md) — fatos verificáveis usados nas propostas (nada inventado)
- [prompts/scoring.md](prompts/scoring.md) — rubrica de qualificação documentada
- [workflows/WF-F1_descoberta_qualificacao.json](workflows/WF-F1_descoberta_qualificacao.json) — fonte do workflow
- credenciais e IDs: `C:\Users\lokem\Claude\frela.env`
