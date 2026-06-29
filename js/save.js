const SHIN_SAVE_SLOT_KEY="shin_active_slot_v1";
const SHIN_SAVE_PREFIX="shin_save_slot_";
const SHIN_STAGE_FLOW=[
  {id:"farm",label:"농장출하",icon:"🐔",url:"./games/farm/index.html"},
  {id:"bid",label:"입찰전쟁",icon:"💰",url:"./games/bid/index.html"},
  {id:"butcher",label:"도축정형",icon:"🔪",url:"./games/butcher/index.html"},
  {id:"packing",label:"출하패킹",icon:"📦",url:"./games/packing/index.html"},
  {id:"sales",label:"영업판매",icon:"🏪",url:"./games/sales/index.html"},
  {id:"boss",label:"병아리킹",icon:"👑",url:"./games/boss/index.html"}
];
const DEFAULT_SAVE={slot:1,devMode:false,coins:12450,gems:1250,points:0,stars:{farm:0,bid:0,butcher:0,packing:0,sales:0,boss:0},unlocked:{farm:true,bid:false,butcher:false,packing:false,sales:false,boss:false},kingdoms:{chicken:true,pig:false,cow:false,demon:false},research:{atk:0,def:0,speed:0,bomb:0}};
function activeSlot(){return Number(localStorage.getItem(SHIN_SAVE_SLOT_KEY)||"1")}
function setActiveSlot(n){localStorage.setItem(SHIN_SAVE_SLOT_KEY,String(n))}
function saveKey(slot=activeSlot()){return SHIN_SAVE_PREFIX+slot}
function loadWorldSave(slot=activeSlot()){
  try{const raw=JSON.parse(localStorage.getItem(saveKey(slot))||"{}");return {...DEFAULT_SAVE,...raw,slot,stars:{...DEFAULT_SAVE.stars,...(raw.stars||{})},unlocked:{...DEFAULT_SAVE.unlocked,...(raw.unlocked||{})},kingdoms:{...DEFAULT_SAVE.kingdoms,...(raw.kingdoms||{})},research:{...DEFAULT_SAVE.research,...(raw.research||{})}}}catch(e){return {...DEFAULT_SAVE,slot}}
}
function saveWorld(d){localStorage.setItem(saveKey(d.slot||activeSlot()),JSON.stringify(d))}
function resetWorld(){localStorage.removeItem(saveKey());location.reload()}
function resetAllSlots(){[1,2,3].forEach(n=>localStorage.removeItem(saveKey(n)));setActiveSlot(1);location.reload()}
function totalStars(d=loadWorldSave()){return Object.values(d.stars||{}).reduce((a,b)=>a+(Number(b)||0),0)}
function progressPercent(d=loadWorldSave()){return Math.round(SHIN_STAGE_FLOW.filter(s=>(d.stars[s.id]||0)>0).length/SHIN_STAGE_FLOW.length*100)}
function clearStage(stageId,stars=1){const d=loadWorldSave();stars=Math.max(1,Math.min(3,Number(stars)||1));d.stars[stageId]=Math.max(d.stars[stageId]||0,stars);const idx=SHIN_STAGE_FLOW.findIndex(s=>s.id===stageId);if(idx>=0&&idx<SHIN_STAGE_FLOW.length-1)d.unlocked[SHIN_STAGE_FLOW[idx+1].id]=true;const coins=500*stars,points=10*stars;d.coins+=coins;d.points+=points;if(stageId==="boss")d.kingdoms.pig=true;saveWorld(d);return {coins,points,stars}}
function nextStageOf(stageId){const idx=SHIN_STAGE_FLOW.findIndex(s=>s.id===stageId);return idx>=0&&idx<SHIN_STAGE_FLOW.length-1?SHIN_STAGE_FLOW[idx+1]:null}
function setDevMode(on){const d=loadWorldSave();d.devMode=!!on;saveWorld(d)}
function devUnlockTo(stageId){const d=loadWorldSave();for(const s of SHIN_STAGE_FLOW){d.unlocked[s.id]=true;if(s.id===stageId)break}saveWorld(d)}
function devSetStars(stageId,stars){const d=loadWorldSave();d.stars[stageId]=Math.max(0,Math.min(3,Number(stars)||0));saveWorld(d)}
function devUnlockAll(){const d=loadWorldSave();SHIN_STAGE_FLOW.forEach(s=>d.unlocked[s.id]=true);d.kingdoms.pig=true;d.kingdoms.cow=true;d.kingdoms.demon=true;saveWorld(d)}
function addResearch(type){const d=loadWorldSave();const lv=d.research[type]||0;const cost=20+lv*20;if(d.points<cost)return false;d.points-=cost;d.research[type]=lv+1;saveWorld(d);return true}
window.STAGE_FLOW=SHIN_STAGE_FLOW;
