function node(value){
  const n = document.createElement('div');
  n.className = 'node';
  n.textContent = value;
  return n;
}

export function StacksQueuesView({root, controls, log, ui, setTitleDescNotes}){
  const stack = [1,2,3];
  const queue = [4,5,6];

  function render(){
    root.innerHTML = '';

    const title1 = document.createElement('div');
    title1.className = 'pill';
    title1.style.position = 'absolute';
    title1.style.left = '14px';
    title1.style.top = '14px';
    title1.textContent = 'Stack (LIFO)';
    root.appendChild(title1);

    const title2 = document.createElement('div');
    title2.className = 'pill';
    title2.style.position = 'absolute';
    title2.style.right = '14px';
    title2.style.top = '14px';
    title2.textContent = 'Queue (FIFO)';
    root.appendChild(title2);

    // stack (left)
    stack.forEach((v,i) => {
      const n = node(v);
      n.style.left = '64px';
      n.style.top = `${70 + (stack.length-1-i)*56}px`;
      root.appendChild(n);
    });

    // queue (right)
    queue.forEach((v,i) => {
      const n = node(v);
      n.style.left = `${root.clientWidth - 64 - 46 - i*56}px`;
      n.style.top = '120px';
      root.appendChild(n);
    });

    // arrows
    const a1 = document.createElement('div');
    a1.className = 'muted';
    a1.style.position='absolute';
    a1.style.left='22px';
    a1.style.top='86px';
    a1.style.fontSize='12px';
    a1.textContent='top';
    root.appendChild(a1);

    const a2 = document.createElement('div');
    a2.className = 'muted';
    a2.style.position='absolute';
    a2.style.right='22px';
    a2.style.top='178px';
    a2.style.fontSize='12px';
    a2.textContent='front → back';
    root.appendChild(a2);
  }

  function init(){
    setTitleDescNotes({
      title: 'Stacks & Queues',
      desc: '用操作感受 LIFO / FIFO，並理解常見 O(1) 操作。',
      complexity: 'Push/Pop O(1), Enqueue/Dequeue O(1)',
      hints: [
        'Stack: push/pop 都只動到頂端。',
        'Queue: front 取出、back 加入（這裡用陣列示範概念）。',
        '實作上 Queue 可用 circular buffer 或 linked list 以避免搬移。'
      ],
      notes: `
        <p><b>Stack</b>：後進先出（LIFO），常用在遞迴、括號匹配、Undo。</p>
        <p><b>Queue</b>：先進先出（FIFO），常用在 BFS、排隊系統、工作排程。</p>
        <p>本頁提供：Stack 的 <code>push/pop</code>，Queue 的 <code>enqueue/dequeue</code>。</p>
      `
    });

    const val = ui.inputNumber({value: 7});
    const push = ui.button({text:'Stack Push', kind:'good'});
    const pop  = ui.button({text:'Stack Pop', kind:'danger'});
    const enq  = ui.button({text:'Queue Enqueue', kind:'good'});
    const deq  = ui.button({text:'Queue Dequeue', kind:'danger'});

    push.onclick = () => { stack.push(Number(val.value)); log(`stack.push(${val.value})`); render(); };
    pop.onclick = () => {
      if(stack.length===0) return log('stack is empty');
      const x = stack.pop();
      log(`stack.pop() => ${x}`);
      render();
    };
    enq.onclick = () => { queue.push(Number(val.value)); log(`queue.enqueue(${val.value})`); render(); };
    deq.onclick = () => {
      if(queue.length===0) return log('queue is empty');
      const x = queue.shift();
      log(`queue.dequeue() => ${x}`);
      render();
    };

    controls.appendChild(ui.controlRow([ ui.field({label:'Value', input: val}) ]));
    controls.appendChild(ui.controlRow([ push, pop ]));
    controls.appendChild(ui.controlRow([ enq, deq ]));
    render();
  }

  return { init };
}
