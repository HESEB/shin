(function(){
  window.ShinResult={
    complete:function(stageId,stars){
      stars=Math.max(1,Math.min(3,stars||3));
      var reward=clearStage(stageId,stars);
      var next=nextStageOf(stageId);
      var overlay=document.createElement('div');
      overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML='<div style="width:100%;max-width:380px;background:#fff8e8;color:#3b2413;border:5px solid #4b2d1c;border-radius:24px;padding:20px;text-align:center;box-shadow:0 8px 0 #9a5b17;font-family:Arial,sans-serif"><h2>스테이지 완료</h2><div style="font-size:44px;color:#ffca28;text-shadow:0 3px #805000">'+('★'.repeat(stars))+('☆'.repeat(3-stars))+'</div><p><b>보상</b><br>🪙 +'+reward.coins+'<br>🧪 +'+reward.points+'P</p><button id="nextStage" style="width:100%;height:52px;border:0;border-radius:18px;background:linear-gradient(#ffcf62,#ff8a2d);box-shadow:0 6px 0 #9b4f00;color:white;font-size:18px;font-weight:1000;margin-top:8px">'+(next?'다음 스테이지':'월드맵')+'</button><button id="goMap" style="width:100%;height:52px;border:0;border-radius:18px;background:linear-gradient(#59bdff,#2575e8);box-shadow:0 6px 0 #0d4b99;color:white;font-size:18px;font-weight:1000;margin-top:8px">월드맵</button></div>';
      document.body.appendChild(overlay);
      document.getElementById('goMap').onclick=function(){location.href='../../index.html'};
      document.getElementById('nextStage').onclick=function(){if(next){location.href='../../'+next.url.replace('./','')+'?stage='+next.id}else{location.href='../../index.html'}};
    }
  };
})();
