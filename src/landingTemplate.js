function landingTemplate() {
	return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PureTV - Configurar</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #111; }
    .wrap { max-width: 920px; margin: 0 auto; }
    h1 { margin: 0 0 8px; }
    p { margin: 0 0 16px; color: #333; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; }
    label { display: block; font-weight: 600; margin: 12px 0 6px; }
    input[type="url"], textarea { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px; border: 1px solid #ccc; font-family: inherit; }
    textarea { min-height: 140px; resize: vertical; }
    button { margin-top: 14px; padding: 10px 14px; border: 0; border-radius: 10px; background: #111; color: #fff; font-weight: 700; cursor: pointer; }
    .muted { color: #555; font-size: 13px; }
    .out { margin-top: 16px; padding: 14px; border-radius: 12px; background: #f6f6f6; border: 1px solid #e7e7e7; }
    code { background: #eee; padding: 2px 6px; border-radius: 6px; }
    a { color: #0b57d0; }
    @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>PureTV</h1>
    <p>Configure sua playlist <b>M3U</b> e guia <b>XMLTV</b> por <b>URL</b>. No final, você recebe um link de instalação para o Stremio.</p>

    <div class="grid">
      <div class="card">
        <h2 style="margin:0 0 8px;">M3U</h2>
        <div class="muted">Somente URL.</div>
        <label for="m3uUrl">URL do M3U</label>
        <input id="m3uUrl" type="url" placeholder="https://..." />
      </div>

      <div class="card">
        <h2 style="margin:0 0 8px;">XMLTV</h2>
        <div class="muted">Somente URL.</div>
        <label for="xmltvUrl">URL do XMLTV</label>
        <input id="xmltvUrl" type="url" placeholder="https://..." />
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="muted">Dica: URLs estáveis evitam problemas no deploy.</div>
      <button id="btn">Gerar link de instalação</button>
      <div id="out" class="out" style="display:none;"></div>
    </div>
  </div>

  <script>
    function escapeHtml(s) {
      return (s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    }

    document.getElementById('btn').addEventListener('click', async () => {
      const out = document.getElementById('out');
      out.style.display = 'block';
      out.textContent = 'Processando...';

      const m3uUrl = document.getElementById('m3uUrl').value.trim() || null;
      const xmltvUrl = document.getElementById('xmltvUrl').value.trim() || null;

      try {
        const resp = await fetch('/api/config', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ m3uUrl, xmltvUrl })
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json && json.error ? json.error : 'Falha ao gerar configuração');

        out.innerHTML = '<div><b>Instalar no Stremio:</b></div>' +
          '<div style="margin-top:8px;"><a href="' + escapeHtml(json.installUrl) + '">' + escapeHtml(json.installUrl) + '</a></div>' +
          '<div class="muted" style="margin-top:10px;">Se o link não abrir, copie e cole no navegador. Ele abre a tela de instalação do Stremio.</div>' +
          '<div style="margin-top:10px;"><b>Manifest:</b> <code>' + escapeHtml(json.manifestUrl) + '</code></div>';
      } catch (e) {
        out.textContent = 'Erro: ' + (e && e.message ? e.message : String(e));
      }
    });
  </script>
</body>
</html>`
}

module.exports = landingTemplate

