// Adiciona nó Filter entre "Brevo - Envia Email" e "Notion - Cria Lead"
// O filtro só passa itens onde messageId existe (= Brevo sucesso)
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';
const WF_ID = 'bConkQB6ZWdINiaP';

async function run() {
  const res = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const wf = await res.json();

  const brevoNode = wf.nodes.find(n => n.name === 'Brevo - Envia Email');
  const criaNode = wf.nodes.find(n => n.name === 'Notion - Cria Lead');

  console.log('Brevo pos:', brevoNode.position);
  console.log('Cria Lead pos:', criaNode.position);

  // Posição intermediária
  const filterX = Math.round((brevoNode.position[0] + criaNode.position[0]) / 2);
  const filterY = brevoNode.position[1];

  // Novo nó Filter
  const { randomUUID } = require('crypto');
  const filterId = randomUUID();

  const filterNode = {
    id: filterId,
    name: 'Email Enviado com Sucesso?',
    type: 'n8n-nodes-base.filter',
    typeVersion: 2,
    position: [filterX, filterY],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'brevo-success-check',
            leftValue: '={{ $json.messageId }}',
            rightValue: '',
            operator: { type: 'string', operation: 'notEmpty', singleValue: true }
          }
        ],
        combinator: 'and'
      },
      options: {}
    }
  };

  wf.nodes.push(filterNode);

  // Rewire: Brevo -> [remove Cria Lead, add novo filtro]
  const brevoConns = wf.connections['Brevo - Envia Email'];
  console.log('Brevo main[0] antes:', JSON.stringify(brevoConns.main[0]));

  // Remove conn para Cria Lead, adiciona conn para o filtro
  const newBrevoMain0 = brevoConns.main[0]
    .filter(c => c.node !== 'Notion - Cria Lead')
    .concat([{ node: 'Email Enviado com Sucesso?', type: 'main', index: 0 }]);

  wf.connections['Brevo - Envia Email'].main[0] = newBrevoMain0;

  // Adiciona conn filtro -> Cria Lead
  wf.connections['Email Enviado com Sucesso?'] = {
    main: [
      [{ node: 'Notion - Cria Lead', type: 'main', index: 0 }]
    ]
  };

  console.log('Brevo main[0] depois:', JSON.stringify(wf.connections['Brevo - Envia Email'].main[0]));

  // PUT com apenas campos permitidos
  const payload = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings,
    staticData: wf.staticData
  };

  const putRes = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    method: 'PUT',
    headers: { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await putRes.json();
  if (result.id) {
    console.log('OK - workflow salvo, id:', result.id, '| nodes:', result.nodes.length);
    // Verifica se filtro está lá
    const filterCheck = result.nodes.find(n => n.name === 'Email Enviado com Sucesso?');
    console.log('Filter node presente:', !!filterCheck);
    // Verifica connections
    const brevoAfter = result.connections['Brevo - Envia Email'].main[0];
    console.log('Brevo -> filter:', brevoAfter.some(c => c.node === 'Email Enviado com Sucesso?'));
    console.log('Brevo -> Cria Lead (direto):', brevoAfter.some(c => c.node === 'Notion - Cria Lead'));
  } else {
    console.log('ERRO:', JSON.stringify(result).substring(0, 500));
  }
}

run().catch(console.error);
