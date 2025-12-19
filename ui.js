export const ui = {
  controlRow(children=[]){
    const row = document.createElement('div');
    row.className = 'control-row';
    children.forEach(c => row.appendChild(c));
    return row;
  },
  field({label, input}){
    const wrap = document.createElement('div');
    const l = document.createElement('label');
    l.textContent = label;
    wrap.appendChild(l);
    wrap.appendChild(input);
    return wrap;
  },
  inputText({placeholder='', value='' }={}){
    const i = document.createElement('input');
    i.type = 'text';
    i.placeholder = placeholder;
    i.value = value;
    return i;
  },
  inputNumber({min=null, max=null, step=1, value='' }={}){
    const i = document.createElement('input');
    i.type = 'number';
    if(min!==null) i.min = String(min);
    if(max!==null) i.max = String(max);
    i.step = String(step);
    i.value = value;
    return i;
  },
  select({options=[], value=null}={}){
    const s = document.createElement('select');
    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      s.appendChild(opt);
    });
    if(value!==null) s.value = value;
    return s;
  },
  button({text, kind='' }={}){
    const b = document.createElement('button');
    b.className = `btn ${kind}`.trim();
    b.textContent = text;
    return b;
  },
  hr(){
    const d = document.createElement('div');
    d.className = 'divider';
    return d;
  },
  note(text, cls='muted'){
    const p = document.createElement('p');
    p.className = cls;
    p.textContent = text;
    return p;
  }
};
