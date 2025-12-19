function makeNode(value){
  const n = document.createElement('div');
  n.className = 'node';
  n.textContent = value;
  return n;
}

export function ArraysView({root, controls, log, ui, setTitleDescNotes}){
  const arr = [3, 8, 2, 9, 5];

  function layout(nodes){
    const W = root.clientWidth;
    const gap = 10;
    const size = 46;
    const total = nodes.length*size + Math.max(0, nodes.length-1)*gap;
    let x = Math.max(10, (W - total)/2);
    const y = 90;
    nodes.forEach((node, idx) => {
      node.style.left = `${x + idx*(size+gap)}px`;
      node.style.top = `${y}px`;
    });
  }

  function render(activeIdx=null){
    root.innerHTML = '';
    const nodes = arr.map(v => makeNode(v));
    nodes.forEach((n, i) => {
      if(activeIdx === i) n.classList.add('active');
      root.appendChild(n);
    });
    setTimeout(() => layout(nodes), 10);
  }

  function notes(){
    return `
      <p><b>Array</b> 是一段連續記憶體，透過索引 <code>a[i]</code> 可在 O(1) 存取。</p>
      <ul>
        <li>查找：依情境（線性搜尋 O(n) / 二分搜尋 O(log n) 但需排序）。</li>
        <li>插入/刪除：中間位置需要搬移元素，通常 O(n)。</li>
      </ul>
      <p>本頁提供：<code>append</code>、指定位置 <code>insert</code>、<code>remove</code>、線性搜尋。</p>
    `;
  }

  function initControls(){
    setTitleDescNotes({
      title: 'Arrays',
      desc: '用視覺化觀察「插入/刪除需要搬移」：越靠近開頭越慢。',
      complexity: 'Access O(1), Search O(n), Insert/Delete O(n)',
      hints: [
        '先試試 insert 在 index=0 與 index=末端，比較搬移差異。',
        '搜尋會逐一比對，n 越大越慢（可自行多 append 來感受）。',
        '若資料已排序，可用二分搜尋把搜尋降到 O(log n)。'
      ],
      notes: notes()
    });

    const val = ui.inputNumber({value: 7});
    const idx = ui.inputNumber({min: 0, value: 0});
    const btnAppend = ui.button({text:'Append', kind:'good'});
    const btnInsert = ui.button({text:'Insert@Index', kind:'primary'});
    const btnRemove = ui.button({text:'Remove@Index', kind:'danger'});
    const findVal = ui.inputNumber({value: 9});
    const btnFind = ui.button({text:'Linear Search', kind:'primary'});
    const btnRandom = ui.button({text:'Random Fill', kind:''});

    btnAppend.onclick = () => {
      arr.push(Number(val.value));
      log(`append ${val.value}`);
      render(arr.length-1);
    };

    btnInsert.onclick = () => {
      const i = Math.max(0, Math.min(arr.length, Number(idx.value)));
      arr.splice(i, 0, Number(val.value));
      log(`insert ${val.value} at index ${i} (需要搬移約 ${arr.length-1-i} 個元素)`);
      render(i);
    };

    btnRemove.onclick = () => {
      if(arr.length===0) return;
      const i = Math.max(0, Math.min(arr.length-1, Number(idx.value)));
      const removed = arr.splice(i, 1)[0];
      log(`remove index ${i} => ${removed} (需要搬移約 ${arr.length-i} 個元素)`);
      render(i);
    };

    btnFind.onclick = async () => {
      const target = Number(findVal.value);
      log(`search ${target} ...`);
      for(let i=0;i<arr.length;i++){
        render(i);
        await new Promise(r => setTimeout(r, 350));
        if(arr[i]===target){
          log(`✅ found ${target} at index ${i} (比較了 ${i+1} 次)`);
          render(i);
          return;
        }
      }
      log(`❌ not found ${target} (比較了 ${arr.length} 次)`);
      render(null);
    };

    btnRandom.onclick = () => {
      arr.length = 0;
      const n = 8;
      for(let i=0;i<n;i++) arr.push(Math.floor(Math.random()*90)+10);
      log(`random fill n=${n}`);
      render(null);
    };

    controls.appendChild(ui.controlRow([
      ui.field({label:'Value', input: val}),
      ui.field({label:'Index', input: idx}),
    ]));
    controls.appendChild(ui.controlRow([
      btnAppend, btnInsert, btnRemove, btnRandom
    ]));
    controls.appendChild(ui.hr());
    controls.appendChild(ui.controlRow([
      ui.field({label:'Find value', input: findVal}),
      btnFind
    ]));
  }

  return {
    init(){
      initControls();
      render(null);
    }
  }
}
