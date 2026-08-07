// Fix: força warmup para semana 4 (15 emails/dia) retrocedendo warmupStartDate
// Run: node fix_wf1_warmup_force.js

const WF1_ID = 'bConkQB6ZWdINiaP';
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';

async function run() {
  const res = await fetch(`${N8N_URL}/api/v1/workflows/${WF1_ID}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  const wf = await res.json();

  // Encontra o nó Code que contém a lógica de warmup (procura por warmupStartDate)
  const codeNodes = wf.nodes.filter(n => n.type === 'n8n-nodes-base.code');
  let warmupNode = null;
  for (const n of codeNodes) {
    if ((n.parameters.jsCode || '').includes('warmupStartDate') ||
        (n.parameters.jsCode || '').includes('limit') ||
        (n.parameters.jsCode || '').includes('semana') ||
        (n.parameters.jsCode || '').includes('LIMITE')) {
      warmupNode = n;
      console.log('Warmup node encontrado:', n.name);
      console.log('Código atual:\n', n.parameters.jsCode.substring(0, 1000));
      break;
    }
  }

  if (!warmupNode) {
    // Se não achou nó específico de warmup, procura no staticData
    console.log('staticData atual:', JSON.stringify(wf.staticData, null, 2));

    // Retroage warmupStartDate para 30 dias atrás para forçar semana 4
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    wf.staticData = wf.staticData || {};
    wf.staticData.global = wf.staticData.global || {};
    wf.staticData.global.warmupStartDate = thirtyDaysAgo;

    console.log('Setando warmupStartDate para:', thirtyDaysAgo);
  } else {
    // Substitui o cálculo de limite para hardcodar 15
    const oldCode = warmupNode.parameters.jsCode;

    // Procura padrão de cálculo de semana e substitui por fixo
    let newCode = oldCode
      // Se tem cálculo de semana por días
      .replace(
        /const week = Math\.floor\(daysSince \/ 7\);/g,
        'const week = 4; // FORÇADO: semana 4 = 15 emails/dia'
      )
      .replace(
        /const semana = Math\.floor\(diasDesde \/ 7\);/g,
        'const semana = 4; // FORÇADO: semana 4 = 15 emails/dia'
      );

    if (newCode === oldCode) {
      console.log('Padrão de week não encontrado. Código completo do nó:');
      console.log(oldCode);
      console.log('\nAjuste manualmente.');
      return;
    }

    warmupNode.parameters.jsCode = newCode;
    console.log('Substituído com sucesso.');
  }

  // Salva workflow
  const put = await fetch(`${N8N_URL}/api/v1/workflows/${WF1_ID}`, {
    method: 'PUT',
    headers: { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(wf)
  });
  const result = await put.json();
  console.log('PUT:', put.status, result.id || result.message || JSON.stringify(result).substring(0, 200));
}

run().catch(console.error);
