const routes = {
  chat: 'AI Chat', uml: 'UML Studio', sandbox: 'Sandbox', projects: 'Projects', teams: 'Agent Teams', workflows: 'Workflows', languages: 'Languages', tools: 'Tools', settings: 'Settings'
};

function openPanel(name) {
  const title = routes[name] || 'AI-Test';
  const status = document.getElementById('panelTitle');
  const body = document.getElementById('panelBody');
  if (!status || !body) return;
  status.textContent = title;
  const cards = {
    chat: ['AI Chat','Multi-model routing, conversation context, tools, memory, and agent handoff.'],
    uml: ['UML Studio','Agents → Teams → Workflows → Models → Tools → Sandbox. Design first, validate, then generate configuration.'],
    sandbox: ['Sandbox','Isolated project environments with language-specific profiles, restricted network access, resource limits, and audit events.'],
    projects: ['Projects','Create projects, attach artifacts, select a language, configure agents, and manage project environments.'],
    teams: ['Agent Teams','Create leads and specialists, assign tasks, choose parallel/sequential/debate/consensus execution, and review results.'],
    workflows: ['Workflows','Edit tasks, dependencies, agent assignments, tool permissions, retries, approvals, and execution order.'],
    languages: ['Programming Languages','C, C++, C#, Java, Kotlin, Swift, Objective-C, Rust, Go, Python, JavaScript, TypeScript, PHP, Ruby, Dart, R, Julia, Lua, Perl, Scala, Haskell, Elixir, Erlang, Bash/POSIX Shell, and SQL.'],
    tools: ['Tools','Files, math, dictionary, web, GitHub, code generation, research, artifacts, MCP, and project utilities.'],
    settings: ['Settings','Model providers, sandbox policies, permissions, themes, project defaults, tool access, and runtime configuration.']
  };
  const item = cards[name] || ['AI-Test','Modular AI development workspace.'];
  body.innerHTML = `<h3>${item[0]}</h3><p>${item[1]}</p><div class="panel-actions"><button onclick="runDemo('Prototype')">Run prototype</button><button onclick="runDemo('Configure')">Configure</button></div>`;
  document.getElementById('workspace').classList.add('open');
}

function runDemo(action) {
  const out = document.getElementById('demoStatus');
  if (out) { out.hidden = false; out.textContent = `${action} action queued in prototype mode.`; }
}

function runAssistant() {
  const p = document.getElementById('prompt');
  const s = document.getElementById('assistantStatus');
  if (!p || !s || !p.value.trim()) return;
  s.hidden = false;
  s.textContent = `● Prototype request queued: ${p.value.trim()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', () => openPanel(el.dataset.route)));
});
