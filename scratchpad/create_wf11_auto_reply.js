// WF11 - Auto-resposta a replies de cold email
// Gmail trigger (lok3m.contato@gmail.com) → classifica → wait 3min → responde via Brevo → atualiza Notion
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';

// Credenciais existentes no n8n
const GMAIL_CRED  = { gmailOAuth2: { id: 'RXSPGzyhnsBhcAjN', name: 'Gmail account' } };
const BREVO_CRED  = { httpHeaderAuth: { id: 'T2U1ZJyf8wYB0eGu', name: 'Brevo Header Auth' } };
const NOTION_CRED = { httpHeaderAuth: { id: 'T2U1ZJyf8wYB0eGu', name: 'Notion Header Auth' } };
const ANTHROPIC_CRED = { anthropicApi: { id: 'Netvar Anthropic', name: 'Netvar Anthropic' } };
const LEADS_DB = '3a58b3ec-a1b8-816b-ac4f-cfb246476704';
const { randomUUID } = require('crypto');

const workflow = {
  name: 'Netvar - WF11 Auto-Resposta Replies',
  nodes: [

    // 1. Gmail Trigger — monitora lok3m.contato@gmail.com a cada 1 minuto
    {
      id: randomUUID(),
      name: 'Gmail - Novo Email',
      type: 'n8n-nodes-base.gmailTrigger',
      typeVersion: 1,
      position: [240, 300],
      credentials: GMAIL_CRED,
      parameters: {
        pollTimes: { item: [{ mode: 'everyMinute' }] },
        filters: {},
        options: { downloadAttachments: false }
      }
    },

    // 2. Code — extrai remetente, assunto, corpo (texto limpo)
    {
      id: randomUUID(),
      name: 'Extrai Dados do Email',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [460, 300],
      parameters: {
        language: 'javaScript',
        jsCode: `
const msg = $input.item.json;
const fromRaw = msg.From || msg.from || '';
// extrai apenas o email do campo "Nome <email@x.com>"
const emailMatch = fromRaw.match(/<([^>]+)>/) || fromRaw.match(/([\\w.+%-]+@[\\w.-]+\\.[a-zA-Z]{2,})/);
const senderEmail = emailMatch ? emailMatch[1].toLowerCase() : fromRaw.toLowerCase().trim();
const subject = msg.Subject || msg.subject || '';
const snippet = msg.snippet || msg.Snippet || '';
const body = msg.textPlain || msg.text || snippet || '';

return [{
  json: {
    senderEmail,
    subject,
    body: body.substring(0, 2000),
    messageId: msg.id || msg.messageId || '',
    threadId: msg.threadId || ''
  }
}];
        `
      }
    },

    // 3. Notion — busca lead por email do remetente
    {
      id: randomUUID(),
      name: 'Notion - Busca Lead',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [680, 300],
      credentials: NOTION_CRED,
      parameters: {
        method: 'POST',
        url: `https://api.notion.com/v1/databases/${LEADS_DB}/query`,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Notion-Version', value: '2022-06-28' },
            { name: 'Content-Type', value: 'application/json' }
          ]
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ { "filter": { "and": [ { "property": "Email Decisor", "email": { "equals": $json.senderEmail } }, { "property": "Processado", "checkbox": { "equals": true } } ] }, "page_size": 1 } }}`,
        options: {}
      }
    },

    // 4. IF — lead encontrado?
    {
      id: randomUUID(),
      name: 'Lead Encontrado?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [900, 300],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
          conditions: [{
            id: 'has-lead',
            leftValue: '={{ $json.results.length }}',
            rightValue: 0,
            operator: { type: 'number', operation: 'gt' }
          }],
          combinator: 'and'
        },
        options: {}
      }
    },

    // 5. Set — salva dados do lead para usar depois
    {
      id: randomUUID(),
      name: 'Prepara Contexto',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [1120, 220],
      parameters: {
        mode: 'manual',
        fields: {
          values: [
            { name: 'leadPageId', type: 'string', string: '={{ $json.results[0].id }}' },
            { name: 'leadNome', type: 'string', string: '={{ $json.results[0].properties["Name"]?.title?.[0]?.plain_text || "" }}' },
            { name: 'leadCity', type: 'string', string: '={{ $json.results[0].properties["City"]?.rich_text?.[0]?.plain_text || "" }}' },
            { name: 'senderEmail', type: 'string', string: '={{ $("Extrai Dados do Email").item.json.senderEmail }}' },
            { name: 'emailBody', type: 'string', string: '={{ $("Extrai Dados do Email").item.json.body }}' },
            { name: 'emailSubject', type: 'string', string: '={{ $("Extrai Dados do Email").item.json.subject }}' }
          ]
        },
        options: {}
      }
    },

    // 6. Anthropic — classifica a resposta
    {
      id: randomUUID(),
      name: 'Anthropic - Classifica Reply',
      type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
      typeVersion: 1.3,
      position: [1340, 220],
      credentials: ANTHROPIC_CRED,
      parameters: {
        model: 'claude-3-5-haiku-20241022',
        options: { maxTokens: 200, temperature: 0 },
        messages: {
          messageType: 'multipleMessages',
          values: [{
            type: 'HumanMessagePromptTemplate',
            message: {
              role: 'user',
              content: `Classifica a resposta abaixo de um prospect de cold email B2B (Alemanha, pequenas empresas).

Resposta recebida:
---
{{ $json.emailBody }}
---

Assunto: {{ $json.emailSubject }}

Classifica em UMA das categorias:
- "positivo": interesse real, quer saber mais, perguntou algo relevante
- "preco": perguntou especificamente sobre preço/custo/valor
- "negativo": recusou, não tem interesse, pediu para parar
- "ausencia": resposta automática de fora do escritório (out of office / Abwesenheitsnotiz)
- "outro": não relacionado ou ambíguo demais

Responde APENAS JSON puro: {"categoria": "positivo", "resumo": "quer ver exemplo de site"}`
            }
          }]
        }
      }
    },

    // 7. Code — extrai classificação do Anthropic
    {
      id: randomUUID(),
      name: 'Extrai Classificacao',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [1560, 220],
      parameters: {
        language: 'javaScript',
        jsCode: `
const aiItem = $('Anthropic - Classifica Reply').item.json;
const contextItem = $('Prepara Contexto').item.json;

let categoria = 'outro';
let resumo = '';
try {
  const tb = aiItem.content.find(c => c.type === 'text');
  const raw = tb.text;
  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s !== -1 && e !== -1) {
    const parsed = JSON.parse(raw.substring(s, e + 1));
    categoria = parsed.categoria || 'outro';
    resumo = parsed.resumo || '';
  }
} catch(err) {}

return [{
  json: {
    ...contextItem,
    categoria,
    resumo
  }
}];
        `
      }
    },

    // 8. Wait — 3 minutos antes de responder
    {
      id: randomUUID(),
      name: 'Aguarda 3 Minutos',
      type: 'n8n-nodes-base.wait',
      typeVersion: 1.1,
      position: [1780, 220],
      parameters: {
        resume: 'timeInterval',
        unit: 'minutes',
        amount: 3,
        options: {}
      }
    },

    // 9. Switch — roteia por categoria
    {
      id: randomUUID(),
      name: 'Roteador',
      type: 'n8n-nodes-base.switch',
      typeVersion: 3,
      position: [2000, 220],
      parameters: {
        mode: 'rules',
        rules: {
          values: [
            { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 }, conditions: [{ id: 'r1', leftValue: '={{ $json.categoria }}', rightValue: 'positivo', operator: { type: 'string', operation: 'equals' } }], combinator: 'and' }, renameOutput: true, outputKey: 'positivo' },
            { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 }, conditions: [{ id: 'r2', leftValue: '={{ $json.categoria }}', rightValue: 'preco', operator: { type: 'string', operation: 'equals' } }], combinator: 'and' }, renameOutput: true, outputKey: 'preco' },
            { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 }, conditions: [{ id: 'r3', leftValue: '={{ $json.categoria }}', rightValue: 'negativo', operator: { type: 'string', operation: 'equals' } }], combinator: 'and' }, renameOutput: true, outputKey: 'negativo' }
          ]
        },
        fallbackOutput: 'none',
        options: {}
      }
    },

    // 10a. Brevo — envia resposta POSITIVO
    {
      id: randomUUID(),
      name: 'Brevo - Resposta Positivo',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [2220, 100],
      credentials: BREVO_CRED,
      parameters: {
        method: 'POST',
        url: 'https://api.brevo.com/v3/smtp/email',
        sendHeaders: true,
        headerParameters: { parameters: [{ name: 'Content-Type', value: 'application/json' }] },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ {
  "sender": { "name": "Hugo Luiz", "email": "hugo@netvarstudio.de" },
  "to": [{ "email": $json.senderEmail }],
  "subject": "Re: " + $json.emailSubject,
  "textContent": "Hallo,\\n\\ndanke für Ihre Rückmeldung — das freut mich.\\n\\nDarf ich fragen: Haben Sie aktuell jemanden, der sich um Ihre Website kümmert, oder läuft das noch ohne feste Betreuung?\\n\\nIch kann Ihnen gerne zeigen, wie eine modernisierte Version konkret aussehen könnte — dauert 10 Minuten, kein Anruf nötig.\\n\\nMit freundlichen Grüßen\\nHugo Luiz\\nNetvar Studio"
} }}`,
        options: {}
      }
    },

    // 10b. Brevo — envia resposta PREÇO
    {
      id: randomUUID(),
      name: 'Brevo - Resposta Preco',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [2220, 220],
      credentials: BREVO_CRED,
      parameters: {
        method: 'POST',
        url: 'https://api.brevo.com/v3/smtp/email',
        sendHeaders: true,
        headerParameters: { parameters: [{ name: 'Content-Type', value: 'application/json' }] },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ {
  "sender": { "name": "Hugo Luiz", "email": "hugo@netvarstudio.de" },
  "to": [{ "email": $json.senderEmail }],
  "subject": "Re: " + $json.emailSubject,
  "textContent": "Hallo,\\n\\ngerne: ab 99 EUR/Monat, monatlich kündbar, keine Mindestlaufzeit.\\n\\nDarin enthalten: fertige Website in 48 Stunden, Hosting, laufende Anpassungen.\\n\\nSoll ich Ihnen ein konkretes Beispiel für Ihre Branche zeigen?\\n\\nMit freundlichen Grüßen\\nHugo Luiz\\nNetvar Studio"
} }}`,
        options: {}
      }
    },

    // 10c. Brevo — envia resposta NEGATIVO
    {
      id: randomUUID(),
      name: 'Brevo - Resposta Negativo',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [2220, 340],
      credentials: BREVO_CRED,
      parameters: {
        method: 'POST',
        url: 'https://api.brevo.com/v3/smtp/email',
        sendHeaders: true,
        headerParameters: { parameters: [{ name: 'Content-Type', value: 'application/json' }] },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ {
  "sender": { "name": "Hugo Luiz", "email": "hugo@netvarstudio.de" },
  "to": [{ "email": $json.senderEmail }],
  "subject": "Re: " + $json.emailSubject,
  "textContent": "Hallo,\\n\\nverstanden — danke für Ihre Rückmeldung.\\n\\nFalls sich das mal ändert, melde ich mich nicht nochmal ungefragt. Sie wissen, wo Sie mich finden.\\n\\nMit freundlichen Grüßen\\nHugo Luiz\\nNetvar Studio"
} }}`,
        options: {}
      }
    },

    // 11. Merge — une os 3 branches de Brevo para atualizar Notion
    {
      id: randomUUID(),
      name: 'Merge Respostas',
      type: 'n8n-nodes-base.merge',
      typeVersion: 3,
      position: [2440, 220],
      parameters: {
        mode: 'passThrough',
        output: 'input1',
        options: {}
      }
    },

    // 12. Notion — atualiza status do lead
    {
      id: randomUUID(),
      name: 'Notion - Atualiza Status',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [2660, 220],
      credentials: NOTION_CRED,
      parameters: {
        method: 'PATCH',
        url: `={{ "https://api.notion.com/v1/pages/" + $('Extrai Classificacao').item.json.leadPageId }}`,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Notion-Version', value: '2022-06-28' },
            { name: 'Content-Type', value: 'application/json' }
          ]
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ (function() {
  var cat = $('Extrai Classificacao').item.json.categoria;
  var resumo = $('Extrai Classificacao').item.json.resumo;
  var statusMap = { positivo: 'Em Negociacao', preco: 'Em Negociacao', negativo: 'Sem Interesse' };
  var status = statusMap[cat] || 'Em Negociacao';
  var nota = '[REPLY ' + cat.toUpperCase() + '] ' + new Date().toISOString().split('T')[0] + (resumo ? ': ' + resumo : '');
  return {
    properties: {
      "Status": { "select": { "name": status } },
      "Data Ultimo Contato": { "date": { "start": new Date().toISOString().split('T')[0] } },
      "Assets - Notizen": { "rich_text": [{ "type": "text", "text": { "content": nota } }] }
    }
  };
})() }}`,
        options: {}
      }
    }
  ],

  connections: {
    'Gmail - Novo Email':          { main: [[{ node: 'Extrai Dados do Email', type: 'main', index: 0 }]] },
    'Extrai Dados do Email':       { main: [[{ node: 'Notion - Busca Lead', type: 'main', index: 0 }]] },
    'Notion - Busca Lead':         { main: [[{ node: 'Lead Encontrado?', type: 'main', index: 0 }]] },
    'Lead Encontrado?': {
      main: [
        [{ node: 'Prepara Contexto', type: 'main', index: 0 }],
        []  // false: ignora
      ]
    },
    'Prepara Contexto':            { main: [[{ node: 'Anthropic - Classifica Reply', type: 'main', index: 0 }]] },
    'Anthropic - Classifica Reply': { main: [[{ node: 'Extrai Classificacao', type: 'main', index: 0 }]] },
    'Extrai Classificacao':        { main: [[{ node: 'Aguarda 3 Minutos', type: 'main', index: 0 }]] },
    'Aguarda 3 Minutos':           { main: [[{ node: 'Roteador', type: 'main', index: 0 }]] },
    'Roteador': {
      main: [
        [{ node: 'Brevo - Resposta Positivo', type: 'main', index: 0 }],
        [{ node: 'Brevo - Resposta Preco', type: 'main', index: 0 }],
        [{ node: 'Brevo - Resposta Negativo', type: 'main', index: 0 }]
      ]
    },
    'Brevo - Resposta Positivo':   { main: [[{ node: 'Merge Respostas', type: 'main', index: 0 }]] },
    'Brevo - Resposta Preco':      { main: [[{ node: 'Merge Respostas', type: 'main', index: 1 }]] },
    'Brevo - Resposta Negativo':   { main: [[{ node: 'Merge Respostas', type: 'main', index: 2 }]] },
    'Merge Respostas':             { main: [[{ node: 'Notion - Atualiza Status', type: 'main', index: 0 }]] }
  },

  settings: {
    executionOrder: 'v1',
    saveManualExecutions: true,
    callerPolicy: 'workflowsFromSameOwner',
    errorWorkflow: ''
  },
  staticData: null
};

async function run() {
  const h = { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json' };

  // Cria o workflow
  const res = await fetch(`${N8N_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify(workflow)
  });
  const result = await res.json();
  if (!result.id) { console.log('ERRO ao criar:', JSON.stringify(result).substring(0,400)); return; }
  console.log('Workflow criado:', result.id, '|', result.name);

  // Precisa resolver ID real da credencial Gmail antes de ativar
  // Tenta ativar — pode falhar se credencial precisar de ID numérico
  const act = await fetch(`${N8N_URL}/api/v1/workflows/${result.id}/activate`, {
    method: 'POST', headers: h
  }).then(r => r.json());
  console.log('Ativo:', act.active, '| id:', result.id);
  if (!act.active) console.log('Detalhe:', JSON.stringify(act).substring(0,300));
}

run().catch(console.error);
