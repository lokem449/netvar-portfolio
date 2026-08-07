// Fix WF2 Brevo node: troca startsWith/indexOf('\n') por indexOf('{') / lastIndexOf('}')
// Mesmo fix aplicado no WF1 (gotcha #22: '\n' vira newline real → invalid syntax)
const N8N_URL = 'https://n8n-f3xi.sliplane.app';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NjE4MWE0OC04MjIyLTQyOGEtYWM0NS0zZGUxMTFmNGRiNTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzg1NzI5NzkzfQ.-Z7DnN6ufGTBpcDSsD2zR-S6bTqNhILAkM_sYx7Ih0s';
const WF_ID = 'jvZEaLBnbZcrTzK8';

async function run() {
  const h = { 'X-N8N-API-KEY': API_KEY };
  const wf = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, { headers: h }).then(r => r.json());

  const brevo = wf.nodes.find(n => n.name === 'Brevo - Envia Follow-up');
  if (!brevo) { console.log('Nó Brevo não encontrado'); return; }

  // Nova expressão: usa indexOf('{') / lastIndexOf('}') — não depende de '\n'
  const newJsonBody = `={{ (function() {
    function parseAI() {
      try {
        var tb = $('Anthropic - Escreve Follow-up').item.json.content.find(function(c) { return c.type === 'text'; });
        var raw = tb.text;
        var s = raw.indexOf('{');
        var e = raw.lastIndexOf('}');
        if (s === -1 || e === -1) return {};
        return JSON.parse(raw.substring(s, e + 1));
      } catch(e) { return {}; }
    }
    function getEmail() {
      try {
        var e = $('Decide Follow-up').item.json.properties['Email Decisor'].email;
        return (typeof e === 'string' && e.indexOf('@') > -1) ? e : '';
      } catch(e) { return ''; }
    }
    var p = parseAI();
    return { sender: { name: 'Hugo Luiz', email: 'hugo@netvarstudio.de' }, to: [{ email: getEmail() }], subject: p.email_assunto || '', textContent: p.email_texto || '' };
  })() }}`;

  brevo.parameters.jsonBody = newJsonBody;
  console.log('Nova expressão aplicada. Verificações:');
  console.log('  indexOf check:', newJsonBody.includes("indexOf('{')"));
  console.log('  lastIndexOf check:', newJsonBody.includes("lastIndexOf('}')"));
  console.log('  Anthropic ref:', newJsonBody.includes("Anthropic - Escreve Follow-up"));
  console.log('  Sem backtick fence stripping:', !newJsonBody.includes('startsWith'));

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
    console.log('\nPUT OK — nodes:', result.nodes.length);
    // Verifica nó salvo
    const saved = result.nodes.find(n => n.name === 'Brevo - Envia Follow-up');
    console.log('indexOf salvo:', saved?.parameters?.jsonBody?.includes("indexOf('{')"));
    console.log('Sem startsWith:', !saved?.parameters?.jsonBody?.includes('startsWith'));
  } else {
    console.log('PUT ERRO:', JSON.stringify(result).substring(0, 300));
  }
}

run().catch(console.error);
