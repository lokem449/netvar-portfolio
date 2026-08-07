// Diagnóstico: quantos leads do poco têm Email e não têm Website
// Também mostra o código de warmup do WF1

const WF1_ID = 'bConkQB6ZWdINiaP';
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';

async function run() {
  // Pega execuções recentes do WF1
  const execRes = await fetch(`${N8N_URL}/api/v1/executions?workflowId=${WF1_ID}&limit=10`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const execs = await execRes.json();
  console.log('=== EXECUÇÕES RECENTES WF1 ===');
  (execs.data || []).forEach(e => {
    console.log(`${e.startedAt} | status: ${e.status} | finished: ${e.finished}`);
  });

  // Pega o WF1 e mostra nós de código
  const wfRes = await fetch(`${N8N_URL}/api/v1/workflows/${WF1_ID}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const wf = await wfRes.json();

  console.log('\n=== staticData.global ===');
  console.log(JSON.stringify(wf.staticData?.global, null, 2));

  console.log('\n=== NÓS DE CÓDIGO ===');
  wf.nodes.filter(n => n.type === 'n8n-nodes-base.code').forEach(n => {
    console.log(`\n--- ${n.name} ---`);
    console.log((n.parameters.jsCode || '').substring(0, 1200));
  });
}

run().catch(console.error);
