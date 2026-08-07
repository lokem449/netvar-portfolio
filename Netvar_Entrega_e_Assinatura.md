# Netvar — Processo de entrega e modelo de assinatura

Desenhado em 26/07/2026. Os dois assuntos estão no mesmo documento de propósito:
a regra de capacidade que faz a entrega funcionar é a mesma coisa que torna a
assinatura sustentável para uma pessoa só.

Base no Notion: **Netvar Entregas** (`3a98b3ec-a1b8-817f-bf54-d71160b3e42d`).

---

## 1. A regra que sustenta tudo

> **Uma entrega ativa por vez.**

Não é limite de clientes. É limite de coisas em produção ao mesmo tempo.

O cliente pode pedir o que quiser, quantas vezes quiser durante o contrato. O que
não acontece é duas coisas andando em paralelo. A fila anda de uma em uma, e
quem define a vazão é você, não a soma dos pedidos.

Por que isso importa mais que qualquer outra decisão de processo:

- **Sua capacidade fica previsível.** Você sabe exatamente quanto cabe na semana.
- **Vender não te afoga.** Dez assinantes não viram dez obras simultâneas.
- **O cliente sabe onde está.** "Sua alteração é a próxima" é uma resposta honesta
  e verificável, diferente de "estou vendo isso".

**Quem está bloqueado não ocupa a vaga.** Se o cliente não mandou as fotos, ele
sai da posição ativa e o próximo entra. Isso é o que impede um cliente lento de
travar todos os outros — e é também o incentivo para ele responder.

---

## 2. As etapas

Cada campo abaixo existe na base Netvar Entregas.

| # | Etapa | O que acontece | Quem |
|---|---|---|---|
| 1 | **Briefing offen** | Cliente fechou. Link do formulário de assets enviado. | automático |
| 2 | **Briefing da** | Textos, fotos, logo e horários chegaram. | cliente |
| 3 | **Entwurf läuft** | Construção. **Só uma aqui por vez.** | Hugo |
| 4 | **Beim Kunden** | Preview no ar, cliente olhando. | cliente |
| 5 | **Änderung** | Ajuste pedido, volta pra fila. | Hugo |
| 6 | **Live** | Domínio apontado, site publicado. | Hugo |
| 7 | **Betreuung** | Cliente vivo pagando. Alterações entram na fila normal. | recorrente |
| — | **Pausiert (Kunde)** | Esperando algo do cliente. Não ocupa vaga. | — |

**Regra de ouro do campo `Ativo Agora`:** no máximo uma linha marcada. Se tiver
duas, a regra de capacidade foi quebrada e algo vai atrasar.

---

## 3. A promessa das 48h

O site promete *"innerhalb von 48 Stunden einen fertigen Preview"*. Hoje isso é
promessa sem máquina atrás. Para ser verdade, precisa de duas coisas:

**O relógio começa na etapa 2, não na 1.** As 48h contam a partir do briefing
completo, não do fechamento. Isso precisa estar escrito na oferta, senão você
assume um prazo que depende do cliente.

**A construção precisa partir de base pronta.** Os três Konzeptentwürfe
(Brandt Haustechnik, Elektro Wagner, Dr. Kellner) já são exatamente isso: três
estruturas prontas por nicho. Entrega em 48h significa adaptar uma dessas, não
começar do zero.

Se em algum momento as 48h não forem cumpríveis, **mude a promessa antes de
quebrá-la.** Prazo descumprido no primeiro contato custa mais que prazo maior.

---

## 4. Modelo de assinatura

### Por que mudar

| Modelo | Receita por cliente |
|---|---|
| Avulso antigo (€800) | €800 |
| €99/mês, 12 meses | €1.188 |
| €99/mês, 24 meses | €2.376 |
| Padrão do mercado alemão (€99 × 5 anos, com fidelidade) | ~€6.000 |

E a barreira de compra cai. Um Handwerker que hesita em tirar €800 do caixa
assina €99/mês sem reunião.

### A brecha do mercado

Os guias alemães avisam o Handwerker sobre os fornecedores de assinatura:
**o site pode não ser dele, sumir no cancelamento, e o domínio ficar no nome da
agência.** Contratos de 5 a 6 anos são comuns.

Esse medo declarado é a sua posição. Não é diferencial inventado, é o oposto
literal do que o mercado faz:

> **Monatlich kündbar. Die Domain läuft auf Ihren Namen. Bei Kündigung bekommen
> Sie die Website — sie gehört Ihnen.**

Isso tem que estar na página de preço, não escondido na AGB.

### Pacotes publicados

Estes são os números que estão no ar em netvarstudio.de/preise.html.

| | **Website-Abo** | **Einmalig** |
|---|---|---|
| Preço | €99/mês | a partir de €1.190 |
| Fidelidade | nenhuma, cancela no fim de qualquer mês | — |
| Hospedagem e SSL | incluído | você contrata |
| Domínio no seu nome | sim | sim |
| Google Unternehmensprofil | configurado | opcional |
| Alterações | uma por vez, quantas quiser | por orçamento |
| Preview | 48h após briefing completo | 48h após briefing completo |

O **Einmalig** fica de propósito, por dois motivos. Parte do mercado alemão
prefere possuir sem custo recorrente. E ele ancora: o ponto de virada fica em
12 meses, então quem só olha preço tende à assinatura, que é o que você quer.

Foi por isso que o avulso subiu de €890 para €1.190. A €890 a virada caía em
9 meses e o avulso ganhava quase sempre — a âncora estava invertida.

### O risco do modelo, dito sem enfeite

Cancelamento mensal é risco real de churn. Depois que o site está pronto, o que
segura o cliente?

Hospedagem, domínio e as alterações continuadas. Se ele cancelar, leva o site,
mas precisa arranjar hospedagem própria — e a maioria dos Handwerker não vai
querer esse trabalho. Isso é fricção honesta, não aprisionamento.

**Não invente lock-in para reduzir churn.** Seria abrir mão exatamente da posição
que te diferencia.

---

## 5. Decidido em 26/07/2026

- [x] **Assinatura: €99/mês**, sem fidelidade. Escolhido por ser exatamente a taxa de mercado alemã — cobrar menos levantaria a pergunta "o que está faltando?", e você já entrega mais risco ao não prender o cliente.
- [x] **Avulso: a partir de €1.190**, meio termo pedido pelo Hugo. Sobe depois dos 3 primeiros casos reais.
- [x] **Alteração**: a tabela da seção anterior foi para a página de preço em alemão. Trabalho maior é orçado por escopo real com preço fechado, nunca como desconto percentual.
- [x] **48h contam do briefing completo** com textos e imagens, escrito como *"48 Stunden nach vollständigem Briefing"*.

**A página está no ar: https://netvarstudio.de/preise.html**

Ainda em aberto, e depende de dado que não existe: a taxa de churn real do modelo mensal. Só dá para medir depois dos primeiros assinantes.
