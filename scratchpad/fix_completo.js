// DIAGNÓSTICO + FIX: warmup WF1 + mostra prompt WF5
// Run: node fix_completo.js

const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';

const headers = { 'X-N8N-API-KEY': API_KEY };

async function get(path) {
  const r = await fetch(`${N8N_URL}/api/v1${path}`, { headers });
  return r.json();
}

async function put(path, body) {
  const r = await fetch(`${N8N_URL}/api/v1${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return r.json();
}

async function run() {
  // Lista todos os workflows
  const all = await get('/workflows?limit=50');
  const wfs = all.data || [];
  console.log('\n=== WORKFLOWS ===');
  wfs.forEach(w => console.log(`${w.id} | ${w.name} | active: ${w.active}`));

  // Encontra WF1 e WF5
  const wf1Meta = wfs.find(w => w.name.includes('WF1') || w.name.toLowerCase().includes('prospec'));
  const wf5Meta = wfs.find(w => w.name.includes('WF5') || w.name.toLowerCase().includes('email') || w.name.toLowerCase().includes('escreve'));

  if (!wf1Meta) { console.log('WF1 não encontrado!'); return; }
  console.log('\nWF1 ID:', wf1Meta.id, '|', wf1Meta.name);
  if (wf5Meta) console.log('WF5 ID:', wf5Meta.id, '|', wf5Meta.name);

  // Pega WF1 completo
  const wf1 = await get(`/workflows/${wf1Meta.id}`);

  // Mostra staticData
  console.log('\n=== WF1 staticData.global ===');
  console.log(JSON.stringify(wf1.staticData?.global, null, 2));

  // Mostra execuções recentes
  const execs = await get(`/executions?workflowId=${wf1Meta.id}&limit=8`);
  console.log('\n=== WF1 EXECUÇÕES RECENTES ===');
  (execs.data || []).forEach(e => {
    console.log(`${e.startedAt} | ${e.status} | finished:${e.finished}`);
  });

  // Mostra código dos nós (warmup)
  console.log('\n=== WF1 CODE NODES ===');
  (wf1.nodes || []).filter(n => n.type === 'n8n-nodes-base.code').forEach(n => {
    const code = (n.parameters.jsCode || '');
    if (code.includes('limit') || code.includes('semana') || code.includes('week') || code.includes('warmup') || code.includes('Limita')) {
      console.log(`\n--- ${n.name} ---`);
      console.log(code.substring(0, 1500));
    }
  });

  // === FIX WARMUP ===
  console.log('\n=== APLICANDO FIX: warmup → semana 4 ===');

  let fixed = false;

  // Estratégia 1: retrocede warmupStartDate no staticData
  const sd = wf1.staticData || {};
  const sdg = sd.global || {};
  const oldDate = sdg.warmupStartDate;
  if (oldDate) {
    const newDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    console.log('warmupStartDate:', oldDate, '→', newDate);
    wf1.staticData = { ...sd, global: { ...sdg, warmupStartDate: newDate } };
    fixed = true;
  }

  // Estratégia 2: patcha código do nó de limite
  for (const n of (wf1.nodes || [])) {
    if (n.type !== 'n8n-nodes-base.code') continue;
    const code = n.parameters.jsCode || '';
    let patched = code
      .replace(/Math\.floor\(daysSince\s*\/\s*7\)/g, '4 /* FORÇADO semana 4 */')
      .replace(/Math\.floor\(diasDesde\s*\/\s*7\)/g, '4 /* FORÇADO semana 4 */')
      .replace(/Math\.floor\(\(Date\.now\(\)[\s\S]*?\/\s*\(7.*?\)\)/g, '4 /* FORÇADO */');
    if (patched !== code) {
      console.log(`Patchando nó: ${n.name}`);
      n.parameters.jsCode = patched;
      fixed = true;
    }
  }

  if (!fixed) {
    console.log('⚠️  Nenhum padrão de warmup encontrado para patchar automaticamente.');
    console.log('Mostrando TODOS os code nodes para diagnóstico manual:');
    (wf1.nodes || []).filter(n => n.type === 'n8n-nodes-base.code').forEach(n => {
      console.log(`\n--- ${n.name} ---`);
      console.log((n.parameters.jsCode || '').substring(0, 2000));
    });
    return;
  }

  // Salva
  const result = await put(`/workflows/${wf1Meta.id}`, wf1);
  console.log('PUT WF1:', result.id ? 'OK id=' + result.id : JSON.stringify(result).substring(0, 300));

  // WF5: mostra prompt do nó Anthropic
  if (wf5Meta) {
    const wf5 = await get(`/workflows/${wf5Meta.id}`);
    const anthropicNode = (wf5.nodes || []).find(n =>
      n.type.includes('anthropic') || n.type.includes('lmChat') || n.name.toLowerCase().includes('escreve')
    );
    if (anthropicNode) {
      console.log('\n=== WF5 PROMPT (Anthropic) ===');
      const p = anthropicNode.parameters;
      console.log('system:', (p.system || p.systemPrompt || '').substring(0, 1500));
      console.log('prompt:', JSON.stringify(p.messages || p.prompt || '').substring(0, 1500));
    }
  }
}

run().catch(console.error);
