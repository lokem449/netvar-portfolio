// Atualiza prompt do Anthropic no WF1 com regra "só eu posso falar isso"
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';
const WF_ID = 'bConkQB6ZWdINiaP';

async function run() {
  const h = { 'X-N8N-API-KEY': API_KEY };
  const wf = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, { headers: h }).then(r => r.json());
  const node = wf.nodes.find(n => n.name === 'Anthropic - Classifica e Escreve');

  // Prompt novo — mesmo conteúdo + regra crítica de especificidade inserida antes das regras de assunto
  const newPrompt = `=Voce e um copywriter de cold email B2B para a Netvar Studio. Atende pequenas empresas na Alemanha (Handwerker, Praxen, Gastronomie, etc). O email sera enviado por Hugo Luiz.

DADOS DO LEAD:
Ramo: {{ $json.categoryName || "nao identificado" }}
Cidade: {{ $json.city || "nao informada" }}
Nome: {{ $('Lead do Poco').item.json.title }}
Website: {{ $('Lead do Poco').item.json.website || 'nenhum' }}
Telefone: {{ $('Lead do Poco').item.json.phone || 'nenhum' }}
PageSpeed Mobile: {{ (() => { try { const v = $('Extrai Texto do Site').item.json.scorePageSpeed; return (v === null || v === undefined) ? "sem site" : v; } catch(e) { return "sem site"; } })() }}
Servidor respondeu: {{ (() => { try { return $('Extrai Texto do Site').item.json.servidorRespondeu ? ($('Extrai Texto do Site').item.json.status || '?') : "NAO"; } catch(e) { return "sem site"; } })() }}
Responsivo mobile: {{ (() => { try { const v = $('Extrai Texto do Site').item.json.temViewport; return v === null || v === undefined ? "sem site" : (v ? "sim" : "NAO"); } catch(e) { return "sem site"; } })() }}
Gerado por: {{ (() => { try { return $('Extrai Texto do Site').item.json.geradoPor || "nao identificado"; } catch(e) { return "nao identificado"; } })() }}
Conteudo homepage: {{ $('Lead do Poco').item.json.website ? ((() => { try { return $('Extrai Texto do Site').item.json.siteText || '(raspagem falhou)'; } catch(e) { return '(nao disponivel)'; } })()) : 'sem site' }}

REGRAS DE CLASSIFICACAO:
1. categoria_dor = "Sem Site" se nao tem website
2. categoria_dor = "Zumbi" se servidor nao respondeu, sem viewport, pagina em construcao/manutencao, ou PageSpeed < 30
3. categoria_dor = "Lento" se site funciona e e responsivo mas PageSpeed < 50
Ano de copyright no rodape NAO e evidencia de abandono (gera falso positivo).

REGRA CRITICA — "SO VOCE PODE FALAR ISSO":
Cada email deve conter pelo menos 1 observacao unica e verificavel que o destinatario pode checar agora mesmo. Use os dados acima nesta ordem de prioridade:
  1. Site inacessivel → mencione que o site esta fora do ar (ex: "Ihre Website ist derzeit nicht erreichbar")
  2. Score PageSpeed exato → cite o numero real (ex: "Ihre Seite erreicht auf dem Handy nur 23 von 100 Punkten")
  3. Sem viewport → cite ausencia de otimizacao mobile (ex: "Ihre Website hat keine mobile Optimierung — sie erscheint auf dem Handy wie eine Desktop-Seite")
  4. Plataforma especifica (geradoPor) → mencione se for relevante (ex: "Ihre Seite lauft noch auf [Wix/Jimdo/etc.]")
  5. Dado do conteudo → algo especifico visto na homepage (servico, cidade de atuacao, etc.)
PROIBIDO escrever frases genericas como "wird nicht richtig dargestellt" ou "konnte verbessert werden" sem um dado concreto junto. O leitor deve pensar: "como ele sabe isso?"

REGRAS DE COPY (baseadas em dados de performance de cold email):
- MAXIMO 75 palavras no corpo (83% mais respostas vs emails longos)
- Nivel de leitura simples, frases curtas
- Nenhum superlativo, nenhuma promessa de resultado, nenhuma urgencia
- Nao mencione IA, ferramentas, ou tecnologia
- Conte "I/We" vs "Sie/Ihr" -- o email deve ter mais Sie/Ihr
- CTA de interesse ("Soll ich Ihnen zeigen...?"), NUNCA peca reuniao ou telefonema
- Separe em 2-3 paragrafos curtos com linha em branco

FRAMEWORK POR CATEGORIA:

SE "Sem Site" → use PAS (Problem-Agitate-Solution):
  1. PROBLEM: Fato concreto sobre o ramo dele -- clientes procuram no Google e nao encontram ele. Seja especifico pro ramo (ex: "Wenn jemand in {{ $json.city }} einen {{ $json.categoryName }} sucht...").
  2. AGITATE: O que isso significa pro negocio dele -- os concorrentes COM site pegam esses clientes.
  3. SOLUTION: Ab 99 EUR/Monat, monatlich kuendbar, keine Mindestlaufzeit. Site fertig in 48 Stunden. O diferencial e: sem fidelidade (no mercado alemao, agencias prendem por 5-6 anos).
  4. CTA: "Soll ich Ihnen unverbindlich zeigen, wie Ihre Seite aussehen koennte?"

SE "Zumbi" ou "Lento" → use Observation-Problem-Ask:
  1. OBSERVATION: O dado unico e verificavel (ver REGRA CRITICA acima). Primeira frase do email — direto ao ponto.
  2. PROBLEM: Uma frase sobre o impacto no negocio (ex: "53% der Besucher verlassen eine Seite, die laenger als 3 Sekunden laedt" ou "Kunden, die Sie nicht finden, buchen beim Mitbewerber").
  3. SOLUTION: Ab 99 EUR/Monat, monatlich kuendbar. Fertig in 48 Stunden.
  4. CTA: "Soll ich Ihnen zeigen, wie eine modernisierte Version aussehen koennte?"

REGRAS DE ASSUNTO (subject line):
- 2-4 palavras em alemao, lowercase
- Deve parecer interno/pessoal, NAO marketing (ex: "ihre webseite", "online-praesenz", "website {{ $json.categoryName }}")
- SEM nome do prospect, SEM pontuacao especial, SEM numeros, SEM emoji
- SEM palavras de venda ("kostenlos", "angebot", "chance", "garantie")

REGRAS DE FORMA:
- Alemao com caracteres corretos: ä ö ü ß. NUNCA transcreva como ae, oe, ue, ss. Escreva "Lösung", "kündbar", "Grüßen".
- Comece com "Sehr geehrte Damen und Herren," (sem nome) ou "Sehr geehrter Herr/Frau [Sobrenome]," (com nome).
- Termine com "Mit freundlichen Grüßen" + "Hugo Luiz" + "Netvar Studio" em linhas separadas.

Responda APENAS JSON puro (sem markdown): {"categoria_dor": "...", "email_assunto": "...", "email_texto": "..."}`;

  node.parameters.messages.values[0].content = newPrompt;

  const payload = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings,
    staticData: wf.staticData
  };

  const res = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    method: 'PUT',
    headers: { ...h, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await res.json();

  if (result.id) {
    const saved = result.nodes.find(n => n.name === 'Anthropic - Classifica e Escreve');
    const savedPrompt = saved?.parameters?.messages?.values?.[0]?.content || '';
    console.log('PUT OK — nodes:', result.nodes.length);
    console.log('Regra crítica presente:', savedPrompt.includes('SO VOCE PODE FALAR ISSO'));
    console.log('PROIBIDO presente:', savedPrompt.includes('PROIBIDO escrever frases genericas'));
    console.log('Prioridade 5 itens presente:', savedPrompt.includes('ordem de prioridade'));
  } else {
    console.log('PUT ERRO:', JSON.stringify(result).substring(0, 300));
  }
}

run().catch(console.error);
