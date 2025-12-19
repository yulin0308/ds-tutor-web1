function node(value){
  const n = document.createElement('div');
  n.className = 'node';
  n.textContent = value;
  return n;
}

function insertBST(root, value){
  if(!root) return {value, left:null, right:null};
  if(value < root.value) root.left = insertBST(root.left, value);
  else if(value > root.value) root.right = insertBST(root.right, value);
  return root;
}

function searchBST(root, value, path=[]){
  if(!root) return {found:false, path};
  path.push(root.value);
  if(value === root.value) return {found:true, path};
  if(value < root.value) return searchBST(root.left, value, path);
  return searchBST(root.right, value, path);
}

function levels(root){
  const res = [];
  const q = root ? [{n:root, d:0}] : [];
  while(q.length){
    const {n, d} = q.shift();
    if(!res[d]) res[d] = [];
    res[d].push(n);
    if(n.left) q.push({n:n.left, d:d+1});
    if(n.right) q.push({n:n.right, d:d+1});
  }
  return res;
}

export function TreesView({root, controls, log, ui, setTitleDescNotes}){
  let bst = null;
  [50, 30, 70, 20, 40, 60, 80].forEach(v => bst = insertBST(bst, v));

  function render(activeValue=null){
    root.innerHTML = '';
    if(!bst){
      root.appendChild(ui.note('目前樹是空的，先 Insert 幾個值。'));
      return;
    }
    const lv = levels(bst);
    const W = root.clientWidth;
    const top = 50;
    const vGap = 70;

    // build node positions by level and order
    const positions = new Map();
    lv.forEach((arr, d) => {
      const count = arr.length;
      const span = Math.min(W-40, 640);
      const startX = (W - span)/2;
      arr.forEach((n, i) => {
        const x = startX + (count===1 ? span/2 : i*(span/(count-1)));
        const y = top + d*vGap;
        positions.set(n, {x, y});
      });
    });

    // draw edges first
    positions.forEach((p, n) => {
      const from = p;
      if(n.left){
        const to = positions.get(n.left);
        drawEdge(from.x, from.y, to.x, to.y);
      }
      if(n.right){
        const to = positions.get(n.right);
        drawEdge(from.x, from.y, to.x, to.y);
      }
    });

    // draw nodes
    positions.forEach((p, n) => {
      const el = node(n.value);
      if(activeValue === n.value) el.classList.add('active');
      el.style.left = `${p.x - 23}px`;
      el.style.top  = `${p.y}px`;
      root.appendChild(el);
    });
  }

  function drawEdge(x1,y1,x2,y2){
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx) * 180/Math.PI;

    const e = document.createElement('div');
    e.className = 'edge';
    e.style.left = `${x1}px`;
    e.style.top = `${y1+23}px`;
    e.style.width = `${len}px`;
    e.style.transform = `rotate(${angle}deg)`;
    root.appendChild(e);
  }

  async function animateSearch(target){
    const {found, path} = searchBST(bst, target, []);
    log(`search ${target} path: ${path.join(' -> ') || '(empty)'}`);
    for(const v of path){
      render(v);
      await new Promise(r=>setTimeout(r, 420));
    }
    if(found) log(`✅ found ${target}`);
    else log(`❌ not found ${target}`);
    render(null);
  }

  function init(){
    setTitleDescNotes({
      title: 'Trees (BST demo)',
      desc: '以二元搜尋樹（BST）示範插入與搜尋路徑；平均 O(log n)，最壞 O(n)。',
      complexity: 'BST Search/Insert avg O(log n), worst O(n)',
      hints: [
        '插入順序會影響樹形：若接近已排序，會退化成鏈表。',
        '想保證 O(log n)，可用 AVL / Red-Black Tree。',
        '走訪（inorder/preorder/postorder）可用遞迴或 stack。'
      ],
      notes: `
        <p><b>Tree</b> 是階層式結構。這裡用 <b>Binary Search Tree</b>（左小右大）。</p>
        <ul>
          <li>搜尋：依大小往左/右走，平均 O(log n)。</li>
          <li>最壞情況：退化為鏈表 => O(n)。</li>
        </ul>
        <p>本頁提供：插入節點、動畫搜尋路徑。</p>
      `
    });

    const val = ui.inputNumber({value: 65});
    const ins = ui.button({text:'Insert', kind:'good'});
    const sea = ui.button({text:'Search', kind:'primary'});
    const reset = ui.button({text:'Reset', kind:'danger'});

    ins.onclick = () => {
      const x = Number(val.value);
      bst = insertBST(bst, x);
      log(`insert ${x}`);
      render(x);
    };

    sea.onclick = () => animateSearch(Number(val.value));

    reset.onclick = () => {
      bst = null;
      [50, 30, 70, 20, 40, 60, 80].forEach(v => bst = insertBST(bst, v));
      log('reset tree');
      render(null);
    };

    controls.appendChild(ui.controlRow([ ui.field({label:'Value', input: val}) ]));
    controls.appendChild(ui.controlRow([ ins, sea, reset ]));
    render(null);
  }

  return { init };
}
