const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';
const WF_ID = 'bConkQB6ZWdINiaP';

async function run() {
  const res = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const wf = await res.json();

  // Verifica nó filtro
  const filterNode = wf.nodes.find(n => n.name === 'Email Enviado com Sucesso?');
  console.log('Filter node presente nos nodes:', !!filterNode);
  if (filterNode) console.log('Filter node id:', filterNode.id, '| type:', filterNode.type);

  // Verifica connections
  const brevoConns = wf.connections['Brevo - Envia Email'];
  const filterConns = wf.connections['Email Enviado com Sucesso?'];

  console.log('\nBrevo main[0]:', JSON.stringify(brevoConns?.main?.[0]));
  console.log('Filter -> Cria Lead:', JSON.stringify(filterConns?.main?.[0]));

  // Verifica conexão direta Brevo -> Cria Lead (deve ser removida)
  const directToCria = (brevoConns?.main?.[0] || []).find(c => c.node === 'Notion - Cria Lead');
  console.log('\nBrevo -> Cria Lead DIRETO (deve ser false):', !!directToCria);

  // Nós total
  console.log('\nTotal nodes:', wf.nodes.length);
  console.log('Nodes perto do fim do pipeline:');
  wf.nodes.filter(n => ['Brevo - Envia Email','Email Enviado com Sucesso?','Notion - Cria Lead','Notion - Log de Envios'].includes(n.name))
    .forEach(n => console.log(' -', n.name, '@ pos', n.position));
}

run().catch(console.error);
