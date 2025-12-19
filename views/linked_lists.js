function node(value){
  const n = document.createElement('div');
  n.className = 'node';
  n.textContent = value;
  return n;
}

export function LinkedListsView({root, controls, log, ui, setTitleDescNotes}){
  // singly linked list represented by array of values for demo
  const list = [10, 20, 30, 40];

  function render(active=null){
    root.innerHTML = '';
    const startX = 20, y = 120, gap = 64;
    list.forEach((v,i)=>{
      const n = node(v);
      if(active===i) n.classList.add('active');
      n.style.left = `${startX + i*gap}px`;
      n.style.top = `${y}px`;
      root.appendChild(n);

      if(i < list.length-1){
        const e = document.createElement('div');
        e.className = 'edge';
        e.style.left = `${startX + i*gap + 46}px`;
        e.style.top = `${y + 23}px`;
        e.style.width = `${gap-46}px`;
        root.appendChild(e);

        const arrow = document.createElement('div');
        arrow.className = 'muted';
        arrow.style.position='absolute';
        arrow.style.left = `${startX + i*gap + gap-18}px`;
        arrow.style.top = `${y + 12}px`;
        arrow.style.fontSize='14px';
        arrow.textContent='›';
        root.appendChild(arrow);
      }
    });

    const head = document.createElement('div');
    head.className='pill';
    head.style.position='absolute';
    head.style.left='14px';
    head.style.top='14px';
    head.textContent='head';
    root.appendChild(head);
  }

  async function traverse(){
    log('traverse from head ...');
    for(let i=0;i<list.length;i++){
      render(i);
      await new Promise(r=>setTimeout(r, 380));
    }
    render(null);
    log('done');
  }

  function init(){
    setTitleDescNotes({
      title: 'Linked Lists',
      desc: '節點用指標串起來：插入/刪除指標很快，但搜尋要走訪。',
      complexity: 'Access O(n), Search O(n), Insert/Delete O(1) (given node)',
      hints: [
        'Linked list 的插入/刪除在「已知節點位置」下是 O(1)。',
        '想插入第 k 個位置，仍需先走訪到該位置，整體可能 O(n)。',
        '適合頻繁插入/刪除，但不適合大量隨機存取。'
      ],
      notes: `
        <p><b>Singly Linked List</b> 每個節點包含 (value, next)。</p>
        <ul>
          <li>優點：不需要連續記憶體；插入/刪除可只改指標。</li>
          <li>缺點：無法 O(1) 隨機存取；搜尋/走訪為 O(n)。</li>
        </ul>
        <p>本頁提供：head 插入、指定 index 插入/刪除、走訪動畫。</p>
      `
    });

    const val = ui.inputNumber({value: 25});
    const idx = ui.inputNumber({min:0, value: 0});
    const insHead = ui.button({text:'Insert@Head', kind:'good'});
    const insIdx  = ui.button({text:'Insert@Index', kind:'primary'});
    const delIdx  = ui.button({text:'Delete@Index', kind:'danger'});
    const trav    = ui.button({text:'Traverse', kind:''});

    insHead.onclick = () => { list.unshift(Number(val.value)); log(`insert head ${val.value}`); render(0); };
    insIdx.onclick  = () => {
      const i = Math.max(0, Math.min(list.length, Number(idx.value)));
      list.splice(i,0,Number(val.value));
      log(`insert ${val.value} at index ${i} (需先走訪到位置 => O(n))`);
      render(i);
    };
    delIdx.onclick  = () => {
      if(list.length===0) return;
      const i = Math.max(0, Math.min(list.length-1, Number(idx.value)));
      const x = list.splice(i,1)[0];
      log(`delete index ${i} => ${x}`);
      render(i);
    };
    trav.onclick    = () => traverse();

    controls.appendChild(ui.controlRow([
      ui.field({label:'Value', input: val}),
      ui.field({label:'Index', input: idx}),
    ]));
    controls.appendChild(ui.controlRow([ insHead, insIdx, delIdx, trav ]));
    render(null);
  }

  return { init };
}
