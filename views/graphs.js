function makeNode(value){
  const n = document.createElement('div');
  n.className = 'node';
  n.textContent = value;
  return n;
}

export function GraphsView({root, controls, log, ui, setTitleDescNotes}){
  // fixed small graph
  const nodes = ['A','B','C','D','E','F'];
  const edges = [
    ['A','B'], ['A','C'],
    ['B','D'], ['C','D'],
    ['D','E'], ['E','F']
  ];
  const adj = new Map(nodes.map(n => [n, []]));
  edges.forEach(([u,v]) => {
    adj.get(u).push(v);
    adj.get(v).push(u);
  });

  const pos = {
    A:{x:120,y:60},
    B:{x:60,y:150},
    C:{x:180,y:150},
    D:{x:120,y:240},
    E:{x:240,y:260},
    F:{x:320,y:190}
  };

  function draw(){
    root.innerHTML = '';
    // edges
    edges.forEach(([u,v])=>{
      drawEdge(u,v);
    });
    // nodes
    nodes.forEach(n=>{
      const el = makeNode(n);
      el.dataset.v = n;
      el.style.left = `${pos[n].x}px`;
      el.style.top = `${pos[n].y}px`;
      root.appendChild(el);
    });
  }

  function drawEdge(u,v){
    const x1 = pos[u].x+23, y1=pos[u].y+23;
    const x2 = pos[v].x+23, y2=pos[v].y+23;
    const dx=x2-x1, dy=y2-y1;
    const len=Math.sqrt(dx*dx+dy*dy);
    const angle=Math.atan2(dy,dx)*180/Math.PI;
    const e = document.createElement('div');
    e.className='edge';
    e.style.left=`${x1}px`;
    e.style.top=`${y1}px`;
    e.style.width=`${len}px`;
    e.style.transform=`rotate(${angle}deg)`;
    root.appendChild(e);
  }

  function mark(v, cls){
    const el = root.querySelector(`.node[data-v="${v}"]`);
    if(el) el.classList.add(cls);
  }
  function clearMarks(){
    root.querySelectorAll('.node').forEach(n=>{
      n.classList.remove('active','good','bad');
    });
  }

  async function bfs(start){
    clearMarks();
    const q=[start];
    const vis=new Set([start]);
    log(`BFS from ${start}:`);
    while(q.length){
      const u=q.shift();
      mark(u,'active');
      await new Promise(r=>setTimeout(r, 420));
      mark(u,'good');
      log(`visit ${u}`);
      for(const v of adj.get(u)){
        if(!vis.has(v)){
          vis.add(v);
          q.push(v);
        }
      }
    }
  }

  async function dfs(start){
    clearMarks();
    const st=[start];
    const vis=new Set();
    log(`DFS from ${start}:`);
    while(st.length){
      const u=st.pop();
      if(vis.has(u)) continue;
      vis.add(u);
      mark(u,'active');
      await new Promise(r=>setTimeout(r, 420));
      mark(u,'good');
      log(`visit ${u}`);
      // push neighbors in reverse for nicer order
      const ns=[...adj.get(u)].reverse();
      ns.forEach(v=>{ if(!vis.has(v)) st.push(v); });
    }
  }

  function init(){
    setTitleDescNotes({
      title: 'Graphs (BFS/DFS)',
      desc: '圖可有環與多條路徑；用 BFS/DFS 走訪節點並理解佇列/堆疊的角色。',
      complexity: 'Traversal O(V+E)',
      hints: [
        'BFS 使用 queue，會一層一層擴展（最短路常用）。',
        'DFS 使用 stack/遞迴，會一路深入再回溯。',
        '圖可用 adjacency list 表示，空間 O(V+E)。'
      ],
      notes: `
        <p><b>Graph</b> 由頂點 V 與邊 E 組成，可為有向/無向、加權/不加權。</p>
        <p><b>BFS</b>：使用 Queue，適合找無權重最短路。</p>
        <p><b>DFS</b>：使用 Stack/遞迴，常用在拓樸排序、找連通元件。</p>
      `
    });

    const start = ui.select({
      options: nodes.map(n=>({value:n, label:n})),
      value: 'A'
    });
    const b = ui.button({text:'Run BFS', kind:'primary'});
    const d = ui.button({text:'Run DFS', kind:'primary'});
    const c = ui.button({text:'Clear', kind:'danger'});

    b.onclick = ()=>bfs(start.value);
    d.onclick = ()=>dfs(start.value);
    c.onclick = ()=>{ clearMarks(); log('clear'); };

    controls.appendChild(ui.controlRow([ ui.field({label:'Start node', input: start}) ]));
    controls.appendChild(ui.controlRow([ b, d, c ]));
    draw();
  }

  return { init };
}
