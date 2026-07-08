/* RC fixes: kingdom boss flow, packing preview, boss upgrade balance */
(function(){
  const path=location.pathname;
  function worldNext(w){return w==='chicken'?'pig':w==='pig'?'cow':w==='cow'?'demon':null}
  function selectedWorld(){try{const d=loadWorldSave();return d.world||new URLSearchParams(location.search).get('world')||'chicken'}catch(e){return new URLSearchParams(location.search).get('world')||'chicken'}}
  function patchPacking(){
    const ready=()=>typeof draw==='function'&&typeof next!=='undefined';
    if(!ready())return setTimeout(patchPacking,120);
    const oldDraw=draw;
    window.draw=function(){
      oldDraw.apply(this,arguments);
      try{
        const names={chicken:'닭',pig:'돈',cow:'우',freeze:'냉'};
        const cls={chicken:'p-chicken',pig:'p-pig',cow:'p-cow',freeze:'p-freeze'};
        next.innerHTML=nq.map(t=>'<i class="nChip '+cls[t]+'">'+names[t]+'</i>').join('');
      }catch(e){}
    };
    const css=document.createElement('style');
    css.textContent='.nextBox{display:flex!important;align-items:center!important;gap:4px!important}.nextBox span{display:inline-flex!important;gap:3px!important}.nChip{width:22px;height:22px;border:2px solid #432313;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:1000;font-style:normal;color:#3b2413;box-shadow:0 2px 0 #0003}.p-chicken{background:linear-gradient(#fff6b3,#ffd04a)}.p-pig{background:linear-gradient(#ffb8c8,#ef7795)}.p-cow{background:linear-gradient(#e8d2b0,#9b6a3c);color:#fff}.p-freeze{background:linear-gradient(#bff4ff,#47b0e6);color:#fff}';
    document.head.appendChild(css);
    try{draw()}catch(e){}
  }
  function patchBoss(){
    const ready=()=>typeof upgrade==='function'&&typeof showUpgrade==='function'&&typeof end==='function';
    if(!ready())return setTimeout(patchBoss,120);
    window.showUpgrade=function(){
      overlay.style.display='flex';
      overlay.innerHTML='<div class="card"><h1>LEVEL UP</h1><div class="upgrid"><button class="up" onclick="upgrade(\'rapid\')">⚡ 연사속도 +20%</button><button class="up" onclick="upgrade(\'multi\')">🔪 발사갯수 +1</button><button class="up" onclick="upgrade(\'def\')">🛡 방어력 +2</button></div></div>';
    };
    window.upgrade=function(t){
      if(t==='rapid')stats.spd+=.22;
      if(t==='multi'){stats.shots++;stats.spd+=.08;stats.weapon=stats.shots>=4?'⚙️':stats.shots>=3?'🪚':'🔪'}
      if(t==='def')stats.def+=2;
      if(t==='atk')stats.spd+=.18;
      overlay.style.display='none';upgradePause=false;last=0;pop('무기 강화 완료!');requestAnimationFrame(loop);
    };
    window.end=function(clear){
      run=false;
      let stars=clear?(p.hp>70?3:p.hp>35?2:1):1;
      let w=stage.value||selectedWorld(),nw=worldNext(w);
      if(clear){
        try{clearStage('boss',stars)}catch(e){}
        try{const d=loadWorldSave();if(nw){d.world=nw;d.kingdoms[nw]=true;}saveWorld(d)}catch(e){}
      }
      const nextLabel=clear&&nw?('다음 왕국으로: '+({pig:'돈육왕국',cow:'우육왕국',demon:'마왕성'}[nw]||'월드맵')):'월드맵';
      overlay.style.display='flex';
      overlay.innerHTML='<div class="card"><h1>'+(clear?'🎉 승리!':'💀 패배')+'</h1><div class="stars">'+'★'.repeat(stars)+'☆'.repeat(3-stars)+'</div><p>단계: '+stage.selectedOptions[0].text+'<br>레벨 '+stats.lv+' · 처치 '+stats.kill+'<br>발사 '+stats.shots+'개 · 속도 '+stats.spd.toFixed(1)+'</p><button class="start" id="goNext">'+nextLabel+'</button><button class="start" onclick="startGame()">다시 전투</button></div>';
      document.getElementById('goNext').onclick=function(){location.href='../../index.html'};
    };
  }
  if(path.includes('/games/packing/'))patchPacking();
  if(path.includes('/games/boss/'))patchBoss();
})();
