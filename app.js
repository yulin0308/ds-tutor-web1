import { Views } from './views.js';
import { ui } from './ui.js';

const el = (id) => document.getElementById(id);

const state = {
  current: 'arrays',
  view: null
};

function setTitleDescNotes({title, desc, notes, hints, complexity}) {
  el('viewTitle').textContent = title;
  el('viewDesc').textContent = desc;
  el('notes').innerHTML = notes;
  el('hints').innerHTML = hints.map(h => `<li>${h}</li>`).join('');
  el('complexityPill').textContent = `Complexity: ${complexity || '-'}`;
}

function log(msg){
  const d = new Date();
  const t = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const item = document.createElement('div');
  item.className = 'item';
  item.innerHTML = `<span class="time">[${t}]</span>${msg}`;
  el('log').prepend(item);
}

function mount(viewKey){
  // tabs
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewKey);
  });

  // cleanup
  el('controls').innerHTML = '';
  el('viz').innerHTML = '';
  el('log').innerHTML = '';

  const viewFactory = Views[viewKey];
  const view = viewFactory({ root: el('viz'), controls: el('controls'), log, ui, setTitleDescNotes });
  state.current = viewKey;
  state.view = view;
  view.init();
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => mount(btn.dataset.view));
});

// initial
mount('arrays');
