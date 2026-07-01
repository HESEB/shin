/* shin shared sound/BGM system - no external audio files required */
(function(){
  const KEY='shin_audio_enabled';
  const VOL='shin_audio_volume';
  const BGM='shin_bgm_enabled';
  let ctx=null, master=null, bgmTimer=null, bgmGain=null, bgmKind='map', unlocked=false;
  const state={enabled:localStorage.getItem(KEY)!=='0', bgm:localStorage.getItem(BGM)!=='0', volume:Number(localStorage.getItem(VOL)||0.38)};
  function init(){
    if(ctx) return;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return;
    ctx=new AC();
    master=ctx.createGain();
    master.gain.value=state.enabled?state.volume:0;
    master.connect(ctx.destination);
  }
  function resume(){init(); if(ctx&&ctx.state==='suspended') ctx.resume(); unlocked=true;}
  function gain(v=1){if(!ctx||!master)return null; const g=ctx.createGain(); g.gain.value=v; g.connect(master); return g;}
  function tone(freq=440,dur=.12,type='sine',vol=.22,delay=0){
    if(!state.enabled) return; resume(); if(!ctx)return;
    const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=gain(vol);
    o.type=type; o.frequency.setValueAtTime(freq,t); o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*.72),t+dur);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(g); o.start(t); o.stop(t+dur+.02);
  }
  function noise(dur=.13,vol=.16,delay=0){
    if(!state.enabled) return; resume(); if(!ctx)return;
    const len=Math.max(1,ctx.sampleRate*dur),buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);
    for(let i=0;i<len;i++) data[i]=(Math.random()*2-1)*(1-i/len);
    const src=ctx.createBufferSource(),g=gain(vol),t=ctx.currentTime+delay; src.buffer=buf; src.connect(g); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); src.start(t); src.stop(t+dur+.02);
  }
  const fx={
    click(){tone(520,.055,'square',.08)},
    ok(){tone(660,.08,'triangle',.16);tone(880,.1,'triangle',.12,.06)},
    bad(){tone(180,.16,'sawtooth',.18);noise(.09,.08)},
    combo(){tone(720,.06,'square',.13);tone(980,.08,'square',.12,.05);tone(1220,.09,'triangle',.1,.1)},
    clear(){tone(523,.12,'triangle',.15);tone(659,.12,'triangle',.15,.12);tone(784,.18,'triangle',.16,.24);tone(1046,.25,'triangle',.14,.38)},
    fail(){tone(260,.15,'sawtooth',.14);tone(196,.22,'sawtooth',.13,.12);tone(130,.28,'sawtooth',.12,.28)},
    hit(){noise(.08,.15);tone(260,.07,'square',.1)},
    boss(){tone(90,.28,'sawtooth',.16);tone(140,.28,'sawtooth',.13,.08);noise(.25,.1,.05)},
    level(){tone(700,.08,'triangle',.14);tone(940,.08,'triangle',.14,.08);tone(1260,.16,'triangle',.14,.16)},
    select(){tone(420,.05,'square',.08);tone(630,.05,'square',.07,.04)}
  };
  function play(name){(fx[name]||fx.click)();}
  const bgmNotes={map:[392,494,587,659,587,494],farm:[330,392,440,392,330,294],bid:[392,392,523,494,440,392],butcher:[220,330,392,330,247,294],packing:[294,370,440,370,294,370],sales:[523,659,784,659,587,659],boss:[110,147,165,196,165,147]};
  function stopBgm(){if(bgmTimer){clearInterval(bgmTimer);bgmTimer=null} if(bgmGain){try{bgmGain.disconnect()}catch(e){} bgmGain=null}}
  function startBgm(kind='map'){
    bgmKind=kind; if(!state.enabled||!state.bgm) return; resume(); if(!ctx)return; stopBgm();
    let i=0,notes=bgmNotes[kind]||bgmNotes.map; bgmGain=ctx.createGain(); bgmGain.gain.value=.075; bgmGain.connect(master);
    bgmTimer=setInterval(()=>{if(!state.enabled||!state.bgm||!ctx)return; const f=notes[i++%notes.length],t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(); o.type=kind==='boss'?'sawtooth':'triangle'; o.frequency.value=f; g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.16,t+.035); g.gain.exponentialRampToValueAtTime(.001,t+.34); o.connect(g); g.connect(bgmGain); o.start(t); o.stop(t+.36)}, kind==='boss'?360:430);
  }
  function setEnabled(v){state.enabled=!!v;localStorage.setItem(KEY,state.enabled?'1':'0'); if(master)master.gain.value=state.enabled?state.volume:0; if(state.enabled&&state.bgm&&!bgmTimer)startBgm(bgmKind); if(!state.enabled)stopBgm()}
  function setBgm(v){state.bgm=!!v;localStorage.setItem(BGM,state.bgm?'1':'0'); if(state.bgm)startBgm(bgmKind); else stopBgm()}
  function setVolume(v){state.volume=Math.max(0,Math.min(1,v));localStorage.setItem(VOL,String(state.volume)); if(master)master.gain.value=state.enabled?state.volume:0}
  function makeToggle(){
    if(document.getElementById('shinSoundToggle'))return;
    const b=document.createElement('button'); b.id='shinSoundToggle'; b.type='button'; b.textContent=state.enabled?'🔊':'🔇'; b.style.cssText='position:fixed;right:8px;bottom:8px;z-index:9999;width:42px;height:42px;border:3px solid #432313;border-radius:16px;background:linear-gradient(#fffdf4,#ffe3a0);box-shadow:0 4px 0 #8b4a12;font-size:20px;font-weight:900;';
    b.onclick=function(e){e.stopPropagation();resume();setEnabled(!state.enabled);b.textContent=state.enabled?'🔊':'🔇';play('select')};
    document.body.appendChild(b);
  }
  function guessKind(){const p=location.pathname; if(p.includes('/farm/'))return'farm'; if(p.includes('/bid/'))return'bid'; if(p.includes('/butcher/'))return'butcher'; if(p.includes('/packing/'))return'packing'; if(p.includes('/sales/'))return'sales'; if(p.includes('/boss/'))return'boss'; return'map'}
  function hook(){
    document.addEventListener('pointerdown',()=>resume(),{once:true,capture:true});
    document.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('button,select'))play('click')},true);
    const oldAlert=window.alert; window.alert=function(msg){play('bad'); oldAlert.call(window,msg)};
    const oldClear=window.clearStage; if(typeof oldClear==='function'){window.clearStage=function(){play('clear'); return oldClear.apply(this,arguments)}}
    const oldGo=window.goStage; if(typeof oldGo==='function'){window.goStage=function(){play('select'); return oldGo.apply(this,arguments)}}
    makeToggle(); setTimeout(()=>startBgm(guessKind()),350);
  }
  window.ShinAudio={play,startBgm,stopBgm,setEnabled,setBgm,setVolume,state,resume};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
