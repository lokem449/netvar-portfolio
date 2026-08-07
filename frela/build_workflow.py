"""Gera o Code node de scoring a partir de prompts/scoring.md (fonte unica da verdade)
e injeta no JSON do workflow. Rodar sempre que a rubrica mudar.

  python build_workflow.py            # so gera e valida
  python build_workflow.py --push     # gera, valida e faz PUT no n8n
"""
import json, os, re, subprocess, sys, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
WF = os.path.join(BASE, "workflows", "WF-F1_descoberta_qualificacao.json")
RUBRICA_MD = os.path.join(BASE, "prompts", "scoring.md")

# Query do Upwork: ampliada para alem de automacao (decisao de 25/07).
# Nao pode ser ampla demais: cada vaga pontuada custa ~$0.026 em Claude.
QUERY = ('n8n OR zapier OR "make.com" OR "ai agent" OR "workflow automation" '
         'OR "api integration" OR "web scraping" OR "landing page" OR "wordpress" '
         'OR "python script" OR "data pipeline" OR chatbot')

LIMIAR_UPWORK = 7   # Connects custam dinheiro -> corte alto
MAX_PROPOSTAS = 25  # apertado de 40 para 25: acima disso ele chegou tarde de qualquer jeito
PISO_FIXO = 50
PISO_HORA = 20


def js_array(lines):
    """Transforma linhas em literais JS seguros, um por linha, para .join(NL)."""
    return ",\n    ".join(json.dumps(l, ensure_ascii=False) for l in lines)


def rubrica_lines():
    txt = open(RUBRICA_MD, encoding="utf-8").read()
    blocos = txt.split("```")
    if len(blocos) < 2:
        sys.exit("ERRO: nao achei bloco ``` em scoring.md")
    return blocos[1].strip().split("\n")


PRE_FILTRO = """// Stage 1: corte gratuito em codigo. Mata a maior parte antes de gastar token de LLM.
// Rubrica gerada de prompts/scoring.md por build_workflow.py -- NAO editar aqui.
const NL = String.fromCharCode(10);
const PISO_FIXO = %(piso_fixo)d;
const PISO_HORA = %(piso_hora)d;
const MAX_PROPOSTAS = %(max_prop)d;
const LIMIAR = %(limiar)d;
const BLACKLIST = ['screen share', 'screenshare', 'share your screen', 'loom', 'webcam', 'video call', 'zoom call', 'on camera', 'face to face', 'record a video', 'screen recording'];
// Corte gratuito de PRESENCA: o que se compra e disponibilidade, nao artefato.
// Mata isso aqui em vez de gastar $0.026 pro LLM chegar na mesma conclusao.
const PRESENCA = ['virtual assistant', 'customer support agent', 'support agent', 'live chat agent', 'hours per week', 'hrs per week', 'hours/week', 'full-time position', 'full time position', 'join our team', 'ongoing support', 'daily standup', 'work our hours', 'your own hours are', 'answer phones', 'cold calling', 'appointment setter', 'data entry clerk', 'moderator'];

const RUBRICA = [
    %(rubrica)s
  ].join(NL);

const out = [];
const cortadas = [];

for (const item of $input.all()) {
  const j = item.json || {};
  if (!j.jobId) { continue; }

  const desc = String(j.description || '');
  const dlow = desc.toLowerCase();
  const appl = Number(j.totalApplicants || 0);
  const fixo = j.budgetAmount ? Number(j.budgetAmount) : null;
  const hmax = j.hourlyBudgetMax ? Number(j.hourlyBudgetMax) : null;

  let corte = null;
  if (!j.clientPaymentVerified) { corte = 'pagamento nao verificado'; }
  else if (appl > MAX_PROPOSTAS) { corte = 'tarde demais: ' + appl + ' propostas'; }
  else if (fixo !== null && fixo < PISO_FIXO) { corte = 'fixo $' + fixo + ' abaixo do piso'; }
  else if (hmax !== null && hmax < PISO_HORA) { corte = 'hourly $' + hmax + ' abaixo do piso'; }
  else {
    const kw = BLACKLIST.find(function (k) { return dlow.indexOf(k) !== -1; });
    if (kw) { corte = 'blacklist: ' + kw; }
    else {
      const pk = PRESENCA.find(function (k) { return dlow.indexOf(k) !== -1; });
      if (pk) { corte = 'presenca, nao artefato: ' + pk; }
    }
  }

  if (corte) { cortadas.push({ title: j.title, motivo: corte }); continue; }

  const pub = j.publishTime ? new Date(j.publishTime) : null;
  const idade = pub ? Math.round((Date.now() - pub.getTime()) / 60000) : -1;

  let orcamento = 'nao informado';
  if (fixo !== null) { orcamento = '$' + fixo + ' fixo'; }
  else if (j.hourlyBudgetMin || hmax) { orcamento = '$' + (j.hourlyBudgetMin || '?') + '-$' + (hmax || '?') + '/hr'; }

  const vaga = [
    'Plataforma: Upwork (candidatura custa Connects)',
    'Titulo: ' + String(j.title || ''),
    'Tipo: ' + String(j.jobType || '') + ' | Orcamento: ' + orcamento,
    'Nivel pedido: ' + String(j.experienceLevel || '') + ' | Duracao: ' + String(j.engagementDuration || ''),
    'Skills marcadas: ' + (Array.isArray(j.skills) ? j.skills.join(', ') : ''),
    'Publicada ha: ' + idade + ' minutos',
    'Propostas ja enviadas: ' + appl,
    'Cliente: ' + String(j.clientCountry || '') + ' | pagamento verificado: ' + String(j.clientPaymentVerified) + ' | ja gastou: $' + String(j.clientTotalSpent || 0) + ' | rating: ' + String(j.clientRating || 0) + ' (' + String(j.clientReviewCount || 0) + ' reviews)',
    '',
    'Descricao:',
    desc.slice(0, 3500)
  ].join(NL);

  out.push({
    json: {
      jobId: String(j.jobId),
      title: String(j.title || ''),
      url: String(j.url || ''),
      jobType: String(j.jobType || ''),
      orcamento: orcamento,
      valorEstimado: fixo !== null ? fixo : (hmax || null),
      idadeMin: idade,
      totalApplicants: appl,
      clientCountry: String(j.clientCountry || ''),
      clientPaymentVerified: !!j.clientPaymentVerified,
      clientTotalSpent: Number(j.clientTotalSpent || 0),
      clientRating: Number(j.clientRating || 0),
      description: desc.slice(0, 3500),
      promptScore: RUBRICA.split('{{limiar}}').join(String(LIMIAR)).split('{{vaga}}').join(vaga)
    }
  });
}

console.log('pre-filtro: ' + out.length + ' passaram, ' + cortadas.length + ' cortadas');
for (const c of cortadas) { console.log('  CORTA: ' + String(c.title).slice(0, 50) + ' | ' + c.motivo); }

return out;"""


def main():
    wf = json.load(open(WF, encoding="utf-8"))

    code = PRE_FILTRO % {
        "piso_fixo": PISO_FIXO, "piso_hora": PISO_HORA,
        "max_prop": MAX_PROPOSTAS, "limiar": LIMIAR_UPWORK,
        "rubrica": js_array(rubrica_lines()),
    }

    node = next(n for n in wf["nodes"] if n["name"] == "Pre-filtro + Monta Prompt Score")
    node["parameters"]["jsCode"] = code

    apify = next(n for n in wf["nodes"] if n["name"] == "Apify - Upwork Vagas Frescas")
    body = json.loads(apify["parameters"]["jsonBody"])
    body["query"] = QUERY
    apify["parameters"]["jsonBody"] = json.dumps(body, indent=2, ensure_ascii=False)

    json.dump(wf, open(WF, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"gerado: rubrica com {len(rubrica_lines())} linhas, "
          f"jsCode com {len(code)} chars")

    # gotcha #22: sintaxe de TODO Code node checada antes de qualquer push
    chk = subprocess.run(
        ["node", "-e", """
const fs=require('fs');
const wf=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
let ok=true;
for(const n of wf.nodes){
  if(n.type!=='n8n-nodes-base.code') continue;
  try{ new Function(n.parameters.jsCode); console.log('  OK   '+n.name); }
  catch(e){ ok=false; console.log('  FALHA '+n.name+' -> '+e.message); }
}
process.exit(ok?0:1);
""", WF], capture_output=True, text=True)
    print(chk.stdout.strip())
    if chk.returncode != 0:
        sys.exit("ERRO de sintaxe - nao vou fazer push")

    if "--push" not in sys.argv:
        print("(rode com --push para enviar ao n8n)")
        return

    url = os.environ["N8N_PROD_URL"].rstrip("/")
    wid = os.environ["FRELA_WF1_ID"]
    payload = {k: wf[k] for k in ("name", "nodes", "connections", "settings")}
    req = urllib.request.Request(
        f"{url}/api/v1/workflows/{wid}", method="PUT",
        data=json.dumps(payload).encode(),
        headers={"X-N8N-API-KEY": os.environ["N8N_PROD_API_TOKEN"],
                 "Content-Type": "application/json"})
    try:
        r = json.loads(urllib.request.urlopen(req).read())
        print(f"PUT ok: {r['id']} | active={r.get('active')} | nodes={len(r['nodes'])}")
    except urllib.error.HTTPError as e:
        sys.exit(f"PUT falhou {e.code}: {e.read().decode()[:500]}")


if __name__ == "__main__":
    main()
