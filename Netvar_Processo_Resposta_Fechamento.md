# Processo: Resposta → Proposta → Fechamento

O que preenche o vazio entre "email enviado" e "cliente pagou" — hoje 100% manual, sem processo definido.

## Os 4 trabalhos do "funcionário" (você) fora do horário automático

| # | Trabalho | Status | Frequência |
|---|---|---|---|
| 1 | Conduzir respostas até fechar (Angebot → call → contrato) | Manual, sem processo definido — **corrigindo agora** | Toda vez que alguém responde |
| 2 | Fiscalizar qualidade do que a automação gerou | Manual (você abre o Notion quando lembra) | Diário |
| 3 | Atacar leads "Sem Email" (ligar, LinkedIn) | Manual, sem lembrete | Diário |
| 4 | Construir a próxima rodada de automação | Em andamento nesta sessão | Contínuo |

---

## Processo #1: Resposta → Proposta → Fechamento

```
Lead responde o email frio
        │
        ▼
[AUTOMATIZÁVEL] Detectar resposta na caixa de entrada
        │
        ▼
[AUTOMATIZÁVEL] Claude classifica: Positiva / Negativa / Pergunta / Fora do assunto
        │
   ┌────┼────┬─────────────┐
   ▼    ▼    ▼             ▼
Positiva Negativa Pergunta  Fora do assunto
   │    │    │             │
   ▼    ▼    ▼             ▼
[AUTOMATIZÁVEL]  [AUTOMATIZÁVEL]  [MANUAL]      [MANUAL]
Gera rascunho    Marca "Respondeu  Você responde  Você decide
do Angebot com   Negativo" no      a dúvida        o que fazer
dados do lead    Notion
   │
   ▼
[GATILHO] Te notifica com o rascunho pronto
   │
   ▼
[MANUAL — sua revisão obrigatória]
Você aprova/ajusta e manda o Angebot
   │
   ▼
[MANUAL] Call de 10-15min (se pedir) → cotação na hora
   │
   ▼
[MANUAL] Cliente aceita → contrato + link de pagamento
   │
   ▼
[JÁ AUTOMATIZADO — WF3] Pagamento cai → onboarding automático
```

**O que já dá pra automatizar sem infraestrutura nova**: nada na etapa de detecção de resposta — isso depende de saber onde as respostas caem (Gmail? Inbox do domínio?). Perguntei isso pra decidir a implementação exata.

**O que dá pra automatizar agora, sem depender disso**: um resumo diário que cobre os trabalhos #2 e #3.

---

## Processo #2 + #3: Resumo Diário (implementado nesta sessão)

Todo dia, logo depois que o WF1 termina de mandar os emails (~08:35), um novo workflow (**WF - Resumo Diário**) roda sozinho e te manda um email com:
- **Fiscalização (#2)**: lista dos leads processados hoje — empresa, categoria de dor, se foi enviado ou não.
- **Fila de ataque manual (#3)**: leads sem email encontrado (status "Novo") que precisam de contato manual (telefone, LinkedIn).

Isso não substitui você olhar o Notion, mas garante que você recebe o "trabalho do dia" na caixa de entrada sem precisar lembrar de checar.
