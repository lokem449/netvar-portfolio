// Corrige estrutura de connections do Brevo e reativa o WF1
// PowerShell gravou main[0] como objeto em vez de [[objeto]]
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';
const WF_ID = 'bConkQB6ZWdINiaP';

async function run() {
  const res = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const wf = await res.json();

  console.log('Estado atual:');
  console.log('  active:', wf.active);
  console.log('  Brevo main:', JSON.stringify(wf.connections['Brevo - Envia Email']?.main));
  console.log('  Filter main:', JSON.stringify(wf.connections['Email Enviado com Sucesso?']?.main));

  // Corrige: main deve ser array de arrays (indexed by output port)
  // Estrutura correta: main = [ [conn1, conn2, ...] ]  (port 0 → array de conexões)
  const brevoMain0 = wf.connections['Brevo - Envia Email'].main;

  // Se main[0] é um objeto (não array), corrige
  if (!Array.isArray(brevoMain0[0])) {
    console.log('\nCorreção necessária: Brevo main[0] é objeto, não array');
    // Coleta todas as conexões que estão no nível errado
    const conns = Array.isArray(brevoMain0) ? brevoMain0.filter(c => c && c.node) : [brevoMain0];
    wf.connections['Brevo - Envia Email'].main = [conns];
    console.log('  Corrigido para:', JSON.stringify(wf.connections['Brevo - Envia Email'].main));
  } else {
    console.log('\nBrevo main já é array de arrays — OK');
  }

  // Verifica e corrige Filter connections também
  const filterMain = wf.connections['Email Enviado com Sucesso?']?.main;
  if (filterMain && !Array.isArray(filterMain[0])) {
    console.log('Correção necessária: Filter main[0] é objeto, não array');
    const conns = Array.isArray(filterMain) ? filterMain.filter(c => c && c.node) : [filterMain];
    wf.connections['Email Enviado com Sucesso?'].main = [conns];
    console.log('  Corrigido para:', JSON.stringify(wf.connections['Email Enviado com Sucesso?'].main));
  }

  // PUT
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

  if (!result.id) {
    console.log('\nPUT ERRO:', JSON.stringify(result).substring(0, 300));
    return;
  }
  console.log('\nPUT OK - nodes:', result.nodes.length, '| active:', result.active);

  // Reativa
  const actRes = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}/activate`, {
    method: 'POST',
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const actResult = await actRes.json();
  console.log('Ativação:', actResult.active ? 'ATIVO' : 'FALHOU', actResult.id || JSON.stringify(actResult).substring(0,200));
}

run().catch(console.error);
