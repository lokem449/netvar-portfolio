# Frela — Análise crítica do spec original

> Escrito em 24/07/2026 depois de testar o pipeline contra dados reais do Upwork
> (3 runs de scraping, 46 vagas reais, 11 chamadas de scoring via Claude).
> Nada aqui é opinião: cada falha tem número atrás.

---

## 1. A falha central: o spec otimiza a variável errada

O spec §3 trata **qualificação** como o problema (score 1–10, filtros, red flags) e
**latência** como detalhe (cron de hora em hora). Os dados dizem o contrário.

Medi a taxa de acúmulo de propostas em 20 vagas reais:

| Idade da vaga | Propostas | Propostas/hora |
|---|---|---|
| 86 min | 17 | 11,8 |
| 275 min | **183** | **39,9** |
| 392 min | **204** | **31,2** |
| 458 min | 129 | 16,9 |
| 531 min | 163 | 18,4 |

As duas vagas com melhor fit para o Hugo — *"Senior AI Automation Engineer / AI Systems
Architect"* (cliente com $22.700 gastos, rating 5,0) e *"AI Product Engineer (Claude Code,
n8n, Next.js)"* — tinham **183 e 204 propostas**. Vaga boa acumula 30–40 propostas/hora.

Isso significa que a janela útil é de **15 a 30 minutos**, não de horas:

- aos 15 min → ~8 propostas → ele está entre os 10 primeiros → é lido
- aos 60 min → ~35 propostas → fora do shortlist
- às 4–6 h → 150–200 propostas → irrelevante

**Um cron de 1 hora entrega a proposta na posição ~40.** O pipeline rodaria perfeitamente
e produziria zero. Consertado: cron de 10 min + `maxAgeMinutes` no scraper.

Confirmei que é alcançável — com `maxAgeMinutes: 120` o scraper devolveu uma vaga de
**5 minutos com 0 propostas**, e num segundo teste uma de **0 minutos com 0 propostas**.
A premissa se sustenta, mas só com essa correção.

---

## 2. Connects não estão no orçamento — e são o maior custo

§12 lista Upwork Plus, Apify, Claude API. Não lista **Connects**, que em 2026 custam
$0,15 cada, 4–16 por candidatura = **$0,60 a $2,40 por proposta enviada**.

Nas 40 candidaturas/mês que o próprio spec estabelece (§15), isso é **$24–96/mês**.

Custo real recalculado com números medidos:

| Item | Custo/mês | Base |
|---|---|---|
| Apify | ~$4 | 1.452 runs + ~2.400 resultados a $0,001 |
| Claude API | ~$27 | medido: $0,025/vaga pontuada, ~50/dia após pré-filtro |
| **Connects** | **~$53** | ~44 candidaturas a $1,20 médio |
| Freelancer Plus | $15 | inclui 100 connects |
| **Total** | **~$99** | spec dizia €60–80 |

O total até bate, mas a **composição** é outra: Connects + Plus são 69% do custo.
Consequência de projeto: o score não é um botão de qualidade, é um **botão de orçamento**.
Foi por isso que escrevi a rubrica de scoring dizendo isso explicitamente ao modelo.

---

## 3. Scraping viola a política do Upwork — decisão consciente, não premissa

O spec trata Apify como infraestrutura neutra. A [política oficial](https://support.upwork.com/hc/en-us/articles/43342677368467-Use-bots-and-other-automation-properly)
é explícita: bot é *"qualquer script, programa, extensão de navegador ou serviço de
terceiros que automaticamente envia requisições ao Upwork ou coleta dados"*. E lista
nominalmente *"ferramentas de alerta de vaga que raspam ou rodam buscas"* como causa de
suspensão. Mesmo com API key aprovada, *"raspar dados públicos ou privados"* segue proibido.

Por que ainda é defensável no nosso caso: o Apify roda em **proxies residenciais da Apify,
sem sessão, sem cookie e sem IP do Hugo**. O mecanismo de enforcement do Upwork amarra
atividade a uma conta via sessão/IP/fingerprint de dispositivo. Um run de Apify não é
atribuível à conta dele. Pior caso realista: os IPs da Apify são bloqueados e o actor para
de funcionar — a conta dele não é implicada.

O que é **risco real e está proibido no projeto**:
- ❌ Extensão de navegador que raspa o Upwork logado (ex.: `richardadonnell/Upwork-Job-Scraper`,
  que injeta content script em aba oculta). A própria política nomeia isso. O README do
  projeto admite risco de bloqueio de IP e challenge de Cloudflare.
- ❌ Submissão automática de proposta. Os sinais de ban documentados são comportamentais:
  intervalo de submissão < 4s, fingerprint de browser headless, templates idênticos,
  requisição de user-agent não-browser. O spec já mantém submissão manual — mantenha.

Nota sobre o canal oficial: Freelancer Plus tem alerta de vaga por email, zero risco.
Mas "instant" é batch de **15–90 min**, e exige ter enviado proposta a uma vaga ativa antes.
Serve como rede de segurança redundante, não como canal principal — é lento demais para
a janela de 15–30 min.

**Isso é decisão do Hugo, não minha.** A conta é dele. O cron é um parâmetro só.

---

## 4. As metas de faturamento não sobrevivem a uma conta com zero review

§11 projeta 3–5 fechamentos e €200–400 no mês 1, com 40 candidaturas.
Isso implica ~10% de conversão candidatura→contrato. Os números do mercado:
reply rate médio 15%, top agências 22–30%, categoria AI/ML saturada em **5–7%**.
Conta com zero review fica abaixo da média, não nela.

Aritmética honesta do mês 1: 40 candidaturas × ~8% reply × ~30% fechamento ≈ **1 projeto**.
A $50–80, isso é **$50–80 no mês 1**, não €200–400.

Não é motivo pra não fazer — o spec já diz em §15 que "primeiros 30 dias podem gerar zero
fechamentos, é normal". O problema é a tabela de §11 contradizer o próprio aviso de §15.
Use §15 como expectativa e trate §11 como cenário otimista.

---

## 5. Falhas menores, com correção

**5.1. Piso de ticket contraditório.** §Princípios diz ticket mínimo €300; §10 diz aceitar
$50–80 nas semanas 1–4. São fases diferentes do mesmo número. Implementei como duas
constantes no pré-filtro (`PISO_FIXO`/`PISO_HORA`), fase 1 em $50/$20 — trocar para
$300/$25 depois dos 5 primeiros reviews. É uma linha de código.

**5.2. Wise Business contradiz decisão já tomada.** §4 lista Wise Business. A decisão do
projeto Netvar foi Stripe+PayPal como pessoa física, Wise explicitamente descartado até ter
CNPJ. E é irrelevante aqui: o Upwork paga direto em conta bancária/Wise pessoal — não
precisa de conta Business. Remover do stack.

**5.3. Fiverr com ticket de $150–300 e zero review não vende.** Fiverr rankeia por
histórico de conversão; gig novo sem review fica invisível. Cold start no Fiverr é
provavelmente mais difícil que no Upwork, não mais fácil. Se for pra usar, gig de entrada
mais barato só pra destravar ranking.

**5.4. Regra "nunca aceitar webcam/screen share" custa dinheiro real.** No nicho de
automação, cliente de ticket alto frequentemente quer 15 min de call antes de fechar. Nos
dados: 1 em 20 vagas exigia screen share explicitamente — o filtro em si é barato. Mas
recusar **qualquer** call fecha mais portas do que o número sugere. Meio-termo que preserva
o espírito da regra: **call só por áudio, sem câmera e sem compartilhar tela**. Se for regra
rígida por outro motivo, tudo bem — mas é bom saber que o custo existe.

**5.4-bis. O limite de "40 candidaturas/mês pra evitar ban" (§15) é falso.** Verificado em
25/07: o Upwork **não tem cap diário de propostas nem flag por volume** de envio manual. O
único limite mecânico é o saldo de Connects — ou seja, dinheiro. O risco de ban é
comportamental (fingerprint de automação), não volumétrico. Herdei essa restrição do spec e
ela enviesou o dimensionamento: o teto real de candidaturas é o **suprimento de alertas**
(3–6/dia ≈ 90–130/mês), não uma regra da plataforma.

Correção de preço na mesma checagem: **Freelancer Plus custa $21,99/mês com 80 Connects**,
não os $14,99 do §12. E conta nova ganha até **50 Connects grátis** uma vez — cobre as
primeiras ~12 candidaturas.

**5.4-ter. Boosted Proposals existe e o spec não menciona.** São 4 slots no topo da lista do
cliente, disputados em leilão de Connects: proposta sai de $0,90 (padrão) a **$6,00** (boost
alto). Garante posição, não resposta. Regra de bolso do mercado: só boostar se o contrato
mínimo vale 50x o custo do boost — ou seja, **≥ $300**. Consequência para este projeto:
boost é inútil na fase de $50–80 e passa a valer a partir do mês 3. E note que boost e
velocidade são **substitutos** — ambos compram posição no topo; chegar aos 10 min é de graça,
o boost custa $6. Só compensa combinar os dois em vaga grande.

**5.5. Sem loop de feedback.** §11 mede taxa de resposta mas nada realimenta a rubrica de
scoring. Sem isso o score nunca melhora. Por isso o WF-F1 grava **também as vagas
reprovadas** no Notion com o motivo — é o dataset que permite calibrar depois: cruzar
"score que dei" contra "respondeu ou não".

**5.6. Custo de LLM é o dobro do esperado por causa de thinking.** Medido: 1.920 tokens de
entrada e **1.308 de saída** por vaga — o modelo está raciocinando longamente para
devolver 8 campos de JSON. $0,025/vaga. Alavanca de otimização se apertar: pontuar o
primeiro corte com Haiku e só mandar os finalistas pro Sonnet.

---

## 6. Bug encontrado na implementação (vale pra qualquer workflow futuro)

`max_tokens: 900` **truncava silenciosamente** a resposta de scoring: 13 de 20 vagas
falharam, metade com JSON cortado no meio e metade sem bloco `text` nenhum. Parecia erro de
prompt, era limite de token — o modelo gastou o orçamento pensando. Subir para 2.500 resolveu.

Isso é uma variação do gotcha #2 do Netvar (bloco `thinking` antes do `text`): ali o
problema era ler o bloco errado, aqui é o bloco `text` **nem existir**. Toda chamada precisa
checar `stop_reason` e a existência do bloco antes de parsear. Está implementado assim no
node `Parse Score`.

---

## 7. Arquitetura revisada

```
Cron */10 min (13h–23h Berlim, seg–sex = pico US)
  ↓
Apify blackfalcondata/upwork-scraper
  query booleana OR (n8n | zapier | make.com | ai agent | workflow automation | api integration)
  maxAgeMinutes: 12   ← a correção que torna o projeto viável
  verifiedPaymentOnly: true   ← filtro no servidor, de graça
  ↓
Pré-filtro em código (zero token) — corta 55–80%
  pagamento não verificado | >40 propostas | abaixo do piso | blacklist de webcam/screen share
  ↓
Dedup contra Notion por Job ID   ← sem isso o Telegram repete alerta e ele perde confiança
  ↓
Claude scoring (rubrica que trata Connects como orçamento a proteger)
  ↓
score >= 7 ?
  ├── sim → Claude escreve proposta (abre pelo `angle`: a observação técnica concreta
  │         sobre o problema DELE, que é o que faz não parecer IA)
  │         → Notion (Qualificada) → Telegram com proposta pronta pra colar
  └── não → Notion (Arquivada, com motivo) ← dataset de calibração
```

Diferenças vs. spec original: cadência 6x maior, `maxAgeMinutes`, pré-filtro gratuito antes
do LLM, dedup, actor com dados de cliente, rubrica ciente de custo, e reprovadas gravadas.
