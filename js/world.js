function ShinWorld(rootId="map"){
  this.root=document.getElementById(rootId);
  this.save=loadWorldSave();
}
ShinWorld.prototype.render=function(){
  this.save=loadWorldSave();
  const map=this.root;
  map.innerHTML="";
  SHIN_STAGE_FLOW.forEach((s,idx)=>{
    const unlocked=!!this.save.unlocked[s.id]||this.save.devMode;
    const stars=this.save.stars[s.id]||0;
    const div=document.createElement("div");
    div.className="node"+(s.id==="boss"?" boss":"");
    div.innerHTML=`<div class="stars">${"★".repeat(stars)}${"☆".repeat(3-stars)}</div>
    <button class="stageBtn ${unlocked?"":"lock"}"><b>${idx+1}. ${s.label}</b><small>${unlocked?(this.save.devMode?"DEV 테스트 가능":"플레이 가능"):"이전 단계 클리어 필요"}</small></button>
    <div class="icon">${unlocked?s.icon:"🔒"}</div>`;
    div.querySelector(".stageBtn").onclick=()=>{
      if(!unlocked)return alert("이전 단계를 먼저 클리어해야 합니다.");
      location.href=s.url+"?stage="+s.id;
    };
    map.appendChild(div);
  });
};
