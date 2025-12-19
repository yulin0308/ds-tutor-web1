export function BigOView({root, controls, log, ui, setTitleDescNotes}){
  function init(){
    setTitleDescNotes({
      title: 'Big-O',
      desc: '用表格總結常見資料結構操作的時間複雜度，並連結到 Big-O Cheat Sheet。',
      complexity: 'Depends',
      hints: [
        'Big-O 描述 n 變大時的成長趨勢（忽略常數）。',
        '同一結構在不同情境可能有平均/最壞不同複雜度。',
        '實務也要考慮 cache、常數、資料分布。'
      ],
      notes: `
        <p>這裡整理課堂常用摘要，並提供外部資源：</p>
        <ul>
          <li><a target="_blank" rel="noreferrer" href="https://www.bigocheatsheet.com">Big-O Cheat Sheet</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://visualgo.net/en">VisuAlgo</a>（更多視覺化）</li>
        </ul>
      `
    });

    controls.appendChild(ui.note('本頁沒有操作按鈕；請直接閱讀表格。'));

    root.innerHTML = `
      <div style="overflow:auto">
        <table style="width:100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr>
              <th style="text-align:left; padding:10px; border-bottom:1px solid rgba(255,255,255,.14);">Structure</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid rgba(255,255,255,.14);">Access</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid rgba(255,255,255,.14);">Search</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid rgba(255,255,255,.14);">Insert</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid rgba(255,255,255,.14);">Delete</th>
              <th style="text-align:left; padding:10px; border-bottom:1px solid rgba(255,255,255,.14);">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${row('Array','O(1)','O(n)','O(n)','O(n)','中間插入/刪除需要搬移')}
            ${row('Stack','-','O(n)','O(1) push','O(1) pop','LIFO')}
            ${row('Queue','-','O(n)','O(1) enq','O(1) deq','FIFO；實作可用 circular buffer')}
            ${row('Singly Linked List','O(n)','O(n)','O(1)*','O(1)*','*已知節點位置時')}
            ${row('BST (avg)','O(log n)','O(log n)','O(log n)','O(log n)','最壞可退化 O(n)')}
            ${row('Graph (adj list)','-','-','-','-','走訪 BFS/DFS: O(V+E)')}
          </tbody>
        </table>
      </div>
      <div class="muted" style="margin-top:12px">
        想看更完整版本可點下方資源：Big-O Cheat Sheet。
      </div>
    `;
    function row(a,b,c,d,e,f){
      return `
        <tr>
          <td style="padding:10px; border-bottom:1px solid rgba(255,255,255,.10);">${a}</td>
          <td style="padding:10px; border-bottom:1px solid rgba(255,255,255,.10);">${b}</td>
          <td style="padding:10px; border-bottom:1px solid rgba(255,255,255,.10);">${c}</td>
          <td style="padding:10px; border-bottom:1px solid rgba(255,255,255,.10);">${d}</td>
          <td style="padding:10px; border-bottom:1px solid rgba(255,255,255,.10);">${e}</td>
          <td style="padding:10px; border-bottom:1px solid rgba(255,255,255,.10);">${f}</td>
        </tr>`;
    }
  }
  return { init };
}
