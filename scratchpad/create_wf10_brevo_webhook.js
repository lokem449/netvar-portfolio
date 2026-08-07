// Cria WF10 - Brevo Webhook de Engajamento
// Recebe eventos opened/clicked do Brevo e atualiza o lead no Notion
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';
const NOTION_CRED = { httpHeaderAuth: { id: 'T2U1ZJyf8wYB0eGu', name: 'Notion Header Auth' } };
const LEADS_DB = '3a58b3ec-a1b8-816b-ac4f-cfb246476704';
const { randomUUID } = require('crypto');

const webhookId = randomUUID();

const workflow = {
  name: 'Netvar - WF10 Brevo Engajamento Webhook',
  nodes: [
    // 1. Webhook — recebe POST do Brevo
    {
      id: randomUUID(),
      name: 'Webhook Brevo',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [240, 300],
      webhookId: webhookId,
      parameters: {
        httpMethod: 'POST',
        path: webhookId,
        responseMode: 'onReceived',
        responseData: 'firstEntryJson',
        options: {}
      }
    },

    // 2. Split Out — Brevo envia array de eventos
    {
      id: randomUUID(),
      name: 'Split Eventos',
      type: 'n8n-nodes-base.splitOut',
      typeVersion: 1,
      position: [460, 300],
      parameters: {
        fieldToSplitOut: 'body',
        options: {}
      }
    },

    // 3. Filter — só opened e clicked
    {
      id: randomUUID(),
      name: 'Evento Relevante?',
      type: 'n8n-nodes-base.filter',
      typeVersion: 2,
      position: [680, 300],
      parameters: {
        conditions: {
          options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
          conditions: [
            {
              id: 'evt-filter',
              leftValue: '={{ $json.event }}',
              rightValue: '',
              operator: { type: 'string', operation: 'notEmpty', singleValue: true }
            }
          ],
          combinator: 'and'
        },
        options: {}
      }
    },

    // 4. IF — só processa opened e clicked (ignora delivered, bounced, etc.)
    {
      id: randomUUID(),
      name: 'É Abertura ou Clique?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [900, 300],
      parameters: {
        conditions: {
          options: { caseSensitive: false, leftValue: '', typeValidation: 'loose', version: 2 },
          conditions: [
            {
              id: 'event-type',
              leftValue: '={{ $json.event }}',
              rightValue: 'opened,clicked',
              operator: { type: 'string', operation: 'contains', singleValue: false }
            }
          ],
          combinator: 'and'
        },
        options: {}
      }
    },

    // 5. Notion — busca lead por email
    {
      id: randomUUID(),
      name: 'Notion - Busca Lead por Email',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [1120, 220],
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
        jsonBody: `={{ { "filter": { "property": "Email Decisor", "email": { "equals": $json.email } }, "page_size": 1 } }}`,
        options: {}
      }
    },

    // 6. IF — lead encontrado?
    {
      id: randomUUID(),
      name: 'Lead Encontrado?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [1340, 220],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
          conditions: [
            {
              id: 'has-results',
              leftValue: '={{ $json.results.length }}',
              rightValue: 0,
              operator: { type: 'number', operation: 'gt' }
            }
          ],
          combinator: 'and'
        },
        options: {}
      }
    },

    // 7. Set — prepara dados para update
    {
      id: randomUUID(),
      name: 'Prepara Update',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [1560, 140],
      parameters: {
        mode: 'manual',
        fields: {
          values: [
            {
              name: 'pageId',
              type: 'string',
              string: '={{ $json.results[0].id }}'
            },
            {
              name: 'evento',
              type: 'string',
              string: '={{ $("É Abertura ou Clique?").item.json.event }}'
            },
            {
              name: 'emailLead',
              type: 'string',
              string: '={{ $("É Abertura ou Clique?").item.json.email }}'
            },
            {
              name: 'dataEvento',
              type: 'string',
              string: '={{ new Date().toISOString().split("T")[0] }}'
            },
            {
              name: 'notaAtual',
              type: 'string',
              string: '={{ ($json.results[0].properties["Assets - Notizen"]?.rich_text?.[0]?.plain_text || "") }}'
            }
          ]
        },
        options: {}
      }
    },

    // 8. Notion — atualiza lead
    {
      id: randomUUID(),
      name: 'Notion - Marca Engajamento',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [1780, 140],
      credentials: NOTION_CRED,
      parameters: {
        method: 'PATCH',
        url: '={{ "https://api.notion.com/v1/pages/" + $json.pageId }}',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Notion-Version', value: '2022-06-28' },
            { name: 'Content-Type', value: 'application/json' }
          ]
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ {
  "properties": {
    "Data Ultimo Contato": {
      "date": { "start": $json.dataEvento }
    },
    "Assets - Notizen": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": ($json.evento === "opened" ? "[ABRIU] " : "[CLICOU] ") + $json.dataEvento + (($json.notaAtual && $json.notaAtual.trim()) ? ("\\n" + $json.notaAtual) : "")
        }
      }]
    }
  }
} }}`,
        options: {}
      }
    }
  ],

  connections: {
    'Webhook Brevo': { main: [[{ node: 'Split Eventos', type: 'main', index: 0 }]] },
    'Split Eventos': { main: [[{ node: 'Evento Relevante?', type: 'main', index: 0 }]] },
    'Evento Relevante?': { main: [[{ node: 'É Abertura ou Clique?', type: 'main', index: 0 }]] },
    'É Abertura ou Clique?': {
      main: [
        [{ node: 'Notion - Busca Lead por Email', type: 'main', index: 0 }],
        [] // false branch — ignora
      ]
    },
    'Notion - Busca Lead por Email': { main: [[{ node: 'Lead Encontrado?', type: 'main', index: 0 }]] },
    'Lead Encontrado?': {
      main: [
        [{ node: 'Prepara Update', type: 'main', index: 0 }],
        [] // false — lead não encontrado, ignora
      ]
    },
    'Prepara Update': { main: [[{ node: 'Notion - Marca Engajamento', type: 'main', index: 0 }]] }
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
  const res = await fetch(`${N8N_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(workflow)
  });
  const result = await res.json();

  if (!result.id) {
    console.log('ERRO ao criar:', JSON.stringify(result).substring(0, 400));
    return;
  }

  console.log('Workflow criado:', result.id);
  console.log('Nome:', result.name);

  // Ativa
  const act = await fetch(`${N8N_URL}/api/v1/workflows/${result.id}/activate`, {
    method: 'POST',
    headers: { 'X-N8N-API-KEY': API_KEY }
  }).then(r => r.json());

  console.log('Ativo:', act.active);
  console.log('\n=== URL DO WEBHOOK ===');
  console.log(`${N8N_URL}/webhook/${webhookId}`);
  console.log('\nwebhookId:', webhookId);
}

run().catch(console.error);
